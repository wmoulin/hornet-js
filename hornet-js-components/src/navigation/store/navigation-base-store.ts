///<reference path="../../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.navigation.store.navigation-base-store");

import BaseStore = require("fluxible/addons/BaseStore");

class NavigationBaseStore extends BaseStore {

    static storeName:string = "NavigationBaseStore";

    private menuItems:any;

    static handlers:any = {
        "RECEIVE_MENU_CONFIG": function (res) {
            logger.trace("Nouvelle configuration de menu reçue");
            this.menuItems = res;
            this.emitChange();
        }
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.menuItems = {};
    }

    getConfigMenu():any {
        return this.menuItems;
    }

    rehydrate(state:any) {
        this.menuItems = state.menuItems;
    }

    dehydrate():any {
        return {
            menuItems: this.menuItems
        }
    }
}

export = NavigationBaseStore;