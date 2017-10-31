

var menu = [{
    text: "navigation.welcome",
    url: "/accueil",
    visibleDansMenu: true,
    visibleDansPlan: true
}];

var messages = {
    navigation: {
        planApplication: "Plan de l'application",
        welcome: "Accueil",
        accessibilite: "Accessibilité",
        contact: "Contact",
        planAppli: "Plan de l'application",
        aide: "Aide",
        partenaire: {
            gestionDesPartenaires: "Gestion des partenaires",
            listeViaRecherche: "Liste (via recherche)"
        },
        administration: {
            label: "Administration",
            secteurs: "Secteurs",
            listeSecteurs: "Liste des secteurs"
        }
    }
};

var i18n = require("hornet-js-core/src/i18n/i18n-fluxible-plugin").i18n;

var DispatcherAccueil = {
    getStore: () => {
        return {
            getConfigMenu: () => {
                return menu
            },
            getCurrentUrl: () => {
                return "/accueil"
            },
            getCurrentUrlWithoutContextPath: () => {
                return "/accueil"
            },
            addChangeListener: () => {
                return {
                    results: menu,
                    currentUrl: "/accueil"
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

module.exports = DispatcherAccueil;
