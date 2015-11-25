///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Action = require("src/actions/action");
import ActionsChainData = require("src/routes/actions-chain-data");
import express = require("express");
import director = require("director");

export interface IRoutesInfos {
    actions?: Array<Action<ActionsChainData>>; // Tableau de fonctions retournant une promise
    composant?:any; // Composant React
    lazyRoutesParam?:LazyRouteParam; // Sur une route en lazy loading: les informations pour charger les routes filles
    chainData?:ActionsChainData;
    roles?:Array<string>; // Tableau des rôles à avoir pour pouvoir accéder à cette route
}

export interface HornetRequest extends director.DirectorRequest, express.Request {
    generateNewCsrfTokken?:() => string;
}

export interface IRoutesBuilder {
    buildViewRoutes?(match:MatchViewFn): void;
    buildDataRoutes?(match:MatchDataFn): void;
}


/**
 * Objet permettant d'accéder au context courant de la requete
 */
export interface IRouteContext {

    /**
     * Le dispatcher courant
     */
    actionContext:ActionContext;

    /**
     * Les informations de la requete
     */
    req:HornetRequest;

    /**
     * Les informations de la réponse
     */
    res:director.DirectorResponse;

    /**
     * Uniquement sur le serveur: le prochain middleware express
     * @param any
     */
    next:(any)=>any;

    /**
     * Fonction retournant la route courante splittée par "/"
     */
    getRoute: () => any[];

    /**
     * L'objet director contenant les routes courantes
     */
    routes: any;
}

export interface DirectorError extends Error {
    stack?:string;
}

export interface IRouteHandler {
    /**
     * Interface des fonctions appelées par le route lorsqu'une route est activée
     * @param context Le contexte courant permettant d'accéder à divers éléments de la requête
     * @param param1 Optionnel. Le premier paramètre sur une route de type: /componant/:param1
     * @param param2 Optionnel. Le second paramètre sur une route de type: /componant/:param1/:param2
     * @param param3 Optionnel. Le troisième paramètre sur une route de type: /componant/:param1/:param2/:param3
     */
    (context:IRouteContext, param1?:string, param2?:string, param3?:any): IRoutesInfos;
}

export interface MatchFn {
    /**
     * Fonction associant une route (= url) à une fonction préparant les actions à exécuter lorsque cette route est activée
     * @param path L'url de la route. Peut-être une regex. Exemples: /component/:id ou  /components/ ou /components/.*\.json
     * @param handler La méthode qui est appelée par le routeur lorsque la route est activée
     * @param method La méthode http sur laquelle la route doit s'activer: Valeurs possibles: get, post ou both (pour indiquer que la route s'active sur le get et le post)
     */
    (path:string, handler:IRouteHandler, method?:string): void;

    /**
     * Fonction permettant d'activer le chargement différé d'une portion de routes
     * @param path Le path de base sur lequel réagir, une regex sera construite à partir de ce path
     * @param fileToLoad L'url d'accès au fichier contenant les nouvelles routes à appliquer
     */
    lazy: (path:string, fileToLoad:string) => void;
}

export interface MatchDataFn extends MatchFn {
}
export interface MatchViewFn extends MatchFn {
}
export interface RouterConfiguration {
    /**
     * Classe permettant d'initialiser les routes.
     * La fonction 'build' de cette classe est appelée par le routeur lors de son instanciation afin de configurer toutes les routes possibles de l'application.
     * @param matcher
     */
    defaultRoutesClass:IRoutesBuilder;

    /**
     * Composant React principal à utiliser pour rendre les pages.
     */
    appComponent:any;

    /**
     * Composant React layout à utiliser pour rendre le composant principal (node side).
     */
    layoutComponent?:any;

    /**
     * Composant React invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
     * Ce composant doit être minimaliste et doit aller chercher dans le 'NotiticationStore' les erreurs qui se sont produites
     */
    errorComponent:any;

    /**
     * Fonction de chargement des composants React par le routeur.
     * Elle prend en argument le nom du composant et retourne le composant chargé.
     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
     * @param componantName Le nom du composant à charger
     * @param callback La fonction de callback à appeler avec le composant chargé en premier argument
     */
    componentLoaderFn:(componantName:string, callback?:(composant:any) => void)=>any;

    /**
     * Fonction de chargement des routes à chargement différées.
     * Elle prend en argument le nom du fichier contenant les routes et retourne le fichier chargé
     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramêtre.
     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
     * @param routesFileName
     * @param callback
     */
    routesLoaderfn: (routesFileName:string, callback?:(routes:IRoutesBuilder) => void)=> IRoutesBuilder;

    /**
     * Le contexte Fluxible spécifique à la requête courante
     */
    dispatcherLoaderFn:(local:Array<string>)=>FluxibleContext;

    /**
     * L'url du theme Css à utiliser par défaut dans l'application
     */
    themeUrl?:string;

    /**
     * Le contextPath à utiliser
     */
    contextPath?:string;

    /**
     * La configuration du menu
     */
    menuConfig?:Object;
}

export interface LazyRouteParam {
    path:string;
    fileToLoad:string;
}
