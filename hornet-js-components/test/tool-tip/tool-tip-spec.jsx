"use strict";

var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

var logger = TestUtils.getLogger("hornet-js-components.test.tool-tip.tool-tip-spec");

var ToolTip = require("src/tool-tip/tool-tip");

describe("Infobulle", () => {

    // Arrange
    var props = {src: "/img/tooltip/ico_tooltip.png", alt: "intitulé infobulle", classSpan: "tooltip"};

    var context = {
        getStore: (store) => {
            return {
                getThemeUrl: function () {
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
    var $ = render(() =>
            <div>
                <ToolTip classSpan={props.classSpan} url={props.url} alt={props.alt} title={props.title}
                         src={props.src}/>
            </div>,
        context
    );

    // Assert
    it("doit afficher une infobulle avec les éléments requis", () => {
        var $span = $("span");
        expect($span).to.exist;
        expect($span).to.have.attr("data-tooltip");
        expect($span).to.have.class("tooltip");
        var $img = $("img");
        expect($img).to.exist;
        expect($img).to.have.attr("alt");
        expect($img).to.have.attr("src");
    });
});