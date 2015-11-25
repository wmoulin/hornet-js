"use strict";
var newforms = require("newforms");
var React = require("react");
var AutoCompleteComponent = require("src/auto-complete/auto-complete");

var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.auto-complete.auto-complete-widget");

/**
 Widget regroupant les différents éléments HTML pour faire un auto-complete.
 <br /> Note: Impossible d'utiliser les MultiWidgets fournis par newforms car ils ne répondent pas au besoin
 */
var AutoCompleteWidget = newforms.Widget.extend({
    constructor: function AutoCompleteField(kwargs) {
        logger.trace("Construction AutoCompleteWidget");
        if (!(this instanceof AutoCompleteWidget)) {
            return new AutoCompleteWidget(kwargs)
        }
        newforms.Widget.call(this, kwargs)
    }
});

AutoCompleteWidget.prototype.render = function (name, value, kwargs) {
    this.lastRenderKwargs = kwargs;

    logger.trace("Rendu", name, ", value:", value, ", initialText:", this._initialText);
    return <AutoCompleteComponent
        sourceStore={this._sourceStore}
        actionClass={this._actionClass}
        onUserInputChange={this.onUserInputChange.bind(this)}
        renderAttributes={kwargs}
        inputFieldName={name}
        initialValue={value}
        initialText={this._initialText}
        i18n={this._i18n}
        readOnly={this.attrs.readOnly}
        disabled={this.attrs.disabled}
        />;
};

AutoCompleteWidget.prototype.setComponentProperties = function (store, actionClass, i18n) {
    this._sourceStore = store;
    this._actionClass = actionClass;
    this._i18n = i18n;
};

AutoCompleteWidget.prototype.onUserInputChange = function (oldValues, newValues, maxElements, inputDomNode) {
    logger.trace("[onUserInputChange] oldValues:", oldValues, ", newValues:", newValues);

    if (oldValues.value != newValues.value) {
        logger.trace("[onUserInputChange] event vers newforms");
        // On lance l"évènement original fourni par newforms uniquement sur une selection par la liste déroulante
        this.lastRenderKwargs.attrs.onChange({
            "target": inputDomNode
        });
    }
};

/**
 * Surcharge Widget.idForLabel(id) de façon à renvoyer l'identifiant du champ de saisie libre au lieu du  champ caché.
 * En effet dans le composant auto-complete, c'est le champ caché qui a pour identifiant le nom du champ.
 * Le champ de saisie libre qui est visible a pour identifiant le nom du champ + "$text".
 * @param id identifiant correspondant au nom du champ.
 * @returns {string} l'identifiant de champ à utiliser pour l'attribut for du label.
 */
AutoCompleteWidget.prototype.idForLabel = function (id) {
    return id + "$text";
}

/**
 * Méthode appelée par le renderer newforms pour récupérer la valeur du widget.
 * En plus du fonctionnement par défaut on va chercher la valeur du champ de texte
 * @param data
 * @param files
 * @param name
 * @returns {*}
 */
AutoCompleteWidget.prototype.valueFromData = function (data, files, name) {
    //Hack de newforms: seul moyen trouvé pour récupérer la totalité des données pour aller chercher le champ "name$input"
    this._initialText = data[name + "$text"];

    return newforms.Widget.prototype.valueFromData.call(this, data, files, name);
};


module.exports = AutoCompleteWidget;