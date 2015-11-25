/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import TestUtils = require('src/test-utils');
var expect:any = TestUtils.chai.expect;
var sinon = TestUtils.sinon;
import target = require('src/index');

describe('Index', () => {
    var bean1 = {
        name: 'myBean1'
    }, bean2 = {
        name: 'myBean2'
    };

    it('should registerGlobal', () => {
        expect(target.registerGlobal('some', bean1)).to.be.equal(bean1);
    });
    it('should not re-registerGlobal', () => {
        expect(target.registerGlobal('some', bean2))
            .to.exist
            .to.be.equal(bean1);
    });
    it('should registerConfig', () => {

        expect(target.config.get('server.port')).to.be.equal(11111);
    });

    describe('getContextPath', () => {

        it('should not modify well formed url', () => {
            // Arrange
            var contextPath = "/" + TestUtils.randomString() + "noslash";
            target.setConfigObj({
                contextPath: contextPath
            });

            //Act
            var expected = target.getContextPath();

            //Assert
            expect(expected).to.equals(contextPath);
        });

        it('should modify bad formated url', () => {
            // Arrange
            var contextPath = TestUtils.randomString();
            target.setConfigObj({
                contextPath: contextPath + "/"
            });

            //Act
            var expected = target.getContextPath();

            //Assert
            expect(expected).to.equals("/" + contextPath);
        });

        it('should register contextPath for reusability', () => {
            // Arrange
            target.setConfigObj({
                contextPath: TestUtils.randomString() + "/"
            });

            //Act
            var expected = target.getContextPath();
            target.getContextPath();

            //Assert
            expect((<any>target)._contextPath).to.equals(expected);
        });
    });

    describe('buildContextPath', () => {

        var defaultContextPath = undefined;
        beforeEach(() => {
            defaultContextPath = "/" + TestUtils.randomString() + "noslash";
            sinon.stub(target, "getContextPath").returns(defaultContextPath);
        });

        afterEach(() => {
            (<any>target.getContextPath).restore();
        });

        it('should not add contextPath if not starting with /', () => {
            // Arrange
            var url = "noslash" + TestUtils.randomString();

            //Act
            var expected = target.buildContextPath(url);

            //Assert
            expect(expected).to.equals(url);
        });

        it('should not modify absolute url', () => {
            // Arrange
            var url = "http://" + TestUtils.randomString();

            //Act
            var expected = target.buildContextPath(url);

            //Assert
            expect(expected).to.equals(url);
        });

        it('should add contextPath if starting with /', () => {
            // Arrange
            var url = "/" + TestUtils.randomString();

            //Act
            var expected = target.buildContextPath(url);

            //Assert
            expect(expected).to.equals(defaultContextPath + url);
        });

        it('should not add contextPath multiple time', () => {
            // Arrange
            var url = defaultContextPath + TestUtils.randomString();

            //Act
            var expected = target.buildContextPath(url);

            //Assert
            expect(expected).to.equals(url);
        });

        it('should remove trailing slash', () => {
            // Arrange
            var url = "/" + TestUtils.randomString();

            //Act
            var expected = target.buildContextPath(url + "/");

            //Assert
            expect(expected).to.equals(defaultContextPath + url);
        });

        it('should do nothing without url', () => {
            // Arrange

            //Act
            var expected = target.buildContextPath();

            //Assert
            expect(expected).to.equals(defaultContextPath);
        });

    });


});
