	/// <reference path="../definition.d.ts" />
	/// <reference path="../lodash/lodash.d.ts" />
declare module "hornet-js-utils/src/app-shared-props" {
	class AppSharedProps {
	    static appSharedPropsObject: {};
	    static test: string;
	    /**
	     * Method to set a custom key/value shared between the server and the browser
	     * @param key
	     * @param value
	     */
	    static set(key: string, value: any): void;
	    /**
	     * Method to get a custom shared value setted before
	     * @param key
	     * @returns {any}
	     */
	    static get(key: string): any;
	    static rehydrate(obj: any): void;
	    static dehydrate(): {};
	}
	export = AppSharedProps;
	
}

declare module "hornet-js-utils/src/apply-mixins" {
	export class ApplyMixins {
	    static applyMixins(derivedCtor: any, baseCtors: any[]): void;
	}
	
}

declare module "hornet-js-utils/src/authentication-utils" {
	export interface Role {
	    name: string;
	}
	export interface UserInformations {
	    roles: Array<Role>;
	}
	export class AuthUtils {
	    /**
	     * Fonction retournant true si l'utilisateur courant a au moins un des roles demandés
	     * @param currentUser L'utilisateur courant
	     * @param roles La liste des roles à chercher ou un string contenant le role à chercher
	     * @return {boolean}
	     */
	    static userHasRole(currentUser: UserInformations, roles: any): boolean;
	}
	
}

declare module "hornet-js-utils/src/callbacks-local-storage" {
	class callbacksLocalStorage {
	    static defaultLocalStorage: string;
	    /**
	     * Fonction retournant Le localstorage hornet ou un storage applicatif
	     * @param localStorageName Nom du localStorage, par défaut HornetLocalStorage
	     * @return {boolean}
	     */
	    static getStorage(localStorageName?: string): any;
	}
	export = callbacksLocalStorage;
	
}

declare module "hornet-js-utils/src/common-register" {
	import logger = require("hornet-js-utils/src/logger");
	class Register {
	    static isServer: boolean;
	    static global: any;
	    static getLogger: (category: any, buildLoggerFn?: (category: string) => void) => logger;
	    static registerGlobal<T>(paramName: string, value: T): T;
	}
	export = Register;
	
}

declare module "hornet-js-utils/src/config-lib" {
	/**
	 * Classe gérant l'accès à l'objet de configuration
	 */
	class ConfigLib {
	    private _configObj;
	    constructor();
	    /**
	     * Force l'utilisation d'un objet de configuration spécifique, pour les tests ou pour le navigateur
	     * @param configObj
	     */
	    setConfigObj(configObj: Object): void;
	    /**
	     * Charge les configurations Serveur.
	     *  - répertoire ./config pour le mode DEV
	     *  - répertoire APPLI + INFRA pour le mode PRODUCTION (process.env['HORNET_CONFIG_DIR_APPLI'] & process.env['HORNET_CONFIG_DIR_INFRA'])
	     *   @param configRequireFn Une fonction effectuant le require de la librairie 'config'. Cette fonction est nécessaire afin de ne pas embarquer la librairie côté navigateur
	     */
	    loadServerConfigs(): void;
	    getConfigObj(): any;
	    checkVariables(obj: any): void;
	    /**
	     * <p>Get a configuration value</p>
	     *
	     * <p>
	     * This will return the specified property value, throwing an exception if the
	     * configuration isn't defined.  It is used to assure configurations are defined
	     * before being used, and to prevent typos.
	     * </p>
	     *
	     * @method get
	     * @param property {string} - The configuration property to get. Can include '.' sub-properties.
	     * @return value {mixed} - The property value
	     */
	    get(property: string): any;
	    /**
	     * <p>Get a configuration value, or get defaultValue if no configuration value</p>
	     * @param property
	     * @param defaultValue value if property doesn't exist
	     * @return {any}
	     */
	    getOrDefault(property: string, defaultValue: Object): any;
	    /**
	     * Test that a configuration parameter exists
	     *
	     *
	     * @method has
	     * @param property {string} - The configuration property to test. Can include '.' sub-properties.
	     * @return isPresent {boolean} - True if the property is defined, false if not defined.
	     */
	    has(property: string): any;
	    /**
	     * Underlying get mechanism
	     *
	     * @private
	     * @method getImpl
	     * @param object {object} - Object to get the property for
	     * @param property {string | array[string]} - The property name to get (as an array or '.' delimited string)
	     * @return value {mixed} - Property value, including undefined if not defined.
	     */
	    private static getImpl(object, property);
	}
	export = ConfigLib;
	
}

declare module "hornet-js-utils/src/date-utils" {
	class DateUtils {
	    static TZ_EUROPE_PARIS: string;
	    /**
	     *  On s'assure que le fuseau horaire utilisé par GregorianCalendar est le même que dans l'interpréteur javascript
	     *  @param calendarLocale objet de configuration des calendriers et dates : doit etre non nul
	     */
	    static initTimeZone(calendarLocale: any): void;
	    /**
	     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant le format spécifié et la locale indiquée
	     * @param dateStr chaîne de caractères représentant une date. Doit être non nulle.
	     * @param dateFormat format de date à utiliser. Doit être non nul.
	     * @param calendarLocale configuration locale des dates
	     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
	     */
	    private static parseWithFormat(dateStr, dateFormat, calendarLocale);
	    /**
	     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant le format spécifié dans la locale indiquée : calendarLocale.dateFormat
	     * @param dateStr chaîne de caractères représentant une date
	     * @param calendarLocale configuration locale des dates
	     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
	     */
	    static parse(dateStr: string, calendarLocale: any): any;
	    /**
	     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant les format de date spécifiés et la locale indiquée.
	     * Lorsque dateFormats n'est pas défini ou est vide, on utilise calendarLocale.dateFormat.
	     * @param dateStr chaîne de caractères représentant une date
	     * @param dateFormats formats de date compatibles GregorianCalendar
	     * @param calendarLocale configuration locale des dates
	     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
	     */
	    static parseMultipleFmt(dateStr: string, dateFormats: Array<String>, calendarLocale: any): any;
	    /**
	     * Crée un objet Date à partir de la chaîne de caractères indiquée en utilisant la fonction Date.parse(str)
	     * @param dateStr chaîne de caractères représentant une date générée par Date.toString(), Date.toUTCString(), Date.toISOString() ou Date.toLocaleString()
	     * @returns {Date} un objet Date ou undefined en cas d'erreur
	     */
	    static stdParse(dateStr: string): Date;
	    /**
	     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
	     * @param time temps en millisecondes UTC depuis 'epoch'
	     * @param calendarLocale configuration locale des dates
	     * @returns {string} la chaîne de caractères formatée suivant calendarLocale.dateFormat ou une chaîne vide en cas d'erreur
	     */
	    static format(time: any, calendarLocale: any): string;
	    /**
	     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
	     * @param date un objet Date
	     * @param format le format de la date
	     * @param timezone la timezone sur laquelle formater la date (Europe/Paris, America/Los_Angeles, Australia/Sydney, ...) defaut : Timezone du navigateur/serveur node
	     * @param locale la locale (fr_FR, en_US, ...) defaut : fr_FR
	     * @returns {string} la chaîne de caractères formatée suivant {format} ou une chaîne vide en cas d'erreur
	     */
	    static formatInTZ(date: any, format: string, timezone?: string, locale?: string): string;
	    /**
	     * Convertit un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
	     * en un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
	     * @param format format de date compatible newforms
	     * @returns {string} format de date compatible GregorianCalendarFormat
	     */
	    static newformsToGregorianCalFormat(format: string): string;
	    /**
	     * Convertit un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
	     * en un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
	     * @param format format de date compatible GregorianCalendarFormat
	     * @returns {string} format de date compatible newforms
	     */
	    static gregorianCalToNewformsFormat(format: string): string;
	    /**
	     * Convertit un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
	     * en un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
	     * @param format format de date compatible GregorianCalendarFormat
	     * @returns {string} format de date compatible newforms
	     */
	    static gregorianCalToMomentFormat(format: string): string;
	}
	export = DateUtils;
	
}

declare module "hornet-js-utils" {
	import Logger = require("hornet-js-utils/src/logger");
	import ApplyMixins = require("hornet-js-utils/src/apply-mixins");
	import DateUtils = require("hornet-js-utils/src/date-utils");
	import promiseApi = require("hornet-js-utils/src/promise-api");
	import ConfigLib = require("hornet-js-utils/src/config-lib");
	import AppSharedProps = require("hornet-js-utils/src/app-shared-props");
	import _ = require("lodash");
	import memorystreamNS = require("memorystream");
	import VerrorNS = require("verror");
	import keyEvent = require("hornet-js-utils/src/keyevent");
	class Utils {
	    static newFormsAriaModifications: any;
	    static isServer: boolean;
	    static getLogger: (category: any, buildLoggerFn?: (category: string) => void) => Logger;
	    static _: _.LoDashStatic;
	    static verror: typeof VerrorNS;
	    static werror: typeof VerrorNS.WError;
	    static dateUtils: typeof DateUtils;
	    static promise: typeof promiseApi;
	    static appSharedProps: typeof AppSharedProps;
	    private static _config;
	    private static _contextPath;
	    static csrf: string;
	    static keyEvent: typeof keyEvent;
	    static memorystream: typeof memorystreamNS;
	    static mixins: typeof ApplyMixins;
	    static CONTENT_JSON: string;
	    static log4js: any;
	    static callbacksLocalStorage: any;
	    static registerGlobal<T>(paramName: string, value: T): T;
	    static config: ConfigLib;
	    /**
	     * Retourne le contextPath courant de l"application.
	     * Ce context ne contient pas de "/" de fin et commence forcément par un "/"
	     * @return {string}
	     */
	    static getContextPath(): string;
	    /**
	     * Ajoute le contextPath à l'url passée en paramètre si besoin
	     * @param path
	     * @return {string}
	     */
	    static buildContextPath(path?: string): string;
	    /**
	     * Ajoute le staticPath à l'url passée en paramètre si besoin
	     * @param path
	     * @return {string}
	     */
	    static buildStaticPath(path: any): any;
	    static getStaticPath(): string;
	    static setConfigObj(theConfig: Object): void;
	}
	export = Utils;
	
}

declare module "hornet-js-utils/src/keyevent" {
	var KeyEvent: any;
	export = KeyEvent;
	
}

declare module "hornet-js-utils/src/logger" {
	/**
	 * Construit un logger avec la catégory demandée
	 * @param category
	 * @param getLoggerFn La fonction permettant de charger le logger, cette fonction est différente
	*            selon le client ou le serveur, c'est pour cette raison quelle doit être injectée
	*/
	class Logger {
	    private category;
	    private log4jsLogger;
	    constructor(category: any, buildLoggerFn?: (category: string) => void);
	    static getLogger(category: any, buildLoggerFn?: (category: string) => void): Logger;
	    /**
	     * Récupère le logger. Si côté client alors utilise log4js, si côté serveur alors utilise
	     * log4js-node
	     */
	    buildLogger(category: string): void;
	    fatal(...args: any[]): any;
	    error(...args: any[]): any;
	    warn(...args: any[]): any;
	    info(...args: any[]): any;
	    debug(...args: any[]): any;
	    trace(...args: any[]): any;
	    /**
	     * Récupère le nom de la fonction appelante
	     */
	    static getFunctionName(callStackSize: number): string;
	    /**
	     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
	     * disponible l'id de traitement
	     *
	     * @param niveau de log
	     * @param [, arg1[, arg2[, ...]]] Une liste d'arguments à logguer
	     */
	    log(level: string, ...args: any[]): void;
	    /**
	     * Appelle la fonction de log de manière asynchrone
	     *
	     * @param niveau de log
	     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
	     */
	    /**
	     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
	     * disponible l'id de traitement
	     *
	     * @param niveau de log
	     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
	     */
	    private logInternal(level, logArguments);
	    private mappingObjectToString(arg);
	}
	export = Logger;
	
}

declare module "hornet-js-utils/src/promise-api" {
	class ExtendedPromise<T> implements Thenable<T> {
	    promise: Thenable<T>;
	    constructor(promise: any);
	    then<TR>(onFulfilled: (value: T) => Thenable<TR>, onRejected?: (error: Error) => void): ExtendedPromise<TR>;
	    then<TR>(onFulfilled: (value: T) => TR, onRejected?: (error: Error) => void): ExtendedPromise<TR>;
	    then<TR>(onFulfilled: (value: T) => TR, onRejected?: (error: Error) => TR): ExtendedPromise<TR>;
	    fail(onRejected: (error: Error) => void): ExtendedPromise<T>;
	    fail(onRejected: (error: string) => void): ExtendedPromise<T>;
	    fail(onRejected: (error: string) => T): ExtendedPromise<T>;
	    fail(onRejected: (error: Error) => T): ExtendedPromise<T>;
	    stop(): ExtendedPromise<T>;
	    static prepare<TR>(callback: (resolve: (value?: any) => Thenable<TR>, reject?: (error: Error) => Thenable<TR>) => void): () => ExtendedPromise<TR>;
	    static all(promises: Thenable<any>[]): ExtendedPromise<any[]>;
	    static resolve<T>(value?: T): ExtendedPromise<T>;
	    static reject<T>(error: Error): ExtendedPromise<T>;
	}
	export = ExtendedPromise;
	
}

declare module "hornet-js-utils/src/test-utils" {
	import chai = require("chai");
	import Logger = require("hornet-js-utils/src/logger");
	class TestUtils {
	    static DEBUG: boolean;
	    static chai: typeof chai;
	    static sinon: SinonStatic;
	    static getLogger(category: string): Logger;
	    static _render(elementToRender: any, debug: any): any;
	    static render(getElementToRenderFn: any, context: any, debug: any): any;
	    static randomString(strLength?: number, charSet?: string): string;
	    /**
	     * Permet de démarrer une application Express sur le port premier port disponible à partir du port donné.
	     * Si l'application a bien démarrée, la fonction done est appellée avec l'instance de serveur et le port utilisé.
	     * Sinon, la fonction done est appellée
	     *
	     * @param app l'application Express
	     * @param port Le port initialement souhaité
	     * @param done la fonction à appeller lorsque l'application est démarré
	     */
	    static startExpressApp(app: any, port: number, done: (server: any, port: number, err: string) => void): void;
	}
	export = TestUtils;
	
}

declare module "hornet-js-utils/src/components/test-wrapper" {
	var TestWrapper: any;
	export = TestWrapper;
	
}

declare module "hornet-js-utils/src/extended/new-forms-aria-modifications" {
	var _default: () => void;
	export = _default;
	
}
