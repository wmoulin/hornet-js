///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseStore = require("fluxible/addons/BaseStore");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.stores.flux-informations-store");
/**
 * Store contenant des informations en lien avec le pattern Flux (état des actions, etc...)
 */
var FluxInformationsStore = (function (_super) {
    __extends(FluxInformationsStore, _super);
    function FluxInformationsStore(dispatcher) {
        _super.call(this, dispatcher);
        this.currentExecutingActionsNumber = 0;
    }
    /**
     * Retourne true si au moins une action est en cours d'exécution
     */
    FluxInformationsStore.prototype.hasActionsRunning = function () {
        return this.currentExecutingActionsNumber > 0;
    };
    FluxInformationsStore.storeName = "FluxInformationsStore";
    FluxInformationsStore.handlers = {
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
    };
    return FluxInformationsStore;
})(BaseStore);
module.exports = FluxInformationsStore;
//# sourceMappingURL=flux-informations-store.js.map