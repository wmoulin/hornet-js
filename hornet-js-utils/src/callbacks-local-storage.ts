///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

var ContinuationLocalStorage = require("continuation-local-storage");

class callbacksLocalStorage {

    static defaultLocalStorage:string = "HornetLocalStorage";

    /**
     * Fonction retournant Le localstorage hornet ou un storage applicatif
     * @param localStorageName Nom du localStorage, par défaut HornetLocalStorage
     * @return {boolean}
     */
    static getStorage(localStorageName:string = callbacksLocalStorage.defaultLocalStorage):any {
        return ContinuationLocalStorage.getNamespace(localStorageName) || ContinuationLocalStorage.createNamespace(localStorageName);
    }
}

export = callbacksLocalStorage;