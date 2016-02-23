"use strict";

var BoundField = require("newforms/BoundField");
var originAsWidgetFn:Function = BoundField.prototype.asWidget;
/**
 * Etend newforms de façon à ajouter si nécessaire les balises aria aria-required et aria-invalid aux champs de saisie.
 */
export = function () {
    /**
     * Surcharge la fonction asWidget : ajoute l'état aria-invalid lorsque le champ contient des erreurs,
     * et la propriété aria-required lorsque le champ est obligatoire.
     * A appeler à l'initialisation de l'application.
     * @param kwargs
     * @returns {undefined}
     */
    BoundField.prototype.asWidget = function (kwargs) {
        if (this.errors().isPopulated()) {
            if (kwargs) {
                if (kwargs.attrs) {
                    kwargs.attrs["aria-invalid"] = true;
                } else {
                    kwargs["attrs"] = {"aria-invalid": true};
                }
            } else {
                kwargs = {attrs: {"aria-invalid": true}}
            }
        }
        if (this.field && this.field.required) {
            if (kwargs) {
                if (kwargs.attrs) {
                    kwargs.attrs["aria-required"] = true;
                } else {
                    kwargs["attrs"] = {"aria-required": true};
                }
            } else {
                kwargs = {attrs: {"aria-required": true}}
            }
        }
        return originAsWidgetFn.apply(this, [kwargs]);
    };
};


