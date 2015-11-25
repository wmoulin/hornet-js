"use strict";

var menu = [{
    'text': "navigation.partenaire.listeViaRecherche",
    'url': '/partenaires',
    'visibleDansMenu': true,
    'visibleDansPlan': true
}];

var i18n = require('hornet-js-core/src/i18n/i18n-fluxible-plugin').i18n;

var messages = {
    "navigation": {
        "partenaire": {
            "listeViaRecherche": "Liste (via recherche)"
        }
    }
};

var Dispatcher = {
    getStore: () => {
        return {
            getConfigMenu: () => {
                return menu
            },
            getCurrentUrl: () => {
                return '/partenaires'
            },
            getCurrentUrlWithoutContextPath: () => {
                return '/partenaires'
            },
            addChangeListener: () => {
                return {
                    results: menu,
                    currentUrl: '/partenaires'
                }
            }

        }
    },
    executeAction: () => {
    },
    locale: "fr-FR",
    i18n: (keysString) => {
        return i18n(messages)(keysString);
    }
};

module.exports = Dispatcher;