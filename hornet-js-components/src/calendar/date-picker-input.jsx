"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");
var Calendar = require("src/calendar/calendar");

var logger = utils.getLogger("hornet-js-component.calendar.date-picker-input");

var DatePickerInput = newforms.DateInput.extend({
    formatType: "DATE_INPUT_FORMATS",
    validation: {onChange: true},
    isValueSettable: true,
    constructor(kwargs) {
        logger.trace("Construction DatePickerInput ");
        if (!(this instanceof DatePickerInput)) {
            return new DatePickerInput(kwargs)
        }

        //Ce widget est toujours controllé
        newforms.DateInput.call(this, kwargs);
    }
});

DatePickerInput.prototype.render = function (name, value, kwargs) {
    logger.trace("DatePickerInput.prototype.render", name, value, kwargs);

    var defaultYear, title;
    if(this.attrs) {
        defaultYear = this.attrs.defaultYear;
        title = this.attrs.title;
    }

    var dateFormats;
    /* On doit utiliser le(s) même(s) format(s) sur le champ de saisie et le Calendar */
    if(this.attrs && this.attrs.inputFormats instanceof Array && this.attrs.inputFormats[0]) {
        dateFormats = new Array();
        this.attrs.inputFormats.every(function(inputFormat, index, array) {
            dateFormats[index] = utils.dateUtils.newformsToGregorianCalFormat(inputFormat);
            return true;
        });
    } else if(this.format) {
        dateFormats = [utils.dateUtils.newformsToGregorianCalFormat(this.format)];
    }
    return <Calendar thisContext={this} name={name} value={value} attributes={kwargs} dateFormats={dateFormats} defaultYear={defaultYear} title={title}/>;
};

module.exports = DatePickerInput;