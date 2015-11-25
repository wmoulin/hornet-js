///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var ActionsChainData = (function () {
    function ActionsChainData() {
        /**
         * Boolean indiquant que l'accès à la ressource courante n'est pas autorisé pour l'utilisateur courant
         * @type {boolean}
         */
        this.isAccessForbidden = false;
    }
    ActionsChainData.prototype.parseResponse = function (res) {
        this.result = res.body || { "status": res.status };
        this.responseMimeType = res.type || "application/json";
        return this;
    };
    ActionsChainData.prototype.withBody = function (body) {
        this.result = body;
        return this;
    };
    ActionsChainData.prototype.withResponseMimeType = function (responseMimeType) {
        this.responseMimeType = responseMimeType;
        return this;
    };
    return ActionsChainData;
})();
module.exports = ActionsChainData;
//# sourceMappingURL=actions-chain-data.js.map