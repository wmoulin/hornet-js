///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import RouterAbstract = require("src/routes/router-abstract");
import I = require("src/routes/router-interfaces");
import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.routes.router-matcher");

export class RouteMatcher {
    private _routes:any = {};
    private _lazyRoutes:I.LazyRouteParam[] = [];

    get routes():any {
        return this._routes;
    }

    get lazyRoutes():I.LazyRouteParam[] {
        return this._lazyRoutes;
    }

    getMatcher(routeur:RouterAbstract, basePath:string = "") {
        var matchFn = <I.MatchFn>function (path:string, handler:I.IRouteHandler, method:string = "get") {

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
            methodArray.forEach((method) => {
                if (utils.isServer) {
                    logger.debug("Pattern [", method, "] ", realPath);

                    if (!this.routes[path]) {
                        this.routes[path] = {};
                    }
                    this.routes[path][method] = routeur.buildRouteHandler(handler);
                } else {
                    this.routes[realPath] = routeur.buildRouteHandler(handler);
                }
            });
        }.bind(this);

        matchFn.lazy = (path:string, fileToLoad:string) => {
            if (utils.isServer) {
                logger.debug("Ajout route lazy:", path);
                //Sur le serveur on charge directement la route donc on va garder la liste des routes en mémoire
                this._lazyRoutes.push({
                    path: path,
                    fileToLoad: fileToLoad
                });
            } else {
                var realPath = basePath + path;
                logger.debug("Ajout route lazy:", realPath);
                this._routes[realPath + "/?((\w|.)*)"] = routeur.buildRouteHandler(
                    <I.IRouteHandler>function () {
                        return <I.IRoutesInfos>{
                            composant: "NOTHING",
                            lazyRoutesParam: {
                                fileToLoad: fileToLoad,
                                path: realPath
                            }
                        }
                    }
                );
            }
        };
        return matchFn;
    }
}