///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExtendedPromise = require("hornet-js-utils/src/promise-api");
/**
 * Typage fort d'une ExtendedPromise en <ActionsChainData>
 *     Cela permet de forcer les actions à résoudre leurs promises qu'avec ce type d'objet
 *     cela garantit que l'objet véhiculé tout au long de la chaine des promises d'action reste bien un <ActionsChainData>
 */
var ActionExtendedPromise = (function (_super) {
    __extends(ActionExtendedPromise, _super);
    function ActionExtendedPromise() {
        _super.apply(this, arguments);
    }
    return ActionExtendedPromise;
})(ExtendedPromise);
module.exports = ActionExtendedPromise;
//# sourceMappingURL=action-extended-promise.js.map