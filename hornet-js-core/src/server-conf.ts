///<reference path='../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
import I = require('./routes/router-interfaces');

interface ServerConfiguration {

    /**
     * Composant store pour la session. utilisé pour enregistrer la session.
     */
    sessionStore:any;

    /**
     * Répertoire courant du script, utilisé pour reconstruire les liens relatifs
     */
    serverDir:string;

    /**
     * Répertoire relatif (par rapport à la variable 'serverDir') vers les ressources statiques
     */
    staticPath:string;

    /**
     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
     */
    defaultRoutesClass:I.IRoutesBuilder;

    /**
     * Composant React principal à utiliser pour rendre les pages.
     * Ce composant est instancié par le routeur côté serveur et par le composant 'client' côté client.
     * Côté serveur, la page courante à rendre lui est fourni par le routeur grâce à la propriété 'composantPage'
     */
    appComponent:any;

    /**
     * Composant React de layout à utiliser pour rendre le composant principal.
     * Ce composant est instancié par le routeur côté serveur.
     * Côté serveur, l'app à rendre lui est fourni par le routeur grâce à la propriété 'composantApp'
     */
    layoutComponent:any;

    /**
     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
     */
    errorComponent:any;

    /**
     * Fonction de chargement des composants React par le routeur.
     * Elle prend en argument le nom du composant et retourne le composant chargé.
     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
     * @param componantName Le nom du composant à charger
     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
     */
    componentLoaderFn?:(componantName:string)=>any;

    /**
     * Fonction de chargement des routes en mode lazy.
     * Elle prend en argument le nom du composant et retourne le composant chargé.
     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
     * @param routesFileName Le nom de la route à charger
     */
    routesLoaderfn: (routesFileName:string)=> I.IRoutesBuilder;

    /**
     * Fluxible
     */
    dispatcher:Fluxible;

    /**
     * Internationalisation peut être de type String (JSON) ou bien de type IntlLoader (cas plus complexe)
     */
    internationalization:any;

    /**
     * La configuration du menu
     */
    menuConfig?:Object;

    /**
     * le path vers la page de login
     */
    loginUrl:string;

    /**
     * le path vers l'action de logout
     */
    logoutUrl:string;

    /**
     * le path vers la page d'accueil
     */
    welcomePageUrl:string;

    /**
     * Les prefixes de chemin considérés comme publiques (sans authentification)
     */
    publicZones?:String[];

}

export = ServerConfiguration;