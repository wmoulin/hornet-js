"use strict";

import utils = require("hornet-js-utils");
import TestUtils = require("hornet-js-utils/src/test-utils");
var chai = TestUtils.chai;
var expect = chai.expect;

import I18nFluxiblePlugin = require("hornet-js-core/src/i18n/i18n-fluxible-plugin");

process.env.HORNET_CONFIG_DIR_APPLI = __dirname + "/config";

describe("I18nFluxiblePlugin", () => {

    it("should find simple message with simple key", () => {
        var message:string = I18nFluxiblePlugin.getMessages("titre", {titre:"Titre de test"});

        expect(message).to.be.equal("Titre de test");
    });

    it("should find default simple message with simple key", () => {
        var message:string = I18nFluxiblePlugin.getMessagesOrDefault("applicationTitle", {titre:"Titre de test"}, {applicationTitle:"Titre de l'application"});

        expect(message).to.be.equal("Titre de l'application");
    });

    it("should find simple message with two parts key", () => {
        var message:string = I18nFluxiblePlugin.getMessages("config.titre", {config:{titre:"Titre de test"}});

        expect(message).to.be.equal("Titre de test");
    });

    it("should find simple message with 3 parts key", () => {
        var message:string = I18nFluxiblePlugin.getMessages("app.config.titre", {app:{config:{titre:"Titre de test"}}});

        expect(message).to.be.equal("Titre de test");
    });

    it("should find multiple messages with 2 parts key", () => {
        var messages:any = I18nFluxiblePlugin.getMessages("app.config", {app:{config:{titre:"Titre de test", sousTitre:"Sous-titre de test"}}});

        expect(messages).to.deep.equal({titre:"Titre de test", sousTitre:"Sous-titre de test"});
    });

    it("should not find messages for not existing key", () => {
        var message:string = I18nFluxiblePlugin.getMessages("bouton", {titre:"Titre de test"});

        expect(message).to.be.equal("bouton");
    });

    it("should not find default message with not existing key", () => {
        var message:string = I18nFluxiblePlugin.getMessagesOrDefault("bouton", {titre:"Titre de test"}, {titre:"Titre par défaut"});

        expect(message).to.be.equal("bouton");
    });

    it("should not find messages for undefined key", () => {
        var message:string = I18nFluxiblePlugin.getMessages(undefined, {titre:"Titre de test"});

        expect(message).to.be.undefined;
    });

    it("should detect common format message keys", () => {
        expect(I18nFluxiblePlugin.isMessageKey("applicationTitle")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("info")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("info2")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("form.valid")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("calendar.format.eras")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("info.message.IN-PA-RPA-01")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("info.message.IN_PA_RPA_01")).to.be.true;
        expect(I18nFluxiblePlugin.isMessageKey("a-b-c.d-e-f.g_h")).to.be.true;
    });

    it("should detect message keys that do not match common format", () => {
        expect(I18nFluxiblePlugin.isMessageKey("cle avec espaces")).to.be.false;
        expect(I18nFluxiblePlugin.isMessageKey("caractères_accentués")).to.be.false;
        expect(I18nFluxiblePlugin.isMessageKey("caractères(spéciaux)")).to.be.false;
        expect(I18nFluxiblePlugin.isMessageKey("cle..sousCle")).to.be.false;
    });
});
