///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require("hornet-js-utils");
var Action = require("src/actions/action");
var logger = utils.getLogger("hornet-js-core.actions.simple-action");
var SimpleAction = (function (_super) {
    __extends(SimpleAction, _super);
    function SimpleAction(key) {
        _super.call(this);
        this.key = "";
        if (key) {
            this.key = key;
        }
        else {
            throw new Error("SimpleAction cannot dispatch an empty key string");
        }
    }
    SimpleAction.prototype.execute = function (resolve, reject) {
        logger.trace("actionContext.dispatch", this.getDispatchKey());
        this.actionContext.dispatch(this.getDispatchKey(), this.payload);
        resolve();
    };
    SimpleAction.prototype.getDispatchKey = function () {
        if (!this.key) {
            throw new Error("SimpleAction cannot dispatch an empty key string");
        }
        else {
            return this.key;
        }
    };
    SimpleAction.CHANGE_URL = "CHANGE_URL";
    SimpleAction.CHANGE_PAGE_COMPONENT = "CHANGE_PAGE_COMPONENT";
    SimpleAction.CHANGE_THEME = "CHANGE_THEME";
    SimpleAction.RECEIVE_MENU_CONFIG = "RECEIVE_MENU_CONFIG";
    return SimpleAction;
})(Action);
module.exports = SimpleAction;
//# sourceMappingURL=simple-action.js.map