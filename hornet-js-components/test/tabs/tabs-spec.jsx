"use strict";

var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var sinon = TestUtils.sinon;

var logger = TestUtils.getLogger("hornet-js.component.test.tabs.tabs-spec");

var Tabs = require("src/tab/tabs");
var Tab = require("src/tab/tab");

describe("TabsSpec", () => {
    it("", () => {
        // Act
        var $ = render(() =>
                <Tabs selectedTabIndex={1}>
                    <Tab title="Titre premier onglet">
                        <h5>Montre Le premier onglet</h5>
                    </Tab>
                    <Tab title="Titre second onglet">
                        <h3>Montre second onglet</h3>
                    </Tab>
                </Tabs>,
            context, true
        );

        // Assert
        expect(".onglets").to.exist;
        expect($("li")[0]).to.exist;
        expect($("li")[1]).to.exist;

        expect($("a:contains('Titre premier onglet')")).to.exist;
        expect($("a:contains('Titre second onglet')")).to.exist;

        var selectedPanel = $("div.hornet-tab-panel-selected");
        expect(selectedPanel).to.exist;
        expect($("h3:contains('Montre second onglet')", selectedPanel)).to.exist;
    });
});
