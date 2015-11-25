/// <reference path="../express/express.d.ts" />
declare module "express-handlebars" {
    import express = require('express');

    function e(options?: e.ExpHbsOptions): (viewPath, options, callback) => void;

    module e {
        interface ExpHbsOptions {
            defaultLayout: string;
        }
    }
    export = e;
}
