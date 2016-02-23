"use strict";

/**
 * Interface de typage des stores applicatifs pour l'utilisation des tableaux
 */
interface ITableStore {
    getAllResults(key:string):any;
    getFilters(key:string):any;
    getCriterias(key:string):any;
}

export = ITableStore;
