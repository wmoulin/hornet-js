"use strict";

import {AbstractHornetMiddleware} from "hornet-js-core/src/middleware/middlewares";
var flash = require("connect-flash");

export class PassportAuthentication {

    protected passport:any;

    constructor() {
        this.passport = require("passport");
        this.initSerialize();
    }

    public getMiddleware():typeof AbstractHornetMiddleware {
        var passport = this.passport;
        var createMiddleware = this.createMiddleware.bind(this);

        return class extends AbstractHornetMiddleware {
            constructor(appConfig) {
                super(appConfig);
            }

            insertMiddleware(app) {
                app.use(flash());
                app.use(passport.initialize());
                app.use(passport.session());
                app.use(createMiddleware());
            }
        };
    }

    /**
     * Test si c'est bien l'url demandée (recherche depuis la fin).
     * @param originalUrl URL à tester
     * @param testUrl URL recherchée
     * @returns {boolean} true si correspond.
     */
    protected static isUrl(req, testUrl:string):boolean {
        var originalUrl = require("parseurl").original(req);

        if (originalUrl && originalUrl.pathname && originalUrl.pathname === testUrl) {
            return true;
        }
        return false;
    }

    /**
     * Initialisation de Passport.Js.
     * @return instancePassport
     */
    protected initSerialize():any {
        // Aucune serialisation, l'objet est complet
        this.passport.serializeUser((user, done) => {
            done(null, user);
        });

        // Aucune déserialisation, l'objet est complet
        this.passport.deserializeUser((user, done) => {
            done(null, user);
        });
    }

    protected createMiddleware():Function {
        throw new Error("This method is abstract");
    }
}
