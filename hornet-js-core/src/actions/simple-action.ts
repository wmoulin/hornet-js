///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Action = require("src/actions/action");
import ActionsChainData = require("src/routes/actions-chain-data");

var logger = utils.getLogger("hornet-js-core.actions.simple-action");

class SimpleAction extends Action<ActionsChainData> {

    static CHANGE_URL:string = "CHANGE_URL";
    static CHANGE_PAGE_COMPONENT:string = "CHANGE_PAGE_COMPONENT";
    static CHANGE_THEME:string = "CHANGE_THEME";
    static RECEIVE_MENU_CONFIG:string = "RECEIVE_MENU_CONFIG";

    key:string = "";

    constructor(key:string) {
        super();
        if (key) {
            this.key = key;
        }
        else {
            throw new Error("SimpleAction cannot dispatch an empty key string");
        }
    }

    execute(resolve, reject) {
        logger.trace("actionContext.dispatch", this.getDispatchKey());
        this.actionContext.dispatch(this.getDispatchKey(), this.payload);
        resolve();
    }

    getDispatchKey():string {
        if (!this.key) {
            throw new Error("SimpleAction cannot dispatch an empty key string");
        }
        else {
            return this.key;
        }
    }
}
export = SimpleAction;

