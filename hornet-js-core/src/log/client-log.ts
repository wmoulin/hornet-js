///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import utils = require("hornet-js-utils");
import Logger = require('hornet-js-utils/src/logger');

class ClientLog {

    static LOCAL_STORAGE_LOGGER_LEVEL_KEY = "hornet-js.logger.level";
    static LOCAL_STORAGE_LOGGER_LAYOUT_KEY = "hornet-js.logger.layout";
    static LOCAL_STORAGE_LOGGER_REMOTE_KEY = "hornet-js.logger.remote";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY = "hornet-js.logger.remote.layout";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY = "hornet-js.logger.remote.threshold";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY = "hornet-js.logger.remote.timeout";
    static LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY = "hornet-js.logger.remote.url";

    static defaultRemote:boolean = false;
    static defaultLogLevel:string = "ERROR";
    static defaultLogLayout:string = "BASIC";
    static defaultRemoteLogLayout:string = "JSON";
    static defaultRemoteLogThreshold:number = 100;
    static defaultRemoteLogTimeout:number = 3000;
    static defaultRemoteUrl:string = utils.buildContextPath("/log");

    /**
     * Cette fonction retourne la fonction d'initialisation des loggers de l'application côté ClientLog.
     *
     * @param logConfig  configuration log
     */
    static getLoggerBuilder(logConfig) {

        var appenders = [];

        ClientLog.configHornetLoggerHelp();
        ClientLog.configHornetJsLogState();

        if (logConfig && Object.keys(logConfig).length) {
            ClientLog.defaultRemote = ClientLog.getLoggerKeyValue("LOG remote", logConfig.remote, ClientLog.defaultRemote);
            ClientLog.defaultLogLevel = ClientLog.getLoggerKeyValue("LOG level", logConfig.level, ClientLog.defaultLogLevel);
            if (logConfig.appenders && logConfig.appenders.length) {
                logConfig.appenders.forEach((appender) => {
                    if (appender.type === "BrowserConsole") {
                        appenders.push(ClientLog.configureBrowserConsole(appender));
                    } else if (appender.type === "Ajax") {
                        appenders.push(ClientLog.configureAjaxConsole(appender));
                    } else {
                        console.warn("LOGGER WEB : LOGGER TYPE NOT SUPPORT : ", appender.type);
                    }
                });
            } else {
                console.warn("LOGGER WEB : APPENDER NOT DEFINED");
            }
        } else {
            console.warn("LOGGER WEB : CONFIGURATION NOT DEFINED");
        }
        var logLevel = utils.log4js.Level.INFO.toLevel(ClientLog.setHornetJsLogLevel());
        var remoteLog = ClientLog.setHornetJsRemoteLog();

        if (!appenders.length) {
            console.warn("LOGGER WEB : NONE APPENDER DEFINED, APPLY DEFAULT APPENDER BrowserConsoleAppender");
            var consoleAppender = new utils.log4js.BrowserConsoleAppender();
            var logLayout = ClientLog.getConsoleLayout(ClientLog.setHornetJsLogLayout());
            consoleAppender.setLayout(logLayout);
            appenders.push(consoleAppender);
        }

        return function (category) {
            this.log4jsLogger = utils.log4js.getLogger(category);
            this.log4jsLogger.setLevel(logLevel);

            appenders.forEach((appender) => {
                if (!(appender instanceof utils.log4js.AjaxAppender)
                    || ((appender instanceof utils.log4js.AjaxAppender) && remoteLog)) {
                    this.log4jsLogger.addAppender(appender);
                }
            });
        }
    }

    private static configureAjaxConsole(appender) {
        if (appender.layout) {
            if (appender.layout.type === "pattern" && appender.layout.pattern) {
                ClientLog.defaultRemoteLogLayout = ClientLog.getLoggerKeyValue("AjaxAppender layout.pattern", appender.layout.pattern, ClientLog.defaultRemoteLogLayout);
            } else {
                ClientLog.defaultRemoteLogLayout = ClientLog.getLoggerKeyValue("AjaxAppender layout.type", appender.layout.type, ClientLog.defaultRemoteLogLayout);
            }
        }
        ClientLog.defaultRemoteLogThreshold = ClientLog.getLoggerKeyValue("AjaxAppender threshold", appender.threshold, ClientLog.defaultRemoteLogThreshold);
        ClientLog.defaultRemoteLogTimeout = ClientLog.getLoggerKeyValue("AjaxAppender timeout", appender.timeout, ClientLog.defaultRemoteLogTimeout);

        if (appender.url.indexOf("http") > -1) {
            //On traite les urls complètes, correspond à une url distante autre que celle du serveur d'appli
            ClientLog.defaultRemoteUrl = ClientLog.getLoggerKeyValue("AjaxAppender url", appender.url, ClientLog.defaultRemoteUrl);
        } else {
            //l'url remote est le serveur applicatif
            ClientLog.defaultRemoteUrl = ClientLog.getLoggerKeyValue("AjaxAppender url", utils.buildContextPath(appender.url), ClientLog.defaultRemoteUrl);
        }

        var remoteLogUrl = ClientLog.setHornetJsRemoteLogUrl(ClientLog.defaultRemoteUrl);
        var remoteLogLayout = ClientLog.setHornetJsRemoteLogLayout();

        var ajaxAppender = new utils.log4js.AjaxAppender(remoteLogUrl);
        ajaxAppender.setLayout(ClientLog.getConsoleLayout(remoteLogLayout.layout));
        ajaxAppender.setThreshold(remoteLogLayout.threshold);
        ajaxAppender.setTimeout(remoteLogLayout.timeout);
        return ajaxAppender;
    }

    private static configureBrowserConsole(appender) {
        if (appender.layout) {
            if (appender.layout.type === "pattern" && appender.layout.pattern) {
                ClientLog.defaultLogLayout = ClientLog.getLoggerKeyValue("BrowserConsoleAppender layout.pattern", appender.layout.pattern, ClientLog.defaultLogLayout);
            } else {
                ClientLog.defaultLogLayout = ClientLog.getLoggerKeyValue("BrowserConsoleAppender layout.type", appender.layout.type, ClientLog.defaultLogLayout);
            }
        }
        var consoleAppender = new utils.log4js.BrowserConsoleAppender();
        var logLayout = ClientLog.getConsoleLayout(ClientLog.setHornetJsLogLayout());
        consoleAppender.setLayout(logLayout);
        return consoleAppender;
    }

    static getLoggerKeyValue(confKey:string, value:any, defaultValue:any):any {
        if (!value && String(value) != "false") {
            console.warn("LOGGER WEB : KEY NOT DEFINED : ", confKey, ", DEFAULT VALUE APPLY : ", defaultValue);
        }
        return value || defaultValue;
    }

    static configHornetLoggerHelp() {

        if (!(<any>window).getHornetLoggerHelp) {
            (<any>window).getHornetLoggerHelp = function (level:string) {

                var level = "Level : \
                    \n\t ALL\
                    \n\t TRACE\
                    \n\t DEBUG\
                    \n\t INFO\
                    \n\t WARN\
                    \n\t ERROR\
                    \n\t FATAL\
                    \n\t OFF";

                var layout = "\n\n Layout : \
                    \n\t BASIC : default\
                    \n\t SIMPLE\
                    \n\t THIN\
                    \n\t JSON\
                    \n\t XML\
                    \n\t HTML\
                    \n\t VOID - eq pattern - see pattern format";

                var pattern = "\n\n Pattern format : \
                    \n\t %r - time in toLocaleTimeString format \
                    \n\t %p - log level \
                    \n\t %c - log category\
                    \n\t %h - hostname\
                    \n\t %m - log data\
                    \n\t %d - date in various formats\
                    \n\t %% - %\
                    \n\t %n - newline\
                    \n\t %x{<tokenname>} - add dynamic tokens to your log. Tokens are specified in the tokens parameter\
                    \n\t %[ and %] - define a colored bloc";

                console.log(level + layout + pattern);
            }
        }
    }

    static configHornetJsLogState() {

        if (!(<any>window).getHornetJsLogState) {
            (<any>window).getHornetJsLogState = function () {
                if (window.localStorage) {
                    console.log(
                        "\n Log Level :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LEVEL_KEY) || ClientLog.defaultLogLevel,
                        "\n Log Layout :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LAYOUT_KEY) || ClientLog.defaultLogLayout,
                        "\n Remote :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_KEY) || ClientLog.defaultRemote,
                        "\n Remote Log Layout :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY) || ClientLog.defaultRemoteLogLayout,
                        "\n Remote Log Threshold :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY) || ClientLog.defaultRemoteLogThreshold,
                        "\n Remote Log Timeout :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY) || ClientLog.defaultRemoteLogTimeout,
                        "\n Remote Url :", window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY) || ClientLog.defaultRemoteUrl
                    );
                } else {
                    console.log(
                        "\n Log Level :", ClientLog.defaultLogLevel,
                        "\n Log Layout :", ClientLog.defaultLogLayout,
                        "\n Remote :", ClientLog.defaultRemote,
                        "\n Remote Log Layout :", ClientLog.defaultRemoteLogLayout,
                        "\n Remote Log Threshold :", ClientLog.defaultRemoteLogThreshold,
                        "\n Remote Log Timeout :", ClientLog.defaultRemoteLogTimeout,
                        "\n Remote Url :", ClientLog.defaultRemoteUrl
                    );
                }
            }
        }
    }

    static setHornetJsLogLevel():any {
        if (window.localStorage) {
            if (!(<any>window).setHornetJsLogLevel) {
                (<any>window).setHornetJsLogLevel = function (level:string) {
                    var logLevel = ClientLog.testParamLocalStorage(level, ClientLog.defaultLogLevel);
                    var newLogLevel = utils.log4js.Level.INFO.toLevel(logLevel, ClientLog.defaultLogLevel).toString();
                    console.log("New log level :", newLogLevel, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_LEVEL_KEY, newLogLevel);
                }
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LEVEL_KEY) || ClientLog.defaultLogLevel;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultLogLevel;
        }
    }

    static setHornetJsLogLayout():any {
        if (window.localStorage) {
            if (!(<any>window).setHornetJsLogLayout) {
                (<any>window).setHornetJsLogLayout = function (layout:string) {
                    var logLayout = ClientLog.testParamLocalStorage(layout, ClientLog.defaultLogLayout);

                    console.log("New log layout :", logLayout, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_LAYOUT_KEY, logLayout);
                }
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LAYOUT_KEY) || ClientLog.defaultLogLayout;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultLogLayout;
        }
    }

    static setHornetJsRemoteLog():boolean {
        if (window.localStorage) {
            if (!(<any>window).setHornetJsRemoteLog) {
                (<any>window).setHornetJsRemoteLog = function (remote:boolean) {
                    var logRemote = ClientLog.testParamLocalStorage(remote, ClientLog.defaultRemote);

                    console.log("Remote log (De)Activation :", logRemote, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_KEY, logRemote.toString());
                }
            }
            return (window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_KEY)) === "true" || ClientLog.defaultRemote;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultRemote;
        }
    }

    static setHornetJsRemoteLogLayout():any {
        if (window.localStorage) {
            if (!(<any>window).setHornetJsRemoteLogLayout) {
                (<any>window).setHornetJsRemoteLogLayout = function (layout:string, threshold:string, timeout:string) {
                    var logLayout = ClientLog.testParamLocalStorage(layout, ClientLog.defaultRemoteLogLayout);
                    var logTreshold = parseInt(threshold) || ClientLog.defaultRemoteLogThreshold;
                    var logTimeout = parseInt(timeout) || ClientLog.defaultRemoteLogTimeout;

                    console.log("New remote log layout :", logLayout, " thresold :", logTreshold, ", logTimeout :", logTimeout, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY, logLayout.toString());
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY, logTreshold.toString());
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY, logTimeout.toString());
                }
            }
            return {
                layout: window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY) || ClientLog.defaultRemoteLogLayout,
                threshold: window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY) || ClientLog.defaultRemoteLogThreshold,
                timeout: window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY) || ClientLog.defaultRemoteLogTimeout
            };
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return {
                layout: ClientLog.defaultRemoteLogLayout,
                threshold: ClientLog.defaultRemoteLogThreshold,
                timeout: ClientLog.defaultRemoteLogTimeout
            };
        }
    }

    static setHornetJsRemoteLogUrl(defaultUrl:string):any {
        if (window.localStorage) {
            if (!(<any>window).setHornetJsRemoteLogUrl) {
                (<any>window).setHornetJsRemoteLogUrl = function (url:string) {
                    var logRemoteUrl = ClientLog.testParamLocalStorage(url, defaultUrl);

                    console.log("New remote url :", logRemoteUrl, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY, logRemoteUrl.toString());
                }
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY) || defaultUrl;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return defaultUrl;
        }
    }

    static testParamLocalStorage(value:any, defaultValue:any) {
        return (!value || value === "null" || value === "undefined") ? defaultValue : value;
    }

    static getConsoleLayout(logLayout:string):any {
        var newLayout = new utils.log4js.BasicLayout();
        if (logLayout) {
            var isPatternLayout;
            if (logLayout.indexOf("%") == -1) {
                //on ne traite pas les patterns
                logLayout = logLayout.toLocaleUpperCase();
                isPatternLayout = false;
            } else {
                isPatternLayout = true;
            }
            if (logLayout === "BASIC") {
                newLayout = new utils.log4js.BasicLayout()
            } else if (logLayout === "SIMPLE") {
                newLayout = new utils.log4js.SimpleLayout();
            } else if (logLayout === "THIN") {
                newLayout = new utils.log4js.ThinLayout();
            } else if (logLayout === "JSON") {
                newLayout = new utils.log4js.JSONLayout();
            } else if (logLayout === "XML") {
                newLayout = new utils.log4js.XMLLayout();
            } else if (logLayout === "HTML") {
                newLayout = new utils.log4js.HtmlLayout();
            } else {
                if (isPatternLayout) {
                    newLayout = new utils.log4js.PatternLayout(logLayout);
                } else {
                    newLayout = ClientLog.getDefaultConsoleLayout();
                    console.warn("PATTERN LAYOUT NOT FOUND : '", logLayout, "' APPLY DEFAULT");
                }
            }
        } else {
            newLayout = ClientLog.getDefaultConsoleLayout();
            console.warn("LAYOUT NOT FOUND, APPLY DEFAULT");
        }
        return newLayout;
    }

    static getDefaultConsoleLayout() {
        var defaultLayout;
        if (ClientLog.defaultRemote) {
            defaultLayout = ClientLog.getConsoleLayout(ClientLog.defaultRemoteLogLayout);
        } else {
            defaultLayout = ClientLog.getConsoleLayout(ClientLog.defaultLogLayout);
        }
        return defaultLayout;
    }
}

export = ClientLog;