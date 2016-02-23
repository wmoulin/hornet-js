"use strict";

import Register = require("src/common-register");

class BrowserNameSpace {
    content:any = {};

    get(key:string) {
        return this.content[key];
    }

    set(key:string, value:any) {
        this.content[key] = value;
    }
}

class BrowserContinuationLocalStorage {
    static NAMESPACES:any = {};

    /**
     * Fonction retournant un namespace, peut-être undefined si le namespace n'existe pas
     * @param localStorageName Nom du localStorage
     * @return {any}
     */
    static getNamespace(localStorageName:string):any {
        return BrowserContinuationLocalStorage.NAMESPACES[localStorageName];
    }


    /**
     * Fonction créant et retournant un namespace
     * @param localStorageName Nom du localStorage
     * @return {any}
     */
    static createNamespace(localStorageName:string):any {
        var ns = new BrowserNameSpace();
        BrowserContinuationLocalStorage.NAMESPACES[localStorageName] = ns;
        return ns;
    }
}

class ContinuationLocalStorage {
    /**
     * Fonction retournant le continuationlocalstorage hornet ou un storage applicatif
     * @param localStorageName Nom du localStorage, par défaut HornetContinuationLocalStorage
     * @return {any}
     */
    static getContinuationStorage(localStorageName:string = "HornetContinuationLocalStorage"):any {
        var cls;
        if (Register.isServer) {
            cls = require("continuation-local-storage");
        } else {
            cls = BrowserContinuationLocalStorage;
        }

        return cls.getNamespace(localStorageName) || cls.createNamespace(localStorageName);
    }
}

export = ContinuationLocalStorage;
