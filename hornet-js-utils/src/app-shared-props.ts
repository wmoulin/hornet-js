///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";


class AppSharedProps {
    static appSharedPropsObject = {};
    static test:string;
    /**
     * Method to set a custom key/value shared between the server and the browser
     * @param key
     * @param value
     */
    static set(key:string, value:any) {
        AppSharedProps.appSharedPropsObject[key] = value;
    }

    /**
     * Method to get a custom shared value setted before
     * @param key
     * @returns {any}
     */
    static get(key:string):any {
        return AppSharedProps.appSharedPropsObject[key];
    }

    static rehydrate(obj:any) {
        for (var i in obj) {
            AppSharedProps.appSharedPropsObject[i] = obj[i];
        }
    }

    static dehydrate() {
        return AppSharedProps.appSharedPropsObject;
    }
}

export = AppSharedProps;

