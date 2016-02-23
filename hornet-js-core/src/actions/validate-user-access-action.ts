"use strict";

import Action = require("src/actions/action");
import ActionsChainData = require("src/routes/actions-chain-data");
import utils = require("hornet-js-utils");
import PageInformationsStore = require("src/stores/page-informations-store");

var _ = utils._;
var logger = utils.getLogger("hornet-js-core.actions.validate-user-action");

class ValidateUserAccessAction extends Action<ActionsChainData> {

    execute(resolve, reject) {
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
        } catch (error) {
            reject(error);
        }
        resolve();
    }
}
export = ValidateUserAccessAction;
