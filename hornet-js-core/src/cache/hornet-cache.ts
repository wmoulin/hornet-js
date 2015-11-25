///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Bluebird = require("bluebird");

var OnionSkin = require("onionskin/src/browser");
var logger = utils.getLogger("hornet-js-core.cache.hornet-cache");

/**
 * Cache de l'aplication.
 * Voir documentation Onion Skin: http://onionskin.io/
 * */
class HornetCache {

    private static _instance:HornetCache = new HornetCache();

    private pool:any;

    constructor() {
        if (HornetCache._instance) {
            throw new Error("Error: Instantiation failed: Use HornetCache.getInstance() instead of new.");
        }
        var ephemeral = new OnionSkin.Drivers.Ephemeral();
        this.pool = new OnionSkin([ephemeral]);

        HornetCache._instance = this;
    }

    public static getInstance():HornetCache {
        return HornetCache._instance;
    }

    /**
     * Item voir documentation de Onion Skin http://onionskin.io/api/
     * @param key clé de l'item
     * @returns {any} Item comme définis dans l'API de Onion Skin
     */
    getItem(key:string):Bluebird<any> {
        return this.pool.get(key);
    }

    /**
     * Mise en cache de la donnée passée en paramètre. Methode Asynchrone: Promise.
     * @param key clé de la valeur en cache
     * @param data données à mettre en cache
     * @param timetoliveInCache temps de sauvegarde de la données
     */
    miseEnCacheAsynchrone(key:string, data:any, timetoliveInCache?:number):Bluebird<any> {
        return this.pool.getItem(key).set(data, timetoliveInCache);
    }
}

export = HornetCache;
