///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import ActionsChainData = require('src/routes/actions-chain-data');
import ValidateUserAccessAction = require('src/actions/validate-user-access-action');
import PageInformationStore = require("src/stores/page-informations-store");

import TestUtils = require('hornet-js-utils/src/test-utils');
var chai = TestUtils.chai;
var sinon = TestUtils.sinon;
var expect:any = chai.expect;
var logger = TestUtils.getLogger("hornet-js-core.test.action.validate-user-access-spec");

describe('ValidateUserAccess', () => {

    it('should dispatch user in store', () => {
        // Arrange
        var realPayload = {'user': {'name': TestUtils.randomString()}};
        var actionContext = {
            dispatch: sinon.spy()
        };
        // Act
        return new ValidateUserAccessAction()
            .withContext(<any>actionContext)
            .withPayload(realPayload)
            .promise(new ActionsChainData())
            .then(() => {
                // Assert
                expect(actionContext.dispatch).to.have.been.calledThrice;
                expect(actionContext.dispatch).to.have.been.calledWith('CHANGE_LOGGED_USER', realPayload.user);
            });
    });

    it('should not dispatch in store if no user', () => {
        // Arrange
        var realPayload = {};
        var actionContext = {
            dispatch: sinon.spy()
        };
        // Act
        return new ValidateUserAccessAction()
            .withContext(<any>actionContext)
            .withPayload(realPayload)
            .promise(new ActionsChainData())
            .then(() => {
                // Assert
                expect(actionContext.dispatch).to.have.been.calledTwice;
            });
    });

    it('should allow user with role', () => {
        // Arrange
        var stubPageInformationStore:any = sinon.stub();
        stubPageInformationStore.userHasRole = sinon.stub().returns(true);

        var realPayload = {accessRetrictedToRoles: [TestUtils.randomString()]};
        var actionContext:any = {
            getStore: sinon.stub().returns(stubPageInformationStore),
            dispatch: sinon.spy()
        };
        // Act
        return new ValidateUserAccessAction()
            .withContext(<ActionContext> actionContext)
            .withPayload(realPayload)
            .promise(new ActionsChainData())
            .then(function (actionChainData:ActionsChainData) {
                expect(actionChainData.isAccessForbidden).to.be.false;
               // expect(actionContext.getStore).to.have.been.calledWith(PageInformationStore);
                expect(stubPageInformationStore.userHasRole).to.have.been.calledWith(realPayload.accessRetrictedToRoles);
            });
    });

    it('should not allow user without role', () => {
        // Arrange
        var stubPageInformationStore:any = sinon.stub();
        stubPageInformationStore.userHasRole = sinon.stub().returns(false);

        var realPayload = {accessRetrictedToRoles: [TestUtils.randomString()]};
        var actionContext:any = {
            getStore: sinon.stub().returns(stubPageInformationStore),
            dispatch: sinon.spy()
        };
        // Act
        return new ValidateUserAccessAction()
            .withContext(<ActionContext> actionContext)
            .withPayload(realPayload)
            .promise(new ActionsChainData())
            .then(() => {
                // Assert
                chai.assert.fail('called', 'not called', 'Ne devrait pas être appelé');
            }, function (actionChainData:any) {
                // Assert
                expect((<ActionsChainData>actionChainData).isAccessForbidden).to.be.true;
            });
    });


});

