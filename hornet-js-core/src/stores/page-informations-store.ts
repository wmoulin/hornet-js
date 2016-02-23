"use strict";

import BaseStore = require("fluxible/addons/BaseStore");

import authenticationUtils = require("hornet-js-utils/src/authentication-utils");
import utils = require("hornet-js-utils");

var logger = utils.getLogger("hornet-js-core.stores.page-informations-store");

class PageInformationsStore extends BaseStore {

    static storeName:string = "PageInformationStore";

    private currentUrl:string;
    private currentUser:authenticationUtils.UserInformations;
    private currentPageComponent:string;

    private defaultThemeUrl:string;
    private currentThemeUrl:string;

    private themeName:string;
    private defaultThemeName:string;
    private currentThemeName:string;

    static handlers:any = {
        "CHANGE_PAGE_COMPONENT": function (newPage:any) {
            logger.debug("CHANGE PAGE - current Page :",
                (this.currentPageComponent) ? this.currentPageComponent.displayName : "",
                ", new Page :", (newPage) ? newPage.displayName : "");

            if (this.currentPageComponent !== newPage) {
                this.currentPageComponent = newPage;
                this.emitChange();
            }
        },
        "CHANGE_THEME": function (themeName:string) {
            logger.debug("CHANGE THEME - current Theme Name :", this.currentThemeName, ", new Theme Name:", this.themeName);
            this.themeName = themeName;
            this.emitChange();
        },
        "CHANGE_URL": function (newUrl:string) {
            logger.debug("CHANGE URL - current Url :", this.currentUrl, " , new Url :", newUrl);
            if (this.currentUrl !== newUrl) {
                this.currentUrl = newUrl;
            }
        },
        "CHANGE_LOGGED_USER": function (newUser:authenticationUtils.UserInformations) {
            logger.trace("CHANGE LOGGED USER  - current User :", this.currentUser, ", new User :", newUser);
            if (this.currentUser !== newUser) {
                this.currentUser = newUser;
                this.emitChange();
            }
        }
    }

    constructor(dispatcher) {
        super(dispatcher);
        this.currentPageComponent = undefined;
        this.currentUrl = "";

        this.currentUser = null;

        this.defaultThemeUrl = utils.config.get("themeUrl");
        this.defaultThemeName = this.getDefaultThemeName();

        this.currentThemeUrl = this.defaultThemeUrl;
        this.currentThemeName = this.defaultThemeName;

        this.themeName = this.currentThemeName;
    }

    getCurrentPageComponent():string {
        return this.currentPageComponent;
    }

    getCurrentUrl():string {
        return this.currentUrl;
    }

    getCurrentUrlWithoutContextPath():string {
        return this.currentUrl.replace(utils.getContextPath(), "");
    }

    getThemeName():string {
        return this.themeName || this.defaultThemeName;
    }

    getThemeUrl():string {
        var themeUrl:string;

        if (!this.themeName || this.themeName === this.defaultThemeName) {
            themeUrl = this.defaultThemeUrl;
            this.currentThemeUrl = themeUrl;
        } else {
            if (this.currentThemeName !== this.themeName) {
                themeUrl = this.defaultThemeUrl.replace(this.defaultThemeName, this.themeName);
                this.currentThemeName = this.themeName;
                this.currentThemeUrl = themeUrl;
            } else {
                themeUrl = this.currentThemeUrl;
            }
        }
        return themeUrl;
    }

    private getDefaultThemeName() {
        return this.defaultThemeUrl.slice(this.defaultThemeUrl.lastIndexOf("/") + 1, this.defaultThemeUrl.length);
    }

    getCurrentUser():authenticationUtils.UserInformations {
        return this.currentUser;
    }

    isAuthenticated():boolean {
        return this.currentUser !== null;
    }

    userHasRole(roles:any):boolean {
        return authenticationUtils.AuthUtils.userHasRole(this.currentUser, roles);
    }

    rehydrate(state:any) {
        this.themeName = state.themeName;
        this.currentUser = state.currentUser;
    }

    dehydrate():any {
        return {
            themeName: this.themeName,
            currentUser: this.currentUser
        };
    }
}

export = PageInformationsStore;
