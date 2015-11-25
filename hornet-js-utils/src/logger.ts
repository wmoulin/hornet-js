///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
//"use strict";
import _ = require("lodash");
import VerrorNS = require("verror");
var WError = VerrorNS.WError;

/**
 * Construit un logger avec la catégory demandée
 * @param category
 * @param getLoggerFn La fonction permettant de charger le logger, cette fonction est différente
*            selon le client ou le serveur, c'est pour cette raison quelle doit être injectée
*/
class Logger {
    private category:any;
    private log4jsLogger:any;

    constructor(category:any, buildLoggerFn?:(category:string)=>void) {
        if (!(this instanceof Logger))
            return new Logger(category, buildLoggerFn);

        this.category = category;

        if (buildLoggerFn && _.isFunction(buildLoggerFn)) {
            Logger.prototype.buildLogger = buildLoggerFn;
        }
    }

    static getLogger(category:any, buildLoggerFn?:(category:string)=>void):Logger {
        return new Logger(category, buildLoggerFn);
    }

    /**
     * Récupère le logger. Si côté client alors utilise log4js, si côté serveur alors utilise
     * log4js-node
     */
    buildLogger(category:string):void {
        throw new Error("The log building function should be injected before use log");
    }

    fatal(...args:any[]);
    fatal(message:string) {
        this.logInternal("fatal", arguments);
    }

    error(...args:any[]);
    error(message:string) {
        this.logInternal("error", arguments);
    }

    warn(...args:any[]);
    warn(message:string) {
        this.logInternal("warn", arguments);
    }

    info(...args:any[]);
    info(message:string) {
        this.logInternal("info", arguments);
    }

    debug(...args:any[]);
    debug() {
        this.logInternal("debug", arguments);
    }

    trace(...args:any[]);
    trace(message:string) {
        this.logInternal('trace', arguments);
    }

    /**
     * Récupère le nom de la fonction appelante
     */
    static getFunctionName(callStackSize:number):string {
        var notTyppedError:any = Error;
        var orig:any = notTyppedError.prepareStackTrace;
        var err:any;
        var functionName:string = '';
        if (typeof notTyppedError.captureStackTrace === "function") {
            // Chrome/Node
            notTyppedError.prepareStackTrace = function (_, stack) {
                return stack;
            };
            err = new notTyppedError();
            // "calle is not allowed" https://bugzilla.mozilla.org/show_bug.cgi?id=725398
            notTyppedError.captureStackTrace(err, arguments.callee);
            if (err.stack && err.stack.length >= callStackSize){
                functionName = err.stack[callStackSize-1].getFunctionName();
            }else{
                functionName = "unknownFunction";
            }
            notTyppedError.prepareStackTrace = orig;
        } else {
            // Firefox
            var e = new notTyppedError().stack;
            if (e) {
                var callstack = e.split('\n');
                if (callstack.length > callStackSize) {
                    functionName = callstack[callStackSize];
                }
            }
        }
        return functionName;
    }


    /**
     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
     * disponible l'id de traitement
     *
     * @param niveau de log
     * @param [, arg1[, arg2[, ...]]] Une liste d'arguments à logguer
     */
    log(level:string, ...args:any[]) {
        if (!_.isString(level)) {
            args.unshift(level);
            level = "error";
        }
        this.logInternal.call(this, level, args);
    }


    /**
     * Appelle la fonction de log de manière asynchrone
     *
     * @param niveau de log
     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
     */
    //private logInternalAsync(level:string, logArguments:IArguments) {
    //    setTimeout(this.logInternal.bind(this), 0, level, logArguments);
    //}

    /**
     * Appelle la fonction de journalisation du logger en ajoutant le nom de la fonction appelant et si
     * disponible l'id de traitement
     *
     * @param niveau de log
     * @param logArguments: Un tableau des objets (string, error ou object) à logguer
     */
    private logInternal(level:string, logArguments:IArguments) {

        if (!this.log4jsLogger) {
            this.buildLogger(this.category);
        }

        var logFn;
        switch (level.toLowerCase()) {
            case "trace":
                if (this.log4jsLogger.isTraceEnabled()) {
                    logFn = this.log4jsLogger.trace;
                }
                break;
            case "debug":
                if (this.log4jsLogger.isDebugEnabled()) {
                    logFn = this.log4jsLogger.debug;
                }
                break;
            case "info":
                if (this.log4jsLogger.isInfoEnabled()) {
                    logFn = this.log4jsLogger.info;
                }
                break;
            case "warn":
                if (this.log4jsLogger.isWarnEnabled()) {
                    logFn = this.log4jsLogger.warn;
                }
                break;
            case "fatal":
                if (this.log4jsLogger.isFatalEnabled()) {
                    logFn = this.log4jsLogger.fatal;
                }
                break;
            default:
                if (this.log4jsLogger.isErrorEnabled()) {
                    logFn = this.log4jsLogger.error;
                }
        }

        if (logFn) {
            //On a bien besoin de logguer
            var parameters = Array.prototype.slice.call(logArguments);
            var message = parameters.map(this.mappingObjectToString.bind(this)).join(' ');

            //Et enfin on log réellement
            logFn.call(this.log4jsLogger, message);
        }
    }

    private mappingObjectToString(arg:any) {
        if (_.isString(arg)) {
            return arg;

        } else if (arg instanceof WError) {
            var werr = <WError> arg;
            var errStr = werr.toString();

            var infoSupp;
            try {
                infoSupp = JSON.stringify(werr);
            }
            catch (err) {
                infoSupp = "<stringifyErr>";
            }

            var stacks = werr.stack;
            if (werr.cause()) {
                stacks = stacks + "\nCaused by:\n" + this.mappingObjectToString(werr.cause());
            }
            return errStr + "\nInformations supplémentaires :\n" + infoSupp + "\n" + stacks;

        } else if (_.isError(arg)) {
            var errString;
            try {
                errString = JSON.stringify(arg);
            }
            catch (err) {
                errString = "<stringifyErr>";
            }
            return (arg.stack || (arg.toString && arg.toString()) || arg) + "\n Informations supplémentaires :\n" + errString;
        } else {
            try {
                //return JSON.stringify(arg);
                return JSON.stringify(arg, function (key, value) {
                    if (_.isFunction(value)) {
                        return "[Function" + (value.name ? ": " + value.name : "") + "]";
                    } else if (value instanceof RegExp) {
                        return "_PxEgEr_" + value;
                    } else if(value instanceof WError) {
                        /* Pour WError on utilise toString car JSON.stringify n'affiche pas correctement la cause */
                        return value.toString();
                    }
                    return value;
                });
            }
            catch (err) {
                return "<stringifyErr>";
            }
        }
    }
}

export = Logger;

