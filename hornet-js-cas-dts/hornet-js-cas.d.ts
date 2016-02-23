declare module "hornet-js-cas/src/cas-configuration" {
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

declare module "hornet-js-cas/src/cas-strategy" {
	import { Strategy } from "passport";
	import { CasConfiguration }  from "hornet-js-cas/src/cas-configuration";
	export class CasStrategy implements Strategy {
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
	     * La fonction doit être redéfinie dans les stratégies spécifiques (cf strategy)
	     * pour utiliser le service fournis pas le serveur CAS choisi
	     *
	     * La fonction peut aussi etre créée à la volée et injectée dans la configuration (configuration.verifyFunction)
	     *
	     * @param login nom de l"utilisateur
	     * @param done callback de gestion des retours.
	     */
	    protected getUserInfo(login: any, done: any): void;
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
	     * Extrait l"url de retour après la connexion CAS
	     * @param req requete express
	     * @returns {string} l"url fournie à CAS pour le retour
	     */
	    static origin(req: any, hostUrl?: string): string;
	}
	
}

declare module "hornet-js-cas" {
	export { CasConfiguration }  from "hornet-js-cas/src/cas-configuration";
	export { PassportCas }  from "hornet-js-cas/src/passport-cas";
	export { CasStrategy }  from "hornet-js-cas/src/cas-strategy";
	
}

declare module "hornet-js-cas/src/passport-authentication" {
	import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
	export class PassportAuthentication {
	    protected passport: any;
	    constructor();
	    getMiddleware(): typeof AbstractHornetMiddleware;
	    /**
	     * Test si c'est bien l'url demandée (recherche depuis la fin).
	     * @param originalUrl URL à tester
	     * @param testUrl URL recherchée
	     * @returns {boolean} true si correspond.
	     */
	    protected static isUrl(req: any, testUrl: string): boolean;
	    /**
	     * Initialisation de Passport.Js.
	     * @return instancePassport
	     */
	    protected initSerialize(): any;
	    protected createMiddleware(): Function;
	}
	
}

declare module "hornet-js-cas/src/passport-cas" {
	import { Response } from "express";
	import { CasConfiguration }  from "hornet-js-cas/src/cas-configuration";
	import { PassportAuthentication }  from "hornet-js-cas/src/passport-authentication";
	export class PassportCas extends PassportAuthentication {
	    protected strategyName: string;
	    protected configuration: CasConfiguration;
	    constructor(configuration: CasConfiguration);
	    /**
	     * Renvoie un middleware complet de gestion de l'authentification (connection, validation et déconnexion)
	     * @param passportInstance instance de Passport.Js  sur laquelle lancer l'autentification de la stratégie
	     * @returns middleware express {function(express.Request, express.Response, any)}
	     */
	    protected createMiddleware(): any;
	    protected manageRedirectToCas(req: any, res: Response): any;
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
	    protected initStrategy(): void;
	}
	
}
