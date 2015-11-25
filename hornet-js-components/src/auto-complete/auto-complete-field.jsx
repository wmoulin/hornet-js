"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");
var AutoCompleteWidget = require("src/auto-complete/auto-complete-widget");

var logger = utils.getLogger("hornet-js-components-auto-complete.auto-complete-field");

/*
 Field newforms permettant de construire un composant auto-complete
 */
var AutoCompleteField = newforms.Field.extend({
    widget: AutoCompleteWidget,
    constructor(kwargs) {
        logger.trace("Construction AutoCompleteField");
        if (!(this instanceof AutoCompleteField)) {
            return new AutoCompleteField(kwargs);
        }
        newforms.Field.call(this, kwargs);

        this.widget.setComponentProperties(kwargs.store, kwargs.actionClass, kwargs.i18n);
    }
});

module.exports = AutoCompleteField;