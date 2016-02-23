"use strict";
import logger = require("src/logger");

class Register {
    static isServer:boolean = typeof window === "undefined";
    static global:any;
    static getLogger:(category:any, buildLoggerFn?:(category:string)=>void)=>logger;
    static registerGlobal<T>(paramName:string, value:T):T {
        if (!Register.global[paramName]) {
            Register.global[paramName] = value;
        }

        // Dans tous les cas on remonte la variable globale
        return Register.global[paramName];
    }
}
export = Register;

//
// Création de la variable Globale
//
if (Register.isServer) {
    // Sur le serveur on utilise le global de node.js
    if (!(global as any).hornetClient) {
        (global as any).hornetClient = {};
    }
    Register.global = (global as any).hornetClient;
} else {
    // Sur le browser on utilise window
    var untypedWindow:any = window;
    if (!untypedWindow.hornetClient) {
        untypedWindow.hornetClient = {};
    }
    Register.global = untypedWindow.hornetClient;
}

Register.getLogger = Register.registerGlobal("hornetLogger.getLogger", logger.getLogger);
