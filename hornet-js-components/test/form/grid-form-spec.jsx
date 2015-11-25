"use strict";

var utils = require('hornet-js-utils');
var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

var Newforms = require('newforms');
var RenderForm = Newforms.RenderForm;
var GridForm = require('src/form/grid-form');
var Grid = GridForm.GridForm;
var FieldSet = GridForm.FieldSet;
var Row = GridForm.Row;
var Field = GridForm.Field;

var logger = utils.getLogger("hornet-js-components.test.form.grid-form-spec");

describe('GridForm', () => {
    var formConf = {
        autoId: '{name}',
        labelSuffix: ''
    };

    var context = {
        locale: "fr-FR",
        i18n: function (keysString) {
            return keysString;
        },
        getStore: (store) => {
            return {
                getThemeUrl : function() {
                    return "utltheme";
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

    describe('Field', () => {
        it('doit afficher un champ facultatif à partir des informations du form', () => {
            // Arrange
            var fieldConf = {
                    key: 'nom',
                    label: 'Nom',
                    required: false
                },
                FormDef = prepareForm(fieldConf),
                form = new FormDef(formConf);

            // Act
            //
            // <Field name="nom" span="1" form={form} context={context} />
            //<Fieldtestwrapper span="1" form={form} context={context} name="nom"/>
            //logger.debug("ZE FORM ", form);

            var $ = render(() =>(
                <Grid form={form} >
                    <Field name="nom" span="1"/>
                </Grid>
            ), context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');
            asserts.assertGrid($result);
            var $gridFormField = $result.find('.grid-form-field');
            expect($gridFormField).to.have.class('pure-u-1-1');
            asserts.assertField($gridFormField, fieldConf);
        });

        it('doit afficher un champ obligatoire à partir des informations du form', () => {
            // Arrange
            var fieldConf = {
                    key: 'nom',
                    label: 'Nom',
                    required: true
                },
                FormDef = prepareForm(fieldConf),
                form = new FormDef(formConf);

            // Act
            var $ = render(() => (
                    <Grid form={form}>
                        <Field name="nom" span="1" />
                    </Grid>
                ), context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');

            asserts.assertGrid($result);
            var $gridFormField = $result.find('.grid-form-field');
            expect($gridFormField).to.have.class('pure-u-1-1');
            asserts.assertField($gridFormField, fieldConf);
        });
    });

    describe('Row', () => {
        it('doit afficher un unique champ dans un bloc', () => {
            // Arrange
            var fieldConf = {
                    key: 'nom',
                    label: 'Nom'
                },
                FormDef = prepareForm(fieldConf),
                form = new FormDef(formConf);

            // Act
            var $ = render(() => (
                <RenderForm form={form}>
                    <Grid>
                        <Row>
                            <Field name="nom" />
                        </Row>
                    </Grid>
                </RenderForm>),context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');
            asserts.assertGrid($result);
            var $gridRows = $result.find('div.formmgr-row');
            var $rows = $gridRows.find('div.grid-form-field');
            asserts.assertRow($gridRows, [fieldConf]);
            asserts.assertFields($rows, [fieldConf]);
        });

        it('doit afficher deux champs dans leurs blocs', () => {
            // Arrange
            var fieldsConf = [{
                    key: 'nom',
                    label: 'Nom'
                }, {
                    key: 'prenom',
                    label: 'Prenom'
                }],
                FormDef = prepareForm(fieldsConf),
                form = new FormDef(formConf);

            // Act
            var $ = render(() =>(
                <RenderForm form={form}>
                    <Grid>
                        <Row>
                            <Field name="nom" />
                            <Field name="prenom" />
                        </Row>
                    </Grid>
                </RenderForm>), context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');
            asserts.assertGrid($result);
            var $gridRows = $result.find('div.formmgr-row');
            var $rows = $gridRows.find('div.grid-form-field');
            asserts.assertRow($gridRows, fieldsConf);
            asserts.assertFields($rows, fieldsConf);
        });
    });

    describe('GroupeChamps', () => {
        it('doit afficher des champs dans une ligne', () => {
            // Arrange
            var fieldConf = {
                    key: 'nom',
                    label: 'Nom'
                },
                sectionName = 'Section 1',
                FormDef = prepareForm(fieldConf),
                form = new FormDef(formConf);

            // Act
            var $ = render(() =>(
                <RenderForm form={form}>
                    <Grid>
                        <FieldSet name={sectionName} classNames="hornet-fieldset">
                            <Row>
                                <Field name="nom" />
                            </Row>
                        </FieldSet>
                    </Grid>
                </RenderForm>), context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');
            asserts.assertGrid($result);
            asserts.assertGroupeChamps($result, sectionName);
            var $gridRows = $result.find('div.formmgr-row');
            var $rows = $gridRows.find('div.grid-form-field');
            asserts.assertRow($gridRows, [fieldConf]);
            asserts.assertFields($rows, [fieldConf]);
        });
    });

    describe('Grid', () => {
        it('doit afficher des lignes', () => {
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
            var $ = render(() =>(
                <RenderForm form={form}>
                    <Grid>
                        <Row>
                            <Field name="nom" fieldClassName="pure-u-1-3"/>
                            <Field name="prenom" />
                        </Row>
                        <Row>
                            <Field name="date" />
                        </Row>
                    </Grid>
                </RenderForm>),context);

            // Assert
            var asserts = assertions($),
                $result = $('div.grid-form');
            asserts.assertGrid($result);
            // 2 lignes attendues
            var $gridRows = $result.find('div.formmgr-row');
            expect($gridRows).with.length(2);
            // la première ligne doit contenir les deux premiers champs
            asserts.assertRow($($gridRows[0]), [fieldsConf[0], fieldsConf[1]]);
            var $firstRow = asserts.extractCols($($gridRows[0]));
            asserts.assertFields($firstRow, [fieldsConf[0], fieldsConf[1]]);
            // la seconde ligne doit contenir le dernier champ
            asserts.assertRow($($gridRows[1]), [fieldsConf[2]]);
            var $secondRow = asserts.extractCols($($gridRows[1]));
            asserts.assertFields($secondRow, [fieldsConf[2]]);
        });
    });
});

function assertions($) {
    var asserts = {};

    asserts.extractCols = function ($row) {
        return $row.find('div.grid-form-field');
    };

    /**
     * Contrôle le contenu de $gridForm
     *
     * @param $gridForm
     */
    asserts.assertGrid = function ($gridForm) {
        expect($gridForm)
            .to.have.class('grid-form')
            .to.have.class('pure-g-r');

        return asserts;
    };

    /**
     * Contrôle la présence de la section
     *
     * @param $gridForm
     * @param sectionName
     */
    asserts.assertGroupeChamps = function ($gridForm, sectionName) {
        var $section = $gridForm.find('.hornet-fieldset');
        expect($section).to.exist;

        expect($section.find('legend')).to.have.text(sectionName);
        expect($section.find('.formmgr-row')).to.exist;

        return asserts;
    };

    /**
     * Contrôle le contenu de la ligne dans $gridForm par rapport à la configuration des champs.
     *
     * @param $gridForm
     * @param fieldsConf
     * @returns {Array}
     */
    asserts.assertRow = function ($gridRow, fieldsConf) {
        expect($gridRow).to.exist;
        expect($gridRow).to.have.class('pure-g-r');

        if (fieldsConf.length > 0) {
            expect($gridRow).to.have.descendants('.grid-form-field');

            var $cols = asserts.extractCols($gridRow);
            expect($cols).with.length(fieldsConf.length);
        }

        return asserts;
    }

    /**
     * Contrôle le contenu des champs dans la ligne par rapport à la configuration de ceux-ci.
     *
     * @param $rows
     * @param fieldsConf
     */
    asserts.assertFields = function ($rows, fieldsConf) {
        $rows.each(function (i) {
            var $fieldContainer = $(this);
            expect($fieldContainer).to.have.class('pure-u-1-' + fieldsConf.length);
            expect($fieldContainer.find('label'))
                .to.exist
                .to.have.text(fieldsConf[i].label);

            asserts.assertField($fieldContainer, fieldsConf[i]);
        });

        return asserts;
    }

    /**
     * Contrôle le contenu du champ par rapport à la configuration de celui-ci.
     *
     * @param $gridFormField
     * @param fieldConf     */
    asserts.assertField = function ($gridFormField, fieldConf) {
        expect($gridFormField).to.exist;

        // deux sous div (colonnes label et champ)
        var $fieldGrid = $gridFormField.children('div.pure-g-r');
        expect($fieldGrid).to.exist;
        var $fieldCols = $fieldGrid.children('div');
        expect($fieldCols).with.length(2);
        var $fieldLabelCol = $($fieldCols[0]);
        var $fieldLabel = $fieldLabelCol.children('label');
        expect($fieldLabel).to.exist;
        if (fieldConf.required) {
            expect($fieldLabel.text())
                .to.contain(fieldConf.label)
                .to.contain('*');
            expect($fieldLabelCol.find('span.required'))
                .to.exist
                .to.have.text('*');
        } else {
            expect($fieldLabel).to.have.text(fieldConf.label);
        }
        expect($fieldLabel).to.have.attr('for', fieldConf.label.toLowerCase());

        var $fieldInputCol = $($fieldCols[1]);
        var $fieldInput = $fieldInputCol.children('input');
        expect($fieldInput).to.exist;
        expect($fieldInput).to.have.attr('type', 'text');
        expect($fieldInput).to.have.attr('id', fieldConf.label.toLowerCase());
        expect($fieldInput).to.have.attr('name', fieldConf.label.toLowerCase());

        return asserts;
    }

    return asserts;
}