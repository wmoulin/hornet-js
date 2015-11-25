"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");

var _ = utils._;
var logger = utils.getLogger("hornet-js-components.form.read-only-widget");

/**
 * Widget permettant de rendre un champ en lecture seule dans un TextInput.
 * Si le Field est de type "multi values" (ChoiceField, etc..) la valeur affichée sera automatiquement le libellé plutôt que la valeur
 * @type {Express.Application|function({}): void|void|Result|TResult|*}
 */
var ReadOnlyWidget = newforms.TextInput.extend({
    constructor: function ReadOnlyWidgetConstructor(kwargs) {
        if (!(this instanceof ReadOnlyWidget)) {
            return new ReadOnlyWidget(kwargs);
        }
        newforms.TextInput.call(this, kwargs);
    }
});

ReadOnlyWidget.prototype.render = function (name, value, kwargs) {
    //Récupère le libellé de la valeur dans la liste
    if (!_.isUndefined(value) && this.choices) {
        var oldValue = value;
        var item = _.find(this.choices, function (item) {
            return item[0] == value;
        });
        if (item) {
            value = item[1];
            logger.trace("Remplacement de", oldValue, "par", value);
        }
    }
    return newforms.TextInput.prototype.render.call(this, name, value, kwargs);
};

module.exports = ReadOnlyWidget;