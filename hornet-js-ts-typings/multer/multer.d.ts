// Type definitions for multer
// Project: https://github.com/expressjs/multer
// Definitions by: jt000 <https://github.com/jt000>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// Version customisée par Hornet pour multer 0.1.8
/// <reference path="../express/express.d.ts" />
declare module Express {
    export interface Request {
        file: any;
        files: {
            [fieldname: string]: any
        };
    }
}

declare module "multer" {
    import express = require('express');
function multer(options?: any): express.RequestHandler;
    export = multer;
}