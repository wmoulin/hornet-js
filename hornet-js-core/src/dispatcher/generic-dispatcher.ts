///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import fluxible = require("fluxible");

class GenericDispatcher {

    protected dispatcher:Fluxible;

    constructor(fluxibleDefaultConf?:any){
        this.dispatcher = new fluxible(fluxibleDefaultConf);
        this.dispatcher.registerStore(require("src/stores/page-informations-store"));
        this.dispatcher.registerStore(require("src/stores/flux-informations-store"));
        this.dispatcher.registerStore(require("src/stores/notification-store"));
    }

    getDispatcher():Fluxible{
        return this.dispatcher;
    }
}

export = GenericDispatcher;