/// <reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import utils = require('hornet-js-utils');

//pas d'utilisation du mot clé import pour TestUtils pour pouvoir compiler le fichier
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var sinon = TestUtils.sinon;
var assert = TestUtils.chai.assert;
var logger = TestUtils.getLogger("hornet-js-core.test.services.superagent-hornet-plugins-spec");

var proxyquire = require('proxyquire').noCallThru();

var HornetCacheStub = sinon.spy();
var superAgentPlugins = proxyquire('src/services/superagent-hornet-plugins', {
    './../cache/hornet-cache': HornetCacheStub
});

describe('superagent-hornet-plugins', () => {

    describe('CsrfPlugin', () => {

        it('Should set utils header on request and get it on response', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            mockRequest.set = sinon.spy();
            var mockResponse = sinon.spy();

            var firstGeneratedToken = TestUtils.randomString();
            var secondGeneratedToken = TestUtils.randomString();
            mockResponse.get = sinon.stub().returns(secondGeneratedToken);

            // Act 1
            utils.csrf = firstGeneratedToken;
            utils.isServer = false;
            superAgentPlugins.CsrfPlugin(mockRequest);
            utils.isServer = true;

            // Assert 1
            expect(mockRequest.callback).to.not.equals(mockRequestCallback);
            expect(mockRequest.set).to.be.calledWith('x-csrf-token', firstGeneratedToken);
            expect(mockResponse.get).to.not.be.called;

            // Act 2
            mockRequest.callback(undefined, mockResponse);

            //Assert 2
            expect(mockResponse.get).to.be.calledWith('x-csrf-token');
            expect(utils.csrf).to.be.equals(secondGeneratedToken);
        });

        it('Should set default header on request and not modify if response header', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            mockRequest.set = sinon.spy();

            var defaultToken = 'no-token';
            var mockResponse = sinon.spy();
            mockResponse.get = sinon.stub().returns(undefined);

            // Act 1
            utils.csrf = undefined;
            utils.isServer = false;
            superAgentPlugins.CsrfPlugin(mockRequest);
            utils.isServer = true;

            // Assert 1
            expect(mockRequest.callback).to.not.equals(mockRequestCallback);
            expect(mockRequest.set).to.be.calledWith('x-csrf-token', defaultToken);
            expect(mockResponse.get).to.not.be.called;

            // Act 2
            mockRequest.callback(undefined, mockResponse);

            //Assert 2
            expect(mockResponse.get).to.be.calledWith('x-csrf-token');
            expect(utils.csrf).to.be.equals(undefined);
        });

        it('Should not modify if server', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;

            // Act
            superAgentPlugins.CsrfPlugin(mockRequest);

            // Assert
            expect(mockRequest.callback).to.equals(mockRequestCallback);
        });
    });

    describe('RedirectToLoginPagePlugin', () => {

        beforeEach(() => {
//            global.window = {};
//            global.window.location = {};
//            global.window.location.href = sinon.spy();
        });

        afterEach(() => {
//            global.window = undefined;
        });

        it('Should not redirect if no header', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            var mockResponse = sinon.spy();
            mockResponse.get = sinon.stub().returns(undefined);

            // Act
            utils.isServer = false;
            superAgentPlugins.RedirectToLoginPagePlugin(mockRequest);
            utils.isServer = true;
            mockRequest.callback(undefined, mockResponse);

            // Assert
            expect(mockRequest.callback).to.not.equals(mockRequestCallback);
            expect(mockRequestCallback).to.be.calledWith(undefined, mockResponse);
        });

        it('Should redirect if header', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            var mockResponse = sinon.spy();
            mockResponse.get = sinon.stub().returns("true");

            var configObj = {
                contextPath: "a" + TestUtils.randomString() + "z",
                authentication: {
                    loginUrl: "/" + TestUtils.randomString(),
                }
            };
            // Act
            utils.isServer = false;
            utils.setConfigObj(configObj);
            superAgentPlugins.RedirectToLoginPagePlugin(mockRequest);
            utils.isServer = true;

            mockRequest.callback(undefined, mockResponse);

            // Assert
            expect(mockRequest.callback).to.not.equals(mockRequestCallback);
            expect(mockRequestCallback).to.be.calledWith(undefined, mockResponse);
            expect(mockResponse.get).to.be.calledWith("x-is-login-page");
//            expect(global.window.location.href).to.be.equals("/" + configObj.contextPath + configObj.authentication.loginUrl + '?previousUrl=spy');
        });

        it('Should not modify if server', () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;

            // Act
            superAgentPlugins.RedirectToLoginPagePlugin(mockRequest);

            // Assert
            expect(mockRequest.callback).to.equals(mockRequestCallback);
        });
    });

    describe('MiseEnCachePlugin', () => {

        describe('Plugin Function', () => {
            var HornetCacheStubInstance;
            beforeEach(() => {
                sinon.stub(superAgentPlugins.MiseEnCachePlugin, "_getMethodeEndForCache").returnsArg(0);

                HornetCacheStub.reset();
                HornetCacheStubInstance = sinon.spy();
                HornetCacheStub.getInstance = sinon.stub().returns(HornetCacheStubInstance);

                HornetCacheStubInstance.getItem = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.then = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.catch = sinon.stub();

            });

            afterEach(() => {
                superAgentPlugins.MiseEnCachePlugin._getMethodeEndForCache.restore();
            });

            it('should find in cache', function (done) {
                // Arrange
                var timeToLiveInCache = 10;
                var stubResponse = TestUtils.randomString();
                HornetCacheStubInstance.then = function (callbackFn) {
                    setTimeout(() => {
                        callbackFn(stubResponse);
                    }, 10);

                    return HornetCacheStubInstance;
                };

                var callbackEndMethod = function (err, res) {
                    // Assert
                    expect(err).to.be.undefined;
                    expect(res).to.be.equals(stubResponse);
                    expect(HornetCacheStubInstance.getItem).to.be.calledWith(stubRequest.url);
                    expect(stubRequest.abort).to.not.be.called;

                    done();
                };

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                stubRequest.abort = sinon.spy();

                // Act
                superAgentPlugins.MiseEnCachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
            });

            it('should not find in cache', function (done) {
                // Arrange
                var timeToLiveInCache = 10;
                HornetCacheStubInstance.catch = function (callbackFn) {
                    setTimeout(() => {
                        callbackFn();
                    }, 10);
                };

                var callbackEndMethod = sinon.spy();

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                stubRequest.abort = sinon.spy();
                stubRequest.end = function (callbackFn) {
                    // Assert
                    expect(this).to.be.equals(stubRequest);
                    expect(callbackFn).to.be.equals(stubRequest.url);// C'est juste le bouchon qui retourne ca
                    expect(superAgentPlugins.MiseEnCachePlugin._getMethodeEndForCache).to.be.calledWith(stubRequest.url, callbackEndMethod, timeToLiveInCache);
                    expect(stubRequest.abort).to.not.be.called;

                    done();
                };

                // Act
                superAgentPlugins.MiseEnCachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
            });

            it('should not find and store headers', function (done) {
                // Arrange
                var timeToLiveInCache = 10;
                HornetCacheStubInstance.catch = function (callbackFn) {
                    setTimeout(() => {
                        callbackFn();
                    }, 10);
                };

                var callbackEndMethod = sinon.spy();

                var field1 = TestUtils.randomString();
                var val1 = TestUtils.randomString();
                var field2 = TestUtils.randomString();
                var val2 = TestUtils.randomString();

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                var setFunction = sinon.spy();
                stubRequest.set = setFunction;
                stubRequest.end = () => {
                    // Assert
                    expect(setFunction).to.be.calledWith(field1, val1);
                    expect(setFunction).to.be.calledWith(field2, val2);
                    done();
                };

                // Act
                superAgentPlugins.MiseEnCachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                expect(stubRequest.set).to.exist;

                stubRequest.set(field1, val1);
                stubRequest.set(field2, val2);
                stubRequest.end(callbackEndMethod);
            });

            it('should set default time to live', function (done) {
                // Arrange
                HornetCacheStubInstance.catch = function (callbackFn) {
                    setTimeout(() => {
                        callbackFn();
                    }, 10);
                };

                var callbackEndMethod = sinon.spy();

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                stubRequest.end = function (callbackFn) {
                    // Assert
                    expect(this).to.be.equals(stubRequest);
                    expect(callbackFn).to.be.equals(stubRequest.url);// C'est juste le bouchon qui retourne ca
                    expect(superAgentPlugins.MiseEnCachePlugin._getMethodeEndForCache).to.be.calledWith(stubRequest.url, callbackEndMethod, -1);

                    done();
                };

                // Act
                superAgentPlugins.MiseEnCachePlugin()(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
            });
        });

        describe('_getMethodeEndForCache', () => {
            var HornetCacheStubInstance;
            beforeEach(() => {
                sinon.stub(superAgentPlugins.MiseEnCachePlugin, "_cloneResponse").returnsArg(0);
                HornetCacheStub.reset();
                HornetCacheStubInstance = sinon.spy();
                HornetCacheStub.getInstance = sinon.stub().returns(HornetCacheStubInstance);

                HornetCacheStubInstance.miseEnCacheAsynchrone = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.finally = sinon.stub().yieldsAsync();
                HornetCacheStubInstance.getItem = sinon.stub();
            });

            afterEach(() => {
                superAgentPlugins.MiseEnCachePlugin._cloneResponse.restore();
            });

            it('should not cache error request', () => {
                // Arrange
                var url = TestUtils.randomString();
                var callbackEndMethod = sinon.spy();
                var timeToLiveInCache = 10;

                var error = sinon.spy();
                var response = sinon.spy();

                // Act
                var endFunction = superAgentPlugins.MiseEnCachePlugin._getMethodeEndForCache(url, callbackEndMethod, timeToLiveInCache);
                endFunction(error, response);

                // Assert
                expect(callbackEndMethod).to.be.calledWith(error, response);
            });

            it('should cache good request', function (done) {
                // Arrange
                var url = TestUtils.randomString();
                var timeToLiveInCache = 10;
                var response = sinon.spy();

                var callbackEndMethod = function (err, res) {
                    // Assert
                    expect(err).to.be.undefined;
                    expect(res).to.be.equals(response);

                    expect(superAgentPlugins.MiseEnCachePlugin._cloneResponse).to.be.calledWith(response);
                    expect(HornetCacheStubInstance.miseEnCacheAsynchrone).to.be.calledWith(url, response, timeToLiveInCache);
                    done();
                };

                // Act
                var endFunction = superAgentPlugins.MiseEnCachePlugin._getMethodeEndForCache(url, callbackEndMethod, timeToLiveInCache);
                endFunction(undefined, response);

            });
        });

        describe('_cloneResponse', () => {
            it('Should clone response', () => {
                // Arrange
                var mockRequest = {
                    body: TestUtils.randomString(),
                    header: TestUtils.randomString(),
                    ok: TestUtils.randomString(),
                    status: TestUtils.randomString(),
                    type: TestUtils.randomString()
                };
                var expectedRequest = utils._.cloneDeep(mockRequest);
                mockRequest[TestUtils.randomString()] = TestUtils.randomString();

                // Act
                var clonedRequest = superAgentPlugins.MiseEnCachePlugin._cloneResponse(mockRequest);

                // Assert
                expect(clonedRequest).to.eql(expectedRequest);
            });
        });
    });
});
