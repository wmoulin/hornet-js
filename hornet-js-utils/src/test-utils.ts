/// <reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react/addons");
import register = require("src/common-register");
import _ = require("lodash");
import cheerio = require("cheerio");
import chai = require("chai");
import Log4jsNode = require("log4js");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import Logger = require("src/logger");

var testWrapper = require("src/components/test-wrapper");
chai.use(sinonChai);

var util = require("chai/lib/chai/utils/index.js");

class TestUtils {
    static DEBUG = true;
    static chai = chai;
    static sinon = sinon;

    static getLogger(category:string):Logger {
        return getLogger(category);
    }

    static _render(elementToRender, debug) {

        var result = React.renderToStaticMarkup(elementToRender), $;

        if (debug) {
            getLogger("TestUtil").debug("render: " + result);
        }

        $ = cheerio.load(result);
        return prepare($);
    }

    static render(getElementToRenderFn, context, debug) {
        // L'élément à rendre doit être créé dans la callback courante ("reactWithContextCb"),
        // sinon il n'aura pas le contexte passé en paramètre
        // Il n'est donc pas possible de le créer dans le TU directement
        return TestUtils._render(React.createElement(testWrapper, {
            context: context,
            elements: getElementToRenderFn
        }), debug);
    }

    static randomString(strLength?:number, charSet?:string) {
        var result = [];

        strLength = strLength || 5;
        charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        while (strLength--) {
            result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
        }

        return result.join("");
    }

    /**
     * Permet de démarrer une application Express sur le port premier port disponible à partir du port donné.
     * Si l'application a bien démarrée, la fonction done est appellée avec l'instance de serveur et le port utilisé.
     * Sinon, la fonction done est appellée
     *
     * @param app l'application Express
     * @param port Le port initialement souhaité
     * @param done la fonction à appeller lorsque l'application est démarré
     */
    static startExpressApp(app:any, port:number, done:(server:any, port:number, err:string)=>void):void {
        var logger = getLogger("TestUtil");
        var _port = port;
        var max = 10;

        function doStart() {
            var server = app && app.listen(_port, function () {
                    logger.debug("Serveur démarré sur le port", _port);
                    done(server, _port, undefined);
                })
                    .on("error", function errStart(err) {
                        if (err.code === "EADDRINUSE") {
                            if (max-- > 0) {
                                _port++;
                                logger.warn("Adresse déjà utilisée, nouvelle tentative avec le port", _port);
                                setTimeout(doStart, 250);
                            } else {
                                done(undefined, undefined, "Aucune adresse disponible dans la plage " + port + "-" + _port);
                            }
                        }
                    });
        }

        doStart();
    }
}

export = TestUtils;

var getLogger = (function () {
    var config = require.resolve("./log-config.json");
    console.log("log-config.json: " + config);
    Log4jsNode.configure(config);
    var LoggerBuilder = loggerBuilder(Log4jsNode, "TRACE");

    return function (category):Logger {
        console.log("category: " + category);
        var logger:Logger = register.getLogger(category, LoggerBuilder);
        logger.info("Configuré");
        return logger;
    };
})();

function loggerBuilder(log4jsNode:typeof Log4jsNode, logLevel:string) {
    return function (category) {
        this.log4jsLogger = log4jsNode.getLogger(category);
        this.log4jsLogger.setLevel(logLevel);
    }
}

/**
 * Enrichi l'objet $ fourni afin de réaliser l'intégration chai-jquery / cheerio
 * @param $
 * @returns {*|jQuery|HTMLElement}
 */
function prepare($) {
    $.fn = {};
    /**
     * jQuery.each
     *
     * @param obj
     * @param callback
     * @param args
     * @returns {*}
     */
    $.each = function (obj, callback, args) {
        _.forIn(obj, callback);

        return obj;
    };

    // Activation de chai-jquery
    require("chai-jquery")(chai, util, $);

    return $;
}

