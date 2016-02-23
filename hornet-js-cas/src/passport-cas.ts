"use strict";

import {Response} from "express";
import * as _ from "lodash";
import * as url from "url";
import utils = require("hornet-js-utils");

var logger = utils.getLogger("authentication.cas.passport-cas");

import {CasConfiguration} from "src/cas-configuration";
import {CasStrategy} from "src/cas-strategy";
import {PassportAuthentication} from "src/passport-authentication";

export class PassportCas extends PassportAuthentication {

    protected strategyName:string;
    protected configuration:CasConfiguration;

    constructor(configuration:CasConfiguration) {
        super();
        this.configuration = configuration;
        this.initStrategy();
    }

    /**
     * Renvoie un middleware complet de gestion de l'authentification (connection, validation et déconnexion)
     * @param passportInstance instance de Passport.Js  sur laquelle lancer l'autentification de la stratégie
     * @returns middleware express {function(express.Request, express.Response, any)}
     */
    protected createMiddleware():any {
        var _self = this;

        /* Renvoie d'un middleware gèrent la deconnexion, la connexion et la verification */
        return function ensureAuthenticated(req, res:Response, next:any) {

            // vérification si c'est une déconnexion est demandée
            if (PassportAuthentication.isUrl(req, utils.buildContextPath(_self.configuration.appLogoutPath))) {
                logger.debug(" appel déconnexion");
                _self.disconnectMiddleware()(req, res, next);
                return;
            }

            if (!req.isAuthenticated()) {
                if (req.query.ticket) {
                    // authentifie et redirige vers l'url en session "returnTo"
                    _self.passport.authenticate(_self.strategyName, {
                        failureFlash: true,
                        successReturnToOrRedirect: utils.buildContextPath("/")
                    })(req, res, next);
                } else {

                    _self.manageRedirectToCas(req, res);
                }
            } else {
                // Traitement désynchro session applicative / session CAS :
                // si le user est déconnecté du CAS, mais toujours authentifié sur l'appli (cookie session node existant)
                // alors, lors de la reconnexion au CAS, quand le nouveau ticket arrive (requête = login?ticket=xxx)
                // il faut relancer tout le processus d'authentification (afin d'effacer/re-créer la session applicative existante)
                if (PassportAuthentication.isUrl(req, utils.buildContextPath(_self.configuration.appLoginPath)) && req.query.ticket) {
                    _self.passport.authenticate(_self.strategyName, {
                        failureFlash: true,
                        successReturnToOrRedirect: utils.buildContextPath("/")
                    })(req, res, next);
                } else {
                    next();
                }
            }
        }
    }

    protected manageRedirectToCas(req, res:Response):any {
        logger.info("Deconnexion detectée - reconnexion au CAS en cours");

        // url de retour par defaut (page d'accueil)
        var returnUrl = this.configuration.hostUrlReturnTo + utils.buildContextPath(utils.appSharedProps.get("welcomePageUrl"));
        logger.debug("Reconnexion - default returnUrl = ", returnUrl);

        // url de la page demandée à l'origine
        var originUrl = CasStrategy.origin(req, utils.buildContextPath(this.configuration.hostUrlReturnTo));
        logger.debug("Reconnexion - originUrl = ", originUrl);

        // après l'authentification, il faudra rediriger vers la requête d'origine,
        // sauf quand c'est la page de login qui était demandée (dans ce cas, on renvoie sur la page par defaut)
        if (!PassportAuthentication.isUrl(req, utils.buildContextPath(this.configuration.appLoginPath))) {
            logger.debug("Reconnexion - la page demandée n'est pas la page de login - setting returnUrl to originUrl.");
            returnUrl = originUrl;
        }

        var isServiceRequest = CasStrategy.isServiceRequest(req);
        if (isServiceRequest && req.header("referer")) {
            originUrl = req.header("referer");
            returnUrl = originUrl;
            logger.debug("Reconnexion - requete detectée vers /services/* - " +
                "la redirection après reconnexion se fera vers le referer : ", returnUrl);
        }

        // Suite à une demande de reconnexion côté client (redirection via le RedirectToLoginPagePlugin)
        // c'est l'attribut "previousUrl" qui indique l'url d'origine à utiliser pour le retour
        // on l'utilise systématiquement si elle est présente
        var previousUrl = req.query.previousUrl;
        if (previousUrl) {
            originUrl = previousUrl;
            returnUrl = previousUrl;
            logger.debug("Reconnexion - attribut previousUrl detecté dans la requête, setting returnUrl to previousUrl : ", previousUrl);
        }

        // returnTo = url de redirection après l'authentification
        req.getSession().setAttribute("returnTo", returnUrl);
        logger.debug("Reconnexion - mise en session de returnUrl (attribut returnTo) : ", returnUrl);

        // préparer la requête vers le CAS :
        var urlObject = url.parse(this.configuration.casLoginUrl);
        urlObject.query = {
            service: originUrl
        };

        // Redirection vers le CAS dans tous les cas,
        // sauf si la requête est une requête ajax en provenance de node ou du client js (prefixe /services)
        if (isServiceRequest && CasStrategy.isAjaxRequest(req)) {

            // la requête reçue (ajax) ne peut pas etre redirigée directement (blocage CSP)
            // => laisser le browser s'occuper de la redirection :
            // indiquer via le flag x-is-login-page au RedirectToLoginPagePlugin côté client
            // qu'il faut renvoyer vers la page de login (avec un redirect browser par window.location)

            logger.info("Reconnexion - la requete d'origine est une requête ajax vers un service - redirect à traiter côté client");
            logger.debug("Reconnexion - ajout header x-is-login-page dans la réponse pour le RedirectToLoginPagePlugin");

            res.header("x-is-login-page", "true");
            res.status(200).end();

        } else {
            // autrement (la requête vient du browser)
            // alors, on fait un redirect http vers le serveur CAS (paramètres de connexion = optionsCas)
            logger.info("Reconnexion - redirection vers le CAS : ", url.format(urlObject));
            res.redirect(307, url.format(urlObject));
        }
    }

    /**
     * Retourne le Middleware Express qui gère la déconnexion de l'utilisateur et la redirection.
     * @param disconnectRedirectUrl (optionnel) url de redirection après connexion
     * @return Middleware Express
     */
    protected disconnectMiddleware():any {
        var _self = this;

        return function disconnect(req, res:Response, next):void {
            req.logout(); // suppression du user dans la session s'il est déjà présent

            req.getSession().invalidate(() => {
                res.redirect(307, _self.configuration.casLogoutUrl);
            });
        };
    }

    /**
     * Initialisation de Passport.Js avec une stratégie CAS générique
     * @param passportInstance
     */
    protected initStrategy():void {
        /**
         * Insertion de la stratégie
         */
        var strategy = new CasStrategy(this.configuration);
        this.passport.use(strategy);
        this.strategyName = strategy.name;
    }
}
