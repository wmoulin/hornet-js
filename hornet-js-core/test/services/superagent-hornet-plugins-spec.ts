/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { TestUtils } from "hornet-js-test/src/test-utils";
import { Utils } from "hornet-js-utils";
import * as _ from "lodash";

// pas d'utilisation du mot clé import pour TestUtils pour pouvoir compiler le fichier
let expect = TestUtils.chai.expect;
let sinon:any = TestUtils.sinon;
let assert = TestUtils.chai.assert;

let proxyquire = require("proxyquire").noCallThru();

let HornetCacheStub = sinon.spy();
let superAgentPlugins = proxyquire("src/services/superagent-hornet-plugins", {
    "src/cache/hornet-cache": HornetCacheStub
});

// NOTE: event name is camelCase as per node convention
process.on("unhandledRejection", function(reason, promise) {
    console.error("superagent-hornet-plugins", reason);
    throw reason;
});


describe("superagent-hornet-plugins", () => {

    describe("CsrfPlugin", () => {

        it("Should set utils header on request", () => {

            var token = TestUtils.randomString();

            class utilsMock extends Utils {
                static setCls(key: string, value: any, localStorageName?: string): any {
                    sinon.stub();
                }

                static getCls(key: string, localStorageName?: string): any {
                    return token;
                }
            }

            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            mockRequest.set = sinon.spy();

            // Act 1
            utilsMock.setCls("hornet.csrf", token);
            Utils.isServer = false;
            superAgentPlugins.CsrfPlugin(mockRequest);

            expect(utilsMock.getCls("hornet.csrf")).to.be.equals(token);
        });

        it.skip("Should set default header on request and not modify if response header", () => {
            class utilsMock extends Utils {
                static setCls(key: string, value: any, localStorageName?: string): any {
                    sinon.stub();
                }

                static getCls(key: string, localStorageName?: string): any {
                    return undefined;
                }
            }

            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            mockRequest.set = sinon.spy();

            var defaultToken = "no-token";

            // Act 1
            utilsMock.setCls("hornet.csrf", undefined);
            Utils.isServer = false;
            superAgentPlugins.CsrfPlugin(mockRequest);

            // Assert 1
            expect(utilsMock.getCls("hornet.csrf")).to.be.equals(undefined);
        });
    });

    describe.skip("RedirectToLoginPagePlugin", () => {

        beforeEach(() => {
            (global as any).window = {};
            (global as any).window.location = {};
            (global as any).window.location.href = sinon.spy();
        });

        afterEach(() => {
            (global as any).window = undefined;
        });

        it("Should not redirect if no header", () => {
            // Arrange
            var mockRequest = sinon.spy();
            var mockRequestCallback = sinon.spy();
            mockRequest.callback = mockRequestCallback;
            var mockResponse = sinon.spy();
            mockResponse.get = sinon.stub().returns(undefined);

            // Act
            Utils.isServer = false;
            superAgentPlugins.RedirectToLoginPagePlugin(mockRequest);
            Utils.isServer = true;
            mockRequest.callback(undefined, mockResponse);

            // Assert
            expect(mockRequestCallback).to.be.calledWith(undefined, mockResponse);
        });

        it.skip("Should redirect if header", () => {
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
            Utils.isServer = false;
            Utils.setConfigObj(configObj);
            superAgentPlugins.RedirectToLoginPagePlugin(mockRequest);
            Utils.isServer = true;

            mockRequest.callback(undefined, mockResponse);

            // Assert
            //expect(mockRequest.callback).to.not.equals(mockRequestCallback);
            // expect(mockRequestCallback).to.be.calledWith(undefined, mockResponse);
            expect(mockResponse.get).to.be.calledWith("x-is-login-page");
//          expect(global.window.location.href).to.be.equals("/" + configObj.contextPath
//              + configObj.authentication.loginUrl + '?previousUrl=spy');
        });

        it("Should not modify if server", () => {
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

    describe.skip("CachePlugin", () => {

        describe("Plugin Function", () => {
            var HornetCacheStubInstance;
            beforeEach(() => {
                sinon.stub(superAgentPlugins.CachePlugin, "_getMethodeEndForCache").returnsArg(0);

                HornetCacheStub.reset();
                HornetCacheStubInstance = sinon.spy();
                HornetCacheStub.getInstance = sinon.stub().returns(HornetCacheStubInstance);

                HornetCacheStubInstance.getItem = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.setCacheAsynchrone = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.then = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.catch = sinon.stub();
                HornetCacheStubInstance.finally = sinon.stub();
            });

            afterEach(() => {
                superAgentPlugins.CachePlugin._getMethodeEndForCache.restore();
            });

            it("should find in cache", function(done) {
                // Arrange
                var timeToLiveInCache = 10;
                var stubResponse = TestUtils.randomString();
                HornetCacheStubInstance.then = function(callbackFn) {
                    setTimeout(() => {
                        callbackFn(stubResponse);
                    }, 10);

                    return HornetCacheStubInstance;
                };

                var callbackEndMethod = function(err, res) {
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
                superAgentPlugins.CachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
                done();
            });

            it("should not find in cache", function(done) {
                // Arrange
                var timeToLiveInCache = 10;
                HornetCacheStubInstance.catch = function(callbackFn) {
                    setTimeout(() => {
                        callbackFn();
                    }, 10);
                };

                var callbackEndMethod = sinon.spy();

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                stubRequest.abort = sinon.spy();
                stubRequest.end = function(callbackFn) {
                    // Assert
                    expect(this).to.be.equals(stubRequest);
                    expect(callbackFn).to.be.equals(stubRequest.url);// C'est juste le bouchon qui retourne ca
                    expect(superAgentPlugins.CachePlugin._getMethodeEndForCache).to.be.calledWith(stubRequest.url, callbackEndMethod, timeToLiveInCache);
                    expect(stubRequest.abort).to.not.be.called;

                    done();
                };

                // Act
                superAgentPlugins.CachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
            });

            it("should not find and store headers", function(done) {
                // Arrange
                var timeToLiveInCache = 10;
                HornetCacheStubInstance.catch = function(callbackFn) {
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
                superAgentPlugins.CachePlugin(timeToLiveInCache)(stubRequest);
                expect(stubRequest.end).to.exist;
                expect(stubRequest.set).to.exist;

                stubRequest.set(field1, val1);
                stubRequest.set(field2, val2);
                stubRequest.end(callbackEndMethod);
            });

            it("should set default time to live", function(done) {
                // Arrange
                HornetCacheStubInstance.catch = function(callbackFn) {
                    setTimeout(() => {
                        callbackFn();
                    }, 10);
                };

                var callbackEndMethod = sinon.spy();

                var stubRequest = sinon.spy();
                stubRequest.url = TestUtils.randomString();
                stubRequest.end = function(callbackFn) {
                    // Assert
                    expect(this).to.be.equals(stubRequest);
                    expect(callbackFn).to.be.equals(stubRequest.url);// C'est juste le bouchon qui retourne ca
                    expect(superAgentPlugins.CachePlugin._getMethodeEndForCache).to.be.calledWith(stubRequest.url, callbackEndMethod, -1);

                    done();
                };

                // Act
                superAgentPlugins.CachePlugin()(stubRequest);
                expect(stubRequest.end).to.exist;
                stubRequest.end(callbackEndMethod);
            });
        });

        describe("_getMethodeEndForCache", () => {
            var HornetCacheStubInstance;
            beforeEach(() => {
                sinon.stub(superAgentPlugins.CachePlugin, "_cloneResponse").returnsArg(0);
                HornetCacheStub.reset();
                HornetCacheStubInstance = sinon.spy();
                HornetCacheStub.getInstance = sinon.stub().returns(HornetCacheStubInstance);

                HornetCacheStubInstance.setCacheAsynchrone = sinon.stub().returns(HornetCacheStubInstance);
                HornetCacheStubInstance.finally = sinon.stub().yieldsAsync();
                HornetCacheStubInstance.getItem = sinon.stub();
            });

            afterEach(() => {
                superAgentPlugins.CachePlugin._cloneResponse.restore();
            });

            it("should not cache error request", () => {
                // Arrange
                var url = TestUtils.randomString();
                var callbackEndMethod = sinon.spy();
                var timeToLiveInCache = 10;

                var error = sinon.spy();
                var response = sinon.spy();

                // Act
                var endFunction = superAgentPlugins.CachePlugin._getMethodeEndForCache(url, callbackEndMethod, timeToLiveInCache);
                endFunction(error, response);

                // Assert
                expect(callbackEndMethod).to.be.calledWith(error, response);
            });

            it("should cache good request", function(done) {
                // Arrange
                var url = TestUtils.randomString();
                var timeToLiveInCache = 10;
                var response = sinon.spy();

                var callbackEndMethod = function(err, res) {
                    // Assert
                    expect(err).to.be.undefined;
                    expect(res).to.be.equals(response);
                    expect(superAgentPlugins.CachePlugin._cloneResponse).to.be.calledWith(response);
                    // expect(HornetCacheStubInstance.setCacheAsynchrone).to.be.calledWith(url, response, timeToLiveInCache);
                    done();
                };

                // Act
                var endFunction = superAgentPlugins.CachePlugin._getMethodeEndForCache(url, callbackEndMethod, timeToLiveInCache);
                endFunction(undefined, response);

            });
        });

        describe("_cloneResponse", () => {
            it("Should clone response", () => {
                // Arrange
                var mockRequest = {
                    body: TestUtils.randomString(),
                    header: TestUtils.randomString(),
                    ok: TestUtils.randomString(),
                    status: TestUtils.randomString(),
                    type: TestUtils.randomString()
                };
                var expectedRequest = _.cloneDeep(mockRequest);
                mockRequest[TestUtils.randomString()] = TestUtils.randomString();

                // Act
                var clonedRequest = superAgentPlugins.CachePlugin._cloneResponse(mockRequest);

                // Assert
                expect(clonedRequest).to.eql(expectedRequest);
            });
        });
    });
});
