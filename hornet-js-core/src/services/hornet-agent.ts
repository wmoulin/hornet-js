///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
import superagent = require("superagent");
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");
import utils = require("hornet-js-utils");
import HornetCache = require("src/cache/hornet-cache");

import superAgentPlugins = require("src/services/superagent-hornet-plugins");

var WError = utils.werror;
var _ = utils._;
var logger = utils.getLogger("hornet-js-core.services.hornet-agent");

/**
 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
 */
class HornetAgent<T extends HornetSuperAgentRequest> {

    //enable\disable le cache pour cette requête
    private enableCache:boolean = false;

    //défini le temps de mis en cache
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
            superAgentRequest.use(superAgentPlugins.MiseEnCachePlugin(this.timetoliveInCache));
        }

        superAgentRequest.accept("json");

        superAgentRequest.use(superAgentPlugins.CsrfPlugin);
        superAgentRequest.use(superAgentPlugins.RedirectToLoginPagePlugin);
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
        return superagent[method].call(superagent, url, callback);
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