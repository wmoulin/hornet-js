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

import { Class } from "hornet-js-utils/src/typescript-utils";
import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
var flash = require("connect-flash");
import { Request, Response } from "express";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { AuthenticationtConfiguration } from "src/authentication-configuration";
import { AuthenticationStrategy } from "src/strategy/authentication-strategy";
import { AuthenticationUtils } from "src/authentication-utils";

const logger: Logger = Utils.getLogger("authentication.passport-authentication");


export class PassportAuthentication {

    protected passport:any;
    protected configuration:AuthenticationtConfiguration;
    protected strategies = {};
    
    constructor(configuration:AuthenticationtConfiguration) {
        this.passport = require("passport");
        this.initSerialize();
        this.configuration = configuration;
    }

    public getMiddleware():Class<AbstractHornetMiddleware> {
        var passport = this.passport;
        var createMiddleware = this.createMiddleware.bind(this);

        return class extends AbstractHornetMiddleware {
            insertMiddleware(app) {
                app.use(flash());
                app.use(passport.initialize());
                app.use(passport.session());
                app.use(createMiddleware());
            }
        };
    }

    /**
     * Initialisation de Passport.Js.
     * @return instancePassport
     */
    protected initSerialize():any {
        // Aucune serialisation, l'objet est complet
        this.passport.serializeUser((user, done) => {
            done(null, user);
        });

        // Aucune déserialisation, l'objet est complet
        this.passport.deserializeUser((user, done) => {
            done(null, user);
        });
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
            if (AuthenticationUtils.isUrl(req, Utils.buildContextPath(_self.configuration.appLogoutPath))) {
                logger.debug("appel déconnexion");
                _self.disconnectMiddleware()(req, res, next);
                return;
            }

            if (!req.isAuthenticated()) {
                if (Object.keys(_self.strategies).length == 1) {
                    _self.strategies[Object.keys(_self.strategies)[0]].connect(_self.passport, req, res, next);
                } else if (Object.keys(_self.strategies).length >= 1 && req.query.strategy) {
                    _self.strategies[req.query.strategy].connect(_self.passport, req, res, next);
                } else {
                    next(Object.keys(_self.strategies).length == 0 ? new Error("No strategy defined") : new Error("No strategy passed for authentication"));
                }
            } else {
                // Traitement désynchro session applicative / session CAS :
                // si le user est déconnecté du CAS, mais toujours authentifié sur l'appli (cookie session node existant)
                // alors, lors de la reconnexion au CAS, quand le nouveau ticket arrive (requête = login?ticket=xxx)
                // il faut relancer tout le processus d'authentification (afin d'effacer/re-créer la session applicative existante)
                let user = _self.getUser(req);
                if (AuthenticationUtils.isUrl(req, Utils.buildContextPath(_self.configuration.appLoginPath)) && user && user.strategy && _self.strategies[user.strategy].isRequestForStrategie(req)) {
                    _self.strategies[user.strategy].connect(_self.passport, req, res, next);
                } else {
                    next();
                }
            }
        }
    }

    
    /**
     * Retourne le Middleware Express qui gère la déconnexion de l'utilisateur et la redirection.
     * @param disconnectRedirectUrl (optionnel) url de redirection après connexion
     * @return Middleware Express
     */
    protected disconnectMiddleware():any {
        var _self = this;

        return function disconnect(req: Request, res: Response, next): void {

            // appel de la deconnexion sur lal strategie
            _self.strategies[Object.keys(_self.strategies)[0]].disconnect(_self.passport, req, res, next);
        };
    }

    /**
     * Initialisation de Passport.Js avec une stratégie CAS générique
     * @param passportInstance
     */
    public initStrategy(strategy:AuthenticationStrategy):void {
        /**
         * Insertion de la stratégie
         */
        this.passport.use(strategy);
        this.strategies[strategy.name]=strategy;
    }

    /**
     * Retourne le user mis sur la requete par passport après l'étape de désérialisation
     * @param {Request} req requete http eténdu par passport
     * @return l'utilisateur
     */
    private getUser(req:Request) {

        let user = undefined;
        
        if (this.passport) {
            user = req[this.passport._userProperty || 'user'];
        }
  
        return user;
    }
}
