/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import chai = require('chai');
var expect:any = chai.expect;
import TestUtils = require('src/test-utils');
var logger = TestUtils.getLogger("hornet-js-utils.test.new-forms-aria-modifications-spec");
var newFormsAria = require('src/extended/new-forms-aria-modifications');
var BoundField = require('newforms/BoundField');

describe('NewFormsAriaModificationsApi', () => {

    it('should replace prototype and call it', () => {
        // Arrange
        var callKwargs:any={};
        var oldFn = BoundField.prototype.asWidget;

        var ariaThisMock = {
            errors: () => {
                return {
                    isPopulated: () => {
                        return true;
                    }
                }
            }
        };

        BoundField.prototype.asWidget = function (kwargs) {
            callKwargs = kwargs;
        };

        //Act
        newFormsAria();
        BoundField.prototype.asWidget.call(ariaThisMock, {});
        BoundField.prototype.asWidget = oldFn;

        //Assert
        //expect(callKwargs).to.exist();
        //expect(callKwargs.attrs).to.exist();
        //expect(callKwargs.attrs['aria-invalid']).to.exist().to.be.true;

    });


});
