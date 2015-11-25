///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var ActionsChainData = require("src/routes/actions-chain-data");
var ActionExtendedPromise = require("src/routes/action-extended-promise");
var logger = utils.getLogger("hornet-js-core.actions.action");
var WError = utils.werror;
var Action = (function () {
    function Action() {
        // do nothing
    }
    Action.prototype.getInstance = function (Api) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var builderFn = Action.serviceConstructor(Api);
        var serviceArgs = [this.actionContext].concat(args);
        return builderFn.apply(builderFn, serviceArgs);
    };
    Action.serviceConstructor = function (Api) {
        function F(args) {
            Api.apply(this, args);
        }
        F.prototype = Api.prototype;
        return function () {
            return new F(arguments);
        };
    };
    Action.prototype.withContext = function (actionContext) {
        this.actionContext = actionContext;
        return this;
    };
    Action.prototype.withPayload = function (payload) {
        this.payload = payload;
        return this;
    };
    /**
     * Retourne une action Hornet, sous forme de promise.
     * Cette méthode est appelée par le routeur lors du chainage des actions déclarées dans les routes
     */
    Action.prototype.promise = function (actionsChainData) {
        var _this = this;
        this.actionChainData = actionsChainData;
        return new ActionExtendedPromise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
            // Emission de l'event de démarrage d'une action
            _this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_START);
            try {
                _this.execute(_this._resolveFn.bind(_this), _this._rejectFn.bind(_this));
            }
            catch (err) {
                /* On doit gérer ici les exceptions non prévues, de façon à signaler l'arrêt de l'action via le message ASYNCHRONOUS_REQUEST_END_SUCCESS et à transmettre actionChainData aux promises suivantes dans la chaîne */
                _this._rejectFn(new WError(err, "Action : erreur technique : " + err.message));
            }
        });
    };
    Action.prototype.execute = function (resolve, reject) {
    };
    Action.prototype._resolveFn = function (data) {
        // Emission de l'event de fin OK d'une action
        this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_SUCCESS);
        if (data) {
            this.actionChainData = data;
        }
        this.resolve(this.actionChainData);
    };
    Action.prototype._rejectFn = function (error) {
        // Emission de l'event de fin KO d'une action
        this.actionContext.dispatch(Action.ASYNCHRONOUS_REQUEST_END_ERROR, error);
        if (error) {
            this.actionChainData.lastError = error;
            if (error && error.we_cause && error.we_cause.response && error.we_cause.response.body) {
                // On récupère le corps de la réponse potentiellement présent dans le retour de l'API
                this.actionChainData.result = error.we_cause.response.body;
            }
        }
        this.reject(this.actionChainData);
    };
    /**
     * Retourne une action au sens Fluxible, c'est à dire une fonction prenant en parametres : (actionContext, payload, (callback))
     * Il s'agit enfait de la promise encapsulée
     * Cette action "fluxible" ainsi créée est à utiliser dans la méthode fluxible "executeAction(->action<-, ...)"
     *
     * Exemple :
     *
     * this.executeAction(new MonAction().action(), payload, cb)
     */
    Action.prototype.action = function () {
        var _this = this;
        return function (actionContext, payload, cb) { return (_this.withContext(actionContext)
            .withPayload(payload)
            .promise(new ActionsChainData())
            .then(function () { return cb(); }, cb)); };
    };
    Action.ASYNCHRONOUS_REQUEST_START = "ASYNCHRONOUS_REQUEST_START";
    Action.ASYNCHRONOUS_REQUEST_END_SUCCESS = "ASYNCHRONOUS_REQUEST_END_SUCCESS";
    Action.ASYNCHRONOUS_REQUEST_END_ERROR = "ASYNCHRONOUS_REQUEST_END_ERROR";
    Action.EMIT_ERR_NOTIFICATION = "EMIT_ERR_NOTIFICATION";
    Action.EMIT_MODAL_NOTIFICATION = "EMIT_MODAL_NOTIFICATION";
    Action.REMOVE_ERR_NOTIFICATION = "REMOVE_ERR_NOTIFICATION";
    Action.EMIT_INFO_NOTIFICATION = "EMIT_INFO_NOTIFICATION";
    Action.REMOVE_INFO_NOTIFICATION = "REMOVE_INFO_NOTIFICATION";
    Action.REMOVE_MODAL_NOTIFICATION = "REMOVE_MODAL_NOTIFICATION";
    Action.REMOVE_ALL_ERR_NOTIFICATIONS = "REMOVE_ALL_ERR_NOTIFICATIONS";
    Action.REMOVE_ALL_INFO_NOTIFICATIONS = "REMOVE_ALL_INFO_NOTIFICATIONS";
    Action.REMOVE_ALL_MODAL_NOTIFICATIONS = "REMOVE_ALL_MODAL_NOTIFICATIONS";
    Action.REMOVE_ALL_NOTIFICATIONS = "REMOVE_ALL_NOTIFICATIONS";
    return Action;
})();
module.exports = Action;
//# sourceMappingURL=action.js.map