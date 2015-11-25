///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var utils = require("hornet-js-utils");
var lodash = utils._;
var autobind = require("autobind-decorator");
var reactMixin = require("react-mixin");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var HornetComponent = (function (_super) {
    __extends(HornetComponent, _super);
    function HornetComponent(props, context) {
        _super.call(this, props, context);
        this.state = {};
    }
    /**
     * Fonction à utiliser dans une annotation TypeScript pour appliquer les mixins.
     * Exemple:
     * @HornetComponent.ApplyMixins()
     * class HomePage extends HornetComponent<any,any> {
     * [...]
     * }
     * @param mixins Un tableau optionnel de mixins à appliquer sur le composant
     * @param applyDefaultMixins Indique si les mixins par défaut doivent être appliqués. true par défaut
     */
    HornetComponent.ApplyMixins = function (mixins, applyDefaultMixins) {
        if (applyDefaultMixins === void 0) { applyDefaultMixins = true; }
        if (lodash.isArray(mixins) && mixins.length > 0) {
            var mixinObj = {};
            if (applyDefaultMixins) {
                mixinObj.mixins = mixins.concat(HornetComponentMixin);
            }
            else {
                mixinObj.mixins = mixins;
            }
            return reactMixin.decorate(mixinObj);
        }
        else {
            return reactMixin.decorate(HornetComponentMixin);
        }
    };
    HornetComponent.displayName = "HornetComponent";
    /**
     * Fonction à utiliser dans une annotation TypeScript pour automatiquement binder une méthode sur l'instance du composant.
     * Exemple:
     * class MyComponent extends HornetComponent<any,any> {
     * [...]
     * @HornetComponent.AutoBind
     * onSubmit() {
     *  [...]
     * }
     * [...]
     * }
     * @return {any}
     *
     */
    HornetComponent.AutoBind = autobind;
    return HornetComponent;
})(React.Component);
module.exports = HornetComponent;
//# sourceMappingURL=hornet-component.js.map