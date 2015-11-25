///<reference path='../../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

/**
 * Interface de typage des stores applicatifs pour l'utilisation des tableaux
 */
interface ITableStore{
    getAllResults():any;
    getFilters():any;
    getCriterias():any;
}

export = ITableStore;
