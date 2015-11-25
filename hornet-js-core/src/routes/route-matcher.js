///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.routes.router-matcher");
var RouteMatcher = (function () {
    function RouteMatcher() {
        this._routes = {};
        this._lazyRoutes = [];
    }
    Object.defineProperty(RouteMatcher.prototype, "routes", {
        get: function () {
            return this._routes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteMatcher.prototype, "lazyRoutes", {
        get: function () {
            return this._lazyRoutes;
        },
        enumerable: true,
        configurable: true
    });
    RouteMatcher.prototype.getMatcher = function (routeur, basePath) {
        var _this = this;
        if (basePath === void 0) { basePath = ""; }
        var matchFn = function (path, handler, method) {
            var _this = this;
            if (method === void 0) { method = "get"; }
            var realPath = path;
            if (!utils.isServer) {
                // Sur NodeJS le middleware express écoute déja sur le contextPath donc pas besoin de le remettre dans les routes
                // Par contre sur le client il faut le contextPath complet pour matcher les url
                realPath = basePath + path;
            }
            if (this.routes[realPath]) {
                throw new Error("Duplicate route name: " + realPath);
            }
            var methodArray = [method];
            methodArray.forEach(function (method) {
                if (utils.isServer) {
                    logger.debug("Pattern [", method, "] ", realPath);
                    if (!_this.routes[path]) {
                        _this.routes[path] = {};
                    }
                    _this.routes[path][method] = routeur.buildRouteHandler(handler);
                }
                else {
                    _this.routes[realPath] = routeur.buildRouteHandler(handler);
                }
            });
        }.bind(this);
        matchFn.lazy = function (path, fileToLoad) {
            if (utils.isServer) {
                logger.debug("Ajout route lazy:", path);
                //Sur le serveur on charge directement la route donc on va garder la liste des routes en mémoire
                _this._lazyRoutes.push({
                    path: path,
                    fileToLoad: fileToLoad
                });
            }
            else {
                var realPath = basePath + path;
                logger.debug("Ajout route lazy:", realPath);
                _this._routes[realPath + "/?((\w|.)*)"] = routeur.buildRouteHandler(function () {
                    return {
                        composant: "NOTHING",
                        lazyRoutesParam: {
                            fileToLoad: fileToLoad,
                            path: realPath
                        }
                    };
                });
            }
        };
        return matchFn;
    };
    return RouteMatcher;
})();
exports.RouteMatcher = RouteMatcher;
//# sourceMappingURL=route-matcher.js.map