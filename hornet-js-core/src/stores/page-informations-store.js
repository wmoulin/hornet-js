///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseStore = require("fluxible/addons/BaseStore");
var authenticationUtils = require("hornet-js-utils/src/authentication-utils");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.stores.page-informations-store");
var PageInformationsStore = (function (_super) {
    __extends(PageInformationsStore, _super);
    function PageInformationsStore(dispatcher) {
        _super.call(this, dispatcher);
        this.currentPageComponent = undefined;
        this.currentUrl = "";
        this.currentUser = null;
        this.defaultThemeUrl = utils.config.get("themeUrl");
        this.defaultThemeName = this.getDefaultThemeName();
        this.currentThemeUrl = this.defaultThemeUrl;
        this.currentThemeName = this.defaultThemeName;
        this.themeName = this.currentThemeName;
    }
    PageInformationsStore.prototype.getCurrentPageComponent = function () {
        return this.currentPageComponent;
    };
    PageInformationsStore.prototype.getCurrentUrl = function () {
        return this.currentUrl;
    };
    PageInformationsStore.prototype.getCurrentUrlWithoutContextPath = function () {
        return this.currentUrl.replace(utils.getContextPath(), "");
    };
    PageInformationsStore.prototype.getThemeName = function () {
        return this.themeName || this.defaultThemeName;
    };
    PageInformationsStore.prototype.getThemeUrl = function () {
        var themeUrl;
        if (!this.themeName || this.themeName == this.defaultThemeName) {
            themeUrl = this.defaultThemeUrl;
            this.currentThemeUrl = themeUrl;
        }
        else {
            if (this.currentThemeName != this.themeName) {
                themeUrl = this.defaultThemeUrl.replace(this.defaultThemeName, this.themeName);
                this.currentThemeName = this.themeName;
                this.currentThemeUrl = themeUrl;
            }
            else {
                themeUrl = this.currentThemeUrl;
            }
        }
        return themeUrl;
    };
    PageInformationsStore.prototype.getDefaultThemeName = function () {
        return this.defaultThemeUrl.slice(this.defaultThemeUrl.lastIndexOf("/") + 1, this.defaultThemeUrl.length);
    };
    PageInformationsStore.prototype.getCurrentUser = function () {
        return this.currentUser;
    };
    PageInformationsStore.prototype.isAuthenticated = function () {
        return this.currentUser !== null;
    };
    PageInformationsStore.prototype.userHasRole = function (roles) {
        return authenticationUtils.AuthUtils.userHasRole(this.currentUser, roles);
    };
    PageInformationsStore.prototype.rehydrate = function (state) {
        this.themeName = state.themeName;
        this.currentUser = state.currentUser;
    };
    PageInformationsStore.prototype.dehydrate = function () {
        return {
            themeName: this.themeName,
            currentUser: this.currentUser
        };
    };
    PageInformationsStore.storeName = "PageInformationStore";
    PageInformationsStore.handlers = {
        "CHANGE_PAGE_COMPONENT": function (newPage) {
            logger.debug("CHANGE PAGE - current Page :", (this.currentPageComponent) ? this.currentPageComponent.displayName : "", ", new Page :", (newPage) ? newPage.displayName : "");
            if (this.currentPageComponent !== newPage) {
                this.currentPageComponent = newPage;
                this.emitChange();
            }
        },
        "CHANGE_THEME": function (themeName) {
            logger.debug("CHANGE THEME - current Theme Name :", this.currentThemeName, ", new Theme Name:", this.themeName);
            this.themeName = themeName;
            this.emitChange();
        },
        "CHANGE_URL": function (newUrl) {
            logger.debug("CHANGE URL - current Url :", this.currentUrl, " , new Url :", newUrl);
            if (this.currentUrl !== newUrl) {
                this.currentUrl = newUrl;
            }
        },
        "CHANGE_LOGGED_USER": function (newUser) {
            logger.trace("CHANGE LOGGED USER  - current User :", this.currentUser, ", new User :", newUser);
            if (this.currentUser !== newUser) {
                this.currentUser = newUser;
                this.emitChange();
            }
        }
    };
    return PageInformationsStore;
})(BaseStore);
module.exports = PageInformationsStore;
//# sourceMappingURL=page-informations-store.js.map