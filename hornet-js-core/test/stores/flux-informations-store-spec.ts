///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var sinon = TestUtils.sinon;

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-core.test.store.flux-informations-store-spec");

import FluxInformationsStore = require('src/stores/flux-informations-store');

describe('FluxInformationsStore', () => {
    var target;

    beforeEach(() => {
        target = new FluxInformationsStore(null);
    });

    it('should increment when new action', () => {
        //Arrange
        var emitNumber = 0;
        target.addChangeListener(() => {
            emitNumber++;
        });

        //Act
        var addFn = (FluxInformationsStore.handlers.ASYNCHRONOUS_REQUEST_START).bind(target);
        addFn();
        addFn();

        //Assert
        expect(target.hasActionsRunning()).to.be.true;
        expect(target.currentExecutingActionsNumber).to.be.equal(2);
        expect(emitNumber).to.be.equal(2);
    });

    it('should decrement when success action', () => {
        //Arrange
        var emitNumber = 0;
        target.addChangeListener(() => {
            emitNumber++;
        });
        target.currentExecutingActionsNumber = 1;

        //Act
        var removeFn = (FluxInformationsStore.handlers.ASYNCHRONOUS_REQUEST_END_SUCCESS).bind(target);
        removeFn();

        //Assert
        expect(target.hasActionsRunning()).to.be.false;
        expect(target.currentExecutingActionsNumber).to.be.equal(0);
        expect(emitNumber).to.be.equal(1);
    });

    it('should decrement when error action', () => {
        //Arrange
        var emitNumber = 0;
        target.addChangeListener(() => {
            emitNumber++;
        });
        target.currentExecutingActionsNumber = 2;

        //Act
        var removeFn = (FluxInformationsStore.handlers.ASYNCHRONOUS_REQUEST_END_ERROR).bind(target);
        removeFn();
        removeFn();

        //Assert
        expect(target.hasActionsRunning()).to.be.false;
        expect(target.currentExecutingActionsNumber).to.be.equal(0);
        expect(emitNumber).to.be.equal(2);
    });

});
