"use strict";
import utils = require("hornet-js-utils");

import RouterData = require("src/routes/router-data");
import matcher = require("src/routes/route-matcher");
import routerInterfaces = require("src/routes/router-interfaces");
import TestUtils = require("hornet-js-utils/src/test-utils");

var expect = TestUtils.chai.expect;
var sinon = TestUtils.sinon;
var logger = TestUtils.getLogger("hornet-js-core.test.routes.router-data-spec");

//mock pour la config
utils.setConfigObj({
    services: {
        host: "",
        name: "test"
    }
});

describe("RouteMatcher", () => {
    var matchFn:routerInterfaces.MatchFn;
    var matcherBuilder:matcher.RouteMatcher;
    var buildRouteHandlerMock:any;
    var mockRouteHandler;

    beforeEach(() => {
        matcherBuilder = new matcher.RouteMatcher();
        mockRouteHandler = sinon.spy();

        buildRouteHandlerMock = sinon.stub();
        buildRouteHandlerMock.returnsArg(0);
        var routerMock = {
            "buildRouteHandler": buildRouteHandlerMock
        };
        matchFn = matcherBuilder.getMatcher(<any>routerMock);
        utils.isServer = true;
    });


    it("should build get route by default", () => {
        // Arrange
        var path = TestUtils.randomString();

        // Act
        matchFn(path, mockRouteHandler);

        // Assert
        var route = matcherBuilder.routes[path];
        expect(route).to.exist;
        expect(route["get"]).to.be.equals(mockRouteHandler);
        expect(buildRouteHandlerMock).to.have.been.calledOnce;
    });

    it("should not accept same route multiple times", () => {
        // Arrange
        var path = TestUtils.randomString();
        // Act
        matchFn(path, mockRouteHandler);

        expect(() => {
            matchFn(path, mockRouteHandler);
        }).to.throw(Error);


        // Assert
        expect(buildRouteHandlerMock).to.have.been.calledOnce;
    });

    it("should build get route on client by default", () => {
        // Arrange
        var path = TestUtils.randomString();
        utils.isServer = false;

        // Act
        matchFn(path, mockRouteHandler);

        // Assert
        var route = matcherBuilder.routes[path];
        expect(route).to.be.equals(mockRouteHandler);
        expect(buildRouteHandlerMock).to.have.been.calledOnce;
    });

    it("should build lazy route on server", () => {
        // Arrange
        var path = TestUtils.randomString();
        var fileToLoad = TestUtils.randomString();

        // Act
        matchFn.lazy(path, fileToLoad);

        // Assert
        var routes = matcherBuilder.lazyRoutes;
        expect(routes).to.have.length(1);
        expect(routes[0].path).to.be.equals(path);
        expect(routes[0].fileToLoad).to.be.equals(fileToLoad);
    });

    it("should build lazy route on client", () => {
        // Arrange
        var path = TestUtils.randomString();
        var fileToLoad = TestUtils.randomString();
        utils.isServer = false;

        // Act
        matchFn.lazy(path, fileToLoad);

        // Assert
        var routeFn = matcherBuilder.routes[path + "/?((\w|.)*)"];
        expect(matcherBuilder.lazyRoutes).to.have.length(0);
        expect(routeFn).to.exist;
        var route = routeFn();
        expect(route.composant).to.be.equals("NOTHING");
        expect(route.lazyRoutesParam).to.exist;
        expect(route.lazyRoutesParam.path).to.be.equals(path);
        expect(route.lazyRoutesParam.fileToLoad).to.be.equals(fileToLoad);
    });
});

describe("Router getUrlParameters", () => {

    beforeEach(() => {
        utils.isServer = true;
    });

    it("should get empty parameter if url without parameters", () => {
        // Arrange
        var url = TestUtils.randomString();
        var expected = {};

        // Act
        var result = RouterData.getUrlParameters(url);

        // Assert
        expect(result).to.deep.equal(expected);
    });

    it("should get empty parameter if no url", () => {
        // Arrange
        var url = '';
        var expected = {};

        //Act
        var result = RouterData.getUrlParameters(url);

        //Assert
        expect(result).to.deep.equal(expected);
    });

    it("should get one parameter", () => {
        // Arrange
        var param1 = TestUtils.randomString(10);
        var param1Value = TestUtils.randomString(10);
        var url = TestUtils.randomString(5) + "?" + param1 + "=" + param1Value;

        var expected = {};
        expected[param1] = param1Value;

        // Act
        var result = RouterData.getUrlParameters(url);

        // Assert
        expect(result).to.deep.equal(expected);
    });

    it("should get two parameters", () => {
        // Arrange
        var param1 = TestUtils.randomString(10);
        var param1Value = TestUtils.randomString(10);

        var param2 = TestUtils.randomString(10);
        var param2Value = TestUtils.randomString(10);
        var url = TestUtils.randomString(5) + "??" + param1 + "=" + param1Value + "&" + param2 + '=' + param2Value;

        var expected = {};
        expected[param1] = param1Value;
        expected[param2] = param2Value;

        //Act
        var result = RouterData.getUrlParameters(url);

        //Assert
        expect(result).to.deep.equal(expected);
    });

    it("should not get no value parameter", () => {
        // Arrange
        var param1 = TestUtils.randomString(10);
        var url = TestUtils.randomString(5) + "?" + param1;

        var expected = {};

        //Act
        var result = RouterData.getUrlParameters(url);

        //Assert
        expect(result).to.deep.equal(expected);
    });
});


describe("Router loadLazyRoutesRecursively", () => {

    it("should load one lazy route", () => {
        // Arrange
        var routerStub = <any>{};
        routerStub.configuration = {};
        routerStub.configuration.routesLoaderfn = sinon.stub();
        routerStub.parseRoutes = sinon.stub();
        routerStub.directorRouter = {};
        routerStub.directorRouter.mount = sinon.stub();
        routerStub.loadLazyRoutesRecursively = (<any>RouterData.prototype).loadLazyRoutesRecursively;

        var lazyRoutesInfos = [{path: TestUtils.randomString(), fileToLoad: TestUtils.randomString()}];

        //First Call
        routerStub.configuration.routesLoaderfn.onFirstCall().returns(sinon.stub());
        var parseRoutesFirstCall = <any>{};
        parseRoutesFirstCall.routes = TestUtils.randomString();
        routerStub.parseRoutes.onFirstCall().returns(parseRoutesFirstCall);

        //Act
        (<any>RouterData.prototype).loadLazyRoutesRecursively.call(routerStub, lazyRoutesInfos);

        //Assert
        expect(routerStub.directorRouter.mount).to.have.been.calledWithExactly(parseRoutesFirstCall.routes, lazyRoutesInfos[0].path);
    });


    it("should load two lazy routes recursively", () => {
        // Arrange
        var routerStub = <any>{};
        routerStub.configuration = {};
        routerStub.configuration.routesLoaderfn = sinon.stub();
        routerStub.parseRoutes = sinon.stub();
        routerStub.directorRouter = {};
        routerStub.directorRouter.mount = sinon.stub();
        routerStub.loadLazyRoutesRecursively = (<any>RouterData.prototype).loadLazyRoutesRecursively;

        var lazyRoutesInfos = [{path: TestUtils.randomString(), fileToLoad: TestUtils.randomString()}];
        var secondLazyRoutesInfos = [{path: TestUtils.randomString(), fileToLoad: TestUtils.randomString()}];

        // First Call
        routerStub.configuration.routesLoaderfn.onFirstCall().returns(sinon.stub());
        var parseRoutesFirstCall = <any>{};
        parseRoutesFirstCall.routes = TestUtils.randomString();
        parseRoutesFirstCall.lazyRoutes = secondLazyRoutesInfos;
        routerStub.parseRoutes.onFirstCall().returns(parseRoutesFirstCall);

        // Second Call
        routerStub.configuration.routesLoaderfn.onSecondCall().returns(sinon.stub());
        var parseRoutesSecondCall = <any>{};
        parseRoutesSecondCall.routes = TestUtils.randomString();
        routerStub.parseRoutes.onSecondCall().returns(parseRoutesSecondCall);

        // Act
        (<any>RouterData.prototype).loadLazyRoutesRecursively.call(routerStub, lazyRoutesInfos);

        // Assert
        expect(routerStub.directorRouter.mount).to.have.been.calledWithExactly(parseRoutesFirstCall.routes, lazyRoutesInfos[0].path);
        expect(routerStub.directorRouter.mount).to.have.been.calledWithExactly(parseRoutesSecondCall.routes, secondLazyRoutesInfos[0].path);

    });

    describe("Router Data getUrlParameters", () => {

        beforeEach(() => {
            utils.isServer = true;
        });

        it("should get empty parameter if url without parameters", () => {
            // Arrange
            var url = TestUtils.randomString();
            var expected = {};

            // Act
            var result = RouterData.getUrlParameters(url);

            // Assert
            expect(result).to.deep.equal(expected);
        });

        it("should get empty parameter if no url", () => {
            // Arrange
            var url = "";
            var expected = {};

            // Act
            var result = RouterData.getUrlParameters(url);

            // Assert
            expect(result).to.deep.equal(expected);
        });

        it("should get one parameter", () => {
            // Arrange
            var param1 = TestUtils.randomString(10);
            var param1Value = TestUtils.randomString(10);
            var url = TestUtils.randomString(5) + "?" + param1 + "=" + param1Value;

            var expected = {};
            expected[param1] = param1Value;

            // Act
            var result = RouterData.getUrlParameters(url);

            // Assert
            expect(result).to.deep.equal(expected);
        });

        it("should get two parameters", () => {
            // Arrange
            var param1 = TestUtils.randomString(10);
            var param1Value = TestUtils.randomString(10);

            var param2 = TestUtils.randomString(10);
            var param2Value = TestUtils.randomString(10);
            var url = TestUtils.randomString(5) + "??" + param1 + "=" + param1Value + "&" + param2 + "=" + param2Value;

            var expected = {};
            expected[param1] = param1Value;
            expected[param2] = param2Value;

            // Act
            var result = RouterData.getUrlParameters(url);

            // Assert
            expect(result).to.deep.equal(expected);
        });

        it("should not get no value parameter", () => {
            // Arrange
            var param1 = TestUtils.randomString(10);
            var url = TestUtils.randomString(5) + "?" + param1;

            var expected = {};

            // Act
            var result = RouterData.getUrlParameters(url);

            // Assert
            expect(result).to.deep.equal(expected);
        });
    });
});
