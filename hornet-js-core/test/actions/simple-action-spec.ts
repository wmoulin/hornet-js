"use strict";

import TestUtils = require("hornet-js-utils/src/test-utils");
var chai = TestUtils.chai;
var sinon = TestUtils.sinon;
var expect:any = chai.expect;
import ActionsChainData = require("src/routes/actions-chain-data");

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-core.test.action.simple-action-spec");
import simpleAction = require("src/actions/simple-action");

describe("SimpleAction", () => {

    it("should not call dispatcher", function (doneFn) {
        var promise = new simpleAction(simpleAction.CHANGE_PAGE_COMPONENT).withContext(<ActionContext>{})
            .withPayload("payload").promise(new ActionsChainData());
        promise.then(() => {
            // On attend une erreur
            doneFn("CallBack should be resolved with reject");
        }, function (error) {
            logger.debug("Erreur attendue: " + error);
            doneFn();
        });
    });

    it("should call dispatcher", () => {
        // Arrange
        var newComponent = {test: "dummy"};
        var actionContext = {
            dispatch: sinon.spy()
        };
        // Act
        return new simpleAction(simpleAction.CHANGE_PAGE_COMPONENT).withContext(<any>actionContext)
            .withPayload(newComponent).promise(new ActionsChainData()).then(() => {
            // Assert
            expect(actionContext.dispatch).to.have.been.calledWith(simpleAction.CHANGE_PAGE_COMPONENT, newComponent);
        });
    });
});
