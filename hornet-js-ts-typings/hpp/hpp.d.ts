// Type definitions for hpp
// Project: https://github.com/analog-nico/hpp
/// <reference path="../express/express.d.ts" />
declare module "hpp" {
    import express = require('express');
    function hpp(options?: any): express.RequestHandler;
    export = hpp;
}