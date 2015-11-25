/// <reference path="../express/express.d.ts" />

declare module "cookie-session" {
    import express = require('express');

    export function cookieSession(options: {
		keys: String[];
	}): express.RequestHandler;
}