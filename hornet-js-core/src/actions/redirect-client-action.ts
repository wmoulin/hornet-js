///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import Action = require("src/actions/action");
import ActionsChainData = require("src/routes/actions-chain-data");
import utils = require("hornet-js-utils");

var logger = utils.getLogger("hornet-js-core.actions.redirect-client");

/**
 * Action permettant de faire rediriger le client vers une url (payload) tout en restant sur la page courante (changement de la barre d'adresse).
 */
class RedirectClientAction extends Action<ActionsChainData> {
    /**
     * Effectue la redirection client.
     * payload : url de redirection
     *
     * @param resolve
     * @param reject
     */
    execute(resolve, reject) {
        try {
            if (utils.isServer) {
                reject("Cette action ne peut pas être utilisée côté serveur");
            } else {
                var url = utils.buildContextPath(this.payload);
                logger.debug("Redirection vers l'url:", url);
                (<any>window).routeur.setRoute(url);
            }
        } catch (error) {
            reject(error);
        }
        resolve();
    }
}
export = RedirectClientAction;
