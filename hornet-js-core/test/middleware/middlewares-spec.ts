"use strict";

import utils = require("hornet-js-utils");

// mock pour la config
utils.setConfigObj({});

import TestUtils = require("hornet-js-utils/src/test-utils");

var expect = TestUtils.chai.expect;
var Logger = TestUtils.getLogger("hornet-js-core.test.middleware.middlewares-spec");
var sinon = TestUtils.sinon;

import Middlewares = require("src/middleware/middlewares");

var CsrfMiddleware = Middlewares.CsrfMiddleware;

describe("Middleware CsrfMiddleware", () => {

    describe("middleware ", () => {
        var csrfToken;

        beforeEach(() => {
            csrfToken = TestUtils.randomString();
            sinon.stub(CsrfMiddleware, "generateToken").returns(csrfToken);
        });

        afterEach(() => {
            (<any>CsrfMiddleware.generateToken).restore();
        });

        it("should validate header csrf on POST", () => {
            // arrange
            var req = {
                getSession: () => { return { getAttribute: (key) => csrfToken, setAttribute: (key, val) => { csrfToken = val; } }; },
                method: "POST",
                headers: {"x-csrf-token": csrfToken}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            // Act
            CsrfMiddleware.middleware(req, res, next);

            // Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;

            expect(req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY)).to.eql(csrfToken);

            expect((<any>req).generateCsrfToken).to.not.exist;
        });

        it("should validate header csrf on PATCH", () => {
            // arrange
            var req = {
                getSession: () => { return { getAttribute: (key) => csrfToken, setAttribute: (key, val) => { csrfToken = val; } }; },
                method: "PATCH",
                headers: {"x-csrf-token": csrfToken}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            // Act
            CsrfMiddleware.middleware(req, res, next);

            // Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;
            expect((<any>req).generateCsrfToken).to.not.exist;
        });

        it("should validate body csrf on DELETE", () => {
            // arrange
            var req = {
                getSession: () => { return { getAttribute: (key) => csrfToken, setAttribute: (key, val) => { csrfToken = val; } }; },
                method: "DELETE",
                headers: {},
                body: {"x-csrf-token": csrfToken}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            // Act
            CsrfMiddleware.middleware(req, res, next);

            // Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;

            expect(req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY)).to.eql(csrfToken);
            expect((<any>req).generateCsrfToken).to.not.exist;
        });

        it("should find invalid csrf on PUT", () => {
            // arrange
            var sessionToken = "2" + TestUtils.randomString();
            var req = {
                getSession: () => { return { getAttribute: (key) => sessionToken, setAttribute: (key, val) => { sessionToken = val; } }; },
                method: "PUT",
                headers: {"x-csrf-token": csrfToken}
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            // Act
            CsrfMiddleware.middleware(req, res, next);

            // Assert
            expect(next).to.not.have.been.called;
            expect(res.status).to.have.been.calledWithExactly(417);
            expect(res.end).to.have.been.called;

            expect(req.getSession().getAttribute(CsrfMiddleware.CSRF_SESSION_KEY)).to.eql(sessionToken);
            expect((<any>req).generateNewCsrfTokken).to.not.exist;
        });

        it("should not validate on GET", () => {
            // arrange
            var req = {
                getSession: () => { return { getAttribute: (key) => csrfToken, setAttribute: (key, val) => { csrfToken = val; } }; },
                method: "GET"
            };
            var res:any = sinon.spy();
            var next = sinon.spy();
            res.status = sinon.spy();
            res.end = sinon.spy();

            // Act
            CsrfMiddleware.middleware(req, res, next);
            expect((<any>req).generateCsrfToken).to.exist;
            (<any>req).generateCsrfToken();

            // Assert
            expect(next).to.have.been.calledOnce;
            expect(res.status).to.not.have.been.called;
            expect(res.end).to.not.have.been.called;
        });

    });

    describe("isTokenValid", () => {

        it("should validate token", () => {
            var incomingCsrf = "1" + TestUtils.randomString();
            var sessionCsrf = incomingCsrf;

            // Act
            var valid = CsrfMiddleware.isTokenValid(incomingCsrf, sessionCsrf);

            // assert
            expect(valid).to.equal(true);
        });

        it("should not validate token", () => {
            var incomingCsrf = "1" + TestUtils.randomString();
            var sessionCsrf = "1" + incomingCsrf;

            // Act
            var valid = CsrfMiddleware.isTokenValid(incomingCsrf, sessionCsrf);

            // assert
            expect(valid).to.equal(false);
        });
    });
});
