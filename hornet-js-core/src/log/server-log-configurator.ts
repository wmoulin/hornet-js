"use strict";

import JSONLoader = require("hornet-js-utils/src/json-loader");
import Logger = require("hornet-js-utils/src/logger");
import ServerLog = require("src/log/server-log");
import path = require("path");

let LOG4JS_CONFIG_FILE = "log4js",
    LOG4JS_CONFIG_FILE_EXT = ".json",

    nodeEnv:any = process.env.NODE_ENV,
    appliConfigDir:any = process.env.HORNET_CONFIG_DIR_APPLI,
    infraConfigDir:any = process.env.HORNET_CONFIG_DIR_INFRA,
    appInstance:any = process.env.NODE_APP_INSTANCE,

    log4jsConfigPath:string;

// en developpement
if (!nodeEnv || nodeEnv !== "production") {
    if (!appliConfigDir) {
        appliConfigDir = "config";
    }
    log4jsConfigPath = path.normalize(path.join(appliConfigDir, LOG4JS_CONFIG_FILE + LOG4JS_CONFIG_FILE_EXT));

// en production
} else {
    let log4jsFile:string = LOG4JS_CONFIG_FILE + (appInstance ? "-" + appInstance : "");
    log4jsConfigPath = path.normalize(path.join(infraConfigDir, log4jsFile + LOG4JS_CONFIG_FILE_EXT));
}

// On initialise les logs serveur, si erreur, on arrête le serveur
try {
    let logConfigObject:any = JSONLoader.load(log4jsConfigPath);
    Logger.prototype.buildLogger = ServerLog.getLoggerBuilder(logConfigObject);
    console.info("Chargement de la configuration des logs depuis le fichier '" + log4jsConfigPath + "'");
} catch (e) {
    console.error("Impossible de charger la configuration des logs depuis le fichier '" + log4jsConfigPath + "', " +
        "le serveur ne peut pas démarrer ... : ", e);
    process.exit(1);
}
