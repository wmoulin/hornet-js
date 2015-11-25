"use strict";

var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var logger = TestUtils.getLogger("hornet-js-components.test.form.hornet-form-spec");
var render = TestUtils.render;

var Newforms = require('newforms');
var HornetForm = require('src/form/form');
var GridForm = require('src/form/grid-form');
var Grid = GridForm.GridForm;
var Section = GridForm.Section;
var Row = GridForm.Row;
var Field = GridForm.Field;

var i18n = require('hornet-js-core/src/i18n/i18n-fluxible-plugin').i18n;

describe('HornetForm', () => {

    var messages = {
        "form": {
            "valid": "Valider",
            "cancel": "Annuler",
            "reinit": "Réinitialiser",
            "search": "Rechercher",
            "fillField": "Les champs marqués d'un astérisque (*) doivent être renseignés.",
            "submitData": "Données soumises:"
        },
        "notification": {
            "errorsTitle": "Erreurs"
        }
    };
    var i18nfunc = i18n(messages);

    var formConf = {
            autoId: '{name}',
            labelSuffix: ''
        },
        subTitle = 'Sous-titre formulaire',
        context = {
            locale: "fr-FR",
            i18n: function (keysString) {
                return i18nfunc(keysString);
            },
            getStore: () => {
                return {
                    getCurrentCsrf() {
                        return "123456";
                    },
                    getInfoNotifications() {
                        return {}
                    },
                    getErrorNotifications() {
                        return {}
                    },
                    getThemeCss() {
                        return "";
                    }
                };
            },
            executeAction: () => {
            }
        };

    /**
     * Créée un formulaire pour le test
     *
     * @param fieldConf Les champs à ajouter au formulaire
     * @returns {void|*} un constructeur de Newforms
     */
    function prepareForm(fieldConf) {
        var fieldsConf = Array.isArray(fieldConf) ? fieldConf : [fieldConf],
            form = {
                labelSuffix: '',
                errorCssClass: 'error',
                requiredCssClass: 'required',
                validCssClass: 'valid'
            };

        for (var i = 0; i < fieldsConf.length; i++) {
            form[fieldsConf[i].key] = Newforms.CharField({
                label: fieldsConf[i].label,
                required: fieldsConf[i].required
            });
        }

        return Newforms.Form.extend(form);
    }

    it('doit afficher les éléments par défaut', () => {
        // Arrange

        var fieldConf = [],
            FormDef = prepareForm(fieldConf),
            form = new FormDef(formConf);

        // Act
        var $ = render(() =>(
                    <HornetForm
                        subTitle={subTitle}
                        form={form}
                        formClassName='formRecherche'/>), context
            ),
            $result = $('div.hornet-form');

        assertions($).assertBasicContent($result, subTitle);
    });

    it('le test doit afficher les éléments du formulaire', () => {
        // Arrange
        var fieldsConf = [{
                key: 'nom',
                label: 'Nom'
            }, {
                key: 'prenom',
                label: 'Prenom'
            }, {
                key: 'date',
                label: 'Date'
            }],
            FormDef = prepareForm(fieldsConf),
            form = new FormDef(formConf);

        // Act
        var $ = render(
            () => (
                <HornetForm form={form} subTitle={subTitle} formClassName='formRecherche'>
                    <Row>
                        <Field name="nom"/>
                        <Field name="prenom"/>
                    </Row>
                    <Row>
                        <Field name="date"/>
                    </Row>
                </HornetForm>
            ), context
        );
        var $result = $('div.hornet-form');

        assertions($)
            .assertBasicContent($result, subTitle)
            .assertFieldsPresent($result, fieldsConf);
    });
});

function assertions($) {
    var asserts = {};
    asserts.assertBasicContent = function ($formBloc, subTitle) {
        expect($formBloc).to.have.class('hornet-form');

        var $formInfo = $formBloc.children('p.discret');

        expect($formInfo, 'p.discret').to.exist
            .to.have.text("Les champs marqués d'un astérisque (*) doivent être renseignés.");

        var $form = $formBloc.find('form');
        expect($form, 'form').to.exist;

        var $formTitle = $form.find('h3');
        expect($formTitle, 'h3').to.exist
            .to.have.text(subTitle);

        var $formButtonBloc = $form.find('.button-group');
        expect($formButtonBloc, '.button-group').to.exist;

        var $buttonRecherche = $($formButtonBloc).find("#form_btnValider");
        expect($buttonRecherche, "#form_btnValider").to.exist
            .to.have.text('Valider');

        var $buttonReinit = $($formButtonBloc).find("#form_btnCancel");
        expect($buttonReinit, "#form_btnCancel").to.exist
            .to.have.text('Annuler');

        return asserts;
    };

    /**
     * Contrôle la présence des champs par rapport à la configuration de ceux-ci.
     *
     * @param $container
     * @param fieldsConf
     */
    asserts.assertFieldsPresent = function ($container, fieldsConf) {
        $.each(fieldsConf, function (fieldConf, i) {
            expect($container.find('label[for="' + fieldConf.label.toLowerCase() + '"]'))
                .to.exist
                .to.have.text(fieldConf.label);
        });

        return asserts;
    };

    return asserts;
}
