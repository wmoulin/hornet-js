/// <reference path="../express/express.d.ts" />

declare module "express-state" {
    import http = require('http');
    import express = require('express');

    module ExpressState {
        function extend(app?:express.Application):express.Application;
    }
    export = ExpressState;
}

declare module Express {
    export interface Response {
        //Fonction amenée par express-state
        expose:(param:{}, value:string)=>void;
    }

    export interface Application {
        //Fonction amenée par express-state
        expose:(param:{}, value:string)=>void;
    }
}
