/// <reference path="../dispatchr/dispatchr.d.ts" />

declare module "fluxible/addons" {
    import BaseStore = require('dispatchr/utils/BaseStore');
    class Addons {
        static createStore(param:any):typeof Store;

        static BaseStore:typeof BaseStore;
    }
    export = Addons;
}

declare module "fluxible/addons/BaseStore" {
    import BaseStore = require('dispatchr/utils/BaseStore');
    export = BaseStore;
}


interface FluxibleConfiguration {
    componentActionHandler?: Function
}

/**
 * Classe Fluxible : commun à toutes les sessions / requêtes
 * cf : https://github.com/yahoo/fluxible/blob/master/docs/fluxible.md
 */
declare class Fluxible {
    constructor(options?:FluxibleConfiguration, appComponent?:any);// TODO : appComponent:type react
    createContext(contextOptions?:any):FluxibleContext;

    executeAction(action:any, payload?:any, callback?:any):void;

    plug(plugin:any):void;

    getPlugin(pluginName:String):any;

    registerStore(store:typeof BaseStore):void;

    getAppComponent():any; // TODO : appComponent:type react

    dehydrate():any;

    rehydrate(state:any):void;
}
/**
 * Classe FluxibleContext : spécifique à une session / requête
 * cf : https://github.com/yahoo/fluxible/blob/master/docs/fluxible-context.md
 */
declare class FluxibleContext {
    plug(plugin:any):void;

    getActionContext():ActionContext;

    getComponentContext():ComponentContext;

    getStoreContext():StoreContext;

    dehydrate():any;

    rehydrate(state:any):void;
}

declare class ActionContext {
    dispatch(action:String, data?:any):void;

    executeAction(action:any, payload?:any, callback?:any):void;

    getStore<T extends BaseStore>(store:{ new(dispatcher?:IDispatcher): T; }): T;

    i18n(key:string):string;

    formatMsg(msg:string, values:any):string;
}

declare class ComponentContext {
    executeAction(action:any, payload?:any):void;

    getStore<T extends BaseStore>(store:{ new(dispatcher?:IDispatcher): T; }): T;
}

declare class StoreContext {

}

declare class FluxibleComponent {

}

declare module "fluxible" {
    export = Fluxible;
}