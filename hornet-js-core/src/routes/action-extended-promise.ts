"use strict";
import ExtendedPromise = require("hornet-js-utils/src/promise-api");
import ActionsChainData = require("src/routes/actions-chain-data");

/**
 * Typage fort d'une ExtendedPromise en <ActionsChainData>
 *     Cela permet de forcer les actions à résoudre leurs promises qu'avec ce type d'objet
 *     cela garantit que l'objet véhiculé tout au long de la chaine des promises d'action reste bien un <ActionsChainData>
 */
class ActionExtendedPromise extends ExtendedPromise<ActionsChainData> {

}

export = ActionExtendedPromise;
