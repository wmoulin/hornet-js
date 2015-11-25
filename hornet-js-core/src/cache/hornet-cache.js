///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var OnionSkin = require("onionskin/src/browser");
var logger = utils.getLogger("hornet-js-core.cache.hornet-cache");
/**
 * Cache de l'aplication.
 * Voir documentation Onion Skin: http://onionskin.io/
 * */
var HornetCache = (function () {
    function HornetCache() {
        if (HornetCache._instance) {
            throw new Error("Error: Instantiation failed: Use HornetCache.getInstance() instead of new.");
        }
        var ephemeral = new OnionSkin.Drivers.Ephemeral();
        this.pool = new OnionSkin([ephemeral]);
        HornetCache._instance = this;
    }
    HornetCache.getInstance = function () {
        return HornetCache._instance;
    };
    /**
     * Item voir documentation de Onion Skin http://onionskin.io/api/
     * @param key clé de l'item
     * @returns {any} Item comme définis dans l'API de Onion Skin
     */
    HornetCache.prototype.getItem = function (key) {
        return this.pool.get(key);
    };
    /**
     * Mise en cache de la donnée passée en paramètre. Methode Asynchrone: Promise.
     * @param key clé de la valeur en cache
     * @param data données à mettre en cache
     * @param timetoliveInCache temps de sauvegarde de la données
     */
    HornetCache.prototype.miseEnCacheAsynchrone = function (key, data, timetoliveInCache) {
        return this.pool.getItem(key).set(data, timetoliveInCache);
    };
    HornetCache._instance = new HornetCache();
    return HornetCache;
})();
module.exports = HornetCache;
//# sourceMappingURL=hornet-cache.js.map