"use strict";

var utils = require('hornet-js-utils');
var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var context = require('test/navigation/bread-crumb-dispatcher-mock');
var contextAccueil = require('test/navigation/bread-crumb-dispatcher-mock-accueil');
var contextPartenairesListe = require('test/navigation/bread-crumb-dispatcher-mock-liste-partenaires');
var FilAriane = require('src/navigation/bread-crumb');

var logger = TestUtils.getLogger("hornet-js-components.test.navigation.bread-crumb-spec");

describe('FilAriane', () => {
    it('doit être configuré avec les informations paramétrées', () => {

        // Act
        var $ = render(() =>
                <div>
                    <FilAriane store={context.getStore()}/>
                </div>
            , context
        );

        // Assert
        var $breadCrumb = $('div#breadcrumb');

        expect($breadCrumb).to.exist;
        var $firstAriane = $breadCrumb.find('li.fil-ariane-racine');
        expect($firstAriane).to.exist;
        var $firstChevron = $breadCrumb.find('span.fil-ariane-chevron');
        expect($firstChevron).to.exist;

        // Act
        var $ = render(() =>
                <div>
                    <FilAriane store={contextAccueil.getStore()}/>
                </div>
            , contextAccueil
        );

        // Assert
        var $breadCrumb = $('div#breadcrumb');

        expect($breadCrumb).to.exist;

        var $firstAriane = $breadCrumb.find('li.fil-ariane-racine');
        expect($firstAriane).to.not.exist;

        var $firstChevron = $breadCrumb.find('span.fil-ariane-chevron');
        expect($firstChevron).to.not.exist;


        // Act
        var $ = render(() =>
                <div>
                    <FilAriane store={contextPartenairesListe.getStore()}/>
                </div>
            , contextPartenairesListe
        );

        // Assert
        var $breadCrumb = $('div#breadcrumb');

        expect($breadCrumb).to.exist;
        var $firstAriane = $breadCrumb.find('li.fil-ariane-racine');
        expect($firstAriane).to.exist;
        var $firstChevron = $breadCrumb.find('span.fil-ariane-chevron');
        expect($firstChevron).to.exist;
        var $firstAriane = $breadCrumb.find('li.fil-ariane-parent');
        expect($firstAriane).to.exist;

    });
});
