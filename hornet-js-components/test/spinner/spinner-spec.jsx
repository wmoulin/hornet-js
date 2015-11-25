"use strict";

var React = require('react/addons');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var sinon = TestUtils.sinon;

var logger = TestUtils.getLogger("hornet-js-components.test.spinner.spinner-spec");

var proxyquire = require('proxyquire').noCallThru();

var fluxInformationsStoreMock = sinon.stub();
var dialogComponentMock = require('test/spinner/spinner-react-mock')();

var Spinner = proxyquire('src/spinner/spinner', {
    'hornet-js-core/src/stores/flux-informations-store': fluxInformationsStoreMock,
    './../dialog/modal': dialogComponentMock
});

function makeMockContext() {
    return {
        getStore: sinon.stub().returns(fluxInformationsStoreMock),
        i18n: (key) => {
            return key;
        }
    };
}

describe('SpinnerReactComponent', () => {
    beforeEach(() => {
        fluxInformationsStoreMock.hasActionsRunning = sinon.stub();
    });

    it("doit propager la conf par défaut au modal et rendre les composants fils", () => {
        // Arrange
        var ChildComponent = require('test/dialog/generic-react-mock')();

        // Act
        var $ = render(() =>
                <Spinner>
                    <ChildComponent />
                </Spinner>,
            makeMockContext(), true
        );

        // Assert
        var renderedProps = dialogComponentMock.getLastRenderedProps();
        expect(renderedProps).to.exist;
        expect(renderedProps.isVisible).to.be.false;

        expect(ChildComponent.getNbRendering()).to.equal(1);

        expect($("span[role='progressbar']")).to.exist;

    });

    it("doit récupérer la valeur true du store et propager la visibilité", () => {
        // Arrange
        var instance = new Spinner({context:makeMockContext()});
        fluxInformationsStoreMock.hasActionsRunning.returns(true);
        instance.setState = sinon.spy();

        // Act
        instance._retrieveStoreValue();

        // Assert
        sinon.assert.calledWith(instance.setState, sinon.match.has("isVisible", true).and(sinon.match.has("lastVisibilitySwitch")));
        expect(fluxInformationsStoreMock.hasActionsRunning).to.be.calledOnce;
    });

    it("doit récupérer la valeur false du store et ne pas appeler setState", () => {
        // Arrange
        var instance = new Spinner({context:makeMockContext()});
        fluxInformationsStoreMock.hasActionsRunning.returns(false);
        instance.setState = sinon.spy();

        // Act
        instance._retrieveStoreValue();

        // Assert
        expect(instance.setState).to.be.callCount(0);
        expect(fluxInformationsStoreMock.hasActionsRunning).to.be.calledOnce;
    });

    it("doit demander l'appel au store de manière asynchrone", function (doneFn) {
        // Arrange
        var startTime = Date.now();
        var instance = new Spinner({scheduleDelayInMs: 25, context:makeMockContext()});
        instance._retrieveStoreValue = () => {
            var endTime = Date.now();
            // Assert
            var waitedTime = endTime - startTime;
            expect(waitedTime >= 25).to.be.true;
            doneFn();
        };

        // Act
        instance.scheduleStoreCheck();
    });

    it("doit replanifier l'appel au store", function (doneFn) {
        // Arrange
        var instance = new Spinner({scheduleDelayInMs: 25, minimalShowTimeInMs: 50, context:makeMockContext()});
        instance.state.isVisible = true;
        var startTime = Date.now();
        instance.state.lastVisibilitySwitch = startTime;
        sinon.spy(instance, "scheduleStoreCheck");

        instance._retrieveStoreValue = () => {
            var endTime = Date.now();
            // Assert
            var waitedTime = endTime - startTime;
            expect(waitedTime >= 50).to.be.true;
            expect(instance.scheduleStoreCheck).to.have.been.calledTwice;
            doneFn();
        };

        // Act
        instance.scheduleStoreCheck();
    });
});
