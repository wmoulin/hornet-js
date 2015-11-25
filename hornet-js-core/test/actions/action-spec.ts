///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
import TestUtils = require('hornet-js-utils/src/test-utils');
import ActionsChainData = require('src/routes/actions-chain-data')

var chai = TestUtils.chai;
var sinon = TestUtils.sinon;
var expect:any = chai.expect;

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-core.test.action.action-spec");
import action = require('src/actions/action');


describe('ActionSpec', () => {

    it('should dispatch starting and ending event', () => {
        // Arrange
        var payload = TestUtils.randomString();
        var actionChain = new ActionsChainData();
        var actionContext = {
            dispatch: sinon.spy()
        };
        var instance = new action().withContext(<any>actionContext).withPayload(payload);
        instance.execute = function (doneFn) {
            expect(this.payload).to.equal(payload);
            doneFn();
        };
        // Act
        return instance.promise(actionChain).then((expectedPayload) => {
            // Assert
            expect(expectedPayload).to.equal(actionChain);

            expect(actionContext.dispatch).to.have.been.calledTwice;
            expect(actionContext.dispatch).to.have.been.calledWith(action.ASYNCHRONOUS_REQUEST_START);
            expect(actionContext.dispatch).to.have.been.calledWith(action.ASYNCHRONOUS_REQUEST_END_SUCCESS);
        });
    });

    it('should change actionChainData', () => {
        // Arrange
        var payload = TestUtils.randomString();
        var actionChain = new ActionsChainData();
        var actionContext = {
            dispatch: sinon.spy()
        };
        var instance = new action().withContext(<any>actionContext).withPayload(payload);
        instance.execute = function (doneFn) {
            expect(this.payload).to.equal(payload);
            doneFn(this.payload);
        };
        // Act
        return instance.promise(actionChain).then((expectedPayload) => {
            // Assert
            expect(expectedPayload).to.equal(payload);
        });
    });

    it('should dispatch starting and error ending event', () => {
        // Arrange
        var payload = TestUtils.randomString();
        var errorPayload = TestUtils.randomString();
        var actionContext = {
            dispatch: sinon.spy()
        };
        var instance = new action().withContext(<any>actionContext).withPayload(payload);
        instance.execute = function (doneFn, errorFn) {
            errorFn(errorPayload);
        };

        // Act
        return instance.promise(new ActionsChainData()).then(null, (error:any) => {
            // Assert
            expect(error).to.exist;
            expect(error.lastError).to.equal(errorPayload);

            expect(actionContext.dispatch).to.have.been.calledTwice;
            expect(actionContext.dispatch).to.have.been.calledWith(action.ASYNCHRONOUS_REQUEST_START);
            expect(actionContext.dispatch).to.have.been.calledWith(action.ASYNCHRONOUS_REQUEST_END_ERROR);
        });
    });

});
