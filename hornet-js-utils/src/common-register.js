/// <reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var logger = require("src/logger");
var Register = (function () {
    function Register() {
    }
    Register.registerGlobal = function (paramName, value) {
        if (!Register.global[paramName]) {
            Register.global[paramName] = value;
        }
        //Dans tous les cas on remonte la variable globale
        return Register.global[paramName];
    };
    Register.isServer = typeof window === "undefined";
    return Register;
})();
//
// Création de la variable Globale
//
if (Register.isServer) {
    //Sur le serveur on utilise le global de node.js
    if (!global.hornetClient) {
        global.hornetClient = {};
    }
    Register.global = global.hornetClient;
}
else {
    // Sur le browser on utilise window
    var untypedWindow = window;
    if (!untypedWindow.hornetClient) {
        untypedWindow.hornetClient = {};
    }
    Register.global = untypedWindow.hornetClient;
}
Register.getLogger = Register.registerGlobal("hornetLogger.getLogger", logger.getLogger);
module.exports = Register;
//# sourceMappingURL=common-register.js.map