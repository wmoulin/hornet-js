"use strict";

var React = require('react');
var utils = require('hornet-js-utils');
var TestUtils = require('hornet-js-utils/src/test-utils');
var chai = TestUtils.chai;
var expect = chai.expect;
var sinon = TestUtils.sinon;
var render = TestUtils.render;
var logger = TestUtils.getLogger("hornet-js-components.test.navigation.plan-spec");

var Plan = require('src/navigation/plan');
var NavigationBaseStore = require('src/navigation/store/navigation-base-store').NavigationBaseStore;
var PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");

describe('PlanSpec', () => {
    it("doit afficher le plan de l'application avec restriction sur les rôles", () => {
        // Arrange
        var NavigationBaseStoreMock = {};
        NavigationBaseStoreMock.getConfigMenu = sinon.stub().returns(require('test/navigation/menu-test-app-conf').menu);

        var PageInformationStoreMock = {};
        PageInformationStoreMock.userHasRole = (roles) => {
            if (roles === 'user') {
                return true;
            } else {
                return false;
            }
        };

        var context = {};
        context.getStore = (store) => {
            if (store === PageInformationStore) {
                return PageInformationStoreMock;
            } else if (store === NavigationBaseStoreMock) {
                return NavigationBaseStoreMock;
            } else {
                chai.assert.fail(store, 'other', 'Appel de getStore avec un store inconnu');
                throw new Error('Appel de getStore avec un store inconnu');
            }
        };
        context.i18n = sinon.stub().returnsArg(0);

        // Act
        var $ = render(() =>
                <div id='planDuSiteTest'>
                    <Plan store={NavigationBaseStoreMock}/>
                </div>
            , context, true
        );

        // Assert
        expect($("a[href='/cas1']")).to.exist;
        expect($("a[href='/cas2']")).to.not.exist;
        expect($("a[href='/cas3']")).to.not.exist;
        expect($("li:contains('cas3')")).to.exist;
        expect($("a[href='/cas3.1']")).to.exist;
        expect($("a[href='/cas4']")).to.not.exist;
        expect($("a[href='/cas4.1']")).to.not.exist;
        expect($("a[href='/cas5']")).to.not.exist;
    });

});