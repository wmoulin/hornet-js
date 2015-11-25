/// <reference path="../../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import utils = require('hornet-js-utils');
//mock pour la config
utils.setConfigObj({});

import TestUtils = require('hornet-js-utils/src/test-utils');

var expect = TestUtils.chai.expect;
var Logger = TestUtils.getLogger("hornet-js-core.test.middleware.middlewares-spec");
var sinon = TestUtils.sinon;

import Middlewares = require("src/middleware/middlewares");

var CsrfMiddleware = Middlewares.CsrfMiddleware;

describe("Middleware CsrfMiddleware", () => {

    beforeEach(() => {
            //new CsrfMiddleware();// Uniquement pour appeler le constructeur et ne pas avoir une couverture de test erronnée
            CsrfMiddleware.maxTokensNumberPerSession = 10;
        }
    );

    describe("middleware ", () => {
        var lastToken;

        beforeEach(() => {
            lastToken = TestUtils.randomString();
            sinon.stub(CsrfMiddleware, "_getIndexOfIncomingCsrf").returns(0);
            sinon.stub(CsrfMiddleware, "generateToken").returns(lastToken);
            sinon.stub(CsrfMiddleware, "setTokenInHeader");
            sinon.stub(CsrfMiddleware, "_generateTokenAndPutItInSession").returns(lastToken);
        });

        afterEach(() => {
            (<any>CsrfMiddleware._getIndexOfIncomingCsrf).restore();
            (<any>CsrfMiddleware.generateToken).restore();
            (<any>CsrfMiddleware.setTokenInHeader).restore();
            (<any>CsrfMiddleware._generateTokenAndPutItInSession).restore();
        });

        it("should validate header csrf on POST", () => {
            //arrange
            var csrf = [TestUtils.randomString()];
            var req = {
                getSession: () => { return { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } }; },
                method: "POST",
                headers: {"x-csrf-token": csrf}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            //Act
            CsrfMiddleware.middleware(req, res, next);

            //Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;

            expect(CsrfMiddleware._getIndexOfIncomingCsrf).to.have.been.calledWithExactly(csrf, req.getSession().getAttribute("csrf"));
            expect(CsrfMiddleware.setTokenInHeader).to.have.been.calledWithExactly(lastToken, res);
            expect(req.getSession().getAttribute("csrf")).to.eql([lastToken]);

            expect((<any>req).generateNewCsrfTokken).to.not.exist;
        });

        it("should validate header csrf on PATCH", () => {
            //arrange
            var csrf = [TestUtils.randomString()];
            var req = {
                getSession: () => { return { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } }; },
                method: "PATCH",
                headers: {"x-csrf-token": csrf}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            //Act
            CsrfMiddleware.middleware(req, res, next);

            //Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;
            expect((<any>req).generateNewCsrfTokken).to.not.exist;
        });

        it("should validate body csrf on DELETE", () => {
            //arrange
            var csrf = [TestUtils.randomString()];
            var req = {
                getSession: () => { return { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } }; },
                method: "DELETE",
                headers: {},
                body: {"x-csrf-token": csrf}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            //Act
            CsrfMiddleware.middleware(req, res, next);

            //Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;

            expect(CsrfMiddleware._getIndexOfIncomingCsrf).to.have.been.calledWithExactly(csrf, req.getSession().getAttribute("csrf"));
            expect(CsrfMiddleware.setTokenInHeader).to.have.been.calledWithExactly(lastToken, res);
            expect(req.getSession().getAttribute("csrf")).to.eql([lastToken]);
            expect((<any>req).generateNewCsrfTokken).to.not.exist;
        });

        it("should not find invalid csrf on PUT", () => {
            //arrange
            (<any>CsrfMiddleware._getIndexOfIncomingCsrf).restore();
            sinon.stub(CsrfMiddleware, "_getIndexOfIncomingCsrf").returns(-1);

            var csrf = ["1" + TestUtils.randomString()];
            var sessionToken = ["2" + TestUtils.randomString()];
            var req = {
                getSession: () => { return { getAttribute: (key) => sessionToken, setAttribute: (key, val) => {sessionToken.push(val); } }; },
                method: "PUT",
                headers: {"x-csrf-token": csrf}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            //Act
            CsrfMiddleware.middleware(req, res, next);

            //Assert
            expect(next).to.not.have.been.called;
            expect(res.status).to.have.been.calledWithExactly(417);
            expect(res.end).to.have.been.called;

            expect(CsrfMiddleware._getIndexOfIncomingCsrf).to.have.been.calledWithExactly(csrf, req.getSession().getAttribute("csrf"));
            expect(CsrfMiddleware.setTokenInHeader).to.not.have.been.called;
            expect(req.getSession().getAttribute("csrf")).to.eql(sessionToken);
            expect((<any>req).generateNewCsrfTokken).to.not.exist;
        });

        it("should not validate on GET", () => {
            //arrange
            var csrf = [TestUtils.randomString()];
            var req = {
                getSession: () => { return  { toto:function() {return 1;}} },
                method: "GET"
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            //Act
            console.log("MON TEST, req.getSession()=",req.getSession())
            CsrfMiddleware.middleware(req, res, next);
            expect((<any>req).generateNewCsrfTokken).to.exist;
            (<any>req).generateNewCsrfTokken();

            //Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;

            expect(CsrfMiddleware._getIndexOfIncomingCsrf).to.not.have.been.called;
            expect(CsrfMiddleware.setTokenInHeader).to.not.have.been.called;

            expect(CsrfMiddleware._generateTokenAndPutItInSession).to.have.been.calledWithExactly(req.getSession());
        });

    });

    it("should have 10 tokens max by default", () => {
        //assert
        expect(CsrfMiddleware.maxTokensNumberPerSession).to.eql(10);
    });

    describe("_generateTokenAndPutItInSession", () => {
        it("should set token for first time", () => {
            //arrange
            var csrf = [];
            var session = { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } };

            //Act
            var token = CsrfMiddleware._generateTokenAndPutItInSession(session);

            //assert
            expect(csrf).to.eql([token]);
            expect(session).to.not.have.been.called;
        });

        it("should add token with existing array", () => {
            //arrange
            var firstRandom = TestUtils.randomString();
            var csrf = [firstRandom];
            var session = { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } };

            //Act
            var token = CsrfMiddleware._generateTokenAndPutItInSession(session);

            //assert
            expect(session.getAttribute("csrf")).to.eql([firstRandom, token]);
        });

        it("should remove first one and add token with existing array too large", () => {
            //arrange
            var firstRandom = TestUtils.randomString();
            var secondRandom = TestUtils.randomString();
            var csrf = [firstRandom, secondRandom];
            var session = { getAttribute: (key) => csrf, setAttribute: (key, val) => {csrf.push(val); } };
            CsrfMiddleware.maxTokensNumberPerSession = 2;

            //Act
            var token = CsrfMiddleware._generateTokenAndPutItInSession(session);

            //assert
            expect(session.getAttribute("csrf")).to.eql([secondRandom, token]);
        });
    });

    describe("setTokenInHeader", () => {
        it("should set token", () => {
            //arrange
            var token = TestUtils.randomString();
            var response = <any>sinon.spy();
            response.set = sinon.spy();

            //Act
            CsrfMiddleware.setTokenInHeader(token, response);

            //assert
            expect(response).to.not.have.been.called;
            expect(response.set).to.have.been.calledWithExactly('x-csrf-token', token);
        });
    });

    describe("_getIndexOfIncomingCsrf", () => {

        it("should find existing token in array", () => {
            //arrange
            var incomingCsrf = "1" + TestUtils.randomString();
            var sessionCsrf = ["2" + TestUtils.randomString(), incomingCsrf, "3" + TestUtils.randomString()];

            //Act
            var index = CsrfMiddleware._getIndexOfIncomingCsrf(incomingCsrf, sessionCsrf);

            //assert
            expect(index).to.equal(1);
        });

        it("should not find token in array", () => {
            //arrange
            var incomingCsrf = "1" + TestUtils.randomString();
            var sessionCsrf = ["2" + TestUtils.randomString(), "3" + TestUtils.randomString()];

            //Act
            var index = CsrfMiddleware._getIndexOfIncomingCsrf(incomingCsrf, sessionCsrf);

            //assert
            expect(index).to.equal(-1);
        });
    });
});
