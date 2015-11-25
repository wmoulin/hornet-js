///<reference path="../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var AppSharedProps = (function () {
    function AppSharedProps() {
    }
    /**
     * Method to set a custom key/value shared between the server and the browser
     * @param key
     * @param value
     */
    AppSharedProps.set = function (key, value) {
        AppSharedProps.appSharedPropsObject[key] = value;
    };
    /**
     * Method to get a custom shared value setted before
     * @param key
     * @returns {any}
     */
    AppSharedProps.get = function (key) {
        return AppSharedProps.appSharedPropsObject[key];
    };
    AppSharedProps.rehydrate = function (obj) {
        for (var i in obj) {
            AppSharedProps.appSharedPropsObject[i] = obj[i];
        }
    };
    AppSharedProps.dehydrate = function () {
        return AppSharedProps.appSharedPropsObject;
    };
    AppSharedProps.appSharedPropsObject = {};
    return AppSharedProps;
})();
module.exports = AppSharedProps;
//# sourceMappingURL=app-shared-props.js.map