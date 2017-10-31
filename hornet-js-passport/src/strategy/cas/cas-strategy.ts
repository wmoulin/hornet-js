/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-passport - Gestion d'authentification
 *
 * @author 
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license 
 */

import * as url from "url";
import * as request from "request";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { CasConfiguration } from "src/strategy/cas/cas-configuration";
import { AuthenticationStrategy } from "src/strategy/authentication-strategy"
import { Request, Response } from "express";
import { AuthenticationUtils } from "src/authentication-utils";

const logger: Logger = Utils.getLogger("authentication.cas.cas-strategy");

var parseString = require("xml2js").parseString,
    stripPrefix = require("xml2js/lib/processors").stripPrefix;

export class CasStrategy implements AuthenticationStrategy {

    private _name = "cas";

    protected static optionXml: any = {
        explicitRoot: false,
        tagNameProcessors: [stripPrefix]
    };

    protected configuration: CasConfiguration;
    protected verifyAuthentication: any;

    constructor(configuration: CasConfiguration, verify?) {
        this.configuration = configuration;
        this.verifyAuthentication = verify || this.configuration.verifyFunction || this.getUserInfo;
    }

    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    /**
     * Authenticate lance la validation d"un ticket s"il est présent dans la requête.
     *
     * @param {Object} req
     * @param {Object} options
     */
    public authenticate(req): void {

        // récupération du ticket s"il est présent
        let ticket = req.query.ticket;

        // Cast en any pour éviter les erreurs compile TS car méthodes rajoutées à l"exécution
        let self: any = this;

        if (!ticket) { // aucun ticket a valider, redirection vers l"écran de connexion
            self.pass();
            return;
        }

        let urlObject = url.parse(this.configuration.casValidateUrl);
        urlObject.query = {
            service: CasStrategy.origin(req, Utils.buildContextPath(this.configuration.hostUrlReturnTo)),
            ticket: ticket
        };

        // lancement de la validation du ticket
        logger.debug("ticket validation");

        request.get(
            url.format(urlObject),
            function(casErr, casRes, casBody) {
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
        let _self: any = this;
        parseString(casBody, CasStrategy.optionXml, function(err, serviceResponse) {
            if (err) {
                return _self.error("Error from CAS. (" + err.message + ")");
            }

            let success = serviceResponse && serviceResponse.authenticationSuccess && serviceResponse.authenticationSuccess[0],
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

            let verified = function(err, user, info) {
                if (err) {
                    return _self.error(err);
                }
                if (!user) {
                    return _self.fail(info);
                }
                user.strategy = _self.name; // on indique la strategy qui a permis la connexion
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
     * La fonction doit être redéfinie dans les stratégies spécifiques (cf arobas-strategy)
     * pour utiliser le service fournis pas le serveur CAS choisi (arobas par exemple)
     *
     * La fonction peut aussi etre créée à la volée et injectée dans la configuration (configuration.verifyFunction)
     *
     * @param login nom de l"utilisateur
     * @param done callback de gestion des retours.
     */
    protected getUserInfo(login, done): void {
        logger.debug("GET User info (default) - return login : ", login);
        login.strategy = this.name; // on indique la strategy qui a permis la connexion
        return done(null, login); //cb(err, user)

    }

    /**
     * Extrait l"url de retour après la connexion CAS
     * @param req requete express
     * @returns {string} l"url fournie à CAS pour le retour
     */
    public static origin(req, hostUrl?: string): string {
        let parseUrl = require("parseurl");
        let oUrl = parseUrl.original(req);
        let newHost: string = hostUrl || req.protocol + "://" + req.get("host");
        let returnUrl = newHost + oUrl.pathname;

        logger.debug("Original request path is ", oUrl.pathname, " => return url set to : ", returnUrl);
        return returnUrl;
    }

    /**
     * @override
     */
    public connect(passport:any, req:Request, res:Response, next:(err?:Error)=>void) {

        if (!req.isAuthenticated()) {
            if (req.query.ticket) {
                // authentifie et redirige vers l'url en session "returnTo"
                passport.authenticate(this.name, {
                    failureFlash: true,
                    successReturnToOrRedirect: Utils.buildContextPath("/")
                })(req, res, next);
            } else {

                this.manageRedirectToCas(req, res);
            }
        } else {
            // Traitement désynchro session applicative / session CAS :
            // si le user est déconnecté du CAS, mais toujours authentifié sur l'appli (cookie session node existant)
            // alors, lors de la reconnexion au CAS, quand le nouveau ticket arrive (requête = login?ticket=xxx)
            // il faut relancer tout le processus d'authentification (afin d'effacer/re-créer la session applicative existante)
            if (AuthenticationUtils.isUrl(req, Utils.buildContextPath(this.configuration.appLoginPath)) && req.query.ticket) {
                passport.authenticate(this.name, {
                    failureFlash: true,
                    successReturnToOrRedirect: Utils.buildContextPath("/")
                })(req, res, next);
            } else if (AuthenticationUtils.isUrl(req, Utils.buildContextPath(this.configuration.appLoginPath))) {
                this.manageRedirectToCas(req, res);
            } else {
                next();
            }
        }
    }

    /**
     * @override
     */
    public disconnect(passport:any, req:Request, res:Response, next:(err?:Error)=>void) {
        let _self:CasStrategy = this;
        
        req.logout(); // suppression du user dans la session s'il est déjà présent
        req.getSession().invalidate(() => {
            res.redirect(307, _self.configuration.casLogoutUrl);
        });
    }

    private manageRedirectToCas(req: Request, res: Response): any {
        logger.trace("Deconnexion detectée - reconnexion au CAS en cours");

        // url de retour par defaut (page d'accueil)
        let returnUrl = this.configuration.hostUrlReturnTo + Utils.buildContextPath(Utils.appSharedProps.get("welcomePageUrl"));
        logger.debug("Reconnexion - default returnUrl = ", returnUrl);

        // url de la page demandée à l'origine
        let originUrl = CasStrategy.origin(req, Utils.buildContextPath(this.configuration.hostUrlReturnTo));
        logger.debug("Reconnexion - originUrl = ", originUrl);

        // après l'authentification, il faudra rediriger vers la requête d'origine,
        // sauf quand c'est la page de login qui était demandée (dans ce cas, on renvoie sur la page par defaut)
        if (!AuthenticationUtils.isUrl(req, Utils.buildContextPath(this.configuration.appLoginPath))) {
            logger.debug("Reconnexion - la page demandée n'est pas la page de login - setting returnUrl to originUrl.");
            returnUrl = originUrl;
        }

        let isServiceRequest = AuthenticationUtils.isServiceRequest(req);
        if (isServiceRequest && req.header("referer")) {
            originUrl = req.header("referer");
            returnUrl = originUrl;
            logger.debug("Reconnexion - requete detectée vers /services/* - " +
                "la redirection après reconnexion se fera vers le referer : ", returnUrl);
        }

        // Suite à une demande de reconnexion côté client (redirection via le RedirectToLoginPagePlugin)
        // c'est l'attribut "previousUrl" qui indique l'url d'origine à utiliser pour le retour
        // on l'utilise systématiquement si elle est présente
        let previousUrl = req.query.previousUrl;
        if (previousUrl) {
            originUrl = previousUrl;
            returnUrl = previousUrl;
            logger.debug("Reconnexion - attribut previousUrl detecté dans la requête, setting returnUrl to previousUrl : ", previousUrl);
        }

        // returnTo = url de redirection après l'authentification
        req.getSession().setAttribute("returnTo", returnUrl);
        logger.debug("Reconnexion - mise en session de returnUrl (attribut returnTo) : ", returnUrl);

        // préparer la requête vers le CAS :
        let urlObject = url.parse(this.configuration.casLoginUrl);
        urlObject.query = {
            service: originUrl
        };

        // Redirection vers le CAS dans tous les cas,
        // sauf si la requête est une requête ajax en provenance de node ou du client js (prefixe /services)
        if (isServiceRequest && AuthenticationUtils.isAjaxRequest(req)) {

            // la requête reçue (ajax) ne peut pas etre redirigée directement (blocage CSP)
            // => laisser le browser s'occuper de la redirection :
            // indiquer via le flag x-is-login-page au RedirectToLoginPagePlugin côté client
            // qu'il faut renvoyer vers la page de login (avec un redirect browser par window.location)

            logger.trace("Reconnexion - la requete d'origine est une requête ajax vers un service - redirect à traiter côté client");
            logger.debug("Reconnexion - ajout header x-is-login-page dans la réponse pour le RedirectToLoginPagePlugin");

            res.header("x-is-login-page", "true");
            res.status(200).end();

        } else {
            // autrement (la requête vient du browser)
            // alors, on fait un redirect http vers le serveur CAS (paramètres de connexion = optionsCas)
            logger.trace("Reconnexion - redirection vers le CAS : ", url.format(urlObject));
            res.redirect(307, url.format(urlObject));
        }
    }

    /**
     * @override
     */
    public isRequestForStrategie(req:Request) : boolean {
        return (req.query && req.query.ticket) || (req.user && req.user.strategy && req.user.strategy == this.name);
    }
}
