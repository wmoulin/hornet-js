"use strict";

var utils = require('hornet-js-utils');

var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var sinon = TestUtils.sinon;
var render = TestUtils.render;

var logger = TestUtils.getLogger("hornet-js-components.test.dialog.dialog-spec");

//noCallThru >>> le stub n'appelle AUCUNE des méthode du module mocké
var proxyquire = require('proxyquire').noCallThru();

var modaleMock = require('test/dialog/generic-react-mock')();

utils.isServer = false;
//fourni un composant React qui sert de mock
var Dialog = proxyquire('src/dialog/modal', {
    'react-modal': modaleMock
});

utils.isServer = true;
describe('DialogueSpec', () => {
    beforeEach(() => {
        utils.isServer = false;
        this.context = {
            getStore: () => {
            },
            i18n: () => {
                return {
                    "title": "titre A afficher par défaut"
                };
            }
        };
    });

    it('Test la construction de la boîte de dialogue', () => {
        global.document = {
            getElementById: () => {
                return 'toto'
            }
        };

        var contenuDeLaDialogue = 'Contenu de la dialogue';
        var $ = render(() =>
                <Dialog isVisible={true}>
                    <div id='toto'>
                        {contenuDeLaDialogue}
                    </div>
                </Dialog>,
            this.context
        );

        //vérfie des élément de contenus
        expect($('div#toto')).to.exist
            .to.have.text(contenuDeLaDialogue);
        expect($('button.hornet-dialogue-croix')).to.exist;
        expect($('div.widget-dialogue-title')).to.exist;

        global.document = null;

    });
});
