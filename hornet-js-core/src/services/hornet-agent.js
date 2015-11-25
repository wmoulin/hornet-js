///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
var superagent = require("superagent");
var utils = require("hornet-js-utils");
var superAgentPlugins = require("src/services/superagent-hornet-plugins");
var WError = utils.werror;
var _ = utils._;
var logger = utils.getLogger("hornet-js-core.services.hornet-agent");
/**
 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
 */
var HornetAgent = (function () {
    function HornetAgent() {
        //enable\disable le cache pour cette requête
        this.enableCache = false;
    }
    /**
     * Active le cache sur les méthodes GET de hornetAgent.
     * SI pas de paramètre la durée de vie est celle de l'application
     * @param timeToliveInCache_ durée de mise en cache en SECONDE. si rien est passé le temps moyen est celui définis dans le fichier de configuration
     * @returns {HornetAgent} ce même objet
     */
    HornetAgent.prototype.cache = function (timeToliveInCache) {
        var globalCacheActivated = utils.config.getOrDefault("cache.enabled", true);
        if (globalCacheActivated) {
            this.enableCache = true;
            if (_.isNumber(timeToliveInCache)) {
                this.timetoliveInCache = timeToliveInCache;
            }
            else {
                this.timetoliveInCache = utils.config.getOrDefault("cache.timetolive", 3600);
            }
            logger.debug("Activation du cache pour", this.timetoliveInCache, "s");
        }
        else {
            logger.warn("Cache de requêtes désactivé, l'appel à cette méthode n'active donc PAS le cache");
        }
        return this;
    };
    /**
     * Encapsule les appels aux méthodes superagent
     * @param method
     * @param url
     * @param callback
     * @returns {any|NodeJS.EventEmitter|SinonExpectation|"events".EventEmitter|"domain".Domain}
     * @private
     */
    HornetAgent.prototype._callSuperAgent = function (method, url, callback) {
        var superAgentRequest = this._callSuperAgentMethod(method, url, callback);
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
    };
    /**
     * Appel la méthode de super agent passée en paramètre
     * @param method méthode HTTP: get...
     * @param url url appelée
     * @param callback  callback
     */
    HornetAgent.prototype._callSuperAgentMethod = function (method, url, callback) {
        return superagent[method].call(superagent, url, callback);
    };
    /**
     * Redéfinition des méthodes superagent
     *
     * @param url
     * @param callback
     * @returns {HornetSuperAgentRequest}
     */
    HornetAgent.prototype.get = function (url, callback) {
        return this._callSuperAgent("get", url, callback);
    };
    HornetAgent.prototype.post = function (url, callback) {
        return this._callSuperAgent("post", url, callback);
    };
    HornetAgent.prototype.put = function (url, callback) {
        return this._callSuperAgent("put", url, callback);
    };
    HornetAgent.prototype.head = function (url, callback) {
        return this._callSuperAgent("head", url, callback);
    };
    HornetAgent.prototype.del = function (url, callback) {
        return this._callSuperAgent("del", url, callback);
    };
    HornetAgent.prototype.options = function (url, callback) {
        return this._callSuperAgent("options", url, callback);
    };
    HornetAgent.prototype.patch = function (url, callback) {
        return this._callSuperAgent("patch", url, callback);
    };
    HornetAgent.prototype.connect = function (url, callback) {
        return this._callSuperAgent("connect", url, callback);
    };
    return HornetAgent;
})();
module.exports = HornetAgent;
//# sourceMappingURL=hornet-agent.js.map