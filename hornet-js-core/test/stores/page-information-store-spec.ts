"use strict";

import utils = require("hornet-js-utils");
import TestUtils = require("hornet-js-utils/src/test-utils");
import chai = require("chai");
var expect = chai.expect;

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-core.test.store.page-informations-store-spec");
import PageInformationsStore = require("src/stores/page-informations-store");

process.env.HORNET_CONFIG_DIR_APPLI = __dirname + "/config";

describe("PageInformationStore", () => {
    var target;

    beforeEach(() => {
        utils.setConfigObj({
            contextPath: "",
            themeUrl: "themeTestURL"
        });
        target = new PageInformationsStore(null);
    });

    it("should change page component", () => {
        // Arrange
        var myComponent = {test: "dummy"};

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        // Act
        var changePageFn = (PageInformationsStore.handlers.CHANGE_PAGE_COMPONENT).bind(target);
        changePageFn(myComponent);
        var firstEmitDone = emitDone;
        emitDone = false;
        changePageFn(myComponent);
        var secondEmitDone = emitDone;

        // Act
        var storeComponent = target.getCurrentPageComponent();

        // Assert
        expect(storeComponent).to.be.equal(myComponent);
        expect(firstEmitDone, "firstEmitDone").to.be.true;
        expect(secondEmitDone, "secondEmitDone").to.be.false;
    });

    it("should dehydrate store with informations", () => {
        //Arrange
        var myTheme = "dummy";

        var changeThemeFn = (PageInformationsStore.handlers.CHANGE_THEME).bind(target);
        changeThemeFn(myTheme);

        //Act
        var dehydratation = target.dehydrate();

        //Assert
        expect(dehydratation).to.exist.to.have.keys("themeName", "currentUser");
        expect(dehydratation.themeName).to.be.equals(myTheme);
    });

    it("should rehydrate store with informations", () => {
        //Arrange
        var myTheme = TestUtils.randomString();
        var myUser = {name: TestUtils.randomString()};

        //Act
        target.rehydrate({
            themeName: myTheme,
            currentUser: myUser
        });

        //Assert
        expect(target.getThemeName()).to.be.equals(myTheme);
        expect(target.getCurrentUser()).to.be.equals(myUser);
    });
});
