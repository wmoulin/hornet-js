"use strict";
import superagent = require("superagent");
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");
import utils = require("hornet-js-utils");

import superAgentPlugins = require("src/services/superagent-hornet-plugins");

var _ = utils._;
var logger = utils.getLogger("hornet-js-core.services.hornet-agent");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// wrap http & https afin de sécuriser l'utilisation de "continuation-local-storage" (perte ou mix de contexte) //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var http = require("http");
var https = require("https");

var _old_http_request = http.request;
var _old_https_request = https.request;

http.request = function() {
    var req = _old_http_request.apply(http, arguments);
    utils.getContinuationStorage().bindEmitter(req);
    return req;
};

https.request = function() {
    var req = _old_https_request.apply(https, arguments);
    utils.getContinuationStorage().bindEmitter(req);
    return req;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
 */
class HornetAgent<T extends HornetSuperAgentRequest> {

    // enable\disable le cache pour cette requête
    private enableCache:boolean = false;

    // défini le temps de mis en cache
    private timetoliveInCache:number;

    /**
     * Active le cache sur les méthodes GET de hornetAgent.
     * SI pas de paramètre la durée de vie est celle de l'application
     * @param timeToliveInCache_ durée de mise en cache en SECONDE. si rien est passé le temps moyen est celui définis dans le fichier de configuration
     * @returns {HornetAgent} ce même objet
     */
    cache(timeToliveInCache?:number):HornetAgent<T> {
        var globalCacheActivated = utils.config.getOrDefault("cache.enabled", true);

        if (globalCacheActivated) {
            this.enableCache = true;
            if (_.isNumber(timeToliveInCache)) {
                this.timetoliveInCache = timeToliveInCache;
            } else {
                this.timetoliveInCache = utils.config.getOrDefault("cache.timetolive", 3600);
            }
            logger.debug("Activation du cache pour", this.timetoliveInCache, "s");
        } else {
            logger.warn("Cache de requêtes désactivé, l'appel à cette méthode n'active donc PAS le cache");
        }
        return this;
    }

    /**
     * Encapsule les appels aux méthodes superagent
     * @param method
     * @param url
     * @param callback
     * @returns {any|NodeJS.EventEmitter|SinonExpectation|"events".EventEmitter|"domain".Domain}
     * @private
     */
    protected _callSuperAgent(method:string, url:string, callback?:any):T {
        var superAgentRequest:any = this._callSuperAgentMethod(method, url, callback);

        if (this.enableCache) {
            // Ce plugin doit être en première position car il redéfini des méthodes (set par exemple) qui sont utilisées par les plugins suivants et la méthode 'accept'
            superAgentRequest.use(superAgentPlugins.CachePlugin(this.timetoliveInCache));
        }

        superAgentRequest.accept("json");

        if (!utils.isServer) {
            superAgentRequest.set("X-Requested-With", "XMLHttpRequest");
            // Correction Bug IE Afin de pallier au problème de cache sur les services:
            superAgentRequest.use(superAgentPlugins.noCacheIEPlugin);

            superAgentRequest.use(superAgentPlugins.CsrfPlugin);
            superAgentRequest.use(superAgentPlugins.RedirectToLoginPagePlugin);
        }

        superAgentRequest.use(superAgentPlugins.addParamFromLocalStorage("tid"));
        superAgentRequest.use(superAgentPlugins.addParamFromLocalStorage("user"));

        return superAgentRequest;
    }

    /**
     * Appel la méthode de super agent passée en paramètre
     * @param method méthode HTTP: get...
     * @param url url appelée
     * @param callback  callback
     */
    protected _callSuperAgentMethod(method:string, url:string, callback?:any):T {
        var req = superagent[method].call(superagent, url, callback);
        // Surcharge préventive de superagent afin de lancer "abort()" avant de lever une erreur afin d'éviter l'erreur "double callback"
        var _oldEndFn = req.end;
        req.end = function(fn) {
            return _oldEndFn.call(req, function(err, res) {
                try {
                    fn.call(req, err, res);
                } catch (err) {
                    req.abort();
                    throw err;
                }
            });
        };
        return req;
    }

    /**
     * Redéfinition des méthodes superagent
     *
     * @param url
     * @param callback
     * @returns {HornetSuperAgentRequest}
     */
    get(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("get", url, callback);
    }

    post(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("post", url, callback)
    }

    put(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("put", url, callback)
    }

    head(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("head", url, callback);
    }

    del(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("del", url, callback);
    }

    options(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("options", url, callback);
    }

    patch(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("patch", url, callback);
    }

    connect(url:string, callback?:(err:Error, res:superagent.Response) => void):T {
        return this._callSuperAgent("connect", url, callback);
    }
}

export = HornetAgent;
