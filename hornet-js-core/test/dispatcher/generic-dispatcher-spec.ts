/// <reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import utils = require("hornet-js-utils");
import TestUtils = require('hornet-js-utils/src/test-utils');
var chai = TestUtils.chai;
var expect = chai.expect;

import PageInformationsStore = require('src/stores/page-informations-store');
import NotificationStore = require('src/stores/notification-store');
import GenericDispatcher = require('src/dispatcher/generic-dispatcher');

process.env.HORNET_CONFIG_DIR_APPLI = __dirname + '/config';

describe('GenericDispatcher', () => {

    before(() => {
        utils.setConfigObj({
            contextPath: "",
            themeUrl: "themeTestURL"
        });
    });

    it('should register default stores', () => {
        var dispatcher = new GenericDispatcher().getDispatcher();
        var fluxibleContext:FluxibleContext = dispatcher.createContext();
        var pageInformationStore = fluxibleContext.getActionContext().getStore(PageInformationsStore);
        var notificationStore = fluxibleContext.getActionContext().getStore(NotificationStore);
        expect(pageInformationStore).to.be.not.null;
        expect(notificationStore).to.be.not.null;
    });

});

