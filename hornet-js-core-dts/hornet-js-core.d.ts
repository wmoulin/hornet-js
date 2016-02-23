declare module "hornet-js-core/src/client-conf" {
	import I = require("hornet-js-core/src/routes/router-interfaces");
	interface ClientConfiguration {
	    /**
	     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
	     */
	    defaultRoutesClass: I.IRoutesBuilder;
	    /**
	     * Composant React principal à utiliser pour rendre les pages.
	     * Ce composant est instancié dans la fonction 'initAndStart'.
	     * Côté client c'est auprès du 'PageInformationsStore' que ce composant doit aller chercher la page courante à rendre.
	     */
	    appComponent: any;
	    /**
	     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
	     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
	     */
	    errorComponent: any;
	    /**
	     * Fonction de chargement des composants React par le routeur.
	     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
	     * @param componantName Le nom du composant
	     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
	     */
	    componentLoaderFn?: (componantName: string, callback?: (composant: any) => void) => void;
	    /**
	     * Fonction de chargement des routes en mode lazy
	     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
	     * @param routesFileName Le nom du fichier de routes
	     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
	     */
	    routesLoaderfn: (routesFileName: string, callback: (routesFn: I.IRoutesBuilder) => void) => I.IRoutesBuilder;
	    /**
	     * Fluxible
	     */
	    dispatcher: Fluxible;
	    fluxibleContext?: FluxibleContext;
	    directorClientConfiguration?: I.DirectorClientConfiguration;
	}
	export = ClientConfiguration;
	
}

declare module "hornet-js-core/src/client" {
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	import ClientConfiguration = require("hornet-js-core/src/client-conf");
	class Client {
	    static internationalisationWebpackLoader(callback: any): void;
	    /**
	     * Cette fonction initialise complètement le client avec le routage applicatif.
	     *
	     * Elle effectue les opérations suivantes:
	     * <ul>
	     *      <li> Réhydratation des stores et de la configuration applicative</li>
	     *      <li> Enregistrement d'une fonction de callback spéciale auprès du 'PageInformationsStore' afin de lancer le premier rendu React une fois la première route résolue</li>
	     *      <li> Configuration du routeur 'director' afin d'initialiser toutes les routes applicatives</li>
	     *      <li> Démarrage du routeur</li>
	     * </ul>
	     * @param appConfig
	     */
	    static initAndStart(appConfig: ClientConfiguration, readyCallback: Function): ExtendedPromise<any>;
	}
	export = Client;
	
}

declare module "hornet-js-core/src/server-conf" {
	import I = require("hornet-js-core/src/routes/router-interfaces");
	import https = require("https");
	interface ServerConfiguration {
	    /**
	     * Composant store pour la session. utilisé pour enregistrer la session.
	     */
	    sessionStore: any;
	    /**
	     * Répertoire courant du script, utilisé pour reconstruire les liens relatifs
	     */
	    serverDir: string;
	    /**
	     * Répertoire relatif (par rapport à la variable 'serverDir') vers les ressources statiques
	     */
	    staticPath: string;
	    /**
	     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
	     */
	    defaultRoutesClass: I.IRoutesBuilder;
	    /**
	     * Composant React principal à utiliser pour rendre les pages.
	     * Ce composant est instancié par le routeur côté serveur et par le composant 'client' côté client.
	     * Côté serveur, la page courante à rendre lui est fourni par le routeur grâce à la propriété 'composantPage'
	     */
	    appComponent: any;
	    /**
	     * Composant React de layout à utiliser pour rendre le composant principal.
	     * Ce composant est instancié par le routeur côté serveur.
	     * Côté serveur, l'app à rendre lui est fourni par le routeur grâce à la propriété 'composantApp'
	     */
	    layoutComponent: any;
	    /**
	     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
	     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
	     */
	    errorComponent: any;
	    /**
	     * Fonction de chargement des composants React par le routeur.
	     * Elle prend en argument le nom du composant et retourne le composant chargé.
	     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
	     * @param componantName Le nom du composant à charger
	     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
	     */
	    componentLoaderFn?: (componantName: string) => any;
	    /**
	     * Fonction de chargement des routes en mode lazy.
	     * Elle prend en argument le nom du composant et retourne le composant chargé.
	     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
	     * @param routesFileName Le nom de la route à charger
	     */
	    routesLoaderfn: (routesFileName: string) => I.IRoutesBuilder;
	    /**
	     * Fluxible
	     */
	    dispatcher: Fluxible;
	    /**
	     * Internationalisation peut être de type String (JSON) ou bien de type IntlLoader (cas plus complexe)
	     */
	    internationalization: any;
	    /**
	     * La configuration du menu
	     */
	    menuConfig?: Object;
	    /**
	     * le path vers la page de login
	     */
	    loginUrl: string;
	    /**
	     * le path vers l'action de logout
	     */
	    logoutUrl: string;
	    /**
	     * le path vers la page d'accueil
	     */
	    welcomePageUrl: string;
	    /**
	     * Les prefixes de chemin considérés comme publiques (sans authentification)
	     */
	    publicZones?: String[];
	    /**
	     * Déclaration des options pour exécuter un serveur en mode https
	     */
	    httpsOptions?: https.ServerOptions;
	}
	export = ServerConfiguration;
	
}

declare module "hornet-js-core/src/server" {
	import ServerConfiguration = require("hornet-js-core/src/server-conf");
	import HornetMiddlewares = require("hornet-js-core/src/middleware/middlewares");
	class Server {
	    private app;
	    private server;
	    private monitor;
	    private keepAlive;
	    private keepAliveTimeout;
	    private port;
	    private maxConnections;
	    private timeout;
	    private protocol;
	    constructor(appConfig: ServerConfiguration, hornetMiddlewareList: HornetMiddlewares.HornetMiddlewareList);
	    start(): void;
	    /**
	     * Création du serveur web en mode http ou bien https
	     * @param httpsOptions option pour le mode https
	     * @returns {Server} le serveur instancié
	     */
	    private createServer(httpsOptions?);
	    /**
	     * Fonction principale permettant d'initialiser le serveur NodeJS proprement dit. <br />
	     * Elle effectue les opérations suivantes:
	     * <ul>
	     *     <li>Chargement de 'express'</li>
	     *     <li>Application des middlewares</li>
	     * </ul>
	     * @param appConfig
	     * @param hornetMiddlewareList
	     * @returns {"express".e.Express}
	     */
	    private init(appConfig, hornetMiddlewareList);
	}
	export = Server;
	
}

declare module "hornet-js-core/src/actions/action" {
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	import ActionExtendedPromise = require("hornet-js-core/src/routes/action-extended-promise");
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	class Action<A extends ActionsChainData> {
	    static ASYNCHRONOUS_REQUEST_START: string;
	    static ASYNCHRONOUS_REQUEST_END_SUCCESS: string;
	    static ASYNCHRONOUS_REQUEST_END_ERROR: string;
	    static EMIT_ERR_NOTIFICATION: string;
	    static EMIT_MODAL_NOTIFICATION: string;
	    static REMOVE_ERR_NOTIFICATION: string;
	    static EMIT_INFO_NOTIFICATION: string;
	    static REMOVE_INFO_NOTIFICATION: string;
	    static REMOVE_MODAL_NOTIFICATION: string;
	    static REMOVE_ALL_ERR_NOTIFICATIONS: string;
	    static REMOVE_ALL_INFO_NOTIFICATIONS: string;
	    static REMOVE_ALL_MODAL_NOTIFICATIONS: string;
	    static REMOVE_ALL_NOTIFICATIONS: string;
	    actionContext: ActionContext;
	    payload: any;
	    actionChainData: A;
	    private resolve;
	    private reject;
	    constructor();
	    getInstance(Api: any, ...args: any[]): any;
	    static serviceConstructor(Api: any): () => any;
	    withContext(actionContext: ActionContext): this;
	    withPayload(payload?: any): this;
	    /**
	     * Retourne une action Hornet, sous forme de promise.
	     * Cette méthode est appelée par le routeur lors du chainage des actions déclarées dans les routes
	     */
	    promise(actionsChainData: A): ActionExtendedPromise;
	    execute(resolve: (data?: A) => void, reject: (error: any) => void): void;
	    _resolveFn(data?: A): void;
	    _rejectFn(error: any): void;
	    /**
	     * Retourne une action au sens Fluxible, c'est à dire une fonction prenant en parametres : (actionContext, payload, (callback))
	     * Il s'agit enfait de la promise encapsulée
	     * Cette action "fluxible" ainsi créée est à utiliser dans la méthode fluxible "executeAction(->action<-, ...)"
	     *
	     * Exemple :
	     *
	     * this.executeAction(new MonAction().action(), payload, cb)
	     */
	    action(): (actionContext: ActionContext, payload?: any, cb?: (value?: any) => void) => ExtendedPromise<void>;
	}
	export = Action;
	
}

declare module "hornet-js-core/src/actions/form-validation-action" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	export interface NewsFormValidation {
	    validate(): boolean;
	    errors(): Error;
	    data: any;
	}
	export class FormValidationAction extends Action<ActionsChainData> {
	    appForm: NewsFormValidation;
	    eventNameFormNotValid: string;
	    eventNameFormValid: string;
	    withApplicationForm(applicationForm: any): FormValidationAction;
	    /**
	     * Evenement lancé uniquement si la formulaire N'est PAS valide
	     * @param eventName
	     * @returns {FormValidationAction}
	     */
	    dispatchIfFormNotValid(eventName: any): FormValidationAction;
	    /**
	     * Evenement lancé uniquement si la formulaire N'est PAS valide
	     * @param eventName
	     * @returns {FormValidationAction}
	     */
	    dispatchIfFormValid(eventName: any): FormValidationAction;
	    execute(resolve: any, reject: any): void;
	}
	
}

declare module "hornet-js-core/src/actions/redirect-client-action" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	/**
	 * Action permettant de faire rediriger le client vers une url (payload) tout en restant sur la page courante (changement de la barre d'adresse).
	 */
	class RedirectClientAction extends Action<ActionsChainData> {
	    /**
	     * Effectue la redirection client.
	     * payload : url de redirection
	     *
	     * @param resolve
	     * @param reject
	     */
	    execute(resolve: any, reject: any): void;
	}
	export = RedirectClientAction;
	
}

declare module "hornet-js-core/src/actions/simple-action" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	class SimpleAction extends Action<ActionsChainData> {
	    static CHANGE_URL: string;
	    static CHANGE_PAGE_COMPONENT: string;
	    static CHANGE_THEME: string;
	    static RECEIVE_MENU_CONFIG: string;
	    key: string;
	    constructor(key: string);
	    execute(resolve: any, reject: any): void;
	    getDispatchKey(): string;
	}
	export = SimpleAction;
	
}

declare module "hornet-js-core/src/actions/validate-user-access-action" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	class ValidateUserAccessAction extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export = ValidateUserAccessAction;
	
}

declare module "hornet-js-core/src/cache/hornet-cache" {
	import Bluebird = require("bluebird");
	/**
	 * Cache de l'aplication.
	 * Voir documentation Onion Skin: http://onionskin.io/
	 * */
	class HornetCache {
	    private static _instance;
	    private pool;
	    constructor();
	    static getInstance(): HornetCache;
	    /**
	     * Item voir documentation de Onion Skin http://onionskin.io/api/
	     * @param key clé de l'item
	     * @returns {any} Item comme définis dans l'API de Onion Skin
	     */
	    getItem(key: string): Bluebird<any>;
	    /**
	     * Mise en cache de la donnée passée en paramètre. Methode Asynchrone: Promise.
	     * @param key clé de la valeur en cache
	     * @param data données à mettre en cache
	     * @param timetoliveInCache temps de sauvegarde de la données
	     */
	    setCacheAsynchrone(key: string, data: any, timetoliveInCache?: number): Bluebird<any>;
	}
	export = HornetCache;
	
}

declare module "hornet-js-core/src/data/file" {
	class File {
	    id: number;
	    originalname: string;
	    name: string;
	    mimeType: string;
	    encoding: string;
	    size: number;
	    buffer: Array<number>;
	}
	export = File;
	
}

declare module "hornet-js-core/src/dispatcher/generic-dispatcher" {
	class GenericDispatcher {
	    protected dispatcher: Fluxible;
	    constructor(fluxibleDefaultConf?: any);
	    getDispatcher(): Fluxible;
	}
	export = GenericDispatcher;
	
}

declare module "hornet-js-core/src/i18n/i18n-fluxible-plugin" {
	class I18nFluxiblePlugin {
	    createPlugin(): {
	        name: string;
	        plugContext: (options: any) => {
	            plugComponentContext: (componentContext: any) => void;
	            plugActionContext: (actionContext: any) => void;
	            dehydrate: () => {
	                i18nMessages: any;
	                locale: any;
	            };
	            rehydrate: (state: any) => void;
	        };
	    };
	    /**
	     * Renvoie la fonction récupérant les messages internationalisés dans 'messages' ou dans les messages par défaut du framework
	     * @param messages messages internationalisés
	     * @returns {function(string):any}
	     */
	    static i18n(messages: Object): (string) => any;
	    /**
	     * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans 'messages'.
	     * Si la clé n'existe pas elle est retournée directement.
	     * @param keysString clé recherchée
	     * @param messages objet contenant les messages à utiliser
	     * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
	     */
	    static getMessages(keysString: string, messages: Object): any;
	    /**
	     * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans 'messages' ou dans 'defaultMessages'.
	     * Si la clé n'existe pas elle est retournée directement.
	     * @param keysString clé recherchée
	     * @param messages objet contenant les messages à utiliser
	     * @param defaultMessages objet contenant les messages par défaut à utiliser
	     * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
	     */
	    static getMessagesOrDefault(keysString: string, messages: Object, defaultMessages: Object): any;
	    /**
	     * Vérifie si la chaîne de caractères respecte le format commun pour une clé de message internationalisé :
	     * caractères alphanumériques non accentués, tiret ou tiret bas, séparation par des points.
	     * @param str chaîne de caractères à tester
	     * @returns {boolean} true lorsque keyString respecte le format habituel
	     */
	    static isMessageKey(str: string): boolean;
	}
	export = I18nFluxiblePlugin;
	
}

declare module "hornet-js-core/src/i18n/i18n-loader" {
	class I18nLoader {
	    constructor();
	    getMessages(locale: Array<string>): string;
	}
	export = I18nLoader;
	
}

declare module "hornet-js-core/src/log/client-log" {
	class ClientLog {
	    static LOCAL_STORAGE_LOGGER_LEVEL_KEY: string;
	    static LOCAL_STORAGE_LOGGER_LAYOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY: string;
	    static defaultRemote: boolean;
	    static defaultLogLevel: string;
	    static defaultLogLayout: string;
	    static defaultRemoteLogLayout: string;
	    static defaultRemoteLogThreshold: number;
	    static defaultRemoteLogTimeout: number;
	    static defaultRemoteUrl: string;
	    /**
	     * Cette fonction retourne la fonction d'initialisation des loggers de l'application côté ClientLog.
	     *
	     * @param logConfig  configuration log
	     */
	    static getLoggerBuilder(logConfig: any): (category: any) => void;
	    private static configureAjaxConsole(appender);
	    private static configureBrowserConsole(appender);
	    static getLoggerKeyValue(confKey: string, value: any, defaultValue: any): any;
	    static configHornetLoggerHelp(): void;
	    static configHornetJsLogState(): void;
	    static setHornetJsLogLevel(): any;
	    static setHornetJsLogLayout(): any;
	    static setHornetJsRemoteLog(): boolean;
	    static setHornetJsRemoteLogLayout(): any;
	    static setHornetJsRemoteLogUrl(defaultUrl: string): any;
	    static testParamLocalStorage(value: any, defaultValue: any): any;
	    static getConsoleLayout(logLayout: string): any;
	    static getDefaultConsoleLayout(): any;
	}
	export = ClientLog;
	
}

declare module "hornet-js-core/src/log/server-log-configurator" {
	
}

declare module "hornet-js-core/src/log/server-log" {
	class ServerLog {
	    static noTid: string;
	    static noUser: string;
	    /**
	     * Liste des tokens qui sont mis à disposition par Hornet dans le pattern des appender log4js
	     */
	    static appenderLayoutTokens: {
	        "pid": () => number;
	        "tid": () => any;
	        "user": () => any;
	        "fn": () => string;
	    };
	    /**
	     * Fonction d'ajout de token pour utilisation dans un pattern log4js
	     * Si besoin spécifique d'une application, cette fonction permet
	     * d'ajouter de nouveaux tokens en plus de ceux fournis par défaut
	     * @param tokenWithFunc : objet de la forme {"token":function(){return "valeur"}}
	     */
	    static addLayoutTokens(tokenWithFunc: any): void;
	    /**
	     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
	     * @param logConfig Le configuration log
	     * @returns {function(any): undefined}
	     */
	    static getLoggerBuilder(logConfig: any): (category: any) => void;
	}
	export = ServerLog;
	
}

declare module "hornet-js-core/src/middleware/middlewares" {
	import ServerConfiguration = require("hornet-js-core/src/server-conf");
	/**
	 * Classe abstraite de gestion d'un middleware dans une application Hornet
	 * Cette classe doit être héritée par chaque middleware
	 *
	 * Attention : la classe héritant de AbstractHornetMiddleware doit définir le constructeur suivant :
	 *          constructor(appConfig:ServerConfiguration) {
	 *              [...]
	 *              super(appConfig, PREFIX_OPTIONNEL, FN_OPTIONNEL);
	 *              [...]
	 *          }
	 *
	 * > Par défaut, la fonction "insertMiddleware(app)" utilise le PREFIX et FN fournis : app.use(PREFIX, FN)
	 *
	 * > Pour des cas particuliers, il est possible de surcharger cette méthode pour ajouter autant de middlewares qu'on veut :
	 *      public insertMiddleware(app) {
	 *          app.use("/exemple", (req, res, next) => { [ ... ] });
	 *          app.use((req, res, next) => { .... });
	 *          ...
	 *      }
	 */
	export class AbstractHornetMiddleware {
	    protected appConfig: ServerConfiguration;
	    protected prefix: string;
	    protected middlewareFunction: Function;
	    /**
	     * Constructeur
	     *
	     * @param appConfig
	     * @param prefix
	     * @param middlewareFunction
	     */
	    constructor(appConfig: ServerConfiguration, prefix?: string, middlewareFunction?: Function);
	    /**
	     * Méthode appelée automatiquement lors de l'initialisation du serveur afin d'ajouter un middleware
	     * @param app
	     */
	    insertMiddleware(app: any): void;
	}
	export class LoggerTIDMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class LoggerUserMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	}
	export class WelcomePageRedirectMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class StaticNodeHttpHeaderMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	}
	export class StaticPathMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	}
	export class BodyParserJsonMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class BodyParserUrlEncodedMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class SessionMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class MulterMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class SecurityMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	    insertMiddleware(app: any): void;
	    private hppConfiguration(app);
	    private ienoopenConfiguration(app);
	    private noSniffConfiguration(app);
	    private cspConfiguration(app);
	    private frameguardConfiguration(app);
	    private xssFilterConfiguration(app);
	    private hpkpConfiguration(app);
	    private hstsConfiguration(app);
	}
	export class CsrfMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    static HEADER_CSRF_NAME: string;
	    static CSRF_SESSION_KEY: string;
	    constructor();
	    insertMiddleware(app: any): void;
	    private csrfConfiguration(app);
	    /**
	     * Retourne un nouveau token aléatoire
	     * @return {string}
	     */
	    static generateToken(): string;
	    /**
	     * Middleware express pour sécuriser les verbs HTTP PUT, POST, PATCH et DELETE d'attaques CSRF
	     * @param req
	     * @param res
	     * @param next
	     */
	    static middleware(req: any, res: director.DirectorResponse, next: any): void;
	    /**
	     * Détermine si le token envoyé correspond à celui stocké en session
	     * @param incomingCsrf
	     * @param sessionCsrf
	     * @return {boolean}
	     * @private
	     */
	    static isTokenValid(incomingCsrf: string, sessionCsrf: string): boolean;
	}
	import director = require("director");
	export class MockManagerMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	    insertMiddleware(app: any): void;
	}
	export class RouterDataMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class RouterViewMiddleware extends AbstractHornetMiddleware {
	    constructor(appConfig: ServerConfiguration);
	}
	export class ErrorMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor(appConfig: ServerConfiguration);
	}
	export var DEFAULT_HORNET_MIDDLEWARES: Array<typeof AbstractHornetMiddleware>;
	export class HornetMiddlewareList extends Array<typeof AbstractHornetMiddleware> {
	    constructor(middlewares?: Array<typeof AbstractHornetMiddleware>);
	    addMiddlewareBefore(newMiddleware: typeof AbstractHornetMiddleware, middleware: typeof AbstractHornetMiddleware): this;
	    addMiddlewareAfter(newMiddleware: typeof AbstractHornetMiddleware, middleware: typeof AbstractHornetMiddleware): this;
	    removeMiddleware(middleware: typeof AbstractHornetMiddleware): this;
	}
	
}

declare module "hornet-js-core/src/mixins/react-mixins" {
	export var FluxibleMixin: any;
	
}

declare module "hornet-js-core/src/monitoring/monitor" {
	class Monitor {
	    private server;
	    private monitorServer;
	    private connexion;
	    private request;
	    private eventLoopStats;
	    private api;
	    constructor(server: any);
	    monitorApiRequests(): void;
	    /**
	     * Callback qui réceptionne les données du module 'event-loop-monitor'
	     * Les moyennes sont mises à jour avec les dernières données
	     *
	     * @param data
	     */
	    onEventLoopMonitorData(data: any): void;
	    /**
	     * Calcule la moyenne des 'count' derniers éléments des données
	     *
	     * @param count
	     * @returns {{p50: number, p90: number, p95: number, p99: number, p100: number}}
	     */
	    computeAverage(count: any): {
	        p50: number;
	        p90: number;
	        p95: number;
	        p99: number;
	        p100: number;
	    };
	    /**
	     * Callback sur la réception d'une requête par le serveur
	     * @param req
	     * @param res
	     */
	    onRequest(req: any, res: any): void;
	    /**
	     * Callback sur l'établissement d'une nouvelle connexion TCP par le serveur
	     * @param req
	     * @param res
	     */
	    onConnection(socket: any): void;
	    monitorServerPage(req: any, res: any): void;
	}
	export = Monitor;
	
}

declare module "hornet-js-core/src/protocol/media-type" {
	import HornetSuperAgentRequest = require("hornet-js-core/src/services/hornet-superagent-request");
	import ServiceApi = require("hornet-js-core/src/services/service-api");
	class MediaType {
	    static MEDIATYPE_PARAMETER: string;
	    static JSON: {
	        PARAMETER: string;
	        MIME: string;
	        readFromSuperAgent: (api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string) => void;
	    };
	    static XLS: {
	        PARAMETER: string;
	        MIME: string;
	        readFromSuperAgent: (api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string) => void;
	    };
	    static CSV: {
	        PARAMETER: string;
	        MIME: string;
	        readFromSuperAgent: (api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string) => void;
	    };
	    static PDF: {
	        PARAMETER: string;
	        MIME: string;
	        readFromSuperAgent: (api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string) => void;
	    };
	    static DEFAULT: {
	        PARAMETER: string;
	        MIME: string;
	        readFromSuperAgent: (api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string) => void;
	    };
	    static readJsonFromSuperAgent(api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string): void;
	    static readStreamFromSuperAgent(api: ServiceApi, agent: HornetSuperAgentRequest, resolve: any, reject: any, message: string): void;
	    static _fromParameter(parameter: string): any;
	    static _fromMime(mimeType: string): any;
	    static fromParameter(parameter: string): any;
	    static fromMime(parameter: string): any;
	    /**
	     * Renvoie true si le format demandé par le client demande un rendu de composant ou redirect
	     * Renvoie false si le format est géré par l'application et doit envoyé tel quel au client.
	     * @param mimeType
	     * @returns {boolean}
	     */
	    static isRenderNeeded(mimeType: string): boolean;
	    /**
	     * Renvoie true si le format demandé par le client est en fait une redirection serveur (json)
	     * @param mimeType
	     * @returns {boolean}
	     */
	    static isRedirect(mimeType: string): boolean;
	}
	export = MediaType;
	
}

declare module "hornet-js-core/src/routes/action-extended-promise" {
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	/**
	 * Typage fort d'une ExtendedPromise en <ActionsChainData>
	 *     Cela permet de forcer les actions à résoudre leurs promises qu'avec ce type d'objet
	 *     cela garantit que l'objet véhiculé tout au long de la chaine des promises d'action reste bien un <ActionsChainData>
	 */
	class ActionExtendedPromise extends ExtendedPromise<ActionsChainData> {
	}
	export = ActionExtendedPromise;
	
}

declare module "hornet-js-core/src/routes/actions-chain-data" {
	/**
	 * Type d'objet qui est transféré d'une action à une autre (d'une promise à une autre)
	 * Les chaines d'actions peuvent étendre cette classe pour ajouter des attributs spécifiques.
	 *
	 */
	import superagent = require("superagent");
	class ActionsChainData {
	    /**
	     * Le mimeType demandé par le client
	     */
	    requestMimeType: string;
	    /**
	     * Le MimeType du résultat à retourner au client
	     */
	    responseMimeType: string;
	    /**
	     * Le résultat à retourner au client.
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    result: any;
	    /**
	     * La dernière erreur technique produite
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    lastError: any;
	    /**
	     * Les erreurs présentes dans un formulaire
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    formError: any;
	    /**
	     * Boolean indiquant que l'accès à la ressource courante n'est pas autorisé pour l'utilisateur courant
	     * @type {boolean}
	     */
	    isAccessForbidden: boolean;
	    parseResponse(res: superagent.Response): this;
	    withBody(body: any): this;
	    withResponseMimeType(responseMimeType: string): this;
	}
	export = ActionsChainData;
	
}

declare module "hornet-js-core/src/routes/notifications" {
	export class Notifications implements INotifications {
	    notifications: Array<INotificationType>;
	    canRenderRealComponent: boolean;
	    constructor();
	    getNotifications(): Array<INotificationType>;
	    getCanRenderRealComponent(): boolean;
	    addNotification(notification: INotificationType): void;
	    addNotifications(notifications: Array<INotificationType>): void;
	    /**
	     * Construit une instance de Notifications contenant une seule notification ayant l'identifiant et le message indiqués
	     * @param id identifiant de la notification à créer
	     * @param text message de la notification
	     */
	    static makeSingleNotification(id: string, text: string): Notifications;
	}
	export class NotificationType implements INotificationType {
	    id: string;
	    text: string;
	    anchor: string;
	    field: string;
	    canRenderRealComponent: boolean;
	    constructor();
	}
	export interface INotificationType {
	    id: string;
	    text: string;
	    anchor: string;
	    field: string;
	    canRenderRealComponent: boolean;
	}
	export interface INotifications {
	    notifications: Array<INotificationType>;
	    canRenderRealComponent: boolean;
	}
	
}

declare module "hornet-js-core/src/routes/route-matcher" {
	import RouterAbstract = require("hornet-js-core/src/routes/router-abstract");
	import I = require("hornet-js-core/src/routes/router-interfaces");
	export class RouteMatcher {
	    private _routes;
	    private _lazyRoutes;
	    routes: any;
	    lazyRoutes: I.LazyRouteParam[];
	    getMatcher(routeur: RouterAbstract, basePath?: string): I.MatchFn;
	}
	
}

declare module "hornet-js-core/src/routes/router-abstract" {
	import Action = require("hornet-js-core/src/actions/action");
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	import ActionExtendedPromise = require("hornet-js-core/src/routes/action-extended-promise");
	import director = require("director");
	import Matcher = require("hornet-js-core/src/routes/route-matcher");
	import ServerConfiguration = require("hornet-js-core/src/server-conf");
	import ClientConfiguration = require("hornet-js-core/src/client-conf");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	import I = require("hornet-js-core/src/routes/router-interfaces");
	class RouterAbstract {
	    protected configuration: I.RouterConfiguration;
	    protected directorRouter: director.DirectorRouter;
	    protected currentUrl: string;
	    protected currentParam: any;
	    protected bootstrappedData: any;
	    constructor(config: ServerConfiguration | ClientConfiguration);
	    static prepareInternationalizationContextFunction(appConfig: ServerConfiguration): (locales: Array<string>) => FluxibleContext;
	    /**
	     * Construit les routes en appliquant la fonction de matching sur les routes
	     * @param routes
	     * @param basePath Le Path de base de ces routes (utilisé pour les logs uniquement)
	     * @returns {any}
	     */
	    protected parseRoutes(routes: I.IRoutesBuilder, basePath?: string): Matcher.RouteMatcher;
	    /**
	     * Charge de manière récursive toutes les routes 'lazy' et les ajoute au routeur
	     * @param lazyRoutes
	     */
	    protected loadLazyRoutesRecursively(lazyRoutes: I.LazyRouteParam[]): void;
	    /**
	     * Construit une fonction qui est exécutée par le routeur lorsque la route correspondante au handler est appliquée
	     * @param handler
	     * @returns {function(): undefined}
	     */
	    buildRouteHandler(handler: I.IRouteHandler): () => void;
	    protected loadRoutes(currentPromise: ExtendedPromise<any>, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext, fluxibleContext: ActionContext): ActionExtendedPromise;
	    protected manageErrors(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext): ActionExtendedPromise;
	    protected manageResultType(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext): ActionExtendedPromise;
	    /**
	     * Ajoute à la promise courante une action permettant de valider que l'utilisateur actuellement loggué à accès à la ressource demandée. Note
	     * @param currentPromise
	     * @param fluxibleContext
	     * @param routeInfos
	     * @param routeContext
	     * @return {ExtendedPromise<any>}
	     */
	    protected validateUserAccess(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext): ActionExtendedPromise;
	    /**
	     * Fonction appelée lorsqu'une route doit être appliquée
	     * @param routeContext Le contexte courant de lrequete
	     * @param handler La fonction permettant d'exécuter le code associé à la route
	     */
	    protected handleRoute(routeContext: I.IRouteContext, handler: I.IRouteHandler, parameters: any[]): void;
	    /**
	     * @param component composant React à charger
	     * @returns {ExtendedPromise} promise effectuant le chargement du composant React indiqué
	     */
	    protected buildComponentResolver(composant: any): ExtendedPromise<any>;
	    protected buildRoutesLoaderResolver(currentPromise: ExtendedPromise<any>, routesUrl: string): ExtendedPromise<any>;
	    protected handleErrBuilder(routeContext: I.IRouteContext): (err: I.DirectorError) => void;
	    /**
	     * Méthode de gestion des erreurs de routage
	     * @param err L'erreur associée
	     * @param routeContext Sur le serveur uniquement: fourni le context courant
	     */
	    protected handleErr(err: I.DirectorError, routeContext?: I.IRouteContext): void;
	    /**
	     * Méthode utilisée par la partie serveur pour initialiser le routeur.
	     * Note: Fourni un middleware Express
	     */
	    middleware(): (req: Express.Request, res: Express.Response, next: any) => void;
	    /**
	     * Méthode utilisée par la partie cliente pour initialiser le routeur
	     */
	    startClient(bootstrappedData?: any): void;
	    /**
	     * Permet de simuler un changement de route sans changer l'url dans la barre d'adresse du navigateur.
	     * Cette fonction est utilisée pour les cas de POST qui ne doivent pas modifier l'adresse.
	     * Note: Cette fonction étant utilisée uniquement côté client, le fait de mettre le currentParam directement dans le
	     * routeur ne pose pas de problème de multiThreading
	     * @param url L'url à appeler
	     * @param param L'objet contenant les paramètres à fournir à la route
	     */
	    setRouteInternal(url: any, param: any): void;
	    /**
	     * Méthode côté client pour demander un changement d'url dans la barre d'adresse du navigateur (et donc un changement de route)
	     */
	    setRoute(route: string): void;
	    /**
	     * Retourne un objet contenant les paramètres présents dans l'url. Exemple: page?param1=XX&param2=YY => {param1:XX, param2:YY}
	     * @param url L'URL à parser
	     * @returns {{}}
	     */
	    static getUrlParameters(url: string): any;
	    static routeMatcherFactory(): Matcher.RouteMatcher;
	    /**
	     * Cette fonction est appellée avant le premier appel à 'chainActions'
	     * Elle permet d'initialiser l'objet qui sera transmis d'Action en Action (de promise en promise)
	     *
	     * L'objet transmis dans la chaine d'action est de type 'ActionsChainData'
	     * Il peut être initialisé dans la configuration de la route si il y a besoin de le surcharger,
	     * sinon il est instancié ici
	     *
	     * @param currentPromise : la promise sur laquelle vont être chainées les actions
	     * @param chainDataRoute : l'objet défini dans la configuration de la route (peut être undefined / null)
	     * @param req : la request pour accèder au content-type demandé
	     * @returns {ActionExtendedPromise} : la promise sur laquelle vont être chainées les actions
	     */
	    initActionChainData(currentPromise: ExtendedPromise<any>, chainDataRoute: ActionsChainData, req: I.HornetRequest): ActionExtendedPromise;
	    /**
	     * Gère le chainage des actions (pré-actions / actions / post-actions)
	     *
	     * @param currentPromise : la promise déjà initialisée
	     * @param actionContext : le contexte d'action Fluxible
	     * @param actions : le tableau de type Action
	     * @returns {ExtendedPromise<any>}
	     */
	    chainActions(currentPromise: ExtendedPromise<any>, actionContext: ActionContext, actions?: Action<ActionsChainData>[]): ExtendedPromise<any>;
	    static LOCAL_STORAGE_ENABLE_GENERATION_SERVER_KEY: string;
	    static defaultGenerationServerEnabled: string;
	    /**
	     * mantis 0055411
	     * Met a disposition une fonction sur le browser (window.setHornetJsGenerationServer)
	     * Appellée depuis du code client, cette fonction permet de changer  l'option de paramétrage
	     * pour activer ou désactiver la generation des pages côté serveur (cf usage getHornetJsGenerationServer)
	     * Cette option est stockée dans le navigateur au niveau du localStorage,
	     * elle peut donc aussi être modifié manuellement par l'utilisateur
	     *
	     * Attention, ne pas activer l'option en mode fullSpa
	     * (elle n'a d'interet qu'avec le serveur node)
	     */
	    static setHornetJsGenerationServer(): void;
	    /**
	     * Getter pour récuperer la valeur de l'option de paramétrage "hornet-js.enable.generation.server"
	     * Cette option true/false permet d'activer ou désactiver la generation des pages côté serveur
	     * Lecture du localStorage d'abord (si supporté et contient la valeur), et sinon valeur par défaut (false)
	     *
	     * @returns {any}
	     */
	    static getHornetJsGenerationServer(): any;
	}
	export = RouterAbstract;
	
}

declare module "hornet-js-core/src/routes/router-data" {
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	import ActionExtendedPromise = require("hornet-js-core/src/routes/action-extended-promise");
	import RouterAbstract = require("hornet-js-core/src/routes/router-abstract");
	import Matcher = require("hornet-js-core/src/routes/route-matcher");
	import I = require("hornet-js-core/src/routes/router-interfaces");
	import ServerConfiguration = require("hornet-js-core/src/server-conf");
	class RouterData extends RouterAbstract {
	    constructor(appConfig: ServerConfiguration);
	    /**
	     * Fonction appelée lorsqu'une route doit être appliquée
	     * @param routeContext Le contexte courant de lrequete
	     * @param handler La fonction permettant d'exécuter le code associé à la route
	     */
	    protected handleRoute(routeContext: I.IRouteContext, handler: I.IRouteHandler, parameters: any[]): void;
	    protected parseRoutes(routes: I.IRoutesBuilder, basePath?: string): Matcher.RouteMatcher;
	    protected manageResultType(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext): ActionExtendedPromise;
	}
	export = RouterData;
	
}

declare module "hornet-js-core/src/routes/router-interfaces" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	import express = require("express");
	import director = require("director");
	export interface IRoutesInfos {
	    actions?: Array<Action<ActionsChainData>>;
	    composant?: any;
	    lazyRoutesParam?: LazyRouteParam;
	    chainData?: ActionsChainData;
	    roles?: Array<string>;
	}
	export interface HornetRequest extends director.DirectorRequest, express.Request {
	    generateCsrfToken?: () => string;
	}
	export interface IRoutesBuilder {
	    buildViewRoutes?(match: MatchViewFn): void;
	    buildDataRoutes?(match: MatchDataFn): void;
	}
	/**
	 * Objet permettant d'accéder au context courant de la requete
	 */
	export interface IRouteContext {
	    /**
	     * Le dispatcher courant
	     */
	    actionContext: ActionContext;
	    /**
	     * Les informations de la requete
	     */
	    req: HornetRequest;
	    /**
	     * Les informations de la réponse
	     */
	    res: director.DirectorResponse;
	    /**
	     * Uniquement sur le serveur: le prochain middleware express
	     * @param any
	     */
	    next: (any) => any;
	    /**
	     * Fonction retournant la route courante splittée par "/"
	     */
	    getRoute: () => any[];
	    /**
	     * L'objet director contenant les routes courantes
	     */
	    routes: any;
	}
	export interface DirectorError extends Error {
	    stack?: string;
	}
	export interface IRouteHandler {
	    /**
	     * Interface des fonctions appelées par le route lorsqu'une route est activée
	     * @param context Le contexte courant permettant d'accéder à divers éléments de la requête
	     * @param param1 Optionnel. Le premier paramètre sur une route de type: /componant/:param1
	     * @param param2 Optionnel. Le second paramètre sur une route de type: /componant/:param1/:param2
	     * @param param3 Optionnel. Le troisième paramètre sur une route de type: /componant/:param1/:param2/:param3
	     */
	    (context: IRouteContext, param1?: string, param2?: string, param3?: any): IRoutesInfos;
	}
	export interface MatchFn {
	    /**
	     * Fonction associant une route (= url) à une fonction préparant les actions à exécuter lorsque cette route est activée
	     * @param path L'url de la route. Peut-être une regex. Exemples: /component/:id ou  /components/ ou /components/.*\.json
	     * @param handler La méthode qui est appelée par le routeur lorsque la route est activée
	     * @param method La méthode http sur laquelle la route doit s'activer: Valeurs possibles: get, post ou both (pour indiquer que la route s'active sur le get et le post)
	     */
	    (path: string, handler: IRouteHandler, method?: string): void;
	    /**
	     * Fonction permettant d'activer le chargement différé d'une portion de routes
	     * @param path Le path de base sur lequel réagir, une regex sera construite à partir de ce path
	     * @param fileToLoad L'url d'accès au fichier contenant les nouvelles routes à appliquer
	     */
	    lazy: (path: string, fileToLoad: string) => void;
	}
	export interface MatchDataFn extends MatchFn {
	}
	export interface MatchViewFn extends MatchFn {
	}
	export interface RouterConfiguration {
	    /**
	     * Classe permettant d'initialiser les routes.
	     * La fonction 'build' de cette classe est appelée par le routeur lors de son instanciation afin de configurer toutes les routes possibles de l'application.
	     * @param matcher
	     */
	    defaultRoutesClass: IRoutesBuilder;
	    /**
	     * Composant React principal à utiliser pour rendre les pages.
	     */
	    appComponent: any;
	    /**
	     * Composant React layout à utiliser pour rendre le composant principal (node side).
	     */
	    layoutComponent?: any;
	    /**
	     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
	     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
	     */
	    errorComponent: any;
	    /**
	     * Fonction de chargement des composants React par le routeur.
	     * Elle prend en argument le nom du composant et retourne le composant chargé.
	     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
	     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
	     * @param componantName Le nom du composant à charger
	     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
	     */
	    componentLoaderFn: (componantName: string, callback?: (composant: any) => void) => any;
	    /**
	     * Fonction de chargement des routes à chargement différées.
	     * Elle prend en argument le nom du fichier contenant les routes et retourne le fichier chargé
	     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramêtre.
	     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
	     * @param routesFileName
	     * @param callback
	     */
	    routesLoaderfn: (routesFileName: string, callback?: (routes: IRoutesBuilder) => void) => IRoutesBuilder;
	    /**
	     * Le contexte Fluxible spécifique à la requête courante
	     */
	    dispatcherLoaderFn: (local: Array<string>) => FluxibleContext;
	    /**
	     * L'url du theme Css à utiliser par défaut dans l'application
	     */
	    themeUrl?: string;
	    /**
	     * Le contextPath à utiliser
	     */
	    contextPath?: string;
	    /**
	     * La configuration du menu
	     */
	    menuConfig?: Object;
	    directorClientConfiguration?: DirectorClientConfiguration;
	}
	export interface LazyRouteParam {
	    path: string;
	    fileToLoad: string;
	}
	export interface DirectorClientConfiguration {
	    html5history?: boolean;
	    strict?: boolean;
	    convert_hash_in_init?: boolean;
	    recurse?: boolean;
	    notfound?: Function;
	}
	
}

declare module "hornet-js-core/src/routes/router-view" {
	import ExtendedPromise = require("hornet-js-utils/src/promise-api");
	import ActionExtendedPromise = require("hornet-js-core/src/routes/action-extended-promise");
	import RouterAbstract = require("hornet-js-core/src/routes/router-abstract");
	import Matcher = require("hornet-js-core/src/routes/route-matcher");
	import I = require("hornet-js-core/src/routes/router-interfaces");
	import ServerConfiguration = require("hornet-js-core/src/server-conf");
	import ClientConfiguration = require("hornet-js-core/src/client-conf");
	class RouterView extends RouterAbstract {
	    private session;
	    constructor(appConfig: ServerConfiguration | ClientConfiguration);
	    /**
	     * Fonction appelée lorsqu"une route doit être appliquée
	     * @param routeContext Le contexte courant de lrequete
	     * @param handler La fonction permettant d"exécuter le code associé à la route
	     */
	    protected handleRoute(routeContext: I.IRouteContext, handler: I.IRouteHandler, parameters: any[]): void;
	    /**
	     * Ajoute à currentPromise une "promise" déclenchant le chargement du composant page correspondant à la route indiquée
	     * @param currentPromise promise correspondant à la chaîne d'actions de la route
	     * @param fluxibleContext contexte fluxible
	     * @param routeInfos configuration de la route
	     * @returns {ExtendedPromise<any>}
	     */
	    protected clientPageAction(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos): ActionExtendedPromise;
	    protected manageResultType(currentPromise: ExtendedPromise<any>, fluxibleContext: FluxibleContext, routeInfos: I.IRoutesInfos, routeContext: I.IRouteContext): ActionExtendedPromise;
	    protected parseRoutes(routes: I.IRoutesBuilder, basePath?: string): Matcher.RouteMatcher;
	}
	export = RouterView;
	
}

declare module "hornet-js-core/src/services/hornet-agent" {
	import superagent = require("superagent");
	import HornetSuperAgentRequest = require("hornet-js-core/src/services/hornet-superagent-request");
	/**
	 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
	 */
	class HornetAgent<T extends HornetSuperAgentRequest> {
	    private enableCache;
	    private timetoliveInCache;
	    /**
	     * Active le cache sur les méthodes GET de hornetAgent.
	     * SI pas de paramètre la durée de vie est celle de l'application
	     * @param timeToliveInCache_ durée de mise en cache en SECONDE. si rien est passé le temps moyen est celui définis dans le fichier de configuration
	     * @returns {HornetAgent} ce même objet
	     */
	    cache(timeToliveInCache?: number): HornetAgent<T>;
	    /**
	     * Encapsule les appels aux méthodes superagent
	     * @param method
	     * @param url
	     * @param callback
	     * @returns {any|NodeJS.EventEmitter|SinonExpectation|"events".EventEmitter|"domain".Domain}
	     * @private
	     */
	    protected _callSuperAgent(method: string, url: string, callback?: any): T;
	    /**
	     * Appel la méthode de super agent passée en paramètre
	     * @param method méthode HTTP: get...
	     * @param url url appelée
	     * @param callback  callback
	     */
	    protected _callSuperAgentMethod(method: string, url: string, callback?: any): T;
	    /**
	     * Redéfinition des méthodes superagent
	     *
	     * @param url
	     * @param callback
	     * @returns {HornetSuperAgentRequest}
	     */
	    get(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    post(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    put(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    head(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    del(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    options(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    patch(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	    connect(url: string, callback?: (err: Error, res: superagent.Response) => void): T;
	}
	export = HornetAgent;
	
}

declare module "hornet-js-core/src/services/hornet-superagent-request" {
	import superagent = require("superagent");
	import { IncomingMessage } from "http";
	interface HornetSuperAgentRequest extends superagent.Request<HornetSuperAgentRequest> {
	    on(event: string, listener: Function): any;
	    attach(field: string, file: File | Buffer | string, filename?: string): HornetSuperAgentRequest;
	    callback(err: any, res: any): void;
	    use(plugin: (superAgent: HornetSuperAgentRequest) => any): any;
	    url: string;
	    timetoliveInCache: number;
	    method: string;
	    response: superagent.Response;
	    res: IncomingMessage;
	}
	export = HornetSuperAgentRequest;
	
}

declare module "hornet-js-core/src/services/service-api" {
	import superagent = require("superagent");
	import HornetAgent = require("hornet-js-core/src/services/hornet-agent");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	import HornetSuperAgentRequest = require("hornet-js-core/src/services/hornet-superagent-request");
	class ServiceApi {
	    private serviceHost;
	    private serviceName;
	    actionContext: ActionContext;
	    getServiceHost(): string;
	    setServiceHost(serviceHost: string): void;
	    getServiceName(): string;
	    setServiceName(serviceName: string): void;
	    constructor(actionContext?: ActionContext);
	    request(): HornetAgent<HornetSuperAgentRequest>;
	    buildUrl(path: any): string;
	    endFunction(resolve: (retour: ActionsChainData) => void, reject: any, message: string): (err: any, res: superagent.Response) => void;
	}
	export = ServiceApi;
	
}

declare module "hornet-js-core/src/services/superagent-hornet-plugins" {
	import HornetSuperAgentRequest = require("hornet-js-core/src/services/hornet-superagent-request");
	/**
	 * Plugin SuperAgent ajoutant le header csrf lors de l'envoi des requêtes et gérant la récupération du nouveau token lors du retour
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function CsrfPlugin(request: HornetSuperAgentRequest): void;
	/**
	 * Plugin SuperAgent permettant de contourner les problèmes liés au cache sous IE
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function noCacheIEPlugin(request: HornetSuperAgentRequest): void;
	/**
	 * Plugin SuperAgent ajoutant la gestion du cache sur la requête courante
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function CachePlugin(timetoliveInCache?: number): (request: HornetSuperAgentRequest) => void;
	/**
	 * Plugin SuperAgent détectant une redirection vers la page de login et redirigant le navigateur vers cette page.
	 * Pour détecter cette redirection il recherche dans les headers de la réponse le header 'x-is-login-page' valant "true"
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function RedirectToLoginPagePlugin(request: HornetSuperAgentRequest): void;
	/**
	 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
	 * @param nom du localstorage
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function addParamFromLocalStorage(param: string, localStorageName?: string): (request: HornetSuperAgentRequest) => void;
	/**
	 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
	 * @param nom du localstorage
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export function addParam(param: string, paramValue: any): (request: HornetSuperAgentRequest) => void;
	
}

declare module "hornet-js-core/src/session/memory-store" {
	import Session = require("hornet-js-core/src/session/session");
	import Store = require("hornet-js-core/src/session/store");
	class MemoryStore extends Store {
	    private sessions;
	    private expiredCheckInterval;
	    private lastExpiredCheck;
	    /**
	     * Constructor
	     * @param expiredCheckInterval the interval in ms to check / delete expired sessions (default: 60000ms)
	     */
	    constructor(expiredCheckInterval?: number);
	    /**
	     * Describe if the 'touch' method is implemented or not by this kind of store
	     *
	     * @returns {boolean}
	     */
	    isTouchImplemented(): boolean;
	    /**
	     * Clear all sessions.
	     *
	     * @param {function} fn
	     * @public
	     */
	    clear(fn: Function): void;
	    /**
	     * Destroy the session associated with the given session ID.
	     *
	     * @param {Session} session
	     * @param {function} fn
	     * @public
	     */
	    destroy(session: Session, fn: Function): void;
	    /**
	     * Fetch session by the given session ID.
	     *
	     * @param {string} sid
	     * @param {function} fn
	     * @public
	     */
	    get(sid: string, fn: Function): void;
	    /**
	     * Get number of active sessions.
	     *
	     * @param {function} fn
	     * @public
	     */
	    length(fn: any): void;
	    set(session: Session, fn: Function): void;
	    touch(session: Session, fn: Function): void;
	    private checkExpired();
	}
	export = MemoryStore;
	
}

declare module "hornet-js-core/src/session/session-manager" {
	import Session = require("hornet-js-core/src/session/session");
	class SessionManager {
	    private static STORE;
	    static invalidate(session: Session, fn: Function): void;
	    /**
	     * Setup session middleware with the given `options`.
	     *
	     * @param {Object} [options]
	     * @param {Object} [options.cookie] Options for cookie
	     * @param {Function} [options.genid]
	     * @param {String} [options.name=NODESSIONID] Session ID cookie name
	     * @param {Boolean} [options.proxy]
	     * @param {Boolean} [options.resave] Resave unmodified sessions back to the store
	     * @param {Boolean} [options.rolling] Enable/disable rolling session expiration
	     * @param {Boolean} [options.saveUninitialized] Save uninitialized sessions to the store
	     * @param {String} [options.secret] Secret for signing session ID
	     * @param {Object} [options.store=MemoryStore] Session store
	     * @return {Function} middleware
	     * @public
	     */
	    static middleware(options: any): (req: any, res: any, next: any) => any;
	}
	export = SessionManager;
	
}

declare module "hornet-js-core/src/session/session" {
	class Session {
	    private sid;
	    private data;
	    private creationTime;
	    private lastAccessedTime;
	    private maxInactiveInterval;
	    constructor(sid: string, maxInactiveInterval: any, data?: any);
	    getId(): string;
	    getData(): any;
	    invalidate(fn: Function): void;
	    getAttribute(key: string): any;
	    setAttribute(key: string, value: any): void;
	    removeAttribute(key: string): void;
	    touch(): void;
	    getCreationTime(): Date;
	    getLastAccessTime(): Date;
	    getMaxInactiveInterval(): any;
	}
	export = Session;
	
}

declare module "hornet-js-core/src/session/store" {
	import events = require("events");
	import Session = require("hornet-js-core/src/session/session");
	class Store extends events.EventEmitter {
	    private ready;
	    constructor();
	    isReady(): boolean;
	    get(sid: string, fn: Function): void;
	    set(session: Session, fn: Function): void;
	    destroy(session: Session, fn: Function): void;
	    touch(session: Session, fn: Function): void;
	    getName(): string;
	    /**
	     * Describe if the 'touch' method is implemented or not into this kind of store
	     *
	     * @returns {boolean}
	     */
	    isTouchImplemented(): boolean;
	}
	export = Store;
	
}

declare module "hornet-js-core/src/stores/flux-informations-store" {
	import BaseStore = require("fluxible/addons/BaseStore");
	/**
	 * Store contenant des informations en lien avec le pattern Flux (état des actions, etc...)
	 */
	class FluxInformationsStore extends BaseStore {
	    static storeName: string;
	    private currentExecutingActionsNumber;
	    static handlers: any;
	    constructor(dispatcher: any);
	    /**
	     * Retourne true si au moins une action est en cours d'exécution
	     */
	    hasActionsRunning(): boolean;
	}
	export = FluxInformationsStore;
	
}

declare module "hornet-js-core/src/stores/notification-store" {
	import BaseStore = require("fluxible/addons/BaseStore");
	import N = require("hornet-js-core/src/routes/notifications");
	class NotificationStore extends BaseStore {
	    static storeName: string;
	    private err_notifications;
	    private info_notifications;
	    private modal_notifications;
	    private canRenderRealComponent;
	    /**
	     * @returns {Object} les fonctions 'handler' indexées par nom d'évènement
	     */
	    static initHandlers(): Object;
	    static handlers: any;
	    constructor(dispatcher: any);
	    private initialize();
	    private testIntance(notifs);
	    private handleRemove(notifs, notifStore);
	    private removeNotif(notif, notifStore);
	    private handleAddNotif(notifs, notifStore);
	    /**
	     * Ajoute une notification et retourne true si une modification a bien été apportée
	     */
	    addNotif(notif: N.INotificationType, notifStore: Array<N.INotificationType>): boolean;
	    getInfoNotifications(): Array<N.INotificationType>;
	    getErrorNotifications(): Array<N.INotificationType>;
	    getModalNotifications(): Array<N.INotificationType>;
	    hasErrorNotitications(): boolean;
	    canRenderComponent(): boolean;
	    rehydrate(state: any): void;
	    dehydrate(): any;
	}
	export = NotificationStore;
	
}

declare module "hornet-js-core/src/stores/page-informations-store" {
	import BaseStore = require("fluxible/addons/BaseStore");
	import authenticationUtils = require("hornet-js-utils/src/authentication-utils");
	class PageInformationsStore extends BaseStore {
	    static storeName: string;
	    private currentUrl;
	    private currentUser;
	    private currentPageComponent;
	    private defaultThemeUrl;
	    private currentThemeUrl;
	    private themeName;
	    private defaultThemeName;
	    private currentThemeName;
	    static handlers: any;
	    constructor(dispatcher: any);
	    getCurrentPageComponent(): string;
	    getCurrentUrl(): string;
	    getCurrentUrlWithoutContextPath(): string;
	    getThemeName(): string;
	    getThemeUrl(): string;
	    private getDefaultThemeName();
	    getCurrentUser(): authenticationUtils.UserInformations;
	    isAuthenticated(): boolean;
	    userHasRole(roles: any): boolean;
	    rehydrate(state: any): void;
	    dehydrate(): any;
	}
	export = PageInformationsStore;
	
}
