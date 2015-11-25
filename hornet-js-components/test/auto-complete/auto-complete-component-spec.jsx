"use strict";

var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var sinon = TestUtils.sinon;

var proxyquire = require('proxyquire').noCallThru();

var AutoComplete = proxyquire('src/auto-complete/auto-complete', {
    './auto-complete-selector': require('test/auto-complete/react-dummy-component-mock')
});

var logger = TestUtils.getLogger("hornet-js-components.test.auto-complete.auto-complete-component-spec");

describe('AutoCompleteComponentSpec', () => {

    describe('_selectCurrentIndex', () => {

        beforeEach(() => {

                this.storeFunctionName = TestUtils.randomString();
                this.storeMock = sinon.spy();
                this.storeMock[this.storeFunctionName] = sinon.spy();


                this.context = {
                    getStore: sinon.mock().returns(this.storeMock)
                };

                this.defaultProps = {
                    sourceStore: {
                        class: this.storeMock,
                        functionName: this.storeFunctionName
                    },
                    context: this.context
                };
                this.instance = new AutoComplete(this.defaultProps);
            }
        );

        it('ne doit rien selectionner si liste de choix inexistante', () => {
            // Arrange
            this.instance.state.selectedIndex = 1;

            // Act
            var returnValue = this.instance._selectCurrentIndex();

            // Assert
            expect(returnValue).to.be.false;

        });

        it('doit selectionner si liste de choix avec 2 elements', () => {
            // Arrange
            var inst = this.instance;
            var choice = {
                'text': TestUtils.randomString(),
                'value': TestUtils.randomString()
            };
            inst.state.choiceValues = [TestUtils.randomString(),choice];

            inst.state.selectedIndex = 1;
            inst.setState = sinon.spy();
            inst.changeInputTextWidgetValue = sinon.spy();

            // Act
            var returnValue = inst._selectCurrentIndex();

            // Assert
            expect(returnValue).to.be.true;
            expect(inst.setState).to.have.been.calledWithExactly({'selectedIndex': null});
            expect(inst.changeInputTextWidgetValue).to.have.been.calledWithExactly(choice.text, choice.value);

        });

    });

})
;


