/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import TestUtils = require('src/test-utils');
var chai = TestUtils.chai;
var expect:any = chai.expect;
var logger = TestUtils.getLogger("hornet-js-utils.test.authentication-utils-spec");

import AuthenticationUtils = require('src/authentication-utils');
var AuthUtils = AuthenticationUtils.AuthUtils;

describe('AuthenticationUtilsSpec', () => {

    it('should not accept function', () => {
        //Arrange
        var user = {
            roles: [{
                name: TestUtils.randomString()
            }]
        };

        try {
            AuthUtils.userHasRole(user, () => {
            });
            // Assert
            chai.assert.fail('called', 'not called', 'Ne devrait pas être appelé');
        } catch (error) {
            logger.debug(error);
        }
    });

    it('should authorize from string', () => {
        //Arrange
        var user = {
            roles: [{
                name: TestUtils.randomString()
            }]
        };

        //Act
        var authorized = AuthUtils.userHasRole(user, user.roles[0].name);

        // Assert
        expect(authorized).to.be.true;
    });

    it('should authorize from array', () => {
        //Arrange
        var user = {
            roles: [{
                name: TestUtils.randomString()
            }, {
                name: TestUtils.randomString()
            }]
        };

        //Act
        var authorized = AuthUtils.userHasRole(user, [TestUtils.randomString(), user.roles[0].name]);

        // Assert
        expect(authorized).to.be.true;
    });

    it('should not authorize from array without role', () => {
        //Arrange
        var user = {
            roles: [{
                name: "1" + TestUtils.randomString()
            }, {
                name: "2" + TestUtils.randomString()
            }]
        };

        //Act
        var authorized = AuthUtils.userHasRole(user, ["3" + TestUtils.randomString(), "4" + TestUtils.randomString()]);

        // Assert
        expect(authorized).to.be.false;
    });


});
