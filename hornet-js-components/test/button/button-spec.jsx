"use strict";

var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

var Button = require("src/button/button");

describe("Bouton", () => {
    it("doit être configuré avec les informations paramétrées", () => {
        // Arrange
        var item = {
            type: "submit",
            id: "form_btnTest",
            name: "btnTest",
            value: "test value",
            className: "hornet-button",
            label: "test label"
        };

        var context ={
            getStore: (store) => {
                return {
                    getThemeUrl : function() {
                        return "utltheme";
                    }
                };
            },
            executeAction: () => {
            },
            locale: "fr-FR",
            i18n: function (keysString) {
                return keysString;
            }
        };

        // Act
        var $ = render(() => <Button key={item.id + "_" + item.name} item={item}/>, context),
            $button = $("button");

        // Assert
        expect($button).to.have.attr("type", item.type);
        expect($button).to.have.attr("id", item.id);
        expect($button).to.have.attr("name", item.name);
        expect($button).to.have.attr("value", item.value);
        expect($button).to.have.class(item.className);
        expect($button).to.have.text(item.label);
    });
});
