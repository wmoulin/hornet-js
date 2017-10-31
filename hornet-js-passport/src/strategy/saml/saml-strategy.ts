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

import { AuthenticationStrategy } from "src/strategy/authentication-strategy";
import { AuthenticationUtils } from "src/authentication-utils";
import { Saml } from "hornet-js-passport/src/strategy/saml/saml";
import { SamlConfiguration, IdentityProviderProps } from "hornet-js-passport/src/strategy/saml/saml-configuration";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as ReactDOMServer from "react-dom/server";
import { ConnexionPage } from "src/strategy/saml/views/cnx/connexion-page";
import * as _ from "lodash";
import { Request, Response } from "express";


const logger: Logger = Utils.getLogger("hornet-js-passport.strategy.saml.saml-strategy");

export class SamlStrategy implements AuthenticationStrategy {

    public name: string;
    public _verify: Function;
    public _saml: Saml;
    public _passReqToCallback: boolean;
    public _authnRequestBinding: string;
    public availableIdp: any;
    public idp: IdentityProviderProps;
    public entryPoint: string;
    public certChiffrement: string;
    public certSignature: string;
    private connexionComponent;
    private appCert: string;
    protected configuration: SamlConfiguration;

    constructor(options: SamlConfiguration, valid?: Function) {

        this.configuration = options;

        this._verify = valid || options.verifyFunction || this.getUserInfo;

        this.name = 'saml';
        this._saml = new Saml(options);
        this._passReqToCallback = !!options.passReqToCallback;
        this._authnRequestBinding = options.authnRequestBinding || 'HTTP-Redirect';

        this.availableIdp = options.availableIdp;
        this.idp = options.idp;
        this.entryPoint = options.entryPoint;
        this.appCert = options.appCert;

        this.configuration.profilSeparator = options.profilSeparator || "; ";

        this.connexionComponent = options.connexionComponent || ConnexionPage;
    }

    /**
     * Méthode permettant de retourner l'objet USER
     * @param login
     * @param done
     * @returns {any}
     */
    protected getUserInfo(login, done) {

        login.roles = this.formateRoles(login.Profil);
        login.name = login.Login;
        return done(null, login);
    }

    /**
     * Formattage de la chaine de caractère des profils => transformation en tableau d'objets
     * @param profils
     * @returns {Array}
     */
    formateRoles(profils) {
        let profilsTmp = [];
        if(profils) {
            profilsTmp = profils.replace('[', "").replace(']', "").replace(/ /gi, "").split(this.configuration.profilSeparator);
        }

        let roles = [];
        profilsTmp.map((role) => {
            roles.push({name: role});
        });

        return roles;
    }


    authenticate(req, options): any {
        let self: any = this;

        options.samlFallback = options.samlFallback || 'login-request';

        let validateCallback = (err, profile, loggedOut) => {
            if (err) {
                return self.error(err);
            }

            if (loggedOut) {
                req.logout();
                if (profile) {
                    req.samlLogoutRequest = profile;
                    return self._saml.getLogoutResponseUrl(req, redirectIfSuccess);
                }
                return self.pass();
            }

            let verified = (err, user, info) => {
                if (err) {
                    return self.error(err);
                }

                if (!user) {
                    return self.fail(info);
                }
                user.strategy = self.name; // on indique la strategy qui a permis la connexion
                self.success(user, info);
            };

            if (self._passReqToCallback) {
                self._verify(req, profile, verified);
            } else {
                self._verify(profile, verified);
            }
        };

        let redirectIfSuccess = (err, url) => {
            if (err) {
                logger.debug("SAML: erreur de redirection", err);
                self.error(err);
            } else {
                logger.debug("SAML: redirection", url);
                if(req.headers["x-requested-with"] == "XMLHttpRequest") {
                    req.res.setHeader("x-is-login-page", "true");
                    req.res.status(200).send("redirection SAML");
                } else {
                    self.redirect(url);
                }
            }
        };

        // GÉNÉRATION DU METADATA
        if ((process.env.NODE_ENV !== "production") && AuthenticationUtils.isUrl(req, Utils.buildContextPath("/metadata-saml"))) {
            req.res.type('application/xml');
            req.res.status(200).send(this.generateServiceProviderMetadata(this.appCert));
            return;

        } else if (req.body && req.body.SAMLResponse) {
            this._saml.validatePostResponse(req.body, validateCallback);

        } else if (req.body && req.body.SAMLRequest) {
            this._saml.validatePostRequest(req.body, validateCallback);

            // AFFICHAGE DE LA PAGE DE SELECTION DU MULTI IDP
        } else if ((!req.body.idp && this.availableIdp && this.availableIdp.length > 1 ) && AuthenticationUtils.isUrl(req, Utils.buildContextPath(this.configuration.appLoginPath))) {
            logger.debug("rendu multi-idp.");
            
            let component = this.renderMultiIdpPage();

            req.res.setHeader("x-is-login-page", "true");
            req.res.send(component);

            // APRES SELECTION DE L'IDP (cas du multiIdp) / mode single IDP
        } else if ((req.body.idp || this.idp ) && AuthenticationUtils.isUrl(req, Utils.buildContextPath(this.configuration.appLoginPath))) {
            logger.debug("connexion pour un idp.");
            if (req.body.idp) {
                this.idp = JSON.parse(req.body.idp);
            }

            // dans le cas d'une deconnexion, on récupère l'idp en session
            if (options.samlFallback == "logout-request") {
                this.idp = req.session.strategy.idp;
            }

            this.getIDPInformations(req, this.idp, () => {
                let requestHandler = {
                    'login-request': function() {
                        logger.debug("SAML login-request");
                        if (self._authnRequestBinding === 'HTTP-POST') {
                            this._saml.getAuthorizeForm(req, (err, data) => {
                                if (err) {
                                    self.error(err);
                                } else {
                                    let res = req.res;
                                    res.send(data);
                                }
                            });
                        } else { // Defaults to HTTP-Redirect
                            this._saml.getAuthorizeUrl(req, redirectIfSuccess);
                        }
                    }.bind(self),
                    'logout-request': function() {
                        logger.debug("SAML logout-request");
                        this._saml.getLogoutUrl(req, redirectIfSuccess);
                        req.logout();
                    }.bind(self)
                }[options.samlFallback];

                if (typeof requestHandler !== 'function') {
                    return self.fail();
                }

                requestHandler();
            });
        } else if (!req.unknowedRoute  && !req.user) { // la route est connu et est contrainte à des droits d'accès
            logger.debug("route connue, mais aucun user -> redirection vers la page de connexion.");
            self.redirect(this._saml.options.hostUrlReturnTo + Utils.buildContextPath(this.configuration.appLoginPath));
        } else {
            self.pass();
        }
    }

    /**
     * Méthode permettant de setter les IDP
     * @param req
     * @param idp
     * @param cb
     */
    protected getIDPInformations(req: Request, idp: IdentityProviderProps, cb): void {
        this._saml.getIdpInformations(idp, (updatedIdp) => {

            this.certChiffrement = updatedIdp.certChiffrement;
            this.certSignature = updatedIdp.certSignature;

            (<any>req).session.strategy = {
                idp: updatedIdp
            };

            cb();
        });
    }

    /**
     * Permet de faire le rendu HTML de l'écran de sélection d'un IDP
     * @returns {string}
     */
    private renderMultiIdpPage() {

        let props = _.merge(this.connexionComponent.defaultProps || {}, {idps: this.availableIdp});

        let htmlApp = ReactDOMServer.renderToStaticMarkup(new this.connexionComponent(props).render());
        let docTypeHtml: string = "<!DOCTYPE html>";

        return docTypeHtml + htmlApp;
    }


    /**
     * Déconnexion
     * @param req
     * @param callback
     */
    logout(req: Request, callback) {
        this._saml.getLogoutUrl(req, callback);
    }

    /**
     * Génération du METADATA de l'application
     * @param decryptionCert
     * @returns {any}
     */
    protected generateServiceProviderMetadata(decryptionCert) {
        return this._saml.generateServiceProviderMetadata(decryptionCert);
    }

    /**
     * Méthode permettant de gérer la connexion SAML
     * @param passport
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    protected manageRedirectTo(passport: any, req: Request, res: Response, next) {

        let originUrl = this._saml.options.hostUrlReturnTo + Utils.buildContextPath(req.originalUrl),
            welcomePage = this._saml.options.hostUrlReturnTo + Utils.buildContextPath(Utils.appSharedProps.get("welcomePageUrl")),
            returnUrl = welcomePage,
            isServiceRequest = AuthenticationUtils.isServiceRequest(req);

        // après l'authentification, il faudra rediriger vers la requête d'origine,
        // sauf quand c'est la page de login qui était demandée (dans ce cas, on renvoie sur la page par defaut)
        if (!AuthenticationUtils.isUrl(req, Utils.buildContextPath(this._saml.options.appLoginPath))) {
            logger.debug("Reconnexion - la page demandée n'est pas la page de login - setting returnUrl to originUrl.");
            returnUrl = (<any>req).session.returnTo || originUrl;
        } else {
            returnUrl = (<any>req).session.returnTo || welcomePage;
        }

        // Cas d'une requête Ajax, on récupère le referer afin de valoriser le previousUrl
        if (isServiceRequest && (<any>req).header("referer")) {
            returnUrl = (<any>req).headers.referer;
            res.header("x-is-login-page", "true");
            res.status(200).end();
            req.query["previousUrl"] = (<any>req).headers.referer;
        }

        if (req.query.previousUrl) {
            returnUrl = (<any>req).session.returnTo = req.query.previousUrl;
        }
        (<any>req).session.returnTo = returnUrl;

        return passport.authenticate(this.name, {successReturnToOrRedirect: returnUrl})(req, res, next);
    }

    /**
     * @override
     */
    public isRequestForStrategie(req: Request): boolean {
        return req.user && req.user.strategy && req.user.strategy == this.name;
    }


    /**
     * @override
     */
    public connect(passport: any, req: Request, res: Response, next: (err?: Error)=>void) {
        this.manageRedirectTo(passport, req, res, next);
        /*if (!req.isAuthenticated()) {
            this.manageRedirectTo(passport, req, res, next);
        } else {
            next();
        }*/
    }

    /**
     * @override
     */
    public disconnect(passport: any, req: Request, res: Response, next: (err?: Error)=>void) {

        let idp: IdentityProviderProps = ((<any>req).session.strategy && (<any>req).session.strategy.idp) ? (<any>req).session.strategy.idp : {};

        this.certChiffrement = idp.certChiffrement;
        this.certSignature = idp.certSignature;

        if(req.user && req.user.nameID) {
            this._saml.getLogoutUrl(req, (err, url) => {
                req.logout(); // suppression du user dans la session s'il est déjà présent
                req.getSession().invalidate(() => {
                    res.redirect(307, url);
                });
            });
        } else {
            res.redirect(this._saml.options.hostUrlReturnTo + Utils.buildContextPath(this.configuration.appLoginPath));
        }
    }
}