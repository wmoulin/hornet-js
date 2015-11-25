/// <reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var React = require("react/addons");
var register = require("src/common-register");
var _ = require("lodash");
var cheerio = require("cheerio");
var chai = require("chai");
var Log4jsNode = require("log4js");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var testWrapper = require("src/components/test-wrapper");
chai.use(sinonChai);
var util = require("chai/lib/chai/utils/index.js");
var TestUtils = (function () {
    function TestUtils() {
    }
    TestUtils.getLogger = function (category) {
        return getLogger(category);
    };
    TestUtils._render = function (elementToRender, debug) {
        var result = React.renderToStaticMarkup(elementToRender), $;
        if (debug) {
            getLogger("TestUtil").debug("render: " + result);
        }
        $ = cheerio.load(result);
        return prepare($);
    };
    TestUtils.render = function (getElementToRenderFn, context, debug) {
        // L'élément à rendre doit être créé dans la callback courante ("reactWithContextCb"),
        // sinon il n'aura pas le contexte passé en paramètre
        // Il n'est donc pas possible de le créer dans le TU directement
        return TestUtils._render(React.createElement(testWrapper, {
            context: context,
            elements: getElementToRenderFn
        }), debug);
    };
    TestUtils.randomString = function (strLength, charSet) {
        var result = [];
        strLength = strLength || 5;
        charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        while (strLength--) {
            result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
        }
        return result.join("");
    };
    /**
     * Permet de démarrer une application Express sur le port premier port disponible à partir du port donné.
     * Si l'application a bien démarrée, la fonction done est appellée avec l'instance de serveur et le port utilisé.
     * Sinon, la fonction done est appellée
     *
     * @param app l'application Express
     * @param port Le port initialement souhaité
     * @param done la fonction à appeller lorsque l'application est démarré
     */
    TestUtils.startExpressApp = function (app, port, done) {
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
                    }
                    else {
                        done(undefined, undefined, "Aucune adresse disponible dans la plage " + port + "-" + _port);
                    }
                }
            });
        }
        doStart();
    };
    TestUtils.DEBUG = true;
    TestUtils.chai = chai;
    TestUtils.sinon = sinon;
    return TestUtils;
})();
var getLogger = (function () {
    var config = require.resolve("./log-config.json");
    console.log("log-config.json: " + config);
    Log4jsNode.configure(config);
    var LoggerBuilder = loggerBuilder(Log4jsNode, "TRACE");
    return function (category) {
        console.log("category: " + category);
        var logger = register.getLogger(category, LoggerBuilder);
        logger.info("Configuré");
        return logger;
    };
})();
function loggerBuilder(log4jsNode, logLevel) {
    return function (category) {
        this.log4jsLogger = log4jsNode.getLogger(category);
        this.log4jsLogger.setLevel(logLevel);
    };
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
module.exports = TestUtils;
//# sourceMappingURL=test-utils.js.map