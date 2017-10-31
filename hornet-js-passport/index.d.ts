declare module "hornet-js-passport/src/authentication-configuration" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	export class AuthenticationtConfiguration {
	    appLoginPath: string;
	    appLogoutPath: string;
	    /**
	     * Instanciation de la configuration pour un appel CAS direct depuis l'application
	     *
	     * @param appLoginPath path relatif de l'application déclenchant le process de connexion
	     * @param appLogoutPath path relatif de l'application déclenchant le process de déconnexion
	     */
	    constructor(appLoginPath: string, appLogoutPath: string);
	}
	
}

declare module "hornet-js-passport/src/authentication-utils" {
	export class AuthenticationUtils {
	    /**
	     * Verifier si la requête est une requête ajax (demande de JSON)
	     *
	     * @param req
	     * @returns {boolean}
	     */
	    static isAjaxRequest(req: any): boolean;
	    /**
	     * Verifier si la requête est effectuée depuis le client js vers node (prefixées en /services)
	     *
	     * @param req
	     * @returns {boolean}
	     */
	    static isServiceRequest(req: any): boolean;
	    /**
	     * Test si c'est bien l'url demandée (recherche depuis la fin).
	     * @param originalUrl URL à tester
	     * @param testUrl URL recherchée
	     * @returns {boolean} true si correspond.
	     */
	    static isUrl(req: any, testUrl: string): boolean;
	    /**
	     * Méthode permettant de construire les queryStrings d'une requête GET
	     * @param params
	     * @returns {any}
	     */
	    static buildQueryStrings(params: any): string;
	}
	
}

declare module "hornet-js-passport/src/passport-authentication" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
	import { AuthenticationtConfiguration }  from "hornet-js-passport/src/authentication-configuration";
	import { AuthenticationStrategy }  from "hornet-js-passport/src/strategy/authentication-strategy";
	export class PassportAuthentication {
	    protected passport: any;
	    protected configuration: AuthenticationtConfiguration;
	    protected strategies: {};
	    constructor(configuration: AuthenticationtConfiguration);
	    getMiddleware(): Class<AbstractHornetMiddleware>;
	    /**
	     * Initialisation de Passport.Js.
	     * @return instancePassport
	     */
	    protected initSerialize(): any;
	    /**
	     * Renvoie un middleware complet de gestion de l'authentification (connection, validation et déconnexion)
	     * @param passportInstance instance de Passport.Js  sur laquelle lancer l'autentification de la stratégie
	     * @returns middleware express {function(express.Request, express.Response, any)}
	     */
	    protected createMiddleware(): any;
	    /**
	     * Retourne le Middleware Express qui gère la déconnexion de l'utilisateur et la redirection.
	     * @param disconnectRedirectUrl (optionnel) url de redirection après connexion
	     * @return Middleware Express
	     */
	    protected disconnectMiddleware(): any;
	    /**
	     * Initialisation de Passport.Js avec une stratégie CAS générique
	     * @param passportInstance
	     */
	    initStrategy(strategy: AuthenticationStrategy): void;
	    /**
	     * Retourne le user mis sur la requete par passport après l'étape de désérialisation
	     * @param {Request} req requete http eténdu par passport
	     * @return l'utilisateur
	     */
	    private getUser(req);
	}
	
}

declare module "hornet-js-passport/src/user" {
	export interface IUSer {
	    getName(): string;
	    setName(name: string): void;
	    getRoles(): Array<IRole>;
	    setRoles(roles: Array<IRole>): void;
	}
	export interface IRole {
	    getName(): string;
	    setName(name: string): void;
	}
	export class User implements IUSer {
	    private name;
	    private roles;
	    constructor(name?: string, roles?: Array<IRole>);
	    getName(): string;
	    setName(name: string): void;
	    getRoles(): Array<IRole>;
	    setRoles(roles: Array<IRole>): void;
	}
	export class Role implements IRole {
	    private name;
	    constructor(name?: string);
	    getName(): string;
	    setName(name: string): void;
	}
	
}

declare module "hornet-js-passport/src/strategy/authentication-strategy" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	import { Strategy } from "passport";
	import { Request, Response } from "express";
	export interface AuthenticationStrategy extends Strategy {
	    /**
	     * fonction de connexion associée à la statégie
	     * @param {Passport} instance de passport sur laquelle la stratégie s'applique
	     * @param {Request} requete
	     * @param {Response} reponse
	     * @param [next] - fonction d'appel middleware express suivant
	     */
	    connect(passport: any, req: Request, res: Response, next: (err?: Error) => void): any;
	    /**
	     * fonction de déconnexion associée à la statégie
	     * @param {Passport} instance de passport sur laquelle la stratégie s'applique
	     * @param {Request} requete
	     * @param {Response} reponse
	     * @param [next] - fonction d'appel middleware express suivant
	     */
	    disconnect(passport: any, req: Request, res: Response, next: (err?: Error) => void): any;
	    /**
	     * Indique si cette requête est prise en charge par la stratégie
	     * @param {Request} requete
	     */
	    isRequestForStrategie(req: Request): boolean;
	}
	
}

declare module "hornet-js-passport/src/strategy/cas/cas-configuration" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	export class CasConfiguration {
	    appLoginPath: string;
	    appLogoutPath: string;
	    hostUrlReturnTo: string;
	    casValidateUrl: string;
	    casLoginUrl: string;
	    casLogoutUrl: string;
	    verifyFunction: any;
	    /**
	     * Instanciation de la configuration pour un appel CAS direct depuis l'application
	     *
	     * @param appLoginPath path relatif de l'application déclenchant le process de connexion
	     * @param appLogoutPath path relatif de l'application déclenchant le process de déconnexion
	     * @param hostUrlReturnTo url de retour après authentification sur le CAS
	     * @param casValidateUrl url du service de validation des tichets CAS
	     * @param casLoginUrl url de connexion du CAS
	     * @param casLogoutUrl url de déconnexion du CAS
	     * @param verifyFunction (facultatif) : fonction à utiliser pour la récupération/vérification des infos de l'utilisateur
	     */
	    constructor(appLoginPath: string, appLogoutPath: string, hostUrlReturnTo: string, casValidateUrl: string, casLoginUrl: string, casLogoutUrl: string, verifyFunction?: any);
	}
	
}

declare module "hornet-js-passport/src/strategy/cas/cas-strategy" {
	import { CasConfiguration }  from "hornet-js-passport/src/strategy/cas/cas-configuration";
	import { AuthenticationStrategy }  from "hornet-js-passport/src/strategy/authentication-strategy";
	import { Request, Response } from "express";
	export class CasStrategy implements AuthenticationStrategy {
	    private _name;
	    protected static optionXml: any;
	    protected configuration: CasConfiguration;
	    protected verifyAuthentication: any;
	    constructor(configuration: CasConfiguration, verify?: any);
	    name: string;
	    /**
	     * Authenticate lance la validation d"un ticket s"il est présent dans la requête.
	     *
	     * @param {Object} req
	     * @param {Object} options
	     */
	    authenticate(req: any): void;
	    /**
	     * Traitement de la réponse à la validation du ticket CAS
	     * @param casBody reponse du CAS à parser
	     */
	    private validateCasResponse(casBody);
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
	    protected getUserInfo(login: any, done: any): void;
	    /**
	     * Extrait l"url de retour après la connexion CAS
	     * @param req requete express
	     * @returns {string} l"url fournie à CAS pour le retour
	     */
	    static origin(req: any, hostUrl?: string): string;
	    /**
	     * @override
	     */
	    connect(passport: any, req: Request, res: Response, next: (err?: Error) => void): void;
	    /**
	     * @override
	     */
	    disconnect(passport: any, req: Request, res: Response, next: (err?: Error) => void): void;
	    private manageRedirectToCas(req, res);
	    /**
	     * @override
	     */
	    isRequestForStrategie(req: Request): boolean;
	}
	
}

declare module "hornet-js-passport/src/strategy/saml/saml-configuration" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	/**
	 *
	 */
	export class SamlConfiguration {
	    appLoginPath: string;
	    appLogoutPath: string;
	    hostUrlReturnTo: string;
	    availableIdp: IdentityProviderProps[];
	    issuer: string;
	    profilSeparator: String;
	    identifierFormat: string;
	    decryptionPvk: string;
	    privateCert: string;
	    certSignature: string;
	    certChiffrement: string;
	    verifyFunction: Function;
	    appCert: string;
	    entryPoint: string;
	    idp: IdentityProviderProps;
	    validateInResponseTo: boolean;
	    disableRequestedAuthnContext: boolean;
	    signatureAlgorithm: string;
	    acceptedClockSkewMs: number;
	    passReqToCallback: boolean;
	    authnRequestBinding: string;
	    connexionComponent: any;
	    /**
	     *
	     * @param appLoginPath path relatif de l'application déclenchant le process de connexion
	     * @param appLogoutPath path relatif de l'application déclenchant le process de déconnexion
	     * @param hostUrlReturnTo
	     * @param certSignature
	     * @param privateCert
	     * @param availableIdp
	     */
	    constructor(appLoginPath: string, appLogoutPath: string, hostUrlReturnTo: string, issuer: string, certSignature: string, privateCert: string, availableIdp: IdentityProviderProps[], verifyFunction?: Function);
	}
	/**
	 * Interface IDP
	 */
	export interface IdentityProviderProps {
	    name: string;
	    shibbolethUrl?: string;
	    entryPoint?: string;
	    logoutUrl?: string;
	    httpsCert?: string;
	    certSignature?: string;
	    certChiffrement?: string;
	}
	
}

declare module "hornet-js-passport/src/strategy/saml/saml-strategy" {
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
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license
	 */
	import { AuthenticationStrategy }  from "hornet-js-passport/src/strategy/authentication-strategy";
	import { Saml } from "hornet-js-passport/src/strategy/saml/saml";
	import { SamlConfiguration, IdentityProviderProps } from "hornet-js-passport/src/strategy/saml/saml-configuration";
	import { Request, Response } from "express";
	export class SamlStrategy implements AuthenticationStrategy {
	    name: string;
	    _verify: Function;
	    _saml: Saml;
	    _passReqToCallback: boolean;
	    _authnRequestBinding: string;
	    availableIdp: any;
	    idp: IdentityProviderProps;
	    entryPoint: string;
	    certChiffrement: string;
	    certSignature: string;
	    private connexionComponent;
	    private appCert;
	    protected configuration: SamlConfiguration;
	    constructor(options: SamlConfiguration, valid?: Function);
	    /**
	     * Méthode permettant de retourner l'objet USER
	     * @param login
	     * @param done
	     * @returns {any}
	     */
	    protected getUserInfo(login: any, done: any): any;
	    /**
	     * Formattage de la chaine de caractère des profils => transformation en tableau d'objets
	     * @param profils
	     * @returns {Array}
	     */
	    formateRoles(profils: any): any[];
	    authenticate(req: any, options: any): any;
	    /**
	     * Méthode permettant de setter les IDP
	     * @param req
	     * @param idp
	     * @param cb
	     */
	    protected getIDPInformations(req: Request, idp: IdentityProviderProps, cb: any): void;
	    /**
	     * Permet de faire le rendu HTML de l'écran de sélection d'un IDP
	     * @returns {string}
	     */
	    private renderMultiIdpPage();
	    /**
	     * Déconnexion
	     * @param req
	     * @param callback
	     */
	    logout(req: Request, callback: any): void;
	    /**
	     * Génération du METADATA de l'application
	     * @param decryptionCert
	     * @returns {any}
	     */
	    protected generateServiceProviderMetadata(decryptionCert: any): string;
	    /**
	     * Méthode permettant de gérer la connexion SAML
	     * @param passport
	     * @param req
	     * @param res
	     * @param next
	     * @returns {any}
	     */
	    protected manageRedirectTo(passport: any, req: Request, res: Response, next: any): any;
	    /**
	     * @override
	     */
	    isRequestForStrategie(req: Request): boolean;
	    /**
	     * @override
	     */
	    connect(passport: any, req: Request, res: Response, next: (err?: Error) => void): void;
	    /**
	     * @override
	     */
	    disconnect(passport: any, req: Request, res: Response, next: (err?: Error) => void): void;
	}
	
}

declare module "hornet-js-passport/src/strategy/saml/saml" {
	import { IdentityProviderProps } from "hornet-js-passport/src/strategy/saml/saml-configuration";
	export type Callback<T> = (res: T) => void;
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { Request, Response } from "express";
	export class Saml {
	    options: any;
	    constructor(options: any);
	    /**
	     * Initialisation Objet
	     * @param options
	     * @returns {any}
	     */
	    protected static initialize(options: any): any;
	    static generateUniqueID(): string;
	    static generateInstant(): string;
	    protected signRequest(samlMessage: any): void;
	    /**
	     * Génération de la requête SAML
	     * @param isPassive
	     * @param callback
	     */
	    protected generateAuthorizeRequest(isPassive: boolean, callback: any): Promise<any>;
	    /**
	     *
	     * @param req
	     * @returns {any}
	     */
	    protected generateLogoutRequest(req: Request): string;
	    /**
	     *
	     * @param logoutRequest
	     * @returns {any}
	     */
	    protected generateLogoutResponse(logoutRequest: any): any;
	    /**
	     *
	     * @param request
	     * @param response
	     * @param operation
	     * @param additionalParameters
	     * @param callback
	     */
	    protected requestToUrl(request: any, response: Response, operation: string, additionalParameters: any, callback: any): void;
	    /**
	     *
	     * @param req
	     * @param operation
	     * @returns {any}
	     */
	    protected getAdditionalParams(req: Request, operation: string): any;
	    /**
	     *
	     * @param req
	     * @param callback
	     */
	    protected getAuthorizeUrl(req: Request, callback: Callback<any>): void;
	    /**
	     *
	     * @param req
	     * @param callback
	     */
	    getLogoutUrl(req: Request, callback: any): void;
	    /**
	     *
	     * @param req
	     * @param callback
	     */
	    getLogoutResponseUrl(req: Request, callback: Callback<any>): void;
	    /**
	     *
	     * @param cert
	     * @returns {any}
	     */
	    static certToPEM(cert: string): string;
	    /**
	     * This function checks that the |currentNode| in the |fullXml| document contains exactly 1 valid
	     * signature of the |currentNode|.
	     * See https://github.com/bergie/passport-saml/issues/19 for references to some of the attack
	     * vectors against SAML signature verification.
	     * @param fullXml
	     * @param currentNode
	     * @param cert
	     * @returns {any}
	     */
	    protected validateSignature(fullXml: any, currentNode: any, cert: string): boolean;
	    /**
	     *
	     * @param container
	     * @param callback
	     * @returns {any}
	     */
	    validatePostResponse(container: any, callback: any): any;
	    /**
	     * Méthode permettant de décrypter le flux xml de retour suite à la connexion SAML
	     * @param encryptedDataXml
	     * @param xmlencOptions
	     * @returns Promise
	     */
	    decryptXml(encryptedDataXml: string, xmlencOptions: any): Promise<{}>;
	    /**
	     * Méthode permettant de parser le flux XML de retour
	     * @param xml
	     * @param parserConfig
	     * @returns Promise
	     */
	    parseString(xml: string, parserConfig: any): Promise<{}>;
	    /**
	     *
	     * @param xml
	     * @param callback
	     */
	    protected processValidlySignedAssertion(xml: string, callback: any): void;
	    /**
	     *
	     * @param nowMs
	     * @param notBefore
	     * @param notOnOrAfter
	     * @returns {any}
	     */
	    protected checkTimestampsValidityError(nowMs: number, notBefore: string, notOnOrAfter: string): Error;
	    /**
	     *
	     * @param container
	     * @param callback
	     */
	    validatePostRequest(container: any, callback: any): void;
	    /**
	     *
	     * @param doc
	     * @param callback
	     * @returns {any}
	     */
	    protected static processValidlySignedPostRequest(doc: any, callback: any): any;
	    /**
	     *
	     * @param decryptionCert
	     * @returns {any}
	     */
	    generateServiceProviderMetadata(decryptionCert: any): string;
	    /**
	     * Permet de récupérer les certificats liés à un IDP
	     * @param idp IdentityProviderProps
	     * @param cb callBack
	     */
	    getIdpInformations(idp: IdentityProviderProps, cb: any): void;
	    /**
	     * Permet de récupérer les informations liés à l'IDP
	     * @param infosUrl
	     * @param idp IdentityProviderProps
	     * @returns {{hostname, path, cert: Buffer, method: string, rejectUnauthorized: boolean}}
	     */
	    protected static getIdpOptions(infosUrl: any, idp: any): {
	        hostname: any;
	        path: any;
	        cert: Buffer;
	        method: string;
	        rejectUnauthorized: boolean;
	    };
	    /**
	     *
	     * @param assertionXML
	     * @param next
	     */
	    parseMetadataIdp(assertionXML: any, next: any): void;
	    /**
	     * Permet de supprimer le dernier saut de ligne d'un certificat
	     * @param str
	     */
	    static removeLastLine(str: string): string;
	}
	
}

declare module "hornet-js-passport/src/strategy/saml/views/cnx/connexion-page" {
	import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
	import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
	export interface ConnexionSAMLPageProps extends HornetComponentProps {
	    errorMessage?: any;
	    previousUrl?: string;
	    staticUrl?: string;
	    idps?: any;
	    appTheme?: string;
	    fwkTheme?: string;
	}
	/**
	 * Ecran de connexion
	 */
	export class ConnexionPage extends HornetComponent<ConnexionSAMLPageProps, any> {
	    static defaultProps: {
	        appTheme: string;
	        fwkTheme: string;
	    };
	    _renderErrorDiv(): JSX.Element;
	    /**
	     * @inheritDoc
	     */
	    render(): JSX.Element;
	    /**
	     * Rendu des boutons liés aux IDP
	     * @returns {any}
	     */
	    renderIDPButtons(): JSX.Element;
	}
	
}

declare module "hornet-js-passport/src/strategy/saml/views/cnx/thumbnail-css" {
	export let styleCSS: {
	    bdr3: {
	        borderRadius: string;
	    };
	    bgColorMain: {
	        backgroundColor: string;
	    };
	    tac: {
	        textAlign: string;
	    };
	    appWidth: {
	        "maxWidth": string;
	    };
	    header: {
	        "paddingTop": string;
	    };
	};
	
}
