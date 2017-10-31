declare module "hornet-js-utils/src/app-shared-props" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export class AppSharedProps {
	    static appSharedPropsObject: {};
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
	
}

declare module "hornet-js-utils/src/array-utils" {
	/**
	 * Classe utilitaire sur les arrays.
	 */
	export class ArrayUtils {
	    /**
	     * retoure l'index de l'objet dans une liste via son ID
	     * @param objectList
	     * @param object
	     * @returns {number}
	     */
	    static getIndexById(objectList: any[], object: any): number;
	    /**
	     * fonction qui test si une liste d'objet est incluse dans une autre
	     * @param objectList1
	     * @param objectList2
	     * @returns {boolean}
	     */
	    static isInclude(objectList1: any[], objectList2: any[]): boolean;
	    /**
	     * fonction qui fait l'union de deux liste avec le predicat id different
	     * @param object
	     * @param other
	     *  @returns {any[]}
	     */
	    static unionWith(object: any[], other: any[]): any[];
	    /**
	     * retourne l'intersection de deux liste
	     * @param object
	     * @param other
	     * @returns {any[]}
	     */
	    static intersectionWith(object: any[], other: any[]): any[];
	}
	
}

declare module "hornet-js-utils/src/authentication-utils" {
	export interface Role {
	    name: string;
	}
	export interface UserInformations {
	    name: string;
	    roles: Array<Role>;
	}
	export class AuthUtils {
	    /**
	     *
	     * @param user L'utilisateur à tester
	     * @param roles Rôle ou liste de rôles à tester
	     * @return {boolean}
	     */
	    static isAllowed(user: UserInformations, roles: Array<string>): boolean;
	    static hasRole(user: UserInformations, role: string): boolean;
	}
	
}

declare module "hornet-js-utils/src/common-register" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Logger }  from "hornet-js-utils/src/logger";
	export class Register {
	    static isServer: boolean;
	    static global: any;
	    static getLogger: (category: any, buildLoggerFn?: (category: string) => void) => Logger;
	    static registerGlobal<T>(paramName: string, value: T): T;
	}
	
}

declare module "hornet-js-utils/src/config-lib" {
	/**
	 * Classe gérant l'accès à l'objet de configuration
	 */
	export class ConfigLib {
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
	     *  - répertoire APPLI + INFRA pour le mode PRODUCTION (process.env.HORNET_CONFIG_DIR_APPLI & process.env.HORNET_CONFIG_DIR_INFRA)
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
	     * Get the configuration value if the property exists
	     * No warning in case there is non configuration
	     * @param property
	     * @returns {any}
	     */
	    getIfExists(property: string): any;
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
	
}

declare module "hornet-js-utils/src/continuation-local-storage" {
	export class ContinuationLocalStorage {
	    /**
	     * Fonction retournant le continuationlocalstorage hornet ou un storage applicatif
	     * @param localStorageName Nom du localStorage, par défaut HornetContinuationLocalStorage
	     * @return {any}
	     */
	    static getContinuationStorage(localStorageName?: string): any;
	    static get(key: string, localStorageName?: string): any;
	    static set(key: string, value: any, localStorageName?: string): void;
	}
	
}

declare module "hornet-js-utils/src/date-utils" {
	export class DateUtils {
	    static TZ_EUROPE_PARIS: string;
	    static default_locale: string;
	    /**
	     * Formats de date en année, mois, jour
	     */
	    static YMD_Formats: Array<string>;
	    /**
	     *  On s'assure que le fuseau horaire utilisé est le même que dans l'interpréteur javascript
	     *  @param calendarLocale objet de configuration des calendriers et dates : doit etre non nul
	     */
	    static initTimeZone(calendarLocale: any): void;
	    /**
	     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant le format spécifié et la locale indiquée
	     * @param dateStr chaîne de caractères représentant une date. Doit être non nulle.
	     * @param dateFormat format de date à utiliser. Doit être non nul.
	     * @param locale locale
	     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
	     */
	    private static parseWithFormat(dateStr, dateFormat, locale?, exact?);
	    /**
	     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant le format spécifié dans la locale indiquée : calendarLocale.dateFormat
	     * @param dateStr chaîne de caractères représentant une date
	     * @param calendarLocale configuration locale des dates
	     * @param locale locale
	     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
	     */
	    static parse(dateStr: string, calendarLocale: any, locale?: any): any;
	    /**
	     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant les formats de date spécifiés et la locale indiquée.
	     * Lorsque dateFormats n'est pas défini ou est vide, on utilise calendarLocale.dateFormat.
	     * @param dateStr chaîne de caractères représentant une date
	     * @param dateFormats formats de date compatibles Moment
	     * @param calendarLocale  configuration locale des dates
	     * @param locale locale
	     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
	     */
	    static parseMultipleFmt(dateStr: string, dateFormats: Array<string>, calendarLocale: any, locale?: any): any;
	    /**
	     * Anlyse la chaîne de caractères indiquée et essaie de créer l'objet Date correspondant.
	     * @param dateStr chaîne de caractères représentant une date
	     * @param format le format de la date au format Moment
	     * @param timezone le fuseau horaire sur lequel formatter la date (Europe/Paris, America/Los_Angeles,
	     * Australia/Sydney, ...). Par défaut : le fuseau horaire du navigateur/serveur node est utilisé
	     * @param locale codes langue et pays (fr_FR, en_US, ...). Par défaut : fr_FR
	     * @returns {Date} une instance de Date ou undefined en cas d'erreur
	     */
	    static parseInTZ(dateStr: string, format: string, timezone?: string, locale?: string): Date;
	    /**
	     * Crée un objet Date à partir de la chaîne de caractères indiquée en utilisant la fonction Date.parse(str)
	     * @param dateStr chaîne de caractères représentant une date générée par Date.toString(), Date.toUTCString(), Date.toISOString() ou Date.toLocaleString()
	     * @returns {Date} un objet Date ou undefined en cas d'erreur
	     */
	    static stdParse(dateStr: string): Date;
	    /**
	     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
	     * @param time temps en millisecondes UTC depuis 'epoch'
	     * @param calendarLocale locale
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
	    static formatInTZ(date: Date, format: string, timezone?: string, locale?: string): string;
	    /**
	     * Calcule la différence entre deux dates
	     * @param {Date} date un objet Date
	     * @param {Date} dateBis un objet Date
	     * @param {DateDiffUnit=ALL} unité calculée
	     * @returns {DateDiff} Objet contenant les résultat des calculs suivant unité.
	     */
	    static diff(date: Date, dateBis: Date, unit?: DateDiffUnit): DateDiff;
	}
	export interface DateDiff {
	    days?: number;
	    weeks?: number;
	    months?: number;
	    years?: number;
	}
	export enum DateDiffUnit {
	    DAYS = 1,
	    WEEKS = 2,
	    MONTHS = 3,
	    YEARS = 4,
	    All = 5,
	}
	
}

declare module "hornet-js-utils/src/dateFileSyncAppender" {
	/**
	 * File appender that rolls files according to a date pattern.
	 * @filename base filename.
	 * @pattern the format that will be added to the end of filename when rolling,
	 *          also used to check when to roll files - defaults to ".yyyy-MM-dd"
	 * @layout layout function for log messages - defaults to basicLayout
	 * @timezoneOffset optional timezone offset in minutes - defaults to system local
	 */
	export function appender(filename: string, pattern: any, alwaysIncludePattern: boolean, layout: Function, timezoneOffset: number): (logEvent: any) => void;
	/**
	 * Configures the appender
	 * @param config
	 * @param options
	 * @returns {function(any): undefined}
	 */
	export function configure(config: any, options?: any): (logEvent: any) => void;
	
}

declare module "hornet-js-utils/src/i18n-utils" {
	export class I18nUtils {
	    /**
	     * Renvoie le ou les messages internationalisés correspondant à la clé indiquée, après avoir remplacé les valeurs paramétrables
	     * avec celles indiquées.
	     * @param keysString clé de message internationalisé
	     * @param values valeurs de remplacement éventuelles
	     * @param internationalization paramètre optionnel contenant les messages internationalisés et la locale
	     * @returns {any} une chaîne de caractères ou un objet contenant des messages
	     */
	    static getI18n(keysString: string, values?: any, internationalization?: any): any;
	}
	
}

declare module "hornet-js-utils" {
	import { Logger }  from "hornet-js-utils/src/logger";
	import { DateUtils }  from "hornet-js-utils/src/date-utils";
	import { ConfigLib }  from "hornet-js-utils/src/config-lib";
	import { AppSharedProps }  from "hornet-js-utils/src/app-shared-props";
	export class Utils {
	    static isServer: boolean;
	    static getLogger: (category: any, buildLoggerFn?: (category: string) => void) => Logger;
	    static dateUtils: typeof DateUtils;
	    static appSharedProps: typeof AppSharedProps;
	    private static _config;
	    private static _contextPath;
	    static log4js: any;
	    static notify: (nid, errors, infos?) => void;
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
	    static buildStaticPath(path: string): string;
	    static getStaticPath(): string;
	    static setConfigObj(theConfig: Object): void;
	    /**
	     * Fonction retournant le continuationlocalstorage hornet ou un storage applicatif
	     * @param localStorageName Nom du localStorage, par défaut HornetContinuationLocalStorage
	     * @return {any}
	     */
	    static getContinuationStorage(localStorageName?: string): any;
	    /**
	     * Fonction retournant la valeur associée à la key du CLS.
	     * @param key: clé de la valeur à retourner
	     * @param localStorageName: Nom du localStorage, par défaut HornetContinuationLocalStorage
	     * @returns {any}
	     */
	    static getCls(key: string, localStorageName?: string): any;
	    /**
	     * Fonction settant la valeur associée à la key du CLS.
	     * @param key: clé de la valeur à retourner
	     * @param localStorageName: Nom du localStorage, par défaut HornetContinuationLocalStorage
	     * @returns {any}
	     */
	    static setCls(key: string, value: any, localStorageName?: string): any;
	    /**
	     * Permet de récupérer la valeur d'un objet, peu importe sa profondeur
	     * exemple:
	     * var o:any = {a:"a", b: {c:{d: "TEST"}}};
	     * utils.getValueObject(o, "a.b.c.d") => null
	     * utils.getValueObject(o, "b.c.d") => TEST
	     * @param object
	     * @param chaine
	     * @returns {any}
	     */
	    static getValueObject(object: any, chaine: string): any;
	}
	
}

declare module "hornet-js-utils/src/json-loader" {
	export class JSONLoader {
	    /**
	     * Surcharge JSON.parse en permettant l'utilisation du format JSON5.
	     */
	    static allowJSON5(): void;
	    /**
	     * Charge un fichier JSON avec son path
	     * @param filePath le chemin vers le fichier JSON
	     * @param encoding encoding du fichier, defaut: UTF-8
	     * @returns {any}
	     */
	    static load(filePath: string, encoding?: string): any;
	}
	
}

declare module "hornet-js-utils/src/key-store-helper" {
	import * as https from "https";
	/**
	 * Interface décrivant une clé privée SSL
	 */
	export interface KeyOptions {
	    file: string;
	    passphrase?: string;
	}
	/**
	 * Interface décrivant un conteneur de clés au format PKCS12
	 */
	export interface PKCS12Options {
	    file: string;
	    passphrase: string;
	}
	/**
	 * Interface décrivant les options permettants de configurer le keystore
	 */
	export interface KeyStoreOptions {
	    CAs?: Array<string>;
	    CERTs?: Array<string>;
	    KEYs?: Array<KeyOptions>;
	    PKCS12?: PKCS12Options;
	}
	/**
	 * Interface décrivant les options nodejs sur l'agent Https
	 */
	export interface AgentOptions {
	    keepAlive?: boolean;
	    keepAliveMsecs?: number;
	    maxSockets?: number;
	    maxFreeSockets?: number;
	}
	/**
	 * Classe d'aide à la configuration de keystore pour des requêtes clients nodejs
	 */
	export class KeyStoreBuilder {
	    /**
	     * Construit un Agent https natif nodejs
	     * @param agentOptions
	     * @param keyStoreOptions
	     * @returns {https.Agent}
	     */
	    static buildHttpsAgent(agentOptions?: AgentOptions, keyStoreOptions?: KeyStoreOptions): https.Agent;
	    /**
	     * Construit un Agent https natif nodejs et le défini comme agent par défaut
	     * @param agentOptions
	     * @param keyStoreOptions
	     */
	    static setHttpsGlobalAgent(agentOptions?: AgentOptions, keyStoreOptions?: KeyStoreOptions): void;
	    /**
	     * Construit l'objet de configuration des autorités de certification
	     * @param CAs
	     * @returns {Array}
	     */
	    private static buildCAs(CAs?);
	    /**
	     * Construit l'objet de configuration des certificats dans le cas d'authentification SSL
	     * @param CERTs
	     * @returns {Array}
	     */
	    private static buildCERTs(CERTs?);
	    /**
	     * Construit l'objet de configuration des clés privées dans le cas d'authentification SSL
	     * @param KEYs
	     * @returns {Array}
	     */
	    private static buildKEYs(KEYs?);
	    /**
	     * Construit l'objet de configuration des certificats/clés privées dans le cas d'authentification SSL
	     * @param PKCS12
	     * @returns {Object}
	     */
	    private static buildPKCS12(PKCS12?);
	}
	
}

declare module "hornet-js-utils/src/lazy-class-loader" {
	export class LazyClassLoader {
	    static load(lazyClass: any): any;
	}
	
}

declare module "hornet-js-utils/src/logger" {
	/**
	 * Construit un logger avec la catégory demandée
	 * @param category
	 * @param getLoggerFn La fonction permettant de charger le logger, cette fonction est différente
	 *            selon le client ou le serveur, c'est pour cette raison quelle doit être injectée
	 */
	export class Logger {
	    private category;
	    private log4jsLogger;
	    constructor(category: any);
	    static getLogger(category: any): Logger;
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
	     * Récupère le nom de la fonction appelante,
	     * [mantis 0055464] en évitant de ramener l'appel du logger, qui ne nous intéresse pas :
	     * on remonte la pile d'appels en cherchant le code applicatif à l'origine de la log.
	     *
	     * Si la "vraie" fonction appelante n'est pas trouvée dans la pile,
	     * alors par défaut on utilise le paramètre d'entrée callStackSize
	     * qui indique le nombre arbitraire de niveaux à remonter dans la pile
	     * pour avoir la fonction appelante
	     *
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
	    /**
	     * Méthode de recherche de stack depuis les arguments passés dans le logger
	     * @param args
	     * @returns {{}}
	     */
	    private searchStack(args);
	    private mappingObjectToString(arg);
	}
	
}

declare module "hornet-js-utils/src/object-utils" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Classe utilitaire sur les objets.
	 */
	export class ObjectUtils {
	    /**
	     * recupère un sous objet d'un objet (deep attribute)
	     * @example
	     * let object1 = { id : 1, desc : { type : {id : 2, label : 'label'}}
	     * ObjectUtils.getSubObject(object1, "desc.type") => {id : 2, label : 'label'}
	     * @param {Object} obj objet à parser
	     * @param {string} chainage d'attribut attr1.attr2....attrn
	     * @return la valeur de l'attribut attrn de l'objet.
	     *
	     */
	    static getSubObject(obj: any, deepAttr: string): any;
	}
	
}

declare module "hornet-js-utils/src/promise-api" {
	import * as Promise from "bluebird";
	export { Promise };
	
}

declare module "hornet-js-utils/src/string-utils" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export class StringUtils {
	    /**
	     * nettoie la chaine de caractère de ses caractères spéciaux
	     * @param value
	     * @param sep
	     * @returns {string}
	     */
	    static replaceCharacters(value: string, sep?: string): string;
	}
	
}

declare module "hornet-js-utils/src/template" {
	/**
	 * @classdesc classe de templating de string
	 */
	export class Template {
	    private template;
	    private stringKey;
	    /**
	     * @class
	     */
	    constructor(template: any);
	    /**
	     * lance le templating avec un objet
	     * @param {Object} obj objet servant au templating
	     * @param {string} remplaceUndef remplacement si undefined
	     * @return la chaine avec les valeurs remplacées
	     */
	    process(obj: any, remplaceUndef: string): string;
	}
	
}

declare module "hornet-js-utils/src/typescript-utils" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export type Class<T> = {
	    new (...args): T;
	};
	export type AbstractClass<T> = Function & {
	    prototype: T;
	};
	
}

declare module "hornet-js-utils/src/exception/base-error" {
	export class BaseError {
	    /**
	     * Timestamp (en ms depuis Epoch) correspondant à la date de création de l'erreur. L'utilisation d'un timestamp
	     * plutôt qu'un objet Date facilite la sérialisation/désérialisation en json.
	     */
	    date: number;
	    /** Code d'erreur, normalement associé à un message internationalisé */
	    code: string;
	    message: string;
	    name: string;
	    /** Paramètres utilisables dans la construction du message d'erreur correspondant au code */
	    args: {
	        [key: string]: string;
	    };
	    err_cause: Error;
	    reportId: string;
	    stack: any;
	    backend: boolean;
	    constructor(code?: string, message?: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	    cause(): Error;
	}
	
}

declare module "hornet-js-utils/src/exception/business-error-list" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BusinessError }  from "hornet-js-utils/src/exception/business-error";
	/**
	 * Liste d'erreurs métier
	 */
	export class BusinessErrorList extends BusinessError {
	    private errors;
	    constructor(businessErrors?: Array<BusinessError>);
	    addError(error: BusinessError): this;
	    getErrors(): BusinessError[];
	}
	
}

declare module "hornet-js-utils/src/exception/business-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BaseError }  from "hornet-js-utils/src/exception/base-error";
	export class BusinessError extends BaseError {
	    constructor(code: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}

declare module "hornet-js-utils/src/exception/codes-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export class CodesError {
	    static DEFAULT_ERROR_MSG: string;
	    /**
	     * codes error SEQUELIZE 10000 - 10099
	     */
	    static SEQUELIZE_CONNECTION_REFUSED: number;
	    static SEQUELIZE_HOST_NOT_FOUND: number;
	    static SEQUELIZE_HOST_NOT_REACHABLE: number;
	    static SEQUELIZE_INVALID_CONNECTION: number;
	    static SEQUELIZE_CONNECTION: number;
	    static SEQUELIZE_INSTANCE_ERROR: number;
	    static SEQUELIZE_CONNECTION_TIMEOUT: number;
	    static SEQUELIZE_TIMEOUT_ERROR: number;
	    static SEQUELIZE_ACCESSDENIED: number;
	    static SEQUELIZE_CONNECTION_ERROR: number;
	    static SEQUELIZE_EXCLUSION_ERROR: number;
	    static SEQUELIZE_FOREIGN_KEY_ERROR: number;
	    static SEQUELIZE_VALIDATION_ERROR: number;
	    static SEQUELIZE_UNIQUE_ERROR: number;
	    static SEQUELIZE_DATABASE_ERROR: number;
	    /**
	     * codes error BINDING 10100 - 10199
	     */
	    static BINDING_ERROR: number;
	    /**
	     * codes error BINDING 10200 - 10299
	     */
	    static ROUTE_ERROR: number;
	    /**
	     * codes error DATASOURCE 10300 - 10399
	     */
	    static DATASOURCE_FETCH_ERROR: number;
	    static DATASOURCE_SORT_ERROR: number;
	    static DATASOURCE_FILTER_ERROR: number;
	    static DATASOURCE_ADD_ERROR: number;
	    static DATASOURCE_DELETE_ERROR: number;
	    static DATASOURCE_RESPONSE_ERROR: number;
	    /**
	     * codes error INJECT 10400 - 10499
	     */
	    static INJECT_ERROR: number;
	    static INJECT_ALREADY_DEFINED_ERROR: number;
	    static INJECT_NOT_DEFINED_ERROR: number;
	    /**
	     * codes error NODEMAILER 10500 - 10599
	     */
	    static NODEMAILER_AUTH_ERROR: number;
	    static NODEMAILER_SERVER_NOTFOUND: number;
	    static NODEMAILER_SERVER_TIMEOUT: number;
	    static NODEMAILER_UNKNOWN: number;
	    /**
	     * codes error CLAMAV 10600 - 10699
	     */
	    static CLAMAV_SCAN_INFECTED: number;
	    static CLAMAV_SCAN_REMOVE: number;
	    static CLAMAV_SCAN_TIMEOUT: number;
	    static CLAMAV_SCAN_RESPONSE_MALFORMED: number;
	    static CLAMAV_SCAN_UNKNOWN: number;
	    /**
	     * code error BATCH 10700 - 10799
	     */
	    static BATCH_OPTIONS_UNDEFINED: number;
	}
	
}

declare module "hornet-js-utils/src/exception/http-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { TechnicalError }  from "hornet-js-utils/src/exception/technical-error";
	export class HttpError extends TechnicalError {
	    status: number;
	    constructor(status: any, code?: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}

declare module "hornet-js-utils/src/exception/not-found-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HttpError }  from "hornet-js-utils/src/exception/http-error";
	export class NotFoundError extends HttpError {
	    static status: number;
	    constructor(args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}

declare module "hornet-js-utils/src/exception/security-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HttpError }  from "hornet-js-utils/src/exception/http-error";
	export class SecurityError extends HttpError {
	    static status: number;
	    constructor(code?: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}

declare module "hornet-js-utils/src/exception/technical-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BaseError }  from "hornet-js-utils/src/exception/base-error";
	export class TechnicalError extends BaseError {
	    constructor(code?: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}

declare module "hornet-js-utils/src/exception/validation-error" {
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
	 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BaseError }  from "hornet-js-utils/src/exception/base-error";
	/**
	 * Erreur de validation de données
	 */
	export class ValidationError extends BaseError {
	    constructor(code?: string, args?: {
	        [key: string]: any;
	    }, cause?: Error);
	}
	
}
