"use strict";

var React = require("react/addons");

var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

// initialisation du logger
var logger = TestUtils.getLogger("hornet-js-components.test.dialog.alert-spec");

//noCallThru >>> le stub n'appelle AUCUNE des méthode du module mocké
var proxyquire = require("proxyquire").noCallThru();

var AlertDialog = proxyquire("src/dialog/alert", {
    "./dialog": require("test/dialog/generic-react-mock")()
});

describe("AlertSpec", () => {
    beforeEach(() => {
        this.context = {
            i18n: () => {
                return {
                    "title": "titre A afficher par défaut"
                };
            }
        };
    });

    //it('Test la construction de l alert', () => {
    //    var $ = render(() =>
    //            <AlertDialog isVisible={true}/>,
    //        this.context, true
    //    );
    //    expect($('div.widget-alert-body')).to.exist;
    //});
    //
    //it('Alert caché', () => {
    //    var $ = render(() =>
    //            <AlertDialog isVisible={false}/>,
    //        this.context
    //    );
    //    expect($('div')).to.not.exist;
    //});
});
