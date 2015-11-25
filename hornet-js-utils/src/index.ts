///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
// Inclusion du polyfill pour faire fonctionner firefox et IE
require("src/extended/capture_stack_trace_polyfill");

// propagation dynamique de la variable NODE_ENV vers le client
if (typeof window != "undefined" && (<any>window).Mode) {
    process.env.NODE_ENV = (<any>window).Mode;
}

import Register = require("src/common-register");
import Logger = require("src/logger");
import ApplyMixins = require("src/apply-mixins");
import DateUtils = require("src/date-utils");
import promiseApi = require("src/promise-api");
import ConfigLib = require("src/config-lib");
import AppSharedProps = require("src/app-shared-props");
import _ = require("lodash");
import memorystreamNS = require("memorystream");

var newFormsAriaModifications = require("src/extended/new-forms-aria-modifications");
import VerrorNS = require("verror");
import keyEvent = require("src/keyevent");

class Utils {
    static newFormsAriaModifications:any = newFormsAriaModifications;
    static isServer:boolean = Register.isServer;
    static getLogger:(category:any, buildLoggerFn?:(category:string)=>void)=>Logger = Register.getLogger;
    static _:_.LoDashStatic;

    static verror:typeof VerrorNS = VerrorNS;
    static werror:typeof VerrorNS.WError = VerrorNS.WError;

    static dateUtils:typeof DateUtils = DateUtils;
    static promise:typeof promiseApi = promiseApi;

    static appSharedProps:typeof AppSharedProps = AppSharedProps;
    private static _config:ConfigLib;
    private static _contextPath:string;
    static csrf:string;
    static keyEvent:typeof keyEvent = keyEvent;

    static memorystream:typeof memorystreamNS = memorystreamNS;

    static mixins:typeof ApplyMixins = ApplyMixins;

    static CONTENT_JSON = "application/json";

    static log4js:any;
    static callbacksLocalStorage:any;

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
                //On enlève le slash de fin si présent
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
    static buildStaticPath(path) {
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
        var staticpath = "/static";
        if (process.env.NODE_ENV === "production") {
            staticpath += "-" + AppSharedProps.get("appVersion");
        }
        return staticpath;
    }
    
    static setConfigObj(theConfig:Object) {
        var config:ConfigLib = new ConfigLib();
        config.setConfigObj(theConfig);
        Utils.config = config;
    }
}

if (Utils.isServer) {
    var config:ConfigLib = new ConfigLib();
    config.loadServerConfigs();
    Utils.config = Utils.registerGlobal("config", config);
}

Utils._ = Utils.registerGlobal("lodash", _);

if (Utils.isServer) {
    Utils.callbacksLocalStorage = require("src/callbacks-local-storage");
}else{
    Utils.log4js = Utils.registerGlobal("log4js", require("src/extended/log4js"));
}

export = Utils;
