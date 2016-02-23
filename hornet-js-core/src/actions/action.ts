"use strict";
import utils = require("hornet-js-utils");
import ActionsChainData = require("src/routes/actions-chain-data");
import ActionExtendedPromise = require("src/routes/action-extended-promise");
import ExtendedPromise = require("hornet-js-utils/src/promise-api");

var logger = utils.getLogger("hornet-js-core.actions.action");
var WError = utils.werror;

class Action<A extends ActionsChainData> {

    static ASYNCHRONOUS_REQUEST_START:string = "ASYNCHRONOUS_REQUEST_START";
    static ASYNCHRONOUS_REQUEST_END_SUCCESS:string = "ASYNCHRONOUS_REQUEST_END_SUCCESS";
    static ASYNCHRONOUS_REQUEST_END_ERROR:string = "ASYNCHRONOUS_REQUEST_END_ERROR";

    static EMIT_ERR_NOTIFICATION:string = "EMIT_ERR_NOTIFICATION";
    static EMIT_MODAL_NOTIFICATION:string = "EMIT_MODAL_NOTIFICATION";
    static REMOVE_ERR_NOTIFICATION:string = "REMOVE_ERR_NOTIFICATION";
    static EMIT_INFO_NOTIFICATION:string = "EMIT_INFO_NOTIFICATION";
    static REMOVE_INFO_NOTIFICATION:string = "REMOVE_INFO_NOTIFICATION";
    static REMOVE_MODAL_NOTIFICATION:string = "REMOVE_MODAL_NOTIFICATION";
    static REMOVE_ALL_ERR_NOTIFICATIONS:string = "REMOVE_ALL_ERR_NOTIFICATIONS";
    static REMOVE_ALL_INFO_NOTIFICATIONS:string = "REMOVE_ALL_INFO_NOTIFICATIONS";
    static REMOVE_ALL_MODAL_NOTIFICATIONS:string = "REMOVE_ALL_MODAL_NOTIFICATIONS";
    static REMOVE_ALL_NOTIFICATIONS:string = "REMOVE_ALL_NOTIFICATIONS";

    actionContext:ActionContext;
    payload:any;
    actionChainData:A;
    private resolve:(obj:any) => void;
    private reject:(obj:any) => void;

    constructor() {
        // do nothing
    }

    getInstance(Api:any, ...args) {
        var builderFn = Action.serviceConstructor(Api);
        var serviceArgs = [this.actionContext].concat(args);
        return builderFn.apply(builderFn, serviceArgs);
    }

    static serviceConstructor(Api:any) {
        function F(args) {
            Api.apply(this, args);
        }

        F.prototype = Api.prototype;
        return function () {
            return new F(arguments);
        }
    }

    withContext(actionContext:ActionContext) {
        this.actionContext = actionContext;
        return this;
    }

    withPayload(payload?:any) {
        this.payload = payload;
        return this;
    }

    /**
     * Retourne une action Hornet, sous forme de promise.
     * Cette méthode est appelée par le routeur lors du chainage des actions déclarées dans les routes
     */
    promise(actionsChainData:A) {
        this.actionChainData = actionsChainData;
        return new ActionExtendedPromise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            // Emission de l'event de démarrage d'une action
            this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_START);
            try {
                this.execute(this._resolveFn.bind(this), this._rejectFn.bind(this));
            } catch (err) {
                /* On doit gérer ici les exceptions non prévues, de façon à signaler l'arrêt de l'action via le message ASYNCHRONOUS_REQUEST_END_SUCCESS et à transmettre actionChainData aux promises suivantes dans la chaîne */
                var errorMess:string = "Action : erreur technique : " + err.message;
                logger.error(errorMess);
                var error = new WError(err, errorMess);
                error.name = " ";
                this._rejectFn(error);
            }
        });
    }

    execute(resolve:(data?:A)=>void, reject:(error:any)=>void) {
    }

    _resolveFn(data?:A) {
        // Emission de l'event de fin OK d'une action
        this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_SUCCESS);

        if (data) {
            this.actionChainData = data;
        }
        this.resolve(this.actionChainData);
    }

    _rejectFn(error:any) {

        // Emission de l'event de fin KO d'une action
        this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_ERROR, error);

        if (error) {
            if (error.name === "WError") {
                error.name = " ";  // permet d'eviter d'avoir WError dans les messages de notification
            }
            this.actionChainData.lastError = error;
            if (error && error.we_cause && error.we_cause.response && error.we_cause.response.body) {
                // On récupère le corps de la réponse potentiellement présent dans le retour de l'API
                this.actionChainData.result = error.we_cause.response.body;
            }
        }
        this.reject(this.actionChainData);
    }

    /**
     * Retourne une action au sens Fluxible, c'est à dire une fonction prenant en parametres : (actionContext, payload, (callback))
     * Il s'agit enfait de la promise encapsulée
     * Cette action "fluxible" ainsi créée est à utiliser dans la méthode fluxible "executeAction(->action<-, ...)"
     *
     * Exemple :
     *
     * this.executeAction(new MonAction().action(), payload, cb)
     */
    action() {
        return (actionContext:ActionContext, payload:any = {}, cb:(value?:any) => void = () => {}) =>(
            this.withContext(actionContext)
                .withPayload(payload)
                .promise(<A>new ActionsChainData())
                .then(() => cb(), cb)
        );
    }
}

export = Action;
