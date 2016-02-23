"use strict";
// Inclusion du polyfill pour faire fonctionner firefox et IE
require("src/extended/capture_stack_trace_polyfill");

// propagation dynamique de la variable NODE_ENV vers le client
if (typeof window !== "undefined" && (<any>window).Mode) {
    process.env.NODE_ENV = (<any>window).Mode;
}

import Register = require("src/common-register");
import Logger = require("src/logger");
import ApplyMixins = require("src/apply-mixins");
import DateUtils = require("src/date-utils");
import ConfigLib = require("src/config-lib");
import AppSharedProps = require("src/app-shared-props");
import ContinuationLocalStorage = require("src/continuation-local-storage");
import _ = require("lodash");
import memorystreamNS = require("memorystream");

var newFormsAriaModifications = require("src/extended/new-forms-aria-modifications");
import Verror = require("verror");
import KeyEvent = require("src/key-event");

class Utils {
    static newFormsAriaModifications:any = newFormsAriaModifications;
    static isServer:boolean = Register.isServer;
    static getLogger:(category:any, buildLoggerFn?:(category:string)=>void)=>Logger = Register.getLogger;
    static _:_.LoDashStatic;

    static verror = Verror;
    static werror:typeof Verror.WError = Verror.WError;

    static dateUtils = DateUtils;

    static appSharedProps = AppSharedProps;
    private static _config:ConfigLib;
    private static _contextPath:string;
    static csrf:string;
    static keyEvent = KeyEvent;

    static memorystream = memorystreamNS;

    static mixins = ApplyMixins;

    static CONTENT_JSON = "application/json";

    static log4js:any;

    static registerGlobal<T>(paramName:string, value:T):T {
        return Register.registerGlobal(paramName, value);
    }

    static set config(configLib) {
        Utils._config = configLib;
        Utils._contextPath = undefined;
    }

    static get config() {
        return Utils._config;
    }

    /**
     * Retourne le contextPath courant de l"application.
     * Ce context ne contient pas de "/" de fin et commence forcément par un "/"
     * @return {string}
     */
    static getContextPath() {
        if (_.isUndefined(Utils._contextPath)) {
            var context = Utils.config.getOrDefault("contextPath", "");
            if (!_.startsWith(context, "/")) {
                // On force le démarrage par un slash
                context = "/" + context;
            }
            if (_.endsWith(context, "/")) {
                // On enlève le slash de fin si présent
                context = context.substr(0, context.length - 1);
            }
            Utils._contextPath = context;
        }
        return Utils._contextPath;
    }

    /**
     * Ajoute le contextPath à l'url passée en paramètre si besoin
     * @param path
     * @return {string}
     */
    static buildContextPath(path:string = "") {
        var retour = path;

        var contextPath = Utils.getContextPath();
        if (path === "" || (_.startsWith(path, "/") && !_.startsWith(path, contextPath))) {
            // On ne prend que les urls relatives à la racine (=> commence par "/")
            // On ne concatène que lorsque ca ne commence pas déja par le contextPath
            retour = contextPath + path;
        }

        if (_.endsWith(retour, "/")) {
            // On enlève toujours le dernier slash
            retour = retour.substr(0, retour.length - 1);
        }

        return retour;
    }

    /**
     * Ajoute le staticPath à l'url passée en paramètre si besoin
     * @param path
     * @return {string}
     */
    static buildStaticPath(path:string) {
        var retour = path;

        var contextPath = Utils.getContextPath();
        if (_.startsWith(path, "/") && !_.startsWith(path, contextPath)) {
            // On ne prend que les urls relatives à la racine (=> commence par "/")
            // On ne concatène que lorsque ca ne commence pas déja par le contextPath
            retour = contextPath + Utils.getStaticPath() + path;
        }

        if (_.endsWith(retour, "/")) {
            // On enlève toujours le dernier slash
            retour = retour.substr(0, retour.length - 1);
        }

        return retour;
    }

    static getStaticPath() {
        var staticpath = "";

        // mantis 53394 - Pour le mode full spa :
        // tout ce qui est dans /static est en fait déployé directement a la racine du serveur web
        // => pas besoin de prefixer les requetes par /static
        // Solution : utiliser une proprieté de configuration pour ce préfixe : "fullSpa.staticPath"
        // Mode fullSpa actif : utiliser la propriété fullSpa.staticPath, qui doit être configurée à vide ou à "/"
        // Mode avec serveur node : on utilise le prefixe "/static"
        if (!Utils.isServer && Utils.config.getOrDefault("fullSpa.enabled", false)) {
            staticpath = Utils.config.getOrDefault("fullSpa.staticPath", "");
        } else {
            staticpath = "/static";
            if (process.env.NODE_ENV === "production") {
                staticpath += "-" + AppSharedProps.get("appVersion");
            }
        }
        return staticpath;
    }
    
    static setConfigObj(theConfig:Object) {
        var config:ConfigLib = new ConfigLib();
        config.setConfigObj(theConfig);
        Utils.config = config;
    }

    /**
     * Fonction retournant le continuationlocalstorage hornet ou un storage applicatif
     * @param localStorageName Nom du localStorage, par défaut HornetContinuationLocalStorage
     * @return {any}
     */
    static getContinuationStorage(localStorageName?:string):any {
        return ContinuationLocalStorage.getContinuationStorage(localStorageName);
    }
}

if (Utils.isServer) {
    var config:ConfigLib = new ConfigLib();
    config.loadServerConfigs();
    Utils.config = Utils.registerGlobal("config", config);
}

Utils._ = Utils.registerGlobal("lodash", _);

if (!Utils.isServer) {
    Utils.log4js = Utils.registerGlobal("log4js", require("src/extended/log4js"));
}

export = Utils;
