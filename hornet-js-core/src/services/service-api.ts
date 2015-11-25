///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import superagent = require("superagent");
import HornetAgent = require("src/services/hornet-agent");
import ActionsChainData = require("src/routes/actions-chain-data");
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");

var logger = utils.getLogger("hornet-js-core.services.service-api");
var WError = utils.werror;

class ServiceApi {
    host:string;
    name:string;
    actionContext:ActionContext;

    constructor(actionContext?:ActionContext) {
        if (actionContext) {
            this.actionContext = actionContext;
        }

        if (utils.isServer) {

            if (utils.config.getOrDefault("mock.enabled", false)) {
                this.host = utils.config.getOrDefault("mock.host", "localhost") + ":"
                    + utils.config.getOrDefault("server.port", "8888");
                this.name = utils.buildContextPath("/hornet-mock");
            } else {
                this.host = utils.config.get("services.host");
                this.name = utils.config.get("services.name");
            }
        }
        else {
            this.host = utils.config.getOrDefault("fullSpa.host", "");
            this.name = utils.buildContextPath(utils.config.getOrDefault("fullSpa.name", "/services"));
        }
    }

    request() {
        return new HornetAgent<HornetSuperAgentRequest>();
    }

    buildUrl(path) {
        var url:string = this.host + this.name + path;
        logger.trace("buildUrl : url = ", url);
        return url;
    }

    endFunction(resolve:(retour:ActionsChainData)=>void, reject:any, message:string):(err:any, res:superagent.Response)=>void {
        return function (err, res) {
            if (!err && res && res.ok) {
                logger.debug(message, ": [OK]");
                var acd:ActionsChainData = new ActionsChainData().parseResponse(res);
                resolve(acd);
            } else {
                logger.error(message, ": [KO] =>", err);
                var error = new WError(err, message + " : [KO]");
                (<any>error).response = res;
                reject(error);
            }
        }
    }
}

export = ServiceApi;
