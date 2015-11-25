///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.i18n.i18n-fluxible-plugin");
var IntlMessageFormat = require("intl-messageformat");
/** Messages par défaut du framework hornet */
var hornetMessages = require("../i18n/hornet-messages-components");
/**
 * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans this.messages ou dans les messages par défaut du framework.
 * Si la clé n'existe pas elle est retournée directement.
 * @param keysString clé recherchée
 * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
 */
function i18n(keysString) {
    var currentMessages = this.messages;
    return I18nFluxiblePlugin.getMessagesOrDefault(keysString, this.messages, hornetMessages);
}
function formatMsg(message, values) {
    var msg = new IntlMessageFormat(message);
    return msg.format(values);
}
var I18nFluxiblePlugin = (function () {
    function I18nFluxiblePlugin() {
    }
    I18nFluxiblePlugin.prototype.createPlugin = function () {
        logger.trace("Crée plugin Fluxible pour l'internationalisation");
        /*
         INFOS:
         ->> coté serveur le dehydrate se fait au niveau context plugin
         ->> coté client le rehydrate se fait au niveau APPLICATION
         */
        return {
            //CONFIGURATION DU PLUGIN (voir doc fluxible)
            // Required unique name property
            name: "InternationalisationPlugin",
            // Called after context creation to dynamically create a context plugin
            plugContext: function (options) {
                // `options` is the same as what is passed into `createContext(options)`
                var messages = options.messages;
                var locale = options.locale;
                // Returns a context plugin
                return {
                    // Method called to allow modification of the component context
                    plugComponentContext: function (componentContext) {
                        componentContext.locale = locale;
                        componentContext.i18n = I18nFluxiblePlugin.i18n(messages);
                    },
                    plugActionContext: function (actionContext) {
                        //accessible dans l'action context
                        actionContext.locale = locale;
                        actionContext.i18n = i18n.bind(actionContext);
                        actionContext.formatMsg = formatMsg;
                        actionContext.messages = messages;
                    },
                    // Allows context plugin settings to be persisted between server and client. Called on server
                    // to send data down to the client
                    dehydrate: function () {
                        logger.trace("dehydrate plugin Fluxible pour l'internationalisation");
                        return {
                            i18nMessages: messages,
                            locale: locale
                        };
                    },
                    // Called on client to rehydrate the context plugin settings
                    rehydrate: function (state) {
                        logger.trace("rehydrate plugin Fluxible pour l'internationalisation");
                        messages = state.i18nMessages;
                        locale = state.locale;
                    }
                };
            }
        };
    };
    /**
     * Renvoie la fonction récupérant les messages internationalisés dans 'messages' ou dans les messages par défaut du framework
     * @param messages messages internationalisés
     * @returns {function(string):any}
     */
    I18nFluxiblePlugin.i18n = function (messages) {
        /**
         * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans 'messages' ou dans les messages par défaut du framework.
         * Si la clé n'existe pas elle est retournée directement.
         * @param keysString clé recherchée
         * @param messages objet contenant les messages à utiliser
         * @param defaultMessages objet contenant les messages par défaut à utiliser
         * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
         */
        return function (keysString) {
            return I18nFluxiblePlugin.getMessagesOrDefault(keysString, messages, hornetMessages);
        };
    };
    /**
     * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans 'messages'.
     * Si la clé n'existe pas elle est retournée directement.
     * @param keysString clé recherchée
     * @param messages objet contenant les messages à utiliser
     * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
     */
    I18nFluxiblePlugin.getMessages = function (keysString, messages) {
        logger.trace("I18N getMessages :", keysString);
        var currentMessages;
        if (keysString) {
            currentMessages = messages;
            var keyArray = keysString.split('.');
            keyArray.every(function (key, index, array) {
                //descend dans l'arborescence
                currentMessages = currentMessages[key];
                if (currentMessages === undefined) {
                    return false; //non définit
                }
                else {
                    /* On continue la descente dans l'arborescence */
                    return true;
                }
            });
        }
        return currentMessages !== undefined ? currentMessages : keysString;
    };
    /**
     * Retourne le(s) message(s) correspondant à la clé passée en paramètre contenu(s) dans 'messages' ou dans 'defaultMessages'.
     * Si la clé n'existe pas elle est retournée directement.
     * @param keysString clé recherchée
     * @param messages objet contenant les messages à utiliser
     * @param defaultMessages objet contenant les messages par défaut à utiliser
     * @returns {any} soit la chaîne de caractères trouvée, soit un objet contenant un ensemble de messages, soit la clé
     */
    I18nFluxiblePlugin.getMessagesOrDefault = function (keysString, messages, defaultMessages) {
        var result = I18nFluxiblePlugin.getMessages(keysString, messages);
        if (result == keysString) {
            result = I18nFluxiblePlugin.getMessages(keysString, defaultMessages);
            if (result == keysString) {
                logger.warn("Message non défini pour la clé :", keysString);
            }
        }
        return result;
    };
    return I18nFluxiblePlugin;
})();
module.exports = I18nFluxiblePlugin;
//# sourceMappingURL=i18n-fluxible-plugin.js.map