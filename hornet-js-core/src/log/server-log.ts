///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import Log4jsNode = require("log4js");

import utils = require("hornet-js-utils");
import Logger = require('hornet-js-utils/src/logger');


class ServerLog {

    /**
     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
     * @param logConfig Le configuration log
     * @returns {function(any): undefined}
     */
    static getLoggerBuilder(logConfig) {
        logConfig.appenders.forEach((appender) => {
                var callbacksStorage = utils.callbacksLocalStorage.getStorage();
                var noTid = "NO_TID";
                var noUser = "NO_USER";
                appender.layout.tokens =
                {
                    "pid": function () {
                        return process.pid;
                    },
                    "tid": function () {
                        return (callbacksStorage) ? callbacksStorage.get("tid") || noTid : noTid;
                    },
                    "user": function () {
                        return (callbacksStorage) ? callbacksStorage.get("user") || noUser : noUser;
                    },
                    "fn": function () {
                        return Logger.getFunctionName(10); //TODO ne fonctionne pas parfaitement
                    }
                }
            }
        );

        Log4jsNode.configure(logConfig);

        return function (category) {
            this.log4jsLogger = Log4jsNode.getLogger(category);
        };
    }
}

export = ServerLog;