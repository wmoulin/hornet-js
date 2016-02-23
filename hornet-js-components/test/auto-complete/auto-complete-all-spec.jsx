"use strict";

var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var logger = TestUtils.getLogger("hornet-js-components.test.auto-complete.auto-complete-all-spec");
var render = TestUtils.render;
var newforms = require("newforms");
var GridForm = require("src/form/grid-form");
var HornetForm = require("src/form/form");
var Grid = GridForm.GridForm;
var Row = GridForm.Row;
var Field = GridForm.Field;
var AutoCompleteField = require("src/auto-complete/auto-complete-field");
var AutoCompleteSelector = require("src/auto-complete/auto-complete-selector");
var i18n = require("hornet-js-core/src/i18n/i18n-fluxible-plugin").i18n;

describe("AutoComplete", () => {
    var formConf = {
        autoId: "{name}",
        labelSuffix: ""
    };

    /**
     * Créée un formulaire pour le test
     *
     * @param fieldConf Les champs à ajouter au formulaire
     * @returns {void|*} un constructeur de Newforms
     */
    function prepareForm() {
        var form = {
            autocomplete: AutoCompleteField({
                store: {
                    class: construitStore(),
                    functionName: "getListe"
                },
                actionClass: {},
                label: "label",
                required: true,
                errorMessages: {
                    required: "champ obligatoire"
                },
                i18n: {}
            }),
            labelSuffix: "",
            errorCssClass: "error",
            requiredCssClass: "required",
            validCssClass: "valid"
        };


        return newforms.Form.extend(form);
    }

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
    describe("Champ AutoComplete", () => {
        it("doit avoir un champ input", () => {
            // Arrange
            var FormDef = prepareForm(),
                form = new FormDef(formConf);


            var $ = render(() =>(
                <HornetForm form={form}>
                    <Field name="autocomplete" span="1"/>
                </HornetForm>
            ), context, true);
            expect($("input")).to.exist;
        });
        it("la liste doit être alimentée", () => {

            // Act
            var $ = render(() =>
                    <div>
                        <AutoCompleteSelector
                            choices={getAutoCompleteChoices()}
                            currentTyppedText="fra"
                            selectorId="nationalite$select"
                            showComponent={true}
                        />
                    </div>
                , context
            );
            logger.error("RENDER", $.html());
            expect($('li[data-real-text="francaise"]')).to.exist;
        });
        it("Aucun résultat proposé", () => {

            // Act
            var $ = render(() =>
                    <div>
                        <AutoCompleteSelector
                            choices={getAutoCompleteChoices()}
                            currentTyppedText="frasdeg"
                            selectorId="nationalite$select"
                            showComponent={true}
                            />
                    </div>
                , context
            );
            logger.error("RENDER", $("ul.hornet-autocomplete-list li").length);
            expect($("ul.hornet-autocomplete-list li").length).is.equal(0);
        });
        it("La liste est masquée", () => {

            // Act
            var $ = render(() =>
                    <div>
                        <AutoCompleteSelector
                            choices={getAutoCompleteChoices()}
                            currentTyppedText="fra"
                            selectorId="nationalite$select"
                            showComponent={false}
                            />
                    </div>
                , context
            );
            logger.error("RENDER", $.html());
            expect($(".hornet-autocomplete-hidden")).to.exist;
        });
    });
});

function getAutoCompleteChoices() {
    return (
        [
            {
                value: "fr",
                text: "francaise"
            },
            {
                value: "en",
                text: "anglaise"
            },
            {
                value: "nz",
                text: "newzélandaise"
            }
        ]
    )
}


function getForm() {
    return newforms.Form.extend({
        autocomplete: AutoCompleteField({
            store: {
                class: construitStore(),
                functionName: "getListe"
            },
            actionClass: {},
            label: "label",
            required: true,
            errorMessages: {
                required: "champ obligatoire"
            },
            i18n: {}
        })
    });
}

function construitStore() {
    var store = {
        getListe: () => {
            return [];
        },
        getInfoNotifications: () => {
            return {}
        },
        getErrorNotifications: () => {
            return {}
        }
    }

    return store;
}

function construitLeContext(store) {
    var messages = {
        "form": {
            "filter": "Filtrer",
            "cancelFilter": "Annuler",
            "hideFiltering": "Cacher le filtrage"
        }
    };
    var context = {
        getStore: function (quelqueSoitLeStore) {
            return store;
        },
        executeAction: () => {
        },

        locale: "fr-FR",
        i18n: function (keysString) {
            return keysString;
        }
    };
    return context;
};

