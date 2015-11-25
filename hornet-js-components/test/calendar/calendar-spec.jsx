"use strict";

var TestUtils = require('hornet-js-utils/src/test-utils');
var logger = TestUtils.getLogger("hornet-js-components.test.calendar.calendar-spec");
var DateUtils = require('hornet-js-utils/src/date-utils');

var calendarLocale = require('hornet-js-utils/test/locale/fr-fr');

var React = require('react');

var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var newforms = require('newforms');
var RenderForm = newforms.RenderForm;

var DatePickerField = require('src/calendar/date-picker-field');

describe('Calendrier date sélectionnée', () => {
    it('Test le calendrier en mode server', () => {
        // Arrange
        var dateTest = '01/01/2016';
        //Préparation du form
        var formConf = {
            autoId: '{name}',
            labelSuffix: '',
            data: {dataTest: dateTest}
        };

        var form = {
            labelSuffix: '',
            errorCssClass: 'error',
            requiredCssClass: 'required',
            validCssClass: 'valid',
            dataTest: DatePickerField({
                label: 'Label de la date',
                required: true
            })
        };

        logger.debug("form :", form);
        var MonForm = newforms.Form.extend(form);
        logger.debug("formConf :", formConf);
        var instanceForm = new MonForm(formConf);
        logger.debug("instanceForm :", instanceForm);
        var context = {
            locale: "fr-FR",
            i18n: () => {
                return {calendar:calendarLocale};
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



        logger.debug("context :", context);
        var $ = render(() =>
                <div>
                    <RenderForm form={instanceForm}>
                    </RenderForm>
                </div>, context );

        // Assert
        var $inputDate = $('input'); //un seul <input/>
        expect($inputDate).to.exist;
        expect($inputDate.attr('value')).to.equal(dateTest);
    });
});

