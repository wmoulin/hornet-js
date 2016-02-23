"use strict";

var fs = require("fs");
var JSON5 = require("json5");

class JSONLoader {

    /**
     * Surcharge JSON.parse en permettant l'utilisation du format JSON5.
     */
    static allowJSON5() {
        if (!JSON["__oldParse"]) {
            // autorise les : require("monFichierJson") avec extension .json5
            require("json5/lib/require");

            // surcharge JSON.parse
            JSON["__oldParse"] = JSON.parse;
            JSON.parse = function () {
                try {
                    return JSON["__oldParse"].apply(JSON, arguments);
                } catch (e) {
                    return JSON5.parse.apply(JSON5, arguments);
                }
            };
        }
    }

    /**
     * Charge un fichier JSON avec son path
     * @param filePath le chemin vers le fichier JSON
     * @param encoding encoding du fichier, defaut: UTF-8
     * @returns {any}
     */
    static load(filePath:string, encoding:string = "UTF-8"):any {
        var jsonString,
            jsonObject;

        // On tente de charger le fichier avec l'encoding choisi
        try {
            jsonString = fs.readFileSync(filePath, encoding);
            jsonString = jsonString.replace(/^\uFEFF/, "");
        } catch (e) {
            throw new Error("JSON file '" + filePath + "' cannot be read : " + e);
        }

        // On parse le json en object
        jsonObject = JSON.parse(jsonString);

        return jsonObject;
    }
}

export = JSONLoader;
