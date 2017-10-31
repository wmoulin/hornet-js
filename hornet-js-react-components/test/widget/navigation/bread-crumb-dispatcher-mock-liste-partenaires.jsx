

var menu = [{
    text: "navigation.welcome",
    url: "/accueil",
    visibleDansMenu: true,
    visibleDansPlan: true
}, {
    text: "navigation.contact",
    url: "/messages",
    visibleDansMenu: true,
    visibleDansPlan: true
}, {
    text: "navigation.partenaire.gestionDesPartenaires",
    submenu: [{
        text: "navigation.partenaire.listeViaRecherche",
        url: "/partenaires",
        visibleDansMenu: true,
        visibleDansPlan: true
    }]
}, {
    text: "navigation.accessibilite",
    url: "/accessibilite",
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

var DispatcherListe = {
    getStore: () => {
        return {
            getConfigMenu: () => {
                return menu
            },
            getCurrentUrl: () => {
                return "/partenaires"
            },
            getCurrentUrlWithoutContextPath: () => {
                return "/partenaires"
            },
            addChangeListener: () => {
                return {
                    results: menu,
                    currentUrl: "/partenaires"
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

module.exports = DispatcherListe;
