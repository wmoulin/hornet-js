///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import superagent = require("superagent");
import {IncomingMessage} from "http";

interface HornetSuperAgentRequest extends superagent.Request<HornetSuperAgentRequest> {
    on(event:string, listener:Function);
    attach(field:string, file:File|Buffer|string, filename?:string): HornetSuperAgentRequest;
    callback(err:any, res:any): void;
    sendMultiPart(data:any): HornetSuperAgentRequest;
    use(plugin:(superAgent:HornetSuperAgentRequest) => any);
    url: string;
    timetoliveInCache: number;
    method:string;
    response:superagent.Response;
    res:IncomingMessage
}

export = HornetSuperAgentRequest;