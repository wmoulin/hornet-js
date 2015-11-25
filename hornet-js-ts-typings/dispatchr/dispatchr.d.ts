declare function dispatchr():typeof Dispatcher;
declare function createStore(def:StoreParam):typeof Store;

interface StoreParam {
    storeName: string;
    handlers: any;
    initialize?:() => any;
    rehydrate?:(state:any) => void;
    dehydrate?:() => any;
}

declare class BaseStore {
    constructor(dispatcher?:IDispatcher);
    static storeName:string;
    static handlers:any;
    emitChange() : void;
    addChangeListener(callbackFn:any) : void;
    removeChangeListener(callbackFn:any) : void;
    getContext():Context;
    shouldDehydrate():boolean;
}

declare class Store extends BaseStore {
    constructor(dispatcher?:IDispatcher);
    static storeName:string;
    static handlers:any;
    initialize:any;
}

declare class DispatcherState {
    stores:any[];
}

interface IDispatcher {
    dispatch(action:String, data?:any): void;
    dehydrate(): DispatcherState;
    rehydrate(state:DispatcherState): void;
    getStore(store:BaseStore|string): BaseStore;
    waitFor(stores:Array<string>|string, callback);
}

declare class Context {
}

declare class Dispatcher implements IDispatcher {
    constructor(context:Context);
    static registerStore(store:typeof Store):void;
    static isRegistered(store:typeof Store|string):boolean;
    static getStoreName(store:typeof Store|string):string;
    dispatch(action:String, data?:any):void;
    dehydrate():DispatcherState;
    rehydrate(state:DispatcherState):void;
    getStore(store:BaseStore|string):BaseStore;
    waitFor(stores:Array<string>|string, callback);
}


declare module "dispatchr" {
    export = dispatchr;
}

declare module "dispatchr/utils/createStore" {
    export = createStore;
}

declare module "dispatchr/utils/BaseStore" {
    export = BaseStore;
}


