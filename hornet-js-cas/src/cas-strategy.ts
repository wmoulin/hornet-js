"use strict";

import {Strategy} from "passport";
import * as url from "url";
import * as request from "request";
import * as _ from "lodash";
import utils = require("hornet-js-utils");

import {CasConfiguration} from "src/cas-configuration";

var logger = utils.getLogger("authentication.cas.cas-strategy");

var parseString = require("xml2js").parseString,
    stripPrefix = require("xml2js/lib/processors").stripPrefix;

export class CasStrategy implements Strategy {

    private _name = "cas";

    protected static optionXml:any = {
        explicitRoot: false,
        tagNameProcessors: [stripPrefix]
    };

    protected configuration:CasConfiguration;
    protected verifyAuthentication:any;

    constructor(configuration:CasConfiguration, verify?) {
        this.configuration = configuration;
        this.verifyAuthentication = verify || this.configuration.verifyFunction || this.getUserInfo;
    }

    public get name() {
        return this._name;
    }

    public set name(name:string) {
        this._name = name;
    }

    /**
     * Authenticate lance la validation d"un ticket s"il est présent dans la requête.
     *
     * @param {Object} req
     * @param {Object} options
     */
    public authenticate(req):void {

        // récupération du ticket s"il est présent
        var ticket = req.query.ticket;

        // Cast en any pour éviter les erreurs compile TS car méthodes rajoutées à l"exécution
        var self:any = this;

        if (!ticket) { // aucun ticket a valider, redirection vers l"écran de connexion
            self.pass();
            return;
        }

        var urlObject = url.parse(this.configuration.casValidateUrl);
        urlObject.query = {
            service: CasStrategy.origin(req, utils.buildContextPath(this.configuration.hostUrlReturnTo)),
            ticket: ticket
        };

        // lancement de la validation du ticket
        logger.debug("ticket validation");

        request.get(
            url.format(urlObject),
            function (casErr, casRes, casBody) {
                logger.debug("verification de la réponse de validation du ticket");

                if (casErr || casRes.statusCode !== 200) {
                    logger.error(casErr);
                    return self.fail(casErr);
                }
                self.validateCasResponse.call(self, casBody);
            });

    }

    /**
     * Traitement de la réponse à la validation du ticket CAS
     * @param casBody reponse du CAS à parser
     */
    private validateCasResponse(casBody) {
        logger.debug("ticket validation : validate response");
        var _self:any = this;
        parseString(casBody, CasStrategy.optionXml, function (err, serviceResponse) {
            if (err) {
                return _self.error("Error from CAS. (" + err.message + ")");
            }

            var success = serviceResponse && serviceResponse.authenticationSuccess && serviceResponse.authenticationSuccess[0],
                user = success && success.user && success.user[0],
                failure = serviceResponse && serviceResponse.authenticationFailure && serviceResponse.authenticationFailure[0]._;

            if (!serviceResponse) {
                logger.error("ticket validation : Invalid response from CAS");
                return _self.error(new Error("Invalid response from CAS."));
            }

            if (!success) {
                logger.error("ticket validation : ERROR " + failure);
                return _self.fail(new Error(failure));
            }

            var verified = function (err, user, info) {
                if (err) {
                    return _self.error(err);
                }
                if (!user) {
                    return _self.fail(info);
                }
                _self.success(user, info);
            };

            logger.debug("recupération des infos");
            _self.verifyAuthentication(user, verified);
            return;

        });
    }

    /**
     * Récupérer les informations de l"utilisateur :
     * dans la stratégie cas par défaut, c"est une version qui retourne le login
     *
     * La fonction doit être redéfinie dans les stratégies spécifiques (cf strategy)
     * pour utiliser le service fournis pas le serveur CAS choisi
     *
     * La fonction peut aussi etre créée à la volée et injectée dans la configuration (configuration.verifyFunction)
     *
     * @param login nom de l"utilisateur
     * @param done callback de gestion des retours.
     */
    protected getUserInfo(login, done):void {
        logger.debug("GET User info (default) - return login : ", login);

        return done(null, login);

    }

    /**
     * Verifier si la requête est une requête ajax (demande de JSON)
     *
     * @param req
     * @returns {boolean}
     */
    public static isAjaxRequest(req):boolean {
        return (req.header("x-requested-with") && req.header("x-requested-with") === "XMLHttpRequest");
    }

    /**
     * Verifier si la requête est effectuée depuis le client js vers node (prefixées en /services)
     *
     * @param req
     * @returns {boolean}
     */
    public static isServiceRequest(req):boolean {
        var parseUrl = require("parseurl");
        var oUrl = parseUrl.original(req);

        return _.startsWith(oUrl.pathname, utils.buildContextPath(utils.config.getOrDefault("fullSpa.name", "/services")));
    }

    /**
     * Extrait l"url de retour après la connexion CAS
     * @param req requete express
     * @returns {string} l"url fournie à CAS pour le retour
     */
    public static origin(req, hostUrl?:string):string {
        var parseUrl = require("parseurl");
        var oUrl = parseUrl.original(req);
        var newHost:string = hostUrl || req.protocol + "://" + req.get("host");
        var returnUrl = newHost + oUrl.pathname;

        logger.debug("Original request path is ", oUrl.pathname, " => return url set to : ", returnUrl);
        return returnUrl;
    }
}
