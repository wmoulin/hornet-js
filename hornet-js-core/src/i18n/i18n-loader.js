/**
 * Classe utilisée uniquement côté serveur.
 */
"use strict";
var I18nLoader = (function () {
    function I18nLoader() {
    }
    I18nLoader.prototype.getMessages = function (locale) {
        throw new Error('You should extend this class to use it');
    };
    return I18nLoader;
})();
module.exports = I18nLoader;
//# sourceMappingURL=i18n-loader.js.map