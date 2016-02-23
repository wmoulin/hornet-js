"use strict";
import utils = require("hornet-js-utils");

import superagent = require("superagent");
import HornetAgent = require("src/services/hornet-agent");
import ActionsChainData = require("src/routes/actions-chain-data");
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");

import Url = require("url");

var _ = utils._;
var logger = utils.getLogger("hornet-js-core.services.service-api");
var WError = utils.werror;

class ServiceApi {
    private serviceHost:string;
    private serviceName:string;
    actionContext:ActionContext;

    getServiceHost():string {
        return this.serviceHost;
    }

    setServiceHost(serviceHost:string) {
        this.serviceHost = serviceHost;
    }

    getServiceName():string {
        return this.serviceName;
    }

    setServiceName(serviceName:string) {
        this.serviceName = serviceName;
    }

    constructor(actionContext?:ActionContext) {
        if (actionContext) {
            this.actionContext = actionContext;
        }
        if (utils.isServer) {
            if (utils.config.getOrDefault("mock.enabled", false)) {
                this.serviceHost = utils.config.getOrDefault("mock.defaultServices.host", "localhost:8888");
                this.serviceName = utils.buildContextPath("/hornet-mock");
            } else {
                this.serviceHost = utils.config.get("defaultServices.host");
                this.serviceName = utils.config.get("defaultServices.name");
            }
        } else {
            this.serviceHost = utils.config.getOrDefault("fullSpa.host", "");
            this.serviceName = utils.buildContextPath(utils.config.getOrDefault("fullSpa.name", "/services"));
        }
    }

    request() {
        return new HornetAgent<HornetSuperAgentRequest>();
    }

    buildUrl(path) {
        var urlService:string = Url.resolve(this.serviceHost, this.serviceName);
        if (_.endsWith(urlService, "/")) {
            // On enlève le slash de fin si présent
            urlService = urlService.substr(0, urlService.length - 1);
        }
        var url:string = urlService + path;
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
                var errorMess:string = message + " : [KO]";
                logger.error(errorMess);
                var error = new WError(err, errorMess);
                error.name = " ";
                (<any>error).response = res;
                reject(error);
            }
        };
    }
}

export = ServiceApi;
