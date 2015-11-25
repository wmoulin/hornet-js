/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import TestUtils = require('src/test-utils');
import chai = require('chai');
var expect = chai.expect;
var logger = TestUtils.getLogger("hornet-js-utils.test.config-lib-spec");

import Target = require('src/config-lib');

//dossiers de configuration
process.env.HORNET_CONFIG_DIR_APPLI = __dirname + '/config';
process.env.HORNET_CONFIG_DIR_INFRA = __dirname + '/config_infra';

describe('ConfigLib', () => {

    var conf = new Target();
    conf.loadServerConfigs();

    it('should find direct value', () => {
        expect(conf.get('server.port'))
            .to.be.equal(11111);

    });
    it('should find point value', () => {
        expect(conf.get('themeUrl'))
            .to.be.equal('http://localhost:7777/5.0.0/default');

    });
    it('should throw error on inexistant direct value', () => {
        expect(() => {
            return conf.get('should3')
        })
            .to.throw(Error, 'Configuration property "should3" is not defined');

    });

    it('should throw error on inexistant point value', () => {
        expect(() => {
            return conf.get('server.inexistant')
        })
            .to.throw(Error, 'Configuration property "server.inexistant" is not defined');
    });

    it('should return true on existing value', () => {
        expect(conf.has('themeUrl')).to.be.true;
    });

    it('should return false on non existing value', () => {
        expect(conf.has('server.inexistant')).to.be.false;
    });

    it('should return default value on non existing value', () => {
        // Arrange
        var expectedValue = TestUtils.randomString();

        // Act
        var realValue = conf.getOrDefault('server.inexistant', expectedValue);

        //Assert
        expect(realValue).to.be.equals(expectedValue);
    });

    it('should not return default value on existing value', () => {
        // Arrange
        var notExpectedValue = TestUtils.randomString();

        // Act
        var realValue = conf.getOrDefault('themeUrl', notExpectedValue);

        //Assert
        expect(realValue).to.be.equals('http://localhost:7777/5.0.0/default');
    });
});
