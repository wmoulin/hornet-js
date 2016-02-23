"use strict";

import BaseStore = require("fluxible/addons/BaseStore");

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.stores.flux-informations-store");

/**
 * Store contenant des informations en lien avec le pattern Flux (état des actions, etc...)
 */
class FluxInformationsStore extends BaseStore {

    static storeName:string = "FluxInformationsStore";

    private currentExecutingActionsNumber:number;

    static handlers:any = {
        "ASYNCHRONOUS_REQUEST_START": function () {
            logger.trace("Demarrage d'une action");
            this.currentExecutingActionsNumber++;
            logger.trace("Nb actions en cours:", this.currentExecutingActionsNumber);
            this.emitChange();
        },
        "ASYNCHRONOUS_REQUEST_END_SUCCESS": function () {
            logger.trace("Fin d'une action en succès");
            this.currentExecutingActionsNumber--;
            logger.trace("Nb actions en cours:", this.currentExecutingActionsNumber);
            this.emitChange();
        },
        "ASYNCHRONOUS_REQUEST_END_ERROR": function () {
            logger.trace("Fin d'une action en erreur");
            this.currentExecutingActionsNumber--;
            logger.trace("Nb actions en cours:", this.currentExecutingActionsNumber);
            this.emitChange();
        }
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.currentExecutingActionsNumber = 0;
    }

    /**
     * Retourne true si au moins une action est en cours d'exécution
     */
    hasActionsRunning():boolean {
        return this.currentExecutingActionsNumber > 0;
    }
}

export = FluxInformationsStore;
