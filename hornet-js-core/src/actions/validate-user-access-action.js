///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Action = require("src/actions/action");
var utils = require("hornet-js-utils");
var PageInformationsStore = require("src/stores/page-informations-store");
var _ = utils._;
var logger = utils.getLogger("hornet-js-core.actions.validate-user-action");
var ValidateUserAccessAction = (function (_super) {
    __extends(ValidateUserAccessAction, _super);
    function ValidateUserAccessAction() {
        _super.apply(this, arguments);
    }
    ValidateUserAccessAction.prototype.execute = function (resolve, reject) {
        try {
            // Gestion de l'insertion dans le store si besoin
            if (_.isObject(this.payload.user)) {
                logger.debug("Insertion de l'utilisateur", this.payload.user, "dans le store");
                this.actionContext.dispatch("CHANGE_LOGGED_USER", this.payload.user);
            }
            // Gestion de la validation si besoin
            if (_.isArray(this.payload.accessRetrictedToRoles)) {
                logger.debug("Route avec restriction d'accès sur les rôles:", this.payload.accessRetrictedToRoles);
                var store = this.actionContext.getStore(PageInformationsStore);
                this.actionChainData.isAccessForbidden = !store.userHasRole(this.payload.accessRetrictedToRoles);
                if (this.actionChainData.isAccessForbidden) {
                    logger.debug("Rejet de la promise car accès interdit à la ressource");
                    reject();
                    return;
                }
            }
        }
        catch (error) {
            reject(error);
        }
        resolve();
    };
    return ValidateUserAccessAction;
})(Action);
module.exports = ValidateUserAccessAction;
//# sourceMappingURL=validate-user-access-action.js.map