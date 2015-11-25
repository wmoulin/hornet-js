/// <reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import register = require("src/common-register");
var logger = register.getLogger("hornet-js-utils.config-lib");

/**
 * Classe gérant l'accès à l'objet de configuration
 */
class ConfigLib {
    private _configObj:any;

    constructor() {
    }

    /**
     * Force l'utilisation d'un objet de configuration spécifique, pour les tests ou pour le navigateur
     * @param configObj
     */
    setConfigObj(configObj:Object) {
        this._configObj = configObj;
    }

    /**
     * Charge les configurations Serveur.
     *  - répertoire ./config pour le mode DEV
     *  - répertoire APPLI + INFRA pour le mode PRODUCTION (process.env['HORNET_CONFIG_DIR_APPLI'] & process.env['HORNET_CONFIG_DIR_INFRA'])
     *   @param configRequireFn Une fonction effectuant le require de la librairie 'config'. Cette fonction est nécessaire afin de ne pas embarquer la librairie côté navigateur
     */
    loadServerConfigs() {
        var appliFolder = process.env["HORNET_CONFIG_DIR_APPLI"];
        if (appliFolder) {
            process.env["NODE_CONFIG_DIR"] = appliFolder;
            console.log("Chargement de la configuration APPLI (Variable process.env['HORNET_CONFIG_DIR_APPLI']) dans ", appliFolder);
        } else {
            console.log("Chargement de la configuration APPLI en mode DEV", "./config");
        }
        this._configObj =  require("config");
        console.log("Configuration APPLI : ", JSON.stringify(this._configObj));

        var infraFolder = process.env["HORNET_CONFIG_DIR_INFRA"];
        if (infraFolder) {
            process.env["NODE_CONFIG_DIR"] = infraFolder;
            console.log("Chargement de la configuration INFRA (Variable process.env['HORNET_CONFIG_DIR_INFRA']) dans ", infraFolder);
            var infraConf = this._configObj.util.loadFileConfigs();
            console.log("Configuration INFRA : ", JSON.stringify(infraConf));
            this._configObj.util.extendDeep(this._configObj, infraConf);
            console.log("Configuration mergée : ", JSON.stringify(this._configObj));
        }
        this.checkVariables(this._configObj);

    }

    getConfigObj():any {
        return this._configObj;
    }

    checkVariables(obj:any):void {
        var _check = (obj:any):any => {
            var retry:any = false;
            for (var i in obj) {
                var type = typeof obj[i];
                if (type === "function") continue;

                if (type === "object") {
                    retry |= _check(obj[i]);

                } else if (type === "string") {
                    var variables = obj[i].match(/\$\{[^\}]+\}/g);
                    if (variables && variables.length > 0) {
                        retry = true;
                        variables.forEach((variable) => {
                            obj[i] = obj[i].replace(variable, this.get(variable.substring(2, variable.length - 1)))
                        });
                    }
                }
            }
            return retry;
        };

        if (_check(obj)) {
            this.checkVariables(obj);
        }
    }

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
    get(property:string):any {
        if (property === null || property === undefined) {
            throw new Error("Calling config.get with null or undefined argument");
        }
        var value = ConfigLib.getImpl(this._configObj, property);

        // Produce an exception if the property doesn't exist
        if (value === undefined) {
            throw new Error("Configuration property '" + property + "' is not defined");
        }

        // Return the value
        return value;
    }

    /**
     * <p>Get a configuration value, or get defaultValue if no configuration value</p>
     * @param property
     * @param defaultValue value if property doesn't exist
     * @return {any}
     */
    getOrDefault(property:string, defaultValue:Object):any {
        try {
            return this.get(property)
        } catch (error) {
            logger.warn("PROPERTY NOT DEFINED :",property,", DEFAULT VALUE APPLY :", defaultValue);
            return defaultValue;
        }
    }

    /**
     * Test that a configuration parameter exists
     *
     *
     * @method has
     * @param property {string} - The configuration property to test. Can include '.' sub-properties.
     * @return isPresent {boolean} - True if the property is defined, false if not defined.
     */
    has(property:string):any {
        if (property === null || property === undefined) {
            return false;
        }

        return ConfigLib.getImpl(this._configObj, property) !== undefined;
    }


    /**
     * Underlying get mechanism
     *
     * @private
     * @method getImpl
     * @param object {object} - Object to get the property for
     * @param property {string | array[string]} - The property name to get (as an array or '.' delimited string)
     * @return value {mixed} - Property value, including undefined if not defined.
     */
    private static getImpl(object:any, property:any):any {
        var elems = Array.isArray(property) ? property : property.split('.');
        var name = elems[0];
        var value = object[name];
        if (elems.length <= 1) {
            return value;
        }
        if (typeof value !== "object") {
            return undefined;
        }
        return ConfigLib.getImpl(value, elems.slice(1));
    }
}
export = ConfigLib;