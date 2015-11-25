/// <reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
import ServiceApi = require('src/services/service-api');
import ExtendedPromise = require('hornet-js-utils/src/promise-api');
import ConfigLib = require('hornet-js-utils/src/config-lib');
import express = require('express');
import bodyParser = require('body-parser');

import utils = require("hornet-js-utils");
import TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var assert = TestUtils.chai.assert;
var logger = TestUtils.getLogger("hornet-js-core.test.services.service-api-spec");
var loggerMock = TestUtils.getLogger("hornet-js-core.test.services.hornet-agent-spec[mock]");

var _app;
var _port = 3007;
var _server;
var _config:ConfigLib;
var _actionContext:ActionContext;
var defaultMessage = 'Message de test';
var _errorMessage = '[KO]: ' + defaultMessage;

process.env.HORNET_CONFIG_DIR_APPLI = __dirname + '/config';


class MyService extends ServiceApi {
    remoteServicePath:string;

    constructor(remoteServicePath) {
        super(_actionContext);
        this.remoteServicePath = remoteServicePath;
    }

    send(data) {
        return new ExtendedPromise((resolve, reject) => {
            var url = this.buildUrl(this.remoteServicePath);
            this.request()
                .post(url) //
                .send(data) //
                .end(this.endFunction(resolve, reject
                    , defaultMessage));
        });
    }
}

describe('service-api-spec', () => {

    before(function (done) {
        _app = express();

        _app.use(bodyParser.json()); // to support JSON-encoded bodies

        _app.post('/ok', function (req, res) {
            loggerMock.debug("/ok");
            res.json({
                message: "Reçu : " + req.body.data
            });
        });
        _app.post('/ko', function (req, res) {
            loggerMock.debug("/ko");
            res.status(500).json({
                message: "Retour d'une erreur : " + req.body.data
            });
        });

        var testConfig = {
            services: {
                host: 'http://localhost:' + _port,
                name: 'service-api-spec-service/'
            }
        }

        utils.setConfigObj(testConfig);

        TestUtils.startExpressApp(_app, _port, function (server, port, err) {
            _server = server;
            _port = port;
            _config = new ConfigLib();
            _config.setConfigObj(testConfig);
            done(err);
        });
    });

    after(() => {
        _server && _server.close();
    });

    it('should resolve', (done) => {
        new MyService('/ok')
            .send({data: 'ok'})
            .then((result:any) => {
                logger.debug("result (should resolve):", result);
                expect(result).to.exist;
                expect(result.result.message).to.be.equal('Reçu : ok');
                logger.debug("FIN");
            })
            .then(done, done);
    });
    it('should reject', (done) => {
        new MyService('/ko')
            .send({data: 'ko'})
            .then((result) => {
                logger.debug("result: ", result);
                throw new Error('Expected error, result got instead');
            }, (err:WError) => {
                logger.debug("rejected");
                expect(err).to.exist;
                expect(err.message).to.be.equal(_errorMessage);
            })
            .then(done, done);
    });
});
