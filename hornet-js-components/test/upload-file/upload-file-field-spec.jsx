"use strict";

var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var logger = TestUtils.getLogger("hornet-js-components.test.upload-file.upload-file-field-spec");
var render = TestUtils.render;
var newforms = require("newforms");
var HornetForm = require("src/form/form");
var GridForm = require("src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;
var FileField = require("src/upload-file/upload-file-field");

describe("UploadFileField", function () {
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
            file: FileField(
                {
                    image: false,
                    label: "",
                    helpText: "File",
                    /*Définir l'url d'accès à l'image affiché en lecture seule*/
                    fileRoute: "partenaires/photo/",
                    fileTitle: "image alternative"
                }),
            isClient: newforms.ChoiceField({
                custom: {
                    useReadOnlyWidget: true
                },
                required: false,
                widget: newforms.RadioSelect,
                label: "bale",
                choices: [[true, "Client"], [false, "Fournisseur"]]
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
        executeAction: function () {
        }
    };

    describe("FileField", function () {
        it("doit avoir un champ input", function () {
            // Arrange
            var FormDef = prepareForm(),
                form = new FormDef(formConf);

            var $ = render(() =>(
                <HornetForm form={form}>
                    <Field name="file" span="1"/>
                </HornetForm>
            ), context, true);
            expect($("input")).to.exist;
        });
    });

    describe("isClient", function () {
        it("doit avoir un champ input en champ caché", function () {
            // Arrange
            var FormDef = prepareForm(),
                form = new FormDef(formConf);

            var $ = render(() =>(
                <HornetForm form={form}>
                    <Field name="isClient"/>
                </HornetForm>
            ), context, true);
            expect($("input")).to.exist;
        });
    });
});

function construitStore() {
    var store = {
        getListe: function () {
            return [];
        },
        getInfoNotifications: function () {
            return {}
        },
        getErrorNotifications: function () {
            return {}
        }
    }
    return store;
}
