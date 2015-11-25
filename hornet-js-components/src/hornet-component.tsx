///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>

import React = require("react");
import BaseStore = require("fluxible/addons/BaseStore");
import utils = require("hornet-js-utils");
var lodash = utils._;
var autobind = require("autobind-decorator");
var reactMixin = require("react-mixin");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

class HornetComponent<P,S> extends React.Component<P, S> {

    static displayName:string = "HornetComponent";

    constructor(props?:any, context?:any) {
        super(props, context);
        this.state = {} as S;
    }

    // FluxibleMixin
    getStore:<ST extends BaseStore>(store:{new(dispatcher:IDispatcher):ST}) => ST;
    executeAction:(action:Function, data?:any) => void;

    // HornetComponentMixin.themeMixin
    genUrlTheme:(path:string) => string;

    // HornetComponentMixin.contextPathMixin
    genUrl:(path?:string)=>string;
    getContextPath:()=> string;
    genUrlStatic:(path?:string) => string;

    // HornetComponentMixin.internationalisationMixin
    i18n:(keysString:string) => any;

    // HornetComponentMixin.throttleMixin
    throttle:(fn:Function, conf?:any) => Function;

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
    static ApplyMixins(mixins?:any[], applyDefaultMixins:boolean = true):ClassDecorator {
        if (lodash.isArray(mixins) && mixins.length > 0) {
            let mixinObj:any = {};
            if (applyDefaultMixins) {
                mixinObj.mixins = mixins.concat(HornetComponentMixin);
            } else {
                mixinObj.mixins = mixins;
            }
            return reactMixin.decorate(mixinObj);
        } else {
            return reactMixin.decorate(HornetComponentMixin);
        }
    }

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
    static AutoBind:MethodDecorator & ClassDecorator = autobind;
}

export = HornetComponent;
