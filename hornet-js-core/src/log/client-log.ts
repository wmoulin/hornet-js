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
 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";

declare global {
    interface Window {
        getHornetLoggerHelp: () => void;
        getHornetJsLogState: () => void;
        setHornetJsLogLevel: (level: string) => void;
        setHornetJsStacksLog: (enableValue: string) => void;
        setHornetJsLogLayout: (layout: string) => void;
        setHornetJsRemoteLog: (remote: boolean) => void;
        setHornetJsRemoteLogLayout: (layout: string, threshold: string, timeout: string) => void;
        setHornetJsRemoteLogUrl: (url: string) => void;
    }
}

export class ClientLog {

    static LOCAL_STORAGE_LOGGER_LEVEL_KEY = "hornet-js.logger.level";
    static LOCAL_STORAGE_LOGGER_LAYOUT_KEY = "hornet-js.logger.layout";
    static LOCAL_STORAGE_LOGGER_REMOTE_KEY = "hornet-js.logger.remote";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY = "hornet-js.logger.remote.layout";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY = "hornet-js.logger.remote.threshold";
    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY = "hornet-js.logger.remote.timeout";
    static LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY = "hornet-js.logger.remote.url";
    static LOCAL_STORAGE_LOGGER_STACK_ENABLED = "hornet-js.logger.stackEnabled";

    static defaultRemote: boolean = false;
    static defaultLogLevel: string = "ERROR";
    static defaultLogLayout: string = "BASIC";
    static defaultRemoteLogLayout: string = "JSON";
    static defaultRemoteLogThreshold: number = 100;
    static defaultRemoteLogTimeout: number = 3000;
    static defaultRemoteUrl: string = Utils.buildContextPath("/log");
    static defaultStackLogEnabled: string = "false";

    /**
     * Cette fonction retourne la fonction d'initialisation des loggers de l'application côté ClientLog.
     *
     * @param logConfig  configuration log
     */
    static getLoggerBuilder(logConfig) {

        let appenders = [];

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
        let logLevel = Utils.log4js.Level.INFO.toLevel(ClientLog.setHornetJsLogLevel());
        let remoteLog = ClientLog.setHornetJsRemoteLog();

        if (!appenders.length) {
            console.warn("LOGGER WEB : NONE APPENDER DEFINED, APPLY DEFAULT APPENDER BrowserConsoleAppender");
            let consoleAppender = new Utils.log4js.BrowserConsoleAppender();
            let logLayout = ClientLog.getConsoleLayout(ClientLog.setHornetJsLogLayout());
            consoleAppender.setLayout(logLayout);
            appenders.push(consoleAppender);
        }

        return function (category) {
            this.log4jsLogger = Utils.log4js.getLogger(category);
            this.log4jsLogger.setLevel(logLevel);

            appenders.forEach((appender) => {
                if (!(appender instanceof Utils.log4js.AjaxAppender)
                    || ((appender instanceof Utils.log4js.AjaxAppender) && remoteLog)) {
                    this.log4jsLogger.addAppender(appender);
                }
            });
        };
    }

    private static configureAjaxConsole(appender) {
        if (appender.layout) {
            if (appender.layout.type === "pattern" && appender.layout.pattern) {
                ClientLog.defaultRemoteLogLayout = ClientLog.getLoggerKeyValue(
                    "AjaxAppender layout.pattern", appender.layout.pattern, ClientLog.defaultRemoteLogLayout);
            } else {
                ClientLog.defaultRemoteLogLayout = ClientLog.getLoggerKeyValue(
                    "AjaxAppender layout.type", appender.layout.type, ClientLog.defaultRemoteLogLayout);
            }
        }
        ClientLog.defaultRemoteLogThreshold = ClientLog.getLoggerKeyValue(
            "AjaxAppender threshold", appender.threshold, ClientLog.defaultRemoteLogThreshold);
        ClientLog.defaultRemoteLogTimeout = ClientLog.getLoggerKeyValue(
            "AjaxAppender timeout", appender.timeout, ClientLog.defaultRemoteLogTimeout);

        if (appender.url.indexOf("http") > -1) {
            // On traite les urls complètes, correspond à une url distante autre que celle du serveur d'appli
            ClientLog.defaultRemoteUrl = ClientLog.getLoggerKeyValue(
                "AjaxAppender url", appender.url, ClientLog.defaultRemoteUrl);
        } else {
            // l'url remote est le serveur applicatif
            ClientLog.defaultRemoteUrl = ClientLog.getLoggerKeyValue(
                "AjaxAppender url", Utils.buildContextPath(appender.url), ClientLog.defaultRemoteUrl);
        }

        let remoteLogUrl = ClientLog.setHornetJsRemoteLogUrl(ClientLog.defaultRemoteUrl);
        let remoteLogLayout = ClientLog.setHornetJsRemoteLogLayout();

        let remoteStackErrorLog = ClientLog.setHornetJsStacksLog();

        let ajaxAppender = new Utils.log4js.AjaxAppender(remoteLogUrl);
        ajaxAppender.setLayout(ClientLog.getConsoleLayout(remoteLogLayout.layout));
        ajaxAppender.setThreshold(remoteLogLayout.threshold);
        ajaxAppender.setTimeout(remoteLogLayout.timeout);
        return ajaxAppender;
    }

    private static configureBrowserConsole(appender) {
        if (appender.layout) {
            if (appender.layout.type === "pattern" && appender.layout.pattern) {
                ClientLog.defaultLogLayout = ClientLog.getLoggerKeyValue(
                    "BrowserConsoleAppender layout.pattern", appender.layout.pattern, ClientLog.defaultLogLayout);
            } else {
                ClientLog.defaultLogLayout = ClientLog.getLoggerKeyValue(
                    "BrowserConsoleAppender layout.type", appender.layout.type, ClientLog.defaultLogLayout);
            }
        }
        let consoleAppender = new Utils.log4js.BrowserConsoleAppender();
        let logLayout = ClientLog.getConsoleLayout(ClientLog.setHornetJsLogLayout());
        consoleAppender.setLayout(logLayout);
        return consoleAppender;
    }

    static getLoggerKeyValue(confKey: string, value: any, defaultValue: any): any {
        if (!value && String(value) !== "false") {
            console.warn("LOGGER WEB : KEY NOT DEFINED : ", confKey, ", DEFAULT VALUE APPLY : ", defaultValue);
        }
        return value || defaultValue;
    }

    static configHornetLoggerHelp() {
        if (!window.getHornetLoggerHelp) {
            window.getHornetLoggerHelp = function () {
                let level = "Level : \
                    \n\t ALL\
                    \n\t TRACE\
                    \n\t DEBUG\
                    \n\t INFO\
                    \n\t WARN\
                    \n\t ERROR\
                    \n\t FATAL\
                    \n\t OFF";

                let layout = "\n\n Layout : \
                    \n\t BASIC : default\
                    \n\t SIMPLE\
                    \n\t THIN\
                    \n\t JSON\
                    \n\t XML\
                    \n\t HTML\
                    \n\t VOID - eq pattern - see pattern format";

                let pattern = "\n\n Pattern format : \
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
            };
        }
    }

    static configHornetJsLogState() {

        if (!window.getHornetJsLogState) {
            window.getHornetJsLogState = function () {
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
            };
        }
    }

    static setHornetJsLogLevel(): any {
        if (window.localStorage) {
            if (!window.setHornetJsLogLevel) {
                window.setHornetJsLogLevel = function (level: string) {
                    let logLevel = ClientLog.testParamLocalStorage(level, ClientLog.defaultLogLevel);
                    let newLogLevel = Utils.log4js.Level.INFO.toLevel(logLevel, ClientLog.defaultLogLevel).toString();
                    console.log("New log level :", newLogLevel, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_LEVEL_KEY, newLogLevel);
                };
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LEVEL_KEY) || ClientLog.defaultLogLevel;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultLogLevel;
        }
    }

    /**
     * Met a disposition une fonction sur le browser (window.setStacksErrorsLogs)
     * Appelée depuis du code client, cette fonction permet de changer  l'option de paramétrage
     * pour activer ou désactiver la generation des stacks dans les logs d'erreur
     * Cette option est stockée dans le navigateur au niveau du localStorage,
     * elle peut donc aussi être modifié manuellement par l'utilisateur
     */
    static setHornetJsStacksLog(): any {
        if (window.localStorage) {
            if (!window.setHornetJsStacksLog) {
                window.setHornetJsStacksLog = function (enableValue: string) {
                    let enableStacks: string = (!enableValue || enableValue === "null" || enableValue === "undefined") ? ClientLog.defaultStackLogEnabled : enableValue;
                    console.log("New value for enableStacksErrorsLog :", enableValue, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_STACK_ENABLED, enableStacks);
                };
            }
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
        }
    }

    static setHornetJsLogLayout(): any {
        if (window.localStorage) {
            if (!window.setHornetJsLogLayout) {
                window.setHornetJsLogLayout = function (layout: string) {
                    let logLayout = ClientLog.testParamLocalStorage(layout, ClientLog.defaultLogLayout);

                    console.log("New log layout :", logLayout, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_LAYOUT_KEY, logLayout);
                };
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_LAYOUT_KEY) || ClientLog.defaultLogLayout;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultLogLayout;
        }
    }

    static setHornetJsRemoteLog(): boolean {
        if (window.localStorage) {
            if (!window.setHornetJsRemoteLog) {
                window.setHornetJsRemoteLog = function (remote: boolean) {
                    let logRemote = ClientLog.testParamLocalStorage(remote, ClientLog.defaultRemote);

                    console.log("Remote log (De)Activation :", logRemote, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_KEY, logRemote.toString());
                };
            }
            return (window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_KEY)) === "true" || ClientLog.defaultRemote;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return ClientLog.defaultRemote;
        }
    }

    static setHornetJsRemoteLogLayout(): any {
        if (window.localStorage) {
            if (!window.setHornetJsRemoteLogLayout) {
                window.setHornetJsRemoteLogLayout = function (layout: string, threshold: string, timeout: string) {
                    let logLayout = ClientLog.testParamLocalStorage(layout, ClientLog.defaultRemoteLogLayout);
                    let logTreshold = parseInt(threshold) || ClientLog.defaultRemoteLogThreshold;
                    let logTimeout = parseInt(timeout) || ClientLog.defaultRemoteLogTimeout;

                    console.log("New remote log layout :", logLayout, " thresold :", logTreshold, ", logTimeout :", logTimeout, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY, logLayout.toString());
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY, logTreshold.toString());
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY, logTimeout.toString());
                };
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

    static setHornetJsRemoteLogUrl(defaultUrl: string): any {
        if (window.localStorage) {
            if (!window.setHornetJsRemoteLogUrl) {
                window.setHornetJsRemoteLogUrl = function (url: string) {
                    let logRemoteUrl = ClientLog.testParamLocalStorage(url, defaultUrl);

                    console.log("New remote url :", logRemoteUrl, ". Reload page (F5) to activate");
                    window.localStorage.setItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY, logRemoteUrl.toString());
                };
            }
            return window.localStorage.getItem(ClientLog.LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY) || defaultUrl;
        } else {
            console.log("ERREUR: Browser doesn't support LocalStorage");
            return defaultUrl;
        }
    }

    static testParamLocalStorage(value: any, defaultValue: any) {
        return (!value || value === "null" || value === "undefined") ? defaultValue : value;
    }

    static getConsoleLayout(logLayout: string): any {
        let newLayout = new Utils.log4js.BasicLayout();
        if (logLayout) {
            let isPatternLayout;
            if (logLayout.indexOf("%") === -1) {
                // on ne traite pas les patterns
                logLayout = logLayout.toLocaleUpperCase();
                isPatternLayout = false;
            } else {
                isPatternLayout = true;
            }
            if (logLayout === "BASIC") {
                newLayout = new Utils.log4js.BasicLayout();
            } else if (logLayout === "SIMPLE") {
                newLayout = new Utils.log4js.SimpleLayout();
            } else if (logLayout === "THIN") {
                newLayout = new Utils.log4js.ThinLayout();
            } else if (logLayout === "JSON") {
                newLayout = new Utils.log4js.JSONLayout();
            } else if (logLayout === "XML") {
                newLayout = new Utils.log4js.XMLLayout();
            } else if (logLayout === "HTML") {
                newLayout = new Utils.log4js.HtmlLayout();
            } else {
                if (isPatternLayout) {
                    newLayout = new Utils.log4js.PatternLayout(logLayout);
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
        let defaultLayout;
        if (ClientLog.defaultRemote) {
            defaultLayout = ClientLog.getConsoleLayout(ClientLog.defaultRemoteLogLayout);
        } else {
            defaultLayout = ClientLog.getConsoleLayout(ClientLog.defaultLogLayout);
        }
        return defaultLayout;
    }
}
