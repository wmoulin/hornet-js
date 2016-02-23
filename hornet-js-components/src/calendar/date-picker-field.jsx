"use strict";
var newforms = require("newforms");
var validators = require("validators");
var DatePickerInput = require("src/calendar/date-picker-input");
var utils = require("hornet-js-utils");

var logger = utils.getLogger("hornet-js-component.calendar.date-picker-field");

/*
 Création d"un nouveau composant héritant du Widget Date et ajoutant un bouton pour afficher le calendrier
 Le nouveau widget est ensuite ajouté au Field
 */
var DatePickerField = newforms.DateField.extend({
    constructor(kwargs) {
        logger.trace("Construction DatePickerField. kwargs : ", kwargs);
        if (!(this instanceof DatePickerField)) {
            return new DatePickerField(kwargs);
        }
        kwargs.controlled = true;

        var widgetArgs = {attrs: {}};

        // Si un ou plusieurs formats d'entrée sont spécifiés pour le champ, on utilise le premier pour le rendu dans le widget
        if (kwargs.inputFormats instanceof Array && kwargs.inputFormats[0]) {
            widgetArgs = {format: kwargs.inputFormats[0], attrs: {inputFormats: kwargs.inputFormats}};
        }

        /* Prise en compte de l'année par défaut éventuelle */
        if (isFinite(kwargs.defaultYear)) {
            widgetArgs.attrs.defaultYear = kwargs.defaultYear;
        }

        if (kwargs.imgFilePath) {
            widgetArgs.attrs.imgFilePath = kwargs.imgFilePath;
        }

        if (kwargs.isDatePicker === undefined) {
            widgetArgs.attrs.isDatePicker = true; // valeur par défaut
        } else {
            widgetArgs.attrs.isDatePicker = kwargs.isDatePicker;
        }

        // Prise en compte du titre éventuel
        if (kwargs.title) {
            widgetArgs.attrs.title = kwargs.title;
        }

        kwargs.widget = DatePickerInput(widgetArgs);

        newforms.DateField.call(this, kwargs);
    }
});

/**
 * @param format format de date newforms
 * @returns {boolean} true lorsque le format inclut l"année
 */
function formatHasYear(format) {
    var result = false;
    if (utils._.isString(format)) {
        result = format.indexOf("%y") >= 0 || format.indexOf("%Y") >= 0;
    }
    return result;
}

/**
 * Surcharge de DateField.toJavaScript(value) pour les cas où le format du widget n'inclut pas l'année.
 * @param {?(string|Date)} value user input.
 * @return {?Date} a with its year, month and day attributes set, or null for
 *   empty values when they are allowed.
 * @throws {ValidationError} if the input is invalid.
 */
DatePickerField.prototype.toJavaScript = function (value) {
    /* Le premier format n'inclut pas l"année : on utilise l'année par défaut si celle-ci est définie ou alors l'année en cours */
    if (this.widget && this.widget.format && !formatHasYear(this.widget.format) && utils._.isString(value)) {
        logger.debug("DatePickerField.toJavaScript surchargée");
        if (this.isEmptyValue(value)) {
            return null
        }
        value = value.trim();

        var date;
        for (var i = 0, l = this.inputFormats.length; i < l; i++) {
            try {
                date = this.strpdate(value, this.inputFormats[i]);
                if (!formatHasYear(this.inputFormats[i])) {
                    logger.debug("DatePickerField.toJavaScript format sans année");
                    if (this.widget && this.widget.attrs && isFinite(this.widget.attrs.defaultYear)) {
                        date.setFullYear(this.widget.attrs.defaultYear);
                    } else {
                        date.setFullYear(new Date().getFullYear());
                    }
                }
                return date;
            }
            catch (e) {
                // pass
            }
        }
        throw newforms.ValidationError(this.errorMessages.invalid, {code: "invalid"})
    } else {
        /* Dans les autres cas on utilise la fonction non surchargée */
        return newforms.DateField.prototype.toJavaScript.call(this, value);
    }
}

module.exports = DatePickerField;
