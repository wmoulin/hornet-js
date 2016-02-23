"use strict";
import I = require("./routes/router-interfaces");

interface  ClientConfiguration {
    /**
     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
     */
    defaultRoutesClass:I.IRoutesBuilder;

    /**
     * Composant React principal à utiliser pour rendre les pages.
     * Ce composant est instancié dans la fonction 'initAndStart'.
     * Côté client c'est auprès du 'PageInformationsStore' que ce composant doit aller chercher la page courante à rendre.
     */
    appComponent: any;

    /**
     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
     */
    errorComponent: any;

    /**
     * Fonction de chargement des composants React par le routeur.
     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
     * @param componantName Le nom du composant
     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
     */
    componentLoaderFn?: (componantName:string, callback?:(composant:any) => void) => void;

    /**
     * Fonction de chargement des routes en mode lazy
     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
     * @param routesFileName Le nom du fichier de routes
     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
     */
    routesLoaderfn: (routesFileName:string, callback:(routesFn:I.IRoutesBuilder) => void)=>I.IRoutesBuilder;

    /**
     * Fluxible
     */
    dispatcher:Fluxible;

    fluxibleContext?:FluxibleContext;

    directorClientConfiguration?:I.DirectorClientConfiguration
}

export = ClientConfiguration;
