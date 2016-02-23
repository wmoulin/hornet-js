"use strict";
import superagent = require("superagent");
import {IncomingMessage} from "http";

interface HornetSuperAgentRequest extends superagent.Request<HornetSuperAgentRequest> {
    on(event:string, listener:Function);
    attach(field:string, file:File|Buffer|string, filename?:string): HornetSuperAgentRequest;
    callback(err:any, res:any): void;
    use(plugin:(superAgent:HornetSuperAgentRequest) => any);
    url: string;
    timetoliveInCache: number;
    method:string;
    response:superagent.Response;
    res:IncomingMessage;
}

export = HornetSuperAgentRequest;
