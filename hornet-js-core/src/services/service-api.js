///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var HornetAgent = require("src/services/hornet-agent");
var ActionsChainData = require("src/routes/actions-chain-data");
var logger = utils.getLogger("hornet-js-core.services.service-api");
var WError = utils.werror;
var ServiceApi = (function () {
    function ServiceApi(actionContext) {
        if (actionContext) {
            this.actionContext = actionContext;
        }
        if (utils.isServer) {
            if (utils.config.getOrDefault("mock.enabled", false)) {
                this.host = utils.config.getOrDefault("mock.host", "localhost") + ":"
                    + utils.config.getOrDefault("server.port", "8888");
                this.name = utils.buildContextPath("/hornet-mock");
            }
            else {
                this.host = utils.config.get("services.host");
                this.name = utils.config.get("services.name");
            }
        }
        else {
            this.host = utils.config.getOrDefault("fullSpa.host", "");
            this.name = utils.buildContextPath(utils.config.getOrDefault("fullSpa.name", "/services"));
        }
    }
    ServiceApi.prototype.request = function () {
        return new HornetAgent();
    };
    ServiceApi.prototype.buildUrl = function (path) {
        var url = this.host + this.name + path;
        logger.trace("buildUrl : url = ", url);
        return url;
    };
    ServiceApi.prototype.endFunction = function (resolve, reject, message) {
        return function (err, res) {
            if (!err && res && res.ok) {
                logger.debug(message, ": [OK]");
                var acd = new ActionsChainData().parseResponse(res);
                resolve(acd);
            }
            else {
                logger.error(message, ": [KO] =>", err);
                var error = new WError(err, message + " : [KO]");
                error.response = res;
                reject(error);
            }
        };
    };
    return ServiceApi;
})();
module.exports = ServiceApi;
//# sourceMappingURL=service-api.js.map