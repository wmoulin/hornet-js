declare module "hornet-js-core/src/client-conf" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { AbstractRoutes, LazyRoutesAsyncClassResolver, DirectorClientConfiguration }  from "hornet-js-core/src/routes/abstract-routes";
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	export interface ClientConfiguration {
	    /**
	     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
	     */
	    defaultRoutesClass: AbstractRoutes;
	    /**
	     * Composant principal à utiliser pour rendre les pages.
	     * Ce composant est instancié dans la fonction 'initAndStart'.
	     */
	    appComponent: Class<IHornetPage<any, any>>;
	    /**
	     * Composant page invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
	     */
	    errorComponent: Class<IHornetPage<any, any>>;
	    /**
	     * Fonction de chargement des routes en mode lazy
	     * Côté client elle permet de charger les pages de manière asynchrone (fonctionnement proposé par le module 'webpack')
	     */
	    routesLoaderfn: LazyRoutesAsyncClassResolver;
	    directorClientConfiguration?: DirectorClientConfiguration;
	    /**
	     * Le composant HTML sur lequel monter le listener de clicks qui route les changements d'URL vers le routeur
	     */
	    eventListenerComponent?: Document | Element;
	    /**
	     * Méthode exécutée lorsque la page est démontée (sur un F5)..
	     */
	    onbeforeunload?: Function;
	    /**
	     * Méthode exécutée au chargement de la page
	     */
	    onload?: Function;
	}
	
}

declare module "hornet-js-core/src/client" {
	import { ClientConfiguration }  from "hornet-js-core/src/client-conf";
	import { RouterClient }  from "hornet-js-core/src/routes/router-client";
	import { ComponentChangeEventDetail }  from "hornet-js-core/src/routes/router-client-async-elements";
	import { HornetEvent }  from "hornet-js-core/src/event/hornet-event";
	import { IClientInitializer } from "hornet-js-components/src/component/iclient-initializer";
	global  {
	    interface Window {
	        Intl: any;
	        router: RouterClient;
	        Mode: "development" | "production";
	        Config: {
	            [key: string]: any;
	        };
	        HornetCLS: {
	            [key: string]: any;
	        };
	        AppSharedProps: {
	            [key: string]: any;
	        };
	        Perf: any;
	    }
	}
	export class Client {
	    /**
	     * Cette fonction initialise complètement le client et le routage applicatif.
	     *
	     * Elle effectue les opérations suivantes:
	     * <ul>
	     *      <li> Réhydratation de la configuration applicative</li>
	     *      <li> Enregistrement d'une fonction de callback spéciale afin de lancer le premier rendu une fois la première route résolue</li>
	     *      <li> Configuration du routeur 'director' afin d'initialiser toutes les routes applicatives</li>
	     *      <li> Démarrage du routeur</li>
	     * </ul>
	     * @param appConfig configuration de l'application
	     * @param clientInit gestionnaire d'intialisation spécifique au moteur de rendu du client
	     */
	    static initAndStart(appConfig: ClientConfiguration, clientInit: IClientInitializer<HornetEvent<ComponentChangeEventDetail>>): void;
	}
	
}

declare module "hornet-js-core/src/server-conf" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import * as https from "https";
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { AbstractRoutes, LazyRoutesClassResolver }  from "hornet-js-core/src/routes/abstract-routes";
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	import { IMenuItem } from 'hornet-js-components/src/component/imenu-item';
	export interface ServerConfiguration {
	    /**
	     * Composant store pour la session. utilisé pour enregistrer la session.
	     */
	    sessionStore: any;
	    /**
	     * Répertoire courant du script, utilisé pour reconstruire les liens relatifs
	     */
	    serverDir: string;
	    /**
	     * Répertoire relatif (par rapport à la variable 'serverDir') vers les ressources statiques
	     */
	    staticPath: string;
	    /**
	     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
	     */
	    defaultRoutesClass: AbstractRoutes;
	    /**
	     * Composant principal à utiliser pour rendre les pages.
	     * Ce composant est instancié par le routeur côté serveur et par le composant 'client' côté client.
	     * Côté serveur, la page courante à rendre lui est fournie par le routeur grâce à la propriété 'composantPage'
	     */
	    appComponent: Class<IHornetPage<any, any>>;
	    /**
	     * Composant de layout à utiliser pour rendre le composant principal.
	     * Ce composant est instancié par le routeur côté serveur.
	     * Côté serveur, l'app à rendre lui est fournie par le routeur grâce à la propriété 'composantApp'
	     */
	    layoutComponent: Class<IHornetPage<any, any>>;
	    /**
	     * Composant page invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
	     */
	    errorComponent: Class<IHornetPage<any, any>>;
	    /**
	     * Fonction de chargement des routes en mode lazy.
	     * Elle prend en argument le nom du composant et retourne le composant chargé.
	     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
	     * @param routesFileName Le nom de la route à charger
	     */
	    routesLoaderfn?: LazyRoutesClassResolver;
	    /**
	     * Liste des répertoire contenant des routes à charger en Lazy
	     */
	    routesLoaderPaths: Array<string>;
	    /**
	     * Contexte des routes coté serveur par défaut "/services"
	     */
	    routesDataContext?: string;
	    /**
	     * Internationalisation peut être de type String (JSON) ou bien de type IntlLoader (cas plus complexe)
	     */
	    internationalization: any;
	    /**
	     * La configuration du menu
	     */
	    menuConfig?: IMenuItem[];
	    /**
	     * le path vers la page de login
	     */
	    loginUrl: string;
	    /**
	     * le path vers l'action de logout
	     */
	    logoutUrl: string;
	    /**
	     * le path vers la page d'accueil
	     */
	    welcomePageUrl: string;
	    /**
	     * Les prefixes de chemin considérés comme publiques (sans authentification)
	     */
	    publicZones?: String[];
	    /**
	     * Déclaration des options pour exécuter un serveur en mode https
	     */
	    httpsOptions?: https.ServerOptions;
	}
	
}

declare module "hornet-js-core/src/server" {
	import { ServerConfiguration }  from "hornet-js-core/src/server-conf";
	import { HornetMiddlewareList }  from "hornet-js-core/src/middleware/middlewares";
	export class Server {
	    private app;
	    private server;
	    private monitor;
	    private keepAlive;
	    private keepAliveTimeout;
	    private port;
	    private maxConnections;
	    private timeout;
	    private protocol;
	    constructor(appConfig: ServerConfiguration, hornetMiddlewareList: HornetMiddlewareList);
	    start(): void;
	    /**
	     * Création du serveur web en mode http ou bien https
	     * @param httpsOptions option pour le mode https
	     * @returns {Server} le serveur instancié
	     */
	    private createServer(httpsOptions?);
	    /**
	     * Fonction principale permettant d'initialiser le serveur NodeJS proprement dit. <br />
	     * Elle effectue les opérations suivantes:
	     * <ul>
	     *     <li>Chargement de 'express'</li>
	     *     <li>Application des middlewares</li>
	     * </ul>
	     * @param appConfig
	     * @param hornetMiddlewareList
	     * @returns {"express".e.Express}
	     */
	    private init(appConfig, hornetMiddlewareList);
	}
	
}

declare module "hornet-js-core/src/actions/redirect-client-action" {
	
}

declare module "hornet-js-core/src/cache/hornet-cache" {
	/**
	 * Cache de l'application.
	 * Voir documentation Onion Skin: http://onionskin.io/
	 * */
	export class HornetCache {
	    private static _instance;
	    private pool;
	    constructor();
	    static getInstance(): HornetCache;
	    /**
	     * Item voir documentation de Onion Skin http://onionskin.io/api/
	     * @param key clé de l'item
	     * @returns {any} Item comme définis dans l'API de Onion Skin
	     */
	    getItem(key: string): Promise<any>;
	    /**
	     * Mise en cache de la donnée passée en paramètre. Methode Asynchrone: Promise.
	     * @param key clé de la valeur en cache
	     * @param data données à mettre en cache
	     * @param timetoliveInCache temps de sauvegarde de la données
	     */
	    setCacheAsynchrone(key: string, data: any, timetoliveInCache?: number): Promise<any>;
	    /**
	     * Supprime du cache de la donnée passée en paramètre. Methode Asynchrone: Promise.
	     * @param key clé de la valeur en cache
	     */
	    clearCacheAsynchrone(key: string): Promise<any>;
	}
	
}

declare module "hornet-js-core/src/component/error-manager" {
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	/**
	 * Applique le traitement appropriété à l'erreur indiquée suivant sa nature :
	 * - erreur fonctionnelle (BusinessError) : déclenche un évènement d'ajout de notification
	 * - erreur technique : déclenche l'évènement de changement de page vers la page d'erreur indiquée
	 * @param error erreur à traiter
	 * @param errorPage page à afficher en cas d'erreur technique
	 * @param method contexte éventuel de l'erreur : il s'agit de la fonction dans laquelle l'erreur s'est produite
	 */
	export function manageError(error: any, errorPage: Class<IHornetPage<any, any>>, method?: string): void;
	
}

declare module "hornet-js-core/src/component/hornet-component-errors" {
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	import { Class } from "hornet-js-utils/src/typescript-utils";
	export interface HornetComponentErrorReport {
	    componentName: string;
	    method: string;
	    methodArguments: IArguments;
	    props: any;
	    state: any;
	    error: any;
	}
	/**
	 * Fonction de traitement d'erreur pour composant graphique Hornet
	 */
	export type HornetComponentErrorHandler = (report: HornetComponentErrorReport, errorPage: Class<IHornetPage<any, any>>) => void;
	/**
	 * Fonction de traitement d'erreur par défaut
	 * @param report rapport d'erreur
	 * @param errorPage page à afficher en cas d'erreur technique
	 */
	export const DEFAULT_ERROR_HANDLER: HornetComponentErrorHandler;
	
}

declare module "hornet-js-core/src/component/sort-data" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Enumération des sens de tri de tableau
	 * @enum
	 */
	export enum SortDirection {
	    ASC = 0,
	    DESC = 1,
	}
	/***
	 * @description Classe de configuration pour le lancement d'un tri
	 * @interface
	  */
	export class SortData {
	    key: string;
	    dir: SortDirection;
	    /***
	     * @param {string} key Clé de la colonnne sur laquelle le tri est effectué
	     * @param {SortDirection} dir Sens du tri
	     */
	    constructor(key: string, dir?: SortDirection);
	}
	
}

declare module "hornet-js-core/src/data/file" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Représente un fichier uploadé
	 */
	export class UploadedFile {
	    id: number;
	    originalname: string;
	    name: string;
	    mimeType: string;
	    encoding: string;
	    size: number;
	    buffer: Array<number>;
	}
	
}

declare module "hornet-js-core/src/event/hornet-event" {
	global  {
	    interface Window {
	        CustomEvent: CustomEvent;
	        Event: Event;
	    }
	}
	/**
	 * Reprend la structure de la classe Event JavaScript
	 */
	export class BaseEvent {
	    bubbles: boolean;
	    cancelBubble: boolean;
	    cancelable: boolean;
	    currentTarget: EventTarget;
	    defaultPrevented: boolean;
	    eventPhase: number;
	    isTrusted: boolean;
	    returnValue: boolean;
	    srcElement: Element;
	    target: EventTarget;
	    timeStamp: number;
	    type: string;
	    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void;
	    preventDefault(): void;
	    stopImmediatePropagation(): void;
	    stopPropagation(): void;
	    static AT_TARGET: number;
	    static BUBBLING_PHASE: number;
	    static CAPTURING_PHASE: number;
	    constructor(type: string, eventInitDict?: EventInit);
	}
	export class HornetEvent<EventDetailInterface> extends BaseEvent {
	    name: string;
	    detail: EventDetailInterface;
	    constructor(name: string);
	    /**
	     * @returns {HornetEvent<EventDetailInterface>} un clone de cet évènement
	     */
	    private clone();
	    /**
	     * @param data détail de l'évènement à créer
	     * @returns {HornetEvent} un clone de cet évènement alimenté avec le détail indiqué
	     */
	    withData(data: EventDetailInterface): HornetEvent<EventDetailInterface>;
	}
	export function listenWindowEvent(eventName: string, callback: EventListener, capture?: boolean): void;
	export function listenOnceWindowEvent(eventName: string, callback: EventListener, capture?: boolean): void;
	export function removeWindowEvent(eventName: string, callback: EventListener, capture?: boolean): void;
	export function listenHornetEvent<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture?: boolean): void;
	export function listenOnceHornetEvent<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture?: boolean): void;
	export function removeHornetEvent<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture?: boolean): void;
	export function fireHornetEvent<T extends HornetEvent<any>>(event: T, eventOptions?: any): void;
	export interface RequestEventDetail {
	    inProgress: boolean;
	}
	export var ASYNCHRONOUS_REQUEST_EVENT: HornetEvent<RequestEventDetail>;
	export var ASYNCHRONOUS_REQUEST_EVENT_COMPONENT: HornetEvent<RequestEventDetail>;
	export class ServiceEvent {
	    static setRequestInProgress(inProgress: boolean): void;
	    static setRequestComponentInProgress(inProgress: boolean): void;
	}
	export interface ChangeUrlWithDataEventDetail {
	    url: string;
	    data: any;
	    cb: () => void;
	}
	export var CHANGE_URL_WITH_DATA_EVENT: HornetEvent<ChangeUrlWithDataEventDetail>;
	export {};
	
}

declare module "hornet-js-core/src/executor/async-element" {
	export class AsyncElement {
	    private fn;
	    constructor(fn?: (next: (err?: any, data?: any) => void) => void);
	    getFn(): (next: (err?: any) => void, resolvedError: any) => void;
	    execute(next: any, resolvedError: any): void;
	}
	
}

declare module "hornet-js-core/src/executor/async-executor-context" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export class AsyncExecutorContext {
	    shareData: any;
	    result: any;
	    filteredError: Array<Error>;
	    getFilteredErrors(): Error[];
	}
	
}

declare module "hornet-js-core/src/executor/async-executor" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { EventEmitter } from "events";
	import { AsyncElement }  from "hornet-js-core/src/executor/async-element";
	export class AsyncExecutor extends EventEmitter {
	    private started;
	    private ended;
	    private asyncElements;
	    private errorAsyncElement;
	    constructor();
	    setErrorAsyncElement(asyncElement: AsyncElement): this;
	    addElement(element: AsyncElement): this;
	    execute(): void;
	    private toPromise(asyncElement, resolvedError?);
	}
	
}

declare module "hornet-js-core/src/i18n/i18n-loader" {
	/**
	 * Classe utilisée uniquement côté serveur.
	 */
	export class I18nLoader {
	    pathLang: string;
	    constructor(pathLang?: string);
	    /** Méthode qui retourne la langue selectionné
	     * @returns {string[]}
	     */
	    getMessages(locales?: II18n): any;
	    /** Méthode qui liste les langues disponibles dans le dossier resources
	     * @returns {string[]}
	     */
	    getLocales(): Array<string>;
	}
	export interface II18n {
	    lang: string;
	    locale: string;
	}
	
}

declare module "hornet-js-core/src/inject/inject" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import "reflect-metadata";
	import { Class, AbstractClass } from "hornet-js-utils/src/typescript-utils";
	/**
	 * Decorateur de paramètre pour l'injecter suivant le côté où le code est ecécuté
	 * @param  key {any} clé de stockage
	 * @param  side {Side} complément de clé correspondant au côté d'exécution (Client ou Serveur)
	 * */
	export function inject(key: Class<any> | AbstractClass<any> | string): (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
	
}

declare module "hornet-js-core/src/inject/injectable" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import "reflect-metadata";
	import { AbstractClass, Class } from "hornet-js-utils/src/typescript-utils";
	/**
	 * Decorateur de classe pour l'enregistrer dans l'injecteur que si les côté correspond et permet d'injecter
	 * des valeurs dans le constructeur
	 * @param  key {any} clé de stockage
	 * @param  side {Side} complément de clé correspondant au côté d'exécution (Client ou Serveur)
	 * */
	export function injectable(key?: Class<any> | AbstractClass<any> | string, scope?: Scope, side?: Side): <T extends new (...args: any[]) => {}>(constructor: T) => T;
	export enum Side {
	    SERVER = 0,
	    CLIENT = 1,
	}
	export enum Scope {
	    PROTOTYPE = 0,
	    SINGLETON = 1,
	    VALUE = 2,
	}
	
}

declare module "hornet-js-core/src/inject/injector" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Class, AbstractClass } from "hornet-js-utils/src/typescript-utils";
	import { Side, Scope }  from "hornet-js-core/src/inject/injectable";
	export const INJECT_METADATA_KEY = "injectParameters";
	export class Injector {
	    private static registry;
	    /**
	     * Retourne la classe enregistrée pour une clé donnée
	     * @param  key {any} clé de stockage
	     * @param  side {Side} complément de clé correspondant au côté d'exécution (Client ou Serveur)
	     * @returns La valeur stockée
	     * */
	    static getRegistered(key: Class<any> | AbstractClass<any> | string, side?: Side): any;
	    /**
	     * Suppression la classe enregistrée pour une clé donnée
	     * @param  key {any} clé de stockage
	     * @param  side {Side} complément de clé correspondant au côté d'exécution (Client ou Serveur)
	     * */
	    static removeRegistered<T>(key: Class<any> | AbstractClass<any> | string, side?: Side): void;
	    /**
	     * Enregistre une classe suivant une clé
	     * @param  key {any} clé de stockage
	     * @param  side {Side} complément de clé correspondant au côté d'exécution (Client ou Serveur)
	     * @returns La valeur stockée
	     * */
	    static register(key: Class<any> | AbstractClass<any> | string, value: any, scope?: Scope, side?: Side): void;
	}
	
}

declare module "hornet-js-core/src/log/client-log" {
	global  {
	    interface Window {
	        getHornetLoggerHelp: () => void;
	        getHornetJsLogState: () => void;
	        setHornetJsLogLevel: (level: string) => void;
	        setHornetJsStacksLog: (enableValue: string) => void;
	        setHornetJsLogLayout: (layout: string) => void;
	        setHornetJsRemoteLog: (remote: boolean) => void;
	        setHornetJsRemoteLogLayout: (layout: string, threshold: string, timeout: string) => void;
	        setHornetJsRemoteLogUrl: (url: string) => void;
	    }
	}
	export class ClientLog {
	    static LOCAL_STORAGE_LOGGER_LEVEL_KEY: string;
	    static LOCAL_STORAGE_LOGGER_LAYOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_THRESHOLD_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_LAYOUT_TIMEOUT_KEY: string;
	    static LOCAL_STORAGE_LOGGER_REMOTE_URL_KEY: string;
	    static LOCAL_STORAGE_LOGGER_STACK_ENABLED: string;
	    static defaultRemote: boolean;
	    static defaultLogLevel: string;
	    static defaultLogLayout: string;
	    static defaultRemoteLogLayout: string;
	    static defaultRemoteLogThreshold: number;
	    static defaultRemoteLogTimeout: number;
	    static defaultRemoteUrl: string;
	    static defaultStackLogEnabled: string;
	    /**
	     * Cette fonction retourne la fonction d'initialisation des loggers de l'application côté ClientLog.
	     *
	     * @param logConfig  configuration log
	     */
	    static getLoggerBuilder(logConfig: any): (category: any) => void;
	    private static configureAjaxConsole(appender);
	    private static configureBrowserConsole(appender);
	    static getLoggerKeyValue(confKey: string, value: any, defaultValue: any): any;
	    static configHornetLoggerHelp(): void;
	    static configHornetJsLogState(): void;
	    static setHornetJsLogLevel(): any;
	    /**
	     * Met a disposition une fonction sur le browser (window.setStacksErrorsLogs)
	     * Appelée depuis du code client, cette fonction permet de changer  l'option de paramétrage
	     * pour activer ou désactiver la generation des stacks dans les logs d'erreur
	     * Cette option est stockée dans le navigateur au niveau du localStorage,
	     * elle peut donc aussi être modifié manuellement par l'utilisateur
	     */
	    static setHornetJsStacksLog(): any;
	    static setHornetJsLogLayout(): any;
	    static setHornetJsRemoteLog(): boolean;
	    static setHornetJsRemoteLogLayout(): any;
	    static setHornetJsRemoteLogUrl(defaultUrl: string): any;
	    static testParamLocalStorage(value: any, defaultValue: any): any;
	    static getConsoleLayout(logLayout: string): any;
	    static getDefaultConsoleLayout(): any;
	}
	export {};
	
}

declare module "hornet-js-core/src/log/server-log-configurator" {
	export class ServerLogConfigurator {
	    static configure(): void;
	}
	
}

declare module "hornet-js-core/src/log/server-log" {
	export class ServerLog {
	    static noTid: string;
	    static noUser: string;
	    /**
	     * Liste des tokens qui sont mis à disposition par Hornet dans le pattern des appender log4js
	     */
	    static appenderLayoutTokens: {
	        "pid": () => number;
	        "tid": () => any;
	        "user": () => any;
	        "fn": () => string;
	    };
	    /**
	     * Fonction d'ajout de token pour utilisation dans un pattern log4js
	     * Si besoin spécifique d'une application, cette fonction permet
	     * d'ajouter de nouveaux tokens en plus de ceux fournis par défaut
	     * @param tokenWithFunc : objet de la forme {"token":function(){return "valeur"}}
	     */
	    static addLayoutTokens(tokenWithFunc: any): void;
	    /**
	     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
	     * @param logConfig Le configuration log
	     * @returns {function(any): undefined}
	     */
	    static getLoggerBuilder(logConfig: any): (category: any) => void;
	}
	
}

declare module "hornet-js-core/src/mail/mailer" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { Logger } from "hornet-js-utils/src/logger";
	export interface NodeMailerMessage {
	    /** The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted ’“Sender Name” sender@server.com‘, see Address object for details */
	    from: string;
	    /** Comma separated list or an array of recipients email addresses that will appear on the To: field */
	    to: string | any[];
	    /** Comma separated list or an array of recipients email addresses that will appear on the Cc: field */
	    cc?: string | any[];
	    /** Comma separated list or an array of recipients email addresses that will appear on the Bcc: field */
	    bcc?: string | any[];
	    /** An e-mail address that will appear on the Reply-To: field */
	    replyTo?: string;
	    /** The message-id this message is replying */
	    inReplyTo?: string;
	    /** Message-id list (an array or space separated string) */
	    references?: string | string[];
	    /** The subject of the email */
	    subject: string;
	    /** The plaintext version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘/var/data/…’}) */
	    text: any;
	    /** The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘http://…‘}) */
	    html?: any;
	    /** An array of attachment objects. Attachments can be used for embedding images as well. */
	    attachments?: any[];
	    /** optional Message-Id value, random value will be generated if not set */
	    messageId?: string;
	    /** optional Date value, current UTC string will be used if not set */
	    date?: Date;
	    /** optional transfer encoding for the textual parts (defaults to 'quoted-printable') */
	    encoding?: string;
	}
	export class Mailer {
	    static defaultOptions: {
	        host: any;
	        port: any;
	        secure: any;
	        connectionTimeout: any;
	        auth: any;
	        logger: Logger;
	    };
	    private static _instance;
	    private constructor();
	    static readonly Instance: Mailer;
	    protected transport: any;
	    getSmtp(options?: any): any;
	    static sendMail(data: NodeMailerMessage, options?: any): Promise<any>;
	}
	
}

declare module "hornet-js-core/src/middleware/middlewares" {
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { ServerConfiguration }  from "hornet-js-core/src/server-conf";
	/**
	 * Classe abstraite de gestion d'un middleware dans une application Hornet
	 * Cette classe doit être héritée par chaque middleware
	 *
	 * Attention : la classe héritant de AbstractHornetMiddleware doit définir le constructeur suivant :
	 *          constructor() {
	 *              [...]
	 *              super(appConfig, PREFIX_OPTIONNEL, FN_OPTIONNEL);
	 *              [...]
	 *          }
	 *
	 * > Par défaut, la fonction "insertMiddleware(app)" utilise le PREFIX et FN fournis : app.use(PREFIX, FN)
	 *
	 * > Pour des cas particuliers, il est possible de surcharger cette méthode pour ajouter autant de middlewares qu'on veut :
	 *      public insertMiddleware(app) {
	 *          app.use("/exemple", (req, res, next) => { [ ... ] });
	 *          app.use((req, res, next) => { .... });
	 *          ...
	 *      }
	 */
	export class AbstractHornetMiddleware {
	    static APP_CONFIG: ServerConfiguration;
	    protected prefix: string;
	    protected middlewareFunction: ErrorRequestHandler | RequestHandler;
	    /**
	     * Constructeur
	     *
	     * @param middlewareFunction
	     * @param prefix
	     */
	    constructor(middlewareFunction?: ErrorRequestHandler | RequestHandler, prefix?: string);
	    /**
	     * Méthode appelée automatiquement lors de l'initialisation du serveur afin d'ajouter un middleware
	     * @param app
	     */
	    insertMiddleware(app: express.Express): void;
	}
	export class HornetContextInitializerMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class LoggerTIDMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class LoggerUserMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class WelcomePageRedirectMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class WithoutSlashPageRedirectMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class StaticNodeHttpHeaderMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	import * as express from "express";
	export class StaticPathMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class StaticPathErrorMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class BodyParserJsonMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class BodyParserUrlEncodedMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class SessionMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class MulterMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class SecurityMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    insertMiddleware(app: any): void;
	    private hppConfiguration(app);
	    private ieNoOpenConfiguration(app);
	    private noSniffConfiguration(app);
	    private cspConfiguration(app);
	    private referrerPolicyConfiguration(app);
	    private frameguardConfiguration(app);
	    private xssFilterConfiguration(app);
	    private hpkpConfiguration(app);
	    private hstsConfiguration(app);
	}
	import director = require("director");
	export class CsrfMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    static HEADER_CSRF_NAME: string;
	    static CSRF_SESSION_KEY: string;
	    insertMiddleware(app: any): void;
	    private csrfConfiguration(app);
	    /**
	     * Retourne un nouveau token aléatoire
	     * @return {string}
	     */
	    static generateToken(): string;
	    /**
	     * Middleware express pour sécuriser les verbs HTTP PUT, POST, PATCH et DELETE d'attaques CSRF
	     * @param req
	     * @param resrouter
	     * @param next
	     */
	    static middleware(req: any, res: director.DirectorResponse, next: any): void;
	    /**
	     * Détermine si le token envoyé correspond à celui stocké en session
	     * @param incomingCsrf
	     * @param sessionCsrf
	     * @return {boolean}
	     * @private
	     */
	    static isTokenValid(incomingCsrf: string, sessionCsrf: string): boolean;
	}
	export class InternationalizationMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class ChangeI18nLocaleMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class SetExpandedLayoutMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class IsExpandedLayoutMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class RouterServerMiddleware extends AbstractHornetMiddleware {
	    private router;
	    constructor();
	    insertMiddleware(app: any): void;
	}
	export class UserAccessSecurityMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export class MenuConfigMiddleware extends AbstractHornetMiddleware {
	    constructor();
	}
	export class DataRenderingMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	import { RequestHandler } from "express";
	import { ErrorRequestHandler } from "express";
	export class UnmanagedDataErrorMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export const DEFAULT_HORNET_MIDDLEWARES: Array<Class<AbstractHornetMiddleware>>;
	export class HornetMiddlewareList {
	    list: any[];
	    constructor(middlewares?: Array<Class<AbstractHornetMiddleware>>);
	    addBefore(newMiddleware: Class<AbstractHornetMiddleware>, middleware: Class<AbstractHornetMiddleware>): this;
	    addAfter(newMiddleware: Class<AbstractHornetMiddleware>, middleware: Class<AbstractHornetMiddleware>): this;
	    remove(middleware: Class<AbstractHornetMiddleware>): this;
	}
	
}

declare module "hornet-js-core/src/monitoring/monitor" {
	export class Monitor {
	    private server;
	    private monitorServer;
	    private connexion;
	    private request;
	    private eventLoopStats;
	    private api;
	    constructor(server: any);
	    monitorApiRequests(): void;
	    /**
	     * Callback qui réceptionne les données du module 'event-loop-monitor'
	     * Les moyennes sont mises à jour avec les dernières données
	     *
	     * @param data
	     */
	    onEventLoopMonitorData(data: any): void;
	    /**
	     * Calcule la moyenne des 'count' derniers éléments des données
	     *
	     * @param count
	     * @returns {{p50: number, p90: number, p95: number, p99: number, p100: number}}
	     */
	    computeAverage(count: any): {
	        p50: number;
	        p90: number;
	        p95: number;
	        p99: number;
	        p100: number;
	    };
	    /**
	     * Callback sur la réception d'une requête par le serveur
	     * @param req
	     * @param res
	     */
	    onRequest(req: any, res: any): void;
	    /**
	     * Callback sur l'établissement d'une nouvelle connexion TCP par le serveur
	     * @param req
	     * @param res
	     */
	    onConnection(socket: any): void;
	    monitorServerPage(req: any, res: any): void;
	}
	
}

declare module "hornet-js-core/src/notification/notification-events" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HornetEvent }  from "hornet-js-core/src/event/hornet-event";
	import { BaseError } from "hornet-js-utils/src/exception/base-error";
	export interface AddNotificationEventDetail {
	    errors?: any;
	    infos?: any;
	    warnings?: any;
	    id?: string;
	    exceptions?: Array<BaseError>;
	    personnals?: any;
	}
	export interface CleanNotificationEventDetail {
	    id?: string;
	}
	export interface CleanAllNotificationEventDetail {
	}
	export var ADD_NOTIFICATION_EVENT: HornetEvent<AddNotificationEventDetail>;
	export var CLEAN_NOTIFICATION_EVENT: HornetEvent<CleanNotificationEventDetail>;
	export var CLEAN_ALL_NOTIFICATION_EVENT: HornetEvent<CleanAllNotificationEventDetail>;
	
}

declare module "hornet-js-core/src/notification/notification-manager" {
	import { BaseError } from "hornet-js-utils/src/exception/base-error";
	/**
	 * Gestionnaire d'évènements de notifications
	 */
	export class NotificationManager {
	    static clean(id: string): void;
	    static cleanAll(): void;
	    /**
	     * Déclenche un évènement d'ajout de notification contenant les détails indiqués
	     * @param id identifiant de notification
	     * @param errors détail des erreurs éventuelles
	     * @param infos informations éventuelles détail des informations éventuelles
	     * @param exceptions exceptions détail des exceptions éventuelles
	     * @param warnings détail des warnings éventuelles
	     */
	    static notify(id: string, errors: any, infos?: any, exceptions?: BaseError[], warnings?: any, personnals?: any): void;
	}
	export class Notifications implements INotifications {
	    color: string;
	    logo: string;
	    notifications: Array<INotificationType>;
	    canRenderRealComponent: boolean;
	    constructor(color?: string, logo?: string);
	    getNotifications(): Array<INotificationType>;
	    setNotifications(notifs: Array<INotificationType>): void;
	    getCanRenderRealComponent(): boolean;
	    addNotification(notification: INotificationType): void;
	    addNotifications(notifications: Array<INotificationType>): void;
	    /**
	     * Construit une instance de Notifications contenant une seule notification ayant l'identifiant et le message indiqués
	     * @param id identifiant de la notification à créer
	     * @param text message de la notification
	     */
	    static makeSingleNotification(id: string, text: string): Notifications;
	}
	export class NotificationType implements INotificationType {
	    id: string;
	    text: string;
	    anchor: string;
	    field: string;
	    canRenderRealComponent: boolean;
	    additionalInfos: any;
	    constructor();
	    toString(): string;
	}
	export interface INotificationType {
	    id: string;
	    text: string;
	    anchor: string;
	    field: string;
	    canRenderRealComponent: boolean;
	    additionalInfos: AdditionalInfos;
	}
	export interface AdditionalInfos {
	    linkedFieldsName?: Array<string>;
	    other?: any;
	}
	export interface INotifications {
	    notifications: Array<INotificationType>;
	    canRenderRealComponent: boolean;
	}
	
}

declare module "hornet-js-core/src/protocol/media-type" {
	export interface MediaType {
	    /** Représentation simplifiée du type MIME */
	    SHORT: string;
	    /** Type MIME (https://www.iana.org/assignments/media-types/media-types.xhtml) */
	    MIME: string;
	}
	export class MediaTypes {
	    static MEDIATYPE_PARAMETER: string;
	    static JSON: {
	        SHORT: string;
	        MIME: string;
	    };
	    static XLS: {
	        SHORT: string;
	        MIME: string;
	    };
	    static CSV: {
	        SHORT: string;
	        MIME: string;
	    };
	    static PDF: {
	        SHORT: string;
	        MIME: string;
	    };
	    static DOC: {
	        SHORT: string;
	        MIME: string;
	    };
	    static TXT: {
	        SHORT: string;
	        MIME: string;
	    };
	    static PNG: {
	        SHORT: string;
	        MIME: string;
	    };
	    static BMP: {
	        SHORT: string;
	        MIME: string;
	    };
	    static JPG: {
	        SHORT: string;
	        MIME: string;
	    };
	    static OCTETSTREAM: {
	        SHORT: string;
	        MIME: string;
	    };
	    static ODS: {
	        SHORT: string;
	        MIME: string;
	    };
	    static ODT: {
	        SHORT: string;
	        MIME: string;
	    };
	    static DEFAULT: {
	        SHORT: string;
	        MIME: string;
	    };
	    private static _fromShortValue(parameter);
	    private static _fromMime(mimeType);
	    /**
	     * Rerouve la constante MediaType suivant la valeur abrégée
	     * @param {string} shortValue
	     * @return MediaTypes or MediaTypes.JSON si non pris en charge
	     */
	    static fromShortValue(shortValue: string): MediaType;
	    /**
	     * Rerouve la constante MediaType suivant la valeur de l'entête Accept
	     * @param {string} shortValue
	     * @return MediaTypes or MediaTypes.JSON si non pris en charge
	     */
	    static fromMime(accept: string): MediaType;
	}
	
}

declare module "hornet-js-core/src/result/hornet-result-interface" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Cette interface définit le minimum d'options pour former un objet de type result.
	 * A sucharger si nécessaire.
	 * @interface
	 */
	export interface Options {
	    data?: any;
	    filename?: string;
	    encoding?: string;
	}
	export interface OptionsFiles extends Options {
	    size?: number;
	}
	export interface OptionsPDF extends OptionsFiles {
	    definition: {};
	    fonts?: {};
	}
	export interface OptionsFiles extends Options {
	    size?: number;
	}
	export interface OptionsCSV extends OptionsFiles {
	    fields?: (string)[];
	    fieldNames?: string[];
	    del?: string;
	    defaultValue?: string;
	    quotes?: string;
	    doubleQuotes?: string;
	    hasCSVColumnTitle?: boolean;
	    eol?: string;
	    newLine?: string;
	    flatten?: boolean;
	    unwindPath?: string;
	    excelStrings?: boolean;
	    includeEmptyRows?: boolean;
	}
	export interface OptionsOpenDocument extends Options {
	    /** Fichier template utilisé pour la génération */
	    templateFilePath: string;
	    /** Options pour carbone.io on render */
	    computeOptions: Object;
	    /** Options pour carbone.io on setter */
	    initializingCarboneOptions: Object;
	}
	
}

declare module "hornet-js-core/src/result/hornet-result" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Response } from "express";
	import { MediaType }  from "hornet-js-core/src/protocol/media-type";
	import { Options }  from "hornet-js-core/src/result/hornet-result-interface";
	/**
	 * @class
	 * @classdesc HornetResult définit un result basique.
	 */
	export class HornetResult {
	    /**
	     * référence le mediaType du result
	     * @instance
	     */
	    private _mediaType;
	    /**
	     * référence les options à utiliser dans les methodes {@link HornetResult#__compute}  & {@link HornetResult#__configure}
	     * @instance
	     */
	    private _options;
	    constructor(options: Options, mediaType: MediaType);
	    options: any;
	    mediaType: MediaType;
	    /**
	     * méthode qui permet d'appliquer un traitement supplémentaire sur les données avant la télé-transmission des data dans la réponse
	     * @returns {Promise} revoie une promise de traitement
	     */
	    protected compute(): Promise<any>;
	    /**
	     * méthode qui permet de parametrer les entêtes et le corps de la réponse HTTP en fonction du type de résult
	     * @vreturns {boolean} true pour envoyer la reponse [response.end]
	     */
	    protected configure(res: Response): boolean;
	    /**
	     * méthode qui permet d'appeler la chaine des traitements + configuration des la response
	     * @returns {Promise} revoie une promise de traitement
	     */
	    manageResponse(res: Response): Promise<boolean>;
	}
	
}

declare module "hornet-js-core/src/result/result-bpm" {
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type BMP.
	 */
	export class ResultBMP extends ResultFile {
	    constructor(options: any);
	}
	
}

declare module "hornet-js-core/src/result/result-csv" {
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	import { OptionsCSV }  from "hornet-js-core/src/result/hornet-result-interface";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type CSV.
	 */
	export class ResultCSV extends ResultFile {
	    constructor(options: OptionsCSV);
	    protected compute(): Promise<any>;
	}
	
}

declare module "hornet-js-core/src/result/result-doc" {
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type DOC.
	 */
	export class ResultDOC extends ResultFile {
	    constructor(options: any);
	}
	
}

declare module "hornet-js-core/src/result/result-file" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HornetResult }  from "hornet-js-core/src/result/hornet-result";
	import { MediaType }  from "hornet-js-core/src/protocol/media-type";
	import { OptionsFiles }  from "hornet-js-core/src/result/hornet-result-interface";
	import { Response } from "express";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type FILE.
	 */
	export class ResultFile extends HornetResult {
	    constructor(options: OptionsFiles, mediaType: MediaType);
	    protected configure(res: Response): boolean;
	}
	
}

declare module "hornet-js-core/src/result/result-jpg" {
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type JPG.
	 */
	export class ResultJPG extends ResultFile {
	    constructor(options: any);
	}
	
}

declare module "hornet-js-core/src/result/result-json" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HornetResult }  from "hornet-js-core/src/result/hornet-result";
	import { Options }  from "hornet-js-core/src/result/hornet-result-interface";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type JSON.
	 */
	export class ResultJSON extends HornetResult {
	    constructor(options: Options);
	}
	
}

declare module "hornet-js-core/src/result/result-ods" {
	import { OptionsOpenDocument }  from "hornet-js-core/src/result/hornet-result-interface";
	import { ResultOpenDocument }  from "hornet-js-core/src/result/result-open-document";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type ODS.
	 */
	export class ResultODS extends ResultOpenDocument {
	    constructor(options: OptionsOpenDocument);
	}
	
}

declare module "hornet-js-core/src/result/result-odt" {
	import { OptionsOpenDocument }  from "hornet-js-core/src/result/hornet-result-interface";
	import { ResultOpenDocument }  from "hornet-js-core/src/result/result-open-document";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type ODT.
	 */
	export class ResultODT extends ResultOpenDocument {
	    constructor(options: OptionsOpenDocument);
	}
	
}

declare module "hornet-js-core/src/result/result-open-document" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	import { OptionsOpenDocument }  from "hornet-js-core/src/result/hornet-result-interface";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type ODT.
	 */
	export class ResultOpenDocument extends ResultFile {
	    constructor(options: OptionsOpenDocument, mediaTypes: any);
	    protected compute(): Promise<boolean>;
	    protected handleCarboneRenderResult(err: any, resolve: any, result: any): void;
	}
	
}

declare module "hornet-js-core/src/result/result-pdf" {
	import { OptionsPDF }  from "hornet-js-core/src/result/hornet-result-interface";
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	import { Response } from "express";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type PDF. see https://github.com/bpampuch/pdfmake
	 */
	export class ResultPDF extends ResultFile {
	    constructor(options: OptionsPDF);
	    protected compute(): Promise<any>;
	    /**
	     * méthode qui permet de parametrer les entêtes et le corps de la réponse HTTP en fonction du type de résult
	     * @vreturns {boolean} true pour envoyer la reponse [response.end]
	     */
	    protected configure(res: Response): boolean;
	}
	
}

declare module "hornet-js-core/src/result/result-png" {
	import { ResultFile }  from "hornet-js-core/src/result/result-file";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type PNG.
	 */
	export class ResultPNG extends ResultFile {
	    constructor(options: any);
	}
	
}

declare module "hornet-js-core/src/result/result-stream" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Response } from "express";
	import { HornetResult }  from "hornet-js-core/src/result/hornet-result";
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type Stream.
	 */
	export class ResultStream extends HornetResult {
	    constructor(options: any, mime: string);
	    protected compute(): Promise<any>;
	    protected configure(res: Response): boolean;
	}
	
}

declare module "hornet-js-core/src/routes/abstract-routes" {
	import { Class, AbstractClass } from "hornet-js-utils/src/typescript-utils";
	import { UserInformations } from "hornet-js-utils/src/authentication-utils";
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	import { DataValidator }  from "hornet-js-core/src/validation/data-validator";
	import { Request } from "express";
	import { Response } from "express";
	import { IService }  from "hornet-js-core/src/services/service-api";
	import { MediaType }  from "hornet-js-core/src/protocol/media-type";
	/** DirectorClientConfiguration */
	export interface DirectorClientConfiguration {
	    html5history?: boolean;
	    strict?: boolean;
	    convert_hash_in_init?: boolean;
	    recurse?: boolean;
	    notfound?: Function;
	}
	/** Routes type */
	export const RouteType: {
	    PAGE: string;
	    DATA: string;
	};
	/** Routes Authorizations */
	export type RouteAuthorization = Array<string>;
	export const PUBLIC_ROUTE: RouteAuthorization;
	export const PRIVATE_ROUTE: RouteAuthorization;
	export const DEFAULT_AUTHORIZATION: RouteAuthorization;
	/** Routes Method */
	export type RouteMethod = "get" | "post" | "delete" | "put" | "patch";
	export const DEFAULT_METHOD: RouteMethod;
	export type RouteHandler<T extends RouteInfos> = (...params: Array<string>) => T;
	export type Routes<T extends RouteInfos> = {
	    [key: string]: {
	        [key: string]: {
	            authorization: RouteAuthorization;
	            handler: RouteHandler<T>;
	        };
	    };
	};
	export type PageRouteHandler = RouteHandler<PageRouteInfos>;
	export type PageRoutes = Routes<PageRouteInfos>;
	export type DataRouteHandler = RouteHandler<DataRouteInfos>;
	export type DataRoutes = Routes<DataRouteInfos>;
	export type LazyRoutes = {
	    [key: string]: string;
	};
	export type LazyRoutesClassResolver = (name: string) => Class<AbstractRoutes>;
	export type LazyRoutesAsyncClassResolver = (name: string, callback: (routesClass: Class<AbstractRoutes>) => void) => void;
	/** Routes Informations */
	export type RouteAttributes = {
	    [key: string]: any;
	};
	export abstract class RouteAction<A extends RouteAttributes> {
	    /** Requête en cours */
	    req: Request;
	    /** Réponse en cours */
	    res: Response;
	    /** Attributs de la route déclenchant l'action */
	    attributes: A;
	    service: IService;
	    /** Utilisateur connecté */
	    user: UserInformations;
	    /** Exécute l'action */
	    abstract execute(): Promise<any>;
	    /**
	     * Renvoie l'objet contenant les éléments nécessaires à la validation des données transmises à cette action.
	     * Renvoie null par défaut : à surcharger éventuellement dans la classe action implémentée.
	     * @returns {null} une instance de ActionValidation ou null
	     */
	    getDataValidator(): DataValidator;
	    /**
	     * Renvoie les données entrantes éventuelles, récupérées par défaut directement dans le corps de la requête.
	     * A sucharger si nécessaire.
	     * @return {any} un objet contenant les données transmises à cette action
	     */
	    getPayload(): any;
	    /**
	     * Renvoie le MediaType issu de l'entête de la requête.
	     * @return {any} un objet contenant les données transmises à cette action
	     */
	    getMediaType(): MediaType;
	}
	export abstract class RouteActionService<A extends RouteAttributes, B extends IService> extends RouteAction<A> {
	    getService(): B;
	}
	export abstract class RouteInfos {
	    private type;
	    private attributes;
	    private service;
	    constructor(type: string, attributes?: RouteAttributes, service?: Class<IService> | AbstractClass<IService>);
	    getRouteType(): string;
	    getAttributes(): RouteAttributes;
	    getService(): Class<IService> | AbstractClass<IService>;
	}
	export class PageRouteInfos extends RouteInfos {
	    private viewComponent;
	    constructor(viewComponent: Class<IHornetPage<any, any>>, attributes?: RouteAttributes, service?: Class<IService> | AbstractClass<IService>);
	    getViewComponent(): Class<IHornetPage<any, any>>;
	}
	export class DataRouteInfos extends RouteInfos {
	    private action;
	    constructor(action: Class<RouteAction<any>>, attributes?: RouteAttributes, service?: Class<IService>);
	    getAction(): Class<RouteAction<any>>;
	}
	/** Routes Declaration */
	export abstract class AbstractRoutes {
	    private pageRoutes;
	    private dataRoutes;
	    private lazyRoutes;
	    private resolveAuthorizationAndMethod(authorizationOrMethod, method);
	    addPageRoute(path: string, handler: PageRouteHandler, authorization?: RouteAuthorization): void;
	    addDataRoute(path: string, handler: DataRouteHandler): any;
	    addDataRoute(path: string, handler: DataRouteHandler, authorization: RouteAuthorization): any;
	    addDataRoute(path: string, handler: DataRouteHandler, method: RouteMethod): any;
	    addDataRoute(path: string, handler: DataRouteHandler, authorization: RouteAuthorization, method: RouteMethod): any;
	    addLazyRoutes(path: string, subRoutesFile: string): void;
	    getPageRoutes(): PageRoutes;
	    getDataRoutes(): DataRoutes;
	    getLazyRoutes(): LazyRoutes;
	    /**
	     * Permet de charger les routes depuis une liste de répertoires
	     * @param paths
	     * @returns route module
	     */
	    getDefaultRouteLoader(paths: Array<string>): (name: string) => any;
	}
	
}

declare module "hornet-js-core/src/routes/actions-chain-data" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Type d'objet qui est transféré d'une action à une autre (d'une promise à une autre)
	 * Les chaines d'actions peuvent étendre cette classe pour ajouter des attributs spécifiques.
	 *
	 */
	import * as superagent from "superagent";
	export class ActionsChainData {
	    /**
	     * Le mimeType demandé par le client
	     */
	    requestMimeType: string;
	    /**
	     * Le MimeType du résultat à retourner au client
	     */
	    responseMimeType: string;
	    /**
	     * Le résultat à retourner au client.
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    result: any;
	    /**
	     * La dernière erreur technique produite
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    lastError: any;
	    /**
	     * Les erreurs présentes dans un formulaire
	     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
	     */
	    formError: any;
	    /**
	     * Boolean indiquant que l'accès à la ressource courante n'est pas autorisé pour l'utilisateur courant
	     * @type {boolean}
	     */
	    isAccessForbidden: boolean;
	    parseResponse(res: superagent.Response): this;
	    withBody(body: any): this;
	    withResponseMimeType(responseMimeType: string): this;
	}
	
}

declare module "hornet-js-core/src/routes/router-client-async-elements" {
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { AsyncElement }  from "hornet-js-core/src/executor/async-element";
	import { HornetEvent }  from "hornet-js-core/src/event/hornet-event";
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	export class ContextInitializerElement extends AsyncElement {
	    private authorization;
	    private handler;
	    private params;
	    constructor(authorization: any, handler: any, params: any);
	    execute(next: any): void;
	}
	export var PAGE_READY_EVENT: HornetEvent<{}>;
	export interface UrlChangeEventDetail {
	    newUrl: string;
	    newPath: string;
	}
	export var URL_CHANGE_EVENT: HornetEvent<UrlChangeEventDetail>;
	export class UrlChangeElement extends AsyncElement {
	    execute(next: any): void;
	}
	export class UserAccessSecurityElement extends AsyncElement {
	    private static logger;
	    execute(next: any): void;
	}
	export interface ComponentChangeEventDetail {
	    newComponent: Class<IHornetPage<any, any>>;
	    data: any;
	}
	export var COMPONENT_CHANGE_EVENT: HornetEvent<ComponentChangeEventDetail>;
	export class ViewRenderingElement extends AsyncElement {
	    private static logger;
	    private appComponent;
	    constructor(appComponent: any);
	    execute(next: any): void;
	}
	export class UnmanagedViewErrorElement extends AsyncElement {
	    private static logger;
	    private errorComponent;
	    constructor(errorComponent: any);
	    execute(next: any, resolvedError: any): void;
	}
	
}

declare module "hornet-js-core/src/routes/router-client" {
	import { DirectorRouterConfiguration } from "director";
	import { AbstractRoutes, RouteHandler, RouteInfos, LazyRoutesAsyncClassResolver, RouteAuthorization }  from "hornet-js-core/src/routes/abstract-routes";
	global  {
	    interface Window {
	        setHornetJsGenerationServer: (enableValue: string) => void;
	    }
	}
	export type DirectorClientRoutesDesc = {
	    [key: string]: (...arg) => void;
	};
	export class RouterClient {
	    private appComponent;
	    private errorComponent;
	    private pageRoutes;
	    private appRoutes;
	    private directorPage;
	    private directorClientConfiguration;
	    private lazyRoutesClassResolver;
	    constructor(appComponent: any, errorComponent: any, appRoutes: AbstractRoutes, lazyRoutesClassResolver: LazyRoutesAsyncClassResolver, directorClientConfiguration?: DirectorRouterConfiguration);
	    private computeRoutes(routesObj?, prefix?, directorRoutes?);
	    private parseRoutes<T>(declaredRoutes, internalObj, prefix);
	    private buildRouteHandler<T>(declaredRoutes, path, method);
	    private parseLazyRoute(internalObj, prefix, routesClassPath);
	    private loadLazyRoutes(originalRoute, prefix, routesClassPath, done);
	    protected handleRoute<T extends RouteInfos>(done: any, authorization: RouteAuthorization, handler: RouteHandler<T>, params: Array<string>): void;
	    /**
	     * Méthode utilisée par la partie cliente pour initialiser le routeur
	     */
	    startRouter(baseElement?: Document | Element): void;
	    /**
	     * Demande un changement d'url dans la barre d'adresse du navigateur (et donc un changement de route) mais sans recharger la page
	     */
	    setRoute(route: string, pageReady?: () => void): void;
	    /**
	     * Monte les routes dans director
	     * @param newRoutes
	     */
	    mountRoutes(newRoutes: DirectorClientRoutesDesc): void;
	    /**
	     * Retourne un objet contenant les paramètres présents dans l'url. Exemple: page?param1=XX&param2=YY => {param1:XX, param2:YY}
	     * @param url L'URL à parser
	     * @returns {{}}
	     */
	    static getUrlParameters(url: string): any;
	    static LOCAL_STORAGE_ENABLE_GENERATION_SERVER_KEY: string;
	    static defaultGenerationServerEnabled: string;
	    /**
	     * mantis 0055411
	     * Met a disposition une fonction sur le browser (window.setHornetJsGenerationServer)
	     * Appellée depuis du code client, cette fonction permet de changer  l'option de paramétrage
	     * pour activer ou désactiver la generation des pages côté serveur (cf usage getHornetJsGenerationServer)
	     * Cette option est stockée dans le navigateur au niveau du localStorage,
	     * elle peut donc aussi être modifié manuellement par l'utilisateur
	     *
	     * Attention, ne pas activer l'option en mode fullSpa
	     * (elle n'a d'interet qu'avec le serveur node)
	     */
	    static setHornetJsGenerationServer(): void;
	    /**
	     * Getter pour récuperer la valeur de l'option de paramétrage "hornet-js.enable.generation.server"
	     * Cette option true/false permet d'activer ou désactiver la generation des pages côté serveur
	     * Lecture du localStorage d'abord (si supporté et contient la valeur), et sinon valeur par défaut (false)
	     *
	     * @returns {any}
	     */
	    static getHornetJsGenerationServer(): any;
	}
	
}

declare module "hornet-js-core/src/routes/router-server" {
	import { AbstractRoutes, RouteHandler, RouteInfos, LazyRoutesClassResolver, RouteAuthorization }  from "hornet-js-core/src/routes/abstract-routes";
	export class RouterServer {
	    private dataRoutes;
	    private pageRoutes;
	    private appRoutes;
	    private directorData;
	    private directorPage;
	    private lazyRoutesClassResolver;
	    private dataContext;
	    constructor(appRoutes: AbstractRoutes, lazyRoutesClassResolver: LazyRoutesClassResolver, routesPaths: Array<string>, routesDataContext?: String);
	    /**
	     * Méthode utilisée par la partie serveur pour initialiser le routeur.
	     * Note: Fourni un middleware Express
	     */
	    dataMiddleware(): (req: Express.Request, res: Express.Response, next: any) => any;
	    pageMiddleware(): (req: Express.Request, res: Express.Response, next: any) => any;
	    private computeRoutes(routesObj?, prefix?);
	    private computeAuthorizationsRoutes(pageRoutes, dataRoutes, prefix);
	    private parseRoutes<T>(declaredRoutes, internalObj, prefix);
	    private buildRouteHandler<T>(declaredRoutes, path, method);
	    private parseLazyRoutes(lazyRoutes, prefix);
	    protected handleRoute<T extends RouteInfos>(authorization: RouteAuthorization, handler: RouteHandler<T>, method: any, params: Array<string>): void;
	}
	
}

declare module "hornet-js-core/src/security/client-antivirus-connexion" {
	export interface ClientAntivirusConnexionProps {
	    /**
	     *port du serveur clamav
	    */
	    port: number;
	    /**
	     * ip du serveur clamav
	     */
	    host: string;
	    /**
	     * port du serveur clamav
	     */
	    timeout: number;
	    /**
	     * fonctionné à appeler à la fin du traitement.
	     */
	    complete: Function;
	}
	/**
	 * Classe de connexion entre le client et le serveur
	 */
	export class ClientAntivirusConnexion {
	    /**
	     * port du serveur clamav
	     */
	    port: number;
	    /**
	     * ip du serveur clamav
	     */
	    host: string;
	    /**
	     * port du serveur clamav
	     */
	    timeout: number;
	    /**
	     * fonctionné à appeler à la fin du traitement.
	     */
	    complete: Function;
	    constructor(options?: ClientAntivirusConnexionProps);
	    /**
	     *
	     * @param stream le flux du fichier
	     * @returns {Promise<Buffer>|Promise}
	     */
	    scan(stream: any): Promise<{}>;
	}
	
}

declare module "hornet-js-core/src/security/client-input-channel" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Created by framarc on 8/28/17.
	 */
	import stream = require("stream");
	/**
	 * Classe permettant de préparer la request au serveur antivius
	 */
	export class ClientInputChannel extends stream.Transform {
	    _inBody: boolean;
	    constructor(options?: any);
	    _transform(chunk: any, encoding: string, callback: Function): void;
	    _flush(callback: any): void;
	}
	
}

declare module "hornet-js-core/src/services/api-callback" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export type ApiCallback<T> = (res: T) => void;
	
}

declare module "hornet-js-core/src/services/expanding-layout-request" {
	import { ServiceRequest }  from "hornet-js-core/src/services/service-request";
	export class ExpandingLayoutRequest extends ServiceRequest {
	    setExpandedLayout(layoutObject: any): Promise<any>;
	    isExpandedLayout(): Promise<any>;
	}
	
}

declare module "hornet-js-core/src/services/hornet-superagent-request" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Request } from "superagent";
	import { MediaType }  from "hornet-js-core/src/protocol/media-type";
	import { CacheKey }  from "hornet-js-core/src/services/hornet-superagent";
	/**
	 * Surcharge pour la compilation des plugins
	 */
	export interface HornetSuperAgentRequest extends Request<HornetSuperAgentRequest> {
	    callback(err: any, res: any): void;
	}
	export interface HornetRequest {
	    url: string;
	    method?: "get" | "post" | "patch" | "put" | "delete" | "head" | "options";
	    headers?: HornetRequestHeader;
	    data?: any;
	    spinnerType?: SpinnerType;
	    typeMime?: MediaType;
	    attach?: Array<Attachment>;
	    noCached?: boolean;
	    timeToLiveInCache?: number;
	    cacheKey?: CacheKey;
	    cacheLinkKey?: Array<string>;
	    ca?: string;
	    cert?: string;
	    key?: string;
	    progress?: Function;
	}
	export interface Attachment {
	    field: string;
	    file: File | Buffer | string;
	    fileName?: string;
	}
	export interface HornetRequestHeader {
	    contentType?: string;
	    Authorization?: string;
	}
	/**
	 * Type de spinnerType
	 * valeur possible (None, Default, Component[depreacated])
	 */
	export enum SpinnerType {
	    None = 0,
	    Default = 1,
	    Component = 2,
	}
	
}

declare module "hornet-js-core/src/services/hornet-superagent" {
	import * as superagent from "superagent";
	import { Response } from "superagent";
	import { HornetRequest, SpinnerType }  from "hornet-js-core/src/services/hornet-superagent-request";
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { HornetPlugin } from "hornet-js-core/src/services/superagent-hornet-plugins";
	import { Promise } from "hornet-js-utils/src/promise-api";
	export enum CacheKey {
	    URL = 0,
	    URL_DATA = 1,
	}
	/**
	 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
	 * @class
	 */
	export class HornetSuperAgent {
	    private enableCache;
	    private timeToLiveInCache;
	    private cacheKey;
	    private noEventFired;
	    private superAgentRequest;
	    plugins: HornetList<HornetPlugin>;
	    response: Response;
	    constructor(timeToliveInCache?: number, cacheKey?: CacheKey);
	    protected getCacheConfig(): any;
	    /**
	     * Initialise une instance de superagent en ajoutant les plugins et header
	     * @returns {SuperAgentRequest}
	     * @protected
	     */
	    protected initSuperAgent(request: HornetRequest): superagent.SuperAgentRequest;
	    /**
	     * Lancement des évents à lancer côté client lors d'une request
	     * @param  boolean value indicateur de lancement ou reception d'une requete
	     * @param  SpinnerType [spinner=SpinnerType.Default] type de gestion des spinner associés à la requête
	     * @returns HornetAgent
	     * */
	    protected setClientEventForRequest(value: boolean, spinner?: SpinnerType): void;
	    /**
	     * Methode executer sur l'envoi d'une requete (gestion spinner et du cache)
	     * @param {HornetRequest} request requete à envoyer
	     * @returns HornetAgent
	     * */
	    protected preProcessRequest(request: HornetRequest): Promise<Response>;
	    /**
	     * Methode executer sur  la reception d'une requete (gestion spinner et du cache)
	     * @param {HornetRequest} request requete envoyée
	     * @param {Response} response réponse recue
	     * @returns Response
	     * */
	    protected postProcessRequest(request: HornetRequest, response: Response): Response;
	    /**
	     * send a request
	     * @param {HornetRequest} request objet representant une requête (methode 'get' par defaut)
	     * @param {NodeJS.WritableStream} pipedStream flux bindé sur la reponse superagent
	     * @returns {Promise<Response>}
	     */
	    fetch(request: HornetRequest, pipedStream?: NodeJS.WritableStream): Promise<Response>;
	    /**
	     * Formate la réponse pour le client afin de traiter les erreurs automatiquement
	     * @param {Response} response reponse de superagent
	     */
	    private manageClientResult(response);
	    /**
	     * Formate la réponse pour le serveur afin de traiter les erreurs automatiquement
	     * @param {Response} response reponse de superagent
	     */
	    protected manageServerResult(response: Response): any;
	    /**
	     * Test si c'est un format Hornet
	     * @param {Response.body} body reponse de superagent
	     */
	    private hasHornetBody(body);
	    /**
	     * Construction d'une erreur hornet et appel du manager d'erreurs
	     */
	    private manageError(err);
	    /**
	     * Lecture dans le cache
	     * @param {string} url url de la requête
	     */
	    private getFromCache(request);
	    /**
	     * Mise en cache de la reponse
	     * @param {Response} response reponse de superagant
	     * @param {HornetRequest} request requête à mettre en cache
	     * @param {number} timetoliveInCache durée de vie dans le cache
	     */
	    private setInCache(response, request, timetoliveInCache);
	    /**
	     * Nettoyage en cache de la requete
	     * @param {HornetRequest} request requête à mettre en cache
	     */
	    private removeInCache(request);
	    /**
	     * Génère la clé utilisée pour le cache
	     * @param {HornetRequest} request requête pour la génération de la clé (url + param)
	     */
	    protected generateCacheKey(request: HornetRequest): string;
	    /**
	     * clone les paramètres interessants d'une réponse.
	     * La raison est que sur NodeJs la propriété 'body' n'est pas énumérable, on reconstruit donc un objet spécial pour le cache
	     * Note: Possible de d'override cette méthode si d'autres paramètres doivent être ajoutés
	     * @param res
	     * @return {{body: (any|HTMLElement|req.body|{x-csrf-token}), header: any, ok: any, status: any, type: any}}
	     * @protected
	     */
	    protected cloneResponse(res: Response): {
	        body: any;
	        header: any;
	        ok: boolean;
	        status: number;
	        type: string;
	    };
	    /**
	     * nettoyage des data (suppression des null (Button)).
	     * @param {object} data
	     * @protected
	     */
	    protected cleanData(data: any): void;
	}
	export class HornetPluginConfig<T> {
	    readonly name: string;
	    readonly clazz: Class<T>;
	    readonly args: Array<any>;
	    constructor(name: string, clazz: Class<T>, args: Array<any>);
	}
	/**
	 * Classe d'encapsulation de liste
	 * @class
	 */
	export class HornetList<T extends HornetPlugin> {
	    list: String[];
	    mapPlugins: {};
	    constructor(list?: Array<HornetPluginConfig<T>>);
	    addBefore(newElt: HornetPluginConfig<T>, Elt: HornetPluginConfig<T>): this;
	    addAfter(newElt: HornetPluginConfig<T>, Elt: HornetPluginConfig<T>): this;
	    remove(Elt: HornetPluginConfig<T>): this;
	    push(newElt: HornetPluginConfig<T>): this;
	}
	
}

declare module "hornet-js-core/src/services/i18n-service-api" {
	import { ServiceRequest }  from "hornet-js-core/src/services/service-request";
	export class I18nServiceApi extends ServiceRequest {
	    changeLanguage(data: any): Promise<any>;
	}
	
}

declare module "hornet-js-core/src/services/service-api-results" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BaseError } from "hornet-js-utils/src/exception/base-error";
	export interface BackendApiResult {
	    hasTechnicalError: boolean;
	    hasBusinessError: boolean;
	    status: number;
	    url: string;
	    data: any;
	    /** Erreurs : objets représentant des BackendApiError */
	    errors: Array<any>;
	}
	export interface NodeApiResult {
	    hasTechnicalError: boolean;
	    hasBusinessError: boolean;
	    status: number;
	    url: string;
	    data: any;
	    errors: Array<BaseError>;
	}
	export class NodeApiResultBuilder {
	    static build(jsonData: any): NodeApiResult;
	    static buildError(error: BaseError): NodeApiResult;
	}
	export class NodeApiError {
	    /**
	     * Timestamp (en ms depuis Epoch) correspondant à la date de création de l'erreur. L'utilisation d'un timestamp
	     * plutôt qu'un objet Date facilite la sérialisation/désérialisation en json.
	     */
	    date: number;
	    /** Code d'erreur, normalement associé à un message internationalisé */
	    code: string;
	    name: string;
	    details: string;
	    reportId: string;
	    /** Paramètres utilisables dans la construction du message d'erreur correspondant au code */
	    args: {
	        [key: string]: string;
	    };
	    backend: boolean;
	    httpStatus: number;
	    nodeApiErrorList: Array<NodeApiError>;
	    constructor(date?: number, code?: string, name?: string, details?: string, args?: {
	        [key: string]: string;
	    }, reportId?: string, backend?: boolean, httpStatus?: number);
	    /**
	     * Renvoie le résumé des détails éventuels de l'erreur d'origine.
	     * @param apiError erreur serveur
	     * @returns {string} la première ligne de détail
	     */
	    static parseDetails(apiError: BaseError): string;
	    static parseError(apiErrors: BaseError[] | BaseError, httpStatus: number): NodeApiError;
	    toJsError(): BaseError;
	}
	export class BackendApiError {
	    date: number;
	    code: string;
	    name: string;
	    type: string;
	    details: string;
	    reportId: string;
	    args: Array<string>;
	    httpStatus: number;
	    backendApiErrorList: Array<BackendApiError>;
	    constructor(date?: number, code?: string, name?: string, type?: string, details?: string, args?: Array<string>, reportId?: string, httpStatus?: number);
	    /**
	     * Crée l'instance de BackendApiError à partir de l'objet JSON représentant la ou les erreurs
	     * @param apiErrors erreurs[s] représentant
	     * @param httpStatus
	     * @returns {BackendApiError}
	     */
	    static parseError(apiErrors: BackendApiError | Array<BackendApiError>, httpStatus: number): BackendApiError;
	    toJsError(): BaseError;
	}
	
}

declare module "hornet-js-core/src/services/service-api" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export interface IService {
	}
	
}

declare module "hornet-js-core/src/services/service-page" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { ServiceRequest }  from "hornet-js-core/src/services/service-request";
	export class ServicePage extends ServiceRequest {
	    constructor();
	}
	
}

declare module "hornet-js-core/src/services/service-request" {
	import { HornetRequest }  from "hornet-js-core/src/services/hornet-superagent-request";
	import { HornetSuperAgent }  from "hornet-js-core/src/services/hornet-superagent";
	import { IService }  from "hornet-js-core/src/services/service-api";
	export class ServiceRequest implements IService {
	    protected serviceHost: string;
	    protected serviceName: string;
	    getServiceHost(): string;
	    setServiceHost(serviceHost: string): void;
	    getServiceName(): string;
	    setServiceName(serviceName: string): void;
	    constructor();
	    /**
	     * envoi d'une requete
	     * @param {HornetRequest} request objet representant une requête (methode 'get' par defaut)
	     * @returns {Promise<Response>}
	     */
	    fetch(request: HornetRequest): Promise<any>;
	    /**
	     * envoi d'une requete avec la reponse superagent bindée sur un flux
	     * @param {HornetRequest} request objet representant une requête
	     * @param {NodeJS.WritableStream} pipedStream flux bindé sur la reponse superagent
	     * @returns {Promise<Response>}
	     */
	    fetchOnStream(request: HornetRequest, pipedStream: NodeJS.WritableStream): Promise<any>;
	    /**
	     * Récupère une instance de HornetSuperagent
	     * @returns {HornetSuperAgent}
	     */
	    getFetcher(): HornetSuperAgent;
	    /**
	     * Construit une url complète en ajoutant le Host et le chemin aux ressources services
	     * @param {string} path url partielle
	     * @return url complete {host}/{service}/{path}
	     */
	    buildUrl(path: any): string;
	}
	
}

declare module "hornet-js-core/src/services/service-secure" {
	import { HornetRequest }  from "hornet-js-core/src/services/hornet-superagent-request";
	import { HornetSuperAgent }  from "hornet-js-core/src/services/hornet-superagent";
	import { ServiceRequest }  from "hornet-js-core/src/services/service-request";
	import { Response } from "superagent";
	export abstract class ServiceSecure extends ServiceRequest {
	    static HEADER_AUTH: string;
	    prefixeAuth: string;
	    constructor(prefixeAuth?: string);
	    /**
	     * envoi d'une requete
	     * @param {HornetRequest} request objet representant une requête (methode 'get' par defaut)
	     * @returns {Promise<Response>}
	     */
	    fetch(request: HornetRequest): Promise<any>;
	    /**
	     * envoi d'une requete avec la reponse superagent bindée sur un flux
	     * @param {HornetRequest} request objet representant une requête
	     * @param {NodeJS.WritableStream} pipedStream flux bindé sur la reponse superagent
	     * @returns {Promise<Response>}
	     */
	    fetchOnStream(request: HornetRequest, pipedStream: NodeJS.WritableStream): Promise<any>;
	    /**
	     * Récupère une instance de HornetSuperagent
	     * @returns {HornetSuperAgent}
	     */
	    getFetcher(): HornetSuperAgent;
	    /**
	     * methode à implementer retournant le token jwt
	     * @return token JWT
	     */
	    abstract getToken(): String;
	    /**
	     * methode à implementer pour sauvegarder le token jwt
	     * @param {Response} response response contenant l'header d'authentification
	     * @return token JWT
	     */
	    abstract saveToken(response: Response): void;
	}
	
}

declare module "hornet-js-core/src/services/superagent-hornet-plugins" {
	import { HornetSuperAgentRequest }  from "hornet-js-core/src/services/hornet-superagent-request";
	export abstract class HornetPlugin {
	    static getPlugin(...args: any[]): (request: HornetSuperAgentRequest) => void;
	}
	/**HornetPlugin
	 * Plugin SuperAgent ajoutant le header csrf lors de l'envoi des requêtes et gérant la récupération du nouveau token lors du retour
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export class CsrfPlugin extends HornetPlugin {
	    static getPlugin(): (request: HornetSuperAgentRequest) => void;
	}
	/**
	 * Plugin SuperAgent permettant de contourner les problèmes liés au cache sous IE
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export class noCacheIEPlugin extends HornetPlugin {
	    static getPlugin(): (request: HornetSuperAgentRequest) => void;
	}
	/**
	 * Plugin SuperAgent détectant une redirection vers la page de login et redirigant le navigateur vers cette page.
	 * Pour détecter cette redirection il recherche dans les headers de la réponse le header 'x-is-login-page' valant "true"
	 * @param request
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export class RedirectToLoginPagePlugin extends HornetPlugin {
	    static getPlugin(): (request: HornetSuperAgentRequest) => void;
	}
	/**
	 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
	 * @param nom du localstorage
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export class AddParamFromLocalStorage extends HornetPlugin {
	    static getPlugin(param: string, localStorageName?: string): (request: HornetSuperAgentRequest) => void;
	}
	/**
	 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
	 * @param nom du localstorage
	 * @return {HornetSuperAgentRequest}
	 * @constructor
	 */
	export class AddParam extends HornetPlugin {
	    static getPlugin(param: string, paramValue: any): (request: HornetSuperAgentRequest) => void;
	}
	
}

declare module "hornet-js-core/src/session/cookie-manager" {
	import { IncomingMessage, ServerResponse } from "http";
	export interface CookieManagerOption {
	    secret?: string;
	    route?: string;
	    maxAge?: number;
	    path?: string;
	}
	/**
	 * classe de gestion des cookies
	 */
	export class CookieManager {
	    /**
	     * Recupère un cookie de la requête
	     * @param {IncomingMessage} req - requete http
	     * @param {string} name - nom du cookie
	     * @param {CookieManagerOption} [options] - options de récupération du cookie
	     */
	    static getCookie(req: IncomingMessage, name: any, options?: CookieManagerOption): any;
	    /**
	     * ajoute un cookie à la réponse response.
	     * @param {ServerResponse} res - reponse http
	     * @param {string} name - nom du cookie
	     * @param {object} value - valeur du cookie
	     * @param {CookieManagerOption} [options] - options de récupération du cookie
	     */
	    static setCookie(res: ServerResponse, name: string, value: any, options?: CookieManagerOption): void;
	    /**
	     * Verification et decode la valeur suivant une code.
	     *
	     * @param {String} val - valeur
	     * @param {String} secret - code
	     * @returns {String|Boolean}
	     */
	    static unsignCookie(val: string, secret: string): String | Boolean;
	    /**
	     * supprime un cookie .
	     * @param {ServerResponse} res - reponse http
	     * @param {string} name - nom du cookie
	     */
	    static removeCookie(res: any, name: any): void;
	}
	
}

declare module "hornet-js-core/src/session/memory-store" {
	import { Session }  from "hornet-js-core/src/session/session";
	import { Store }  from "hornet-js-core/src/session/store";
	export class MemoryStore extends Store {
	    private sessions;
	    private expiredCheckInterval;
	    private lastExpiredCheck;
	    /**
	     * Constructor
	     * @param expiredCheckInterval the interval in ms to check / delete expired sessions (default: 60000ms)
	     */
	    constructor(expiredCheckInterval?: number);
	    /**
	     * Describe if the 'touch' method is implemented or not by this kind of store
	     *
	     * @returns {boolean}
	     */
	    isTouchImplemented(): boolean;
	    /**
	     * Clear all sessions.
	     *
	     * @param {function} fn
	     * @public
	     */
	    clear(fn: Function): void;
	    /**
	     * Destroy the session associated with the given session ID.
	     *
	     * @param {Session} session
	     * @param {function} fn
	     * @public
	     */
	    destroy(session: Session, fn: Function): void;
	    /**
	     * Fetch session by the given session ID.
	     *
	     * @param {string} sid
	     * @param {function} fn
	     * @public
	     */
	    get(sid: string, fn: Function): void;
	    /**
	     * Get number of active sessions.
	     *
	     * @param {function} fn
	     * @public
	     */
	    length(fn: any): void;
	    set(session: Session, fn: Function): void;
	    touch(session: Session, fn: Function): void;
	    private checkExpired();
	}
	
}

declare module "hornet-js-core/src/session/session-manager" {
	import { Session }  from "hornet-js-core/src/session/session";
	module "express" {
	    interface Request {
	        getSession?: () => Session;
	    }
	}
	export class SessionManager {
	    private static STORE;
	    static invalidate(session: Session, fn: Function): void;
	    /**
	     * Setup session middleware with the given `options`.
	     *
	     * @param {Object} [options]
	     * @param {Object} [options.cookie] Options for cookie
	     * @param {Function} [options.genid]
	     * @param {String} [options.name=NODESSIONID] Session ID cookie name
	     * @param {Boolean} [options.proxy]
	     * @param {Boolean} [options.resave] Resave unmodified sessions back to the store
	     * @param {Boolean} [options.rolling] Enable/disable rolling session expiration
	     * @param {Boolean} [options.saveUninitialized] Save uninitialized sessions to the store
	     * @param {String} [options.secret] Secret for signing session ID
	     * @param {Object} [options.store=MemoryStore] Session store
	     * @return {Function} middleware
	     * @public
	     */
	    static middleware(options: any): (req: any, res: any, next: any) => any;
	}
	
}

declare module "hornet-js-core/src/session/session" {
	export class Session {
	    private sid;
	    private data;
	    private creationTime;
	    private lastAccessedTime;
	    private maxInactiveInterval;
	    constructor(sid: string, maxInactiveInterval: any, data?: any);
	    getId(): string;
	    getData(): any;
	    invalidate(fn: Function): void;
	    getAttribute(key: string): any;
	    setAttribute(key: string, value: any): void;
	    removeAttribute(key: string): void;
	    touch(): void;
	    getCreationTime(): Date;
	    getLastAccessTime(): Date;
	    getMaxInactiveInterval(): any;
	}
	
}

declare module "hornet-js-core/src/session/store" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import * as events from "events";
	import { Session }  from "hornet-js-core/src/session/session";
	export class Store extends events.EventEmitter {
	    private ready;
	    constructor();
	    isReady(): boolean;
	    get(sid: string, fn: Function): void;
	    set(session: Session, fn: Function): void;
	    destroy(session: Session, fn: Function): void;
	    touch(session: Session, fn: Function): void;
	    getName(): string;
	    /**
	     * Describe if the 'touch' method is implemented or not into this kind of store
	     *
	     * @returns {boolean}
	     */
	    isTouchImplemented(): boolean;
	}
	
}

declare module "hornet-js-core/src/upload/custom-store-engine" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/****
	 * https://github.com/yongtang/clamav.js/blob/master/README.md
	 * Fork
	 */
	import multer = require("multer");
	/**
	 * Classe qui permet d'appeler clamav
	 */
	export class CustomStoreEngine implements multer.StorageEngine {
	    constructor();
	    /**
	     * Fonction qui envoie un flux au serveur Clamav et qui analyse la reponse
	     * s'il n'y a pas d'erreur ou que le fichier n'est pas infecté, le traitement est passant.
	     * @param {HttpRequest} req la requête
	     * @param {File} file le fichier à transférer
	     * @param {Function} cb la callback
	     * @private
	     */
	    _handleFile: (req: any, file: any, cb: any) => void;
	    /**
	    *  Permet la suppression d'un
	    * @param {HttpRequest} req la requête
	    * @param {File} file le fichier à transférer
	    * @param {Function} cb la callback
	    * @private
	    */
	    _removeFile: (req: any, file: any, cb: any) => void;
	}
	
}

declare module "hornet-js-core/src/validation/data-validator" {
	/**
	 *  Propriétés d'une classe de validation customisée d'un formulaire
	 */
	export interface ICustomValidation {
	    /**
	     * Méthode de validation customisée d'un formulaire : méthode générique appelée automatiquement depuis le composant
	     * form.tsx si sa propriété customValidation est valorisée
	     * @param data données de formulaire
	     * @return les résultats de validation
	     * */
	    validate(data: any): IValidationResult;
	}
	/**
	 * Résultat de validation
	 */
	export interface IValidationResult {
	    /** Indique si les données sont valides */
	    valid: boolean;
	    /** Tableau d'erreurs de validation éventuelles */
	    errors: Array<ajv.ErrorObject>;
	}
	/**
	 * Contient tous les éléments nécessaires à une validation de données
	 */
	export class DataValidator {
	    /**
	     * Options de validation ajv par défaut, utilisables côté client et serveur (les dates sont supposées être des
	     * chaînes de caractères au format ISO 8601)
	     */
	    static DEFAULT_VALIDATION_OPTIONS: ajv.Options;
	    /** Schéma de validation au format json-schema */
	    schema: any;
	    /** Options de validation ajv (cf. http://epoberezkin.github.io/ajv/#options) */
	    options: ajv.Options;
	    /**
	     * Valideurs customisés : permettent d'implémenter et de chaîner des règles de validation difficiles à mettre
	     * en oeuvre simplement avec un schéma json-schema. Ils sont appliqués après la validation basée sur le schéma
	     * de validation, donc les données du formulaire ont déjà éventuellement bénéficié de la coercition de types. */
	    customValidators: ICustomValidation[];
	    constructor(schema?: any, customValidators?: ICustomValidation[], options?: ajv.Options);
	    /**
	     * Exécute la validation
	     * @param data données à valider
	     * @return {IValidationResult} résultat de la validation
	     */
	    validate(data: any): IValidationResult;
	    /**
	     * Transforme le schéma de validation indiqué en un schéma JSON-Schema valide. Dans le schéma passé en paramètre,
	     * le mot clé "required" peut-être spécifié par champ de type string.
	     * En sortie les noms champs obligatoires sont regroupés dans un tableau, conformément à la spécification JSON-Schema
	     * et le mot-clé "minLength" est utilisé pour les champs obligatoires.
	     * Exemple :
	     * {
	     *  "$schema": "http://json-schema.org/schema#",
	     *  "type": "object",
	     *  "properties": {
	     *      "champ1": {"type": "string", "required": true},
	     *      "champ2": {"type": "number"}
	     *  }
	     * }
	     *
	     * devient :
	     * {
	     *  "$schema": "http://json-schema.org/schema#",
	     *  "type": "object",
	     *  "properties": {
	     *      "champ1": {"type": "string", "minLength": 1},
	     *      "champ2": {"type": "number"}
	     *  },
	     *  "required": ["champ1"]
	     * }
	     *
	     * @param hornetSchema schéma de validation
	     * @return un schéma json-schema valide
	     */
	    static transformRequiredStrings(hornetSchema: any): any;
	}
	
}

declare module "hornet-js-core/src/component/datasource/datasource-linked" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { DataSource }  from "hornet-js-core/src/component/datasource/datasource";
	import { DataSourceMap }  from "hornet-js-core/src/component/datasource/config/datasource-map";
	import { DataSourceConfig }  from "hornet-js-core/src/component/datasource/config/service/datasource-config";
	import { DataSourceConfigPage }  from "hornet-js-core/src/component/datasource/config/service/datasource-config-page";
	export class DataSourceLinked<T> extends DataSource<T> {
	    keysMap: DataSourceMap;
	    options: any[];
	    private _linked;
	    constructor(config: DataSourceConfig | DataSourceConfigPage | Array<T>, keysMap?: DataSourceMap, options?: any[]);
	    /***
	     * Permet de lier les datasources de type DataSourceLinked entre eux.
	     * @example
	     *  this.dataSource1.connectTo(this.dataSource2).connectTo(this.dataSource3).connectTo(this.dataSource1)
	     * @param target  : datasource
	     * @return the target datasource
	     */
	    connectTo(target: DataSourceLinked<T>): DataSourceLinked<T>;
	    /***
	     * Ajout un élément ou des éléments au result à ce datasource et le supprime dans les autres datasources.
	     * @example
	     *    this.dataSource1.insert(false, new Test(5,"ob5","ob5"));
	     * @param triggerFetch déclenche un évènement "fetch" après l'opération si c'est true. [false par defaut]
	     * @param items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @void
	     */
	    insert(triggerFetch?: boolean, ...items: (T | T[])[]): void;
	    /***
	     * Ajout un élément ou des éléments au result à ce datasource et le supprime dans les autres datasources.
	     * @param triggerFetch déclenche un évènement "fetch" après l'opération si c'est true. [false par defaut]
	     * @param items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @void
	     */
	    private remove(triggerFetch, emiter, ...items);
	}
	
}

declare module "hornet-js-core/src/component/datasource/datasource-master" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { DataSource }  from "hornet-js-core/src/component/datasource/datasource";
	import { DataSourceMap }  from "hornet-js-core/src/component/datasource/config/datasource-map";
	import { DataSourceConfig }  from "hornet-js-core/src/component/datasource/config/service/datasource-config";
	import { DataSourceConfigPage }  from "hornet-js-core/src/component/datasource/config/service/datasource-config-page";
	export class DataSourceMaster<T> extends DataSource<T> {
	    keysMap: DataSourceMap;
	    options: any[];
	    private _datasources;
	    constructor(config: DataSourceConfig | DataSourceConfigPage | Array<T>, keysMap: DataSourceMap, options?: any[]);
	    /***
	     * Ajout d'un datasource slave
	     * @param datasource esclave du master
	     * @return une promise du result modifié
	     */
	    addSlave(datasource: DataSource<any>): void;
	    /***
	     * retirer un datasource slave
	     * @param datasource esclave du master
	     */
	    removeDatasource(datasource: DataSource<any>): void;
	    /***
	     * Retourne les datasources slaves du master
	     * @return slaves
	     */
	    getSlaves(): DataSource<any>[];
	    /***
	     * Permet de selectionner un element ou des elements du datasource et de déclencher le fetch sur les slaves.
	     * déclenche un evènement "select", si le datasource est de type Service un event fetch est lancé lorsque les données arrivées
	     * @param args correspond aux éléments à envoyer au fetch des datasources esclaves.
	     * @void
	     */
	    select(args: any): void;
	}
	
}

declare module "hornet-js-core/src/component/datasource/datasource" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import events = require("events");
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { SortData }  from "hornet-js-core/src/component/sort-data";
	import { DataSourceOption, DefaultSort, InitAsync }  from "hornet-js-core/src/component/datasource/options/datasource-option";
	import { DataSourceMap }  from "hornet-js-core/src/component/datasource/config/datasource-map";
	import { DataSourceConfig }  from "hornet-js-core/src/component/datasource/config/service/datasource-config";
	import { DataSourceConfigPage }  from "hornet-js-core/src/component/datasource/config/service/datasource-config-page";
	export enum DataSourceStatus {
	    Dummy = 0,
	    Initialized = 1,
	}
	/***
	 * @classdesc Classe de base des datasources
	 * elle contient une methode pour récupérer des datas, varie selon le type de datasource;
	 * elle implémente une methode qui transforme les données récupérées selon une classe de mapping  {@link DataSourceMap} afin de l'exploiter directement par l'IHM.
	 * liste des events déclenchés par le datasource lorsque les opérations sont effectuées:
	 * -init
	 * -fetch
	 * -add
	 * -delete
	 * -select
	 * -sort
	 * -filter
	 * -error see{@link CodesError.DATASOURCE*}
	 * @class
	 * @extends EventEmitter
	 */
	export class DataSource<T> extends events.EventEmitter {
	    protected config: DataSourceConfig | DataSourceConfigPage | Array<T>;
	    keysMap: DataSourceMap;
	    options: DataSourceOption[];
	    /***
	     * tableau d'item selectionné du datasource
	     * @instance
	     */
	    protected _selected: Array<any>;
	    /***
	     * scope utilisé pour réaliser un fetch de type méthode de service.
	     * @instance
	     */
	    protected scope: any;
	    /***
	     * Fonction appelée pour réaliser un fetch de type méthode de service.
	     * @instance
	     */
	    protected method: Function;
	    /***
	     * tableau de résultats du datasource
	     * @instance
	     */
	    protected _results: Array<any>;
	    /***
	     * backup des résultats du datasource
	     * @instance
	     */
	    protected _results_backup: Array<any>;
	    /***
	     * mode filtre
	     * @instance
	     */
	    protected _filtering_flag: boolean;
	    /**
	     * Indique si le datasource courant est de type DataSourceArray.
	     */
	    protected isDataSourceArray: Boolean;
	    /**
	     * Sauvegarde des argument du fetch pour rejouer lors du tri
	     */
	    protected fetchArgsSaved: any;
	    /**
	     * nom des argument du fetch pour rejouer lors du tri en lui ajoutant le sortData
	     */
	    protected fetchAttrName: string;
	    /**
	     * tri par defaut
	     */
	    protected defaultSort: DefaultSort;
	    /**
	     * mode d'initialisation du datasource
	     */
	    protected initAsync: InitAsync;
	    /**
	     * statut datasource
	     */
	    protected _status: any;
	    /***
	     * @param {DataSourceConfig|DataSourceConfigPage|Array<T>} config : accepte soit une liste de l'éléments Array<T>, soit un service DataSourceConfig | DataSourceConfigPage
	     * @param {DataSourceMap} keysMap  : utilisée pour la transformation des resultats du fetch.
	     * @param {DataSourceOption[]} options : liste de paramètres supplémentaires à transmettre au fetch
	     * Pour un config de type
	     */
	    constructor(config: DataSourceConfig | DataSourceConfigPage | Array<T>, keysMap?: DataSourceMap, options?: DataSourceOption[]);
	    /***
	     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
	     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * Déchenche un event init
	     */
	    init(args?: any): void;
	    /***
	     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
	     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * Déchenche un event init
	     */
	    protected initDataSync(args?: any): any[];
	    /***
	     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
	     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * Déchenche un event init
	     */
	    protected initData(args?: any): Promise<any[]>;
	    /**
	     * On considère que les données sont dèjà présentes dans le datasource, on envoie juste l'event fetch au composant
	     * pour forcer le rendu avec ses anciennes données.
	     */
	    reload(): void;
	    /**
	     * renvoie la valeur selectionnée courante.
	     */
	    selected: any;
	    /**
	     * supprime l'item du dataSource
	     * @param item
	     */
	    removeUnSelectedItem(item: any): void;
	    /**
	     * renvoie le tableau des résultats.
	     */
	    /**
	     * enregistre les résultats dans le datasource
	     * @param {any[]} results les données du data source (post-transformation {@link DataSource#transformData}).
	     */
	    results: Array<any>;
	    readonly status: any;
	    /**
	     * renvoie le tri par defaut
	     */
	    getDefaultSort(): DefaultSort;
	    /***
	     * Méthode qui implémente la méthode de récupération des datas (une par type de datasource)
	     * Déchenche un event fetch
	     * @param {Boolean} triggerFetch  déclenche un évènement "fetch" après l'opération si true.
	     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * @param {boolean} noSave indicateur pour sauvegarder ou non les paramètres du fetch pour les rejouer sur un sort service
	     * @example
	     * dataSource.on("fetch", (MappedResult)=>{
	     *       //staff
	     *   })
	     * dataSource.fetch();
	     * @void
	     */
	    fetch(triggerFetch: Boolean, args?: any, noSave?: boolean): void;
	    /***
	     * Méthode qui déclenche les events
	     **/
	    protected emitEvent(name: any, ...arg: any[]): void;
	    /***
	     * Méthode qui implémente la méthode de récupération des datas (une par type de datasource)
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {any[]} ...args paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * @return {T} une promesse de type result de T.
	     * @example
	     * dataSource.on("fetch", (MappedResult)=>{
	     *       //staff
	     *   })
	     * dataSource.fetch();
	     * @void
	     */
	    protected fetchData(triggerFetch: Boolean, args?: any): Promise<Array<T>>;
	    /***
	     * Ajout un élément ou des éléments au result du datasource
	     * cette action déclenche l'évènement add.
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @example
	     * dataSource.on("add", (IncreasedResult)=>{
	     *       //staff
	     *   })
	     * dataSource.add();
	     * @void
	     */
	    add(triggerFetch: Boolean, ...items: (T | T[])[]): void;
	    /***
	     * Ajout un élément ou des éléments au result du datasource
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @return une promise du result modifié
	     */
	    protected addData(triggerFetch: Boolean, ...items: (T | T[])[]): Promise<Array<any>>;
	    /***
	     * Ajout un élément ou des éléments au result du datasource
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @return {any[]} result modifié
	     */
	    protected addDataSync(triggerFetch: Boolean, ...items: (T | T[])[]): Array<any>;
	    /***
	     * enlève un élément ou des éléments au result du datasource
	     * cette action déclenche l'évènement delete
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @void
	     */
	    delete(triggerFetch: Boolean, ...items: (T | T[])[]): void;
	    /**
	     * supprime toutes les données du datasource.
	     */
	    deleteAll(): void;
	    /***
	     * enlève un élément ou des éléments au result du datasource
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @return {Promise<Array<<any>>} une promise du result modifié
	     */
	    protected deleteData(triggerFetch?: Boolean, ...items: (T | T[])[]): Promise<Array<any>>;
	    /**
	     * permet de normaliser les elements du spread
	     * @param {(T|T[])[]} data : les paramètres à normaliser
	     */
	    protected getSpreadValues(data: (T | T[])[]): any;
	    /***
	     * méthode qui convertie les données brutes en données exploitable par l'IHM.
	     * @param {(T|T[])[]} data les données brutes.
	     * @return {Promise<Array<<any>>} renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
	     */
	    protected transformData(data: (T | T[])[]): Promise<Array<any>>;
	    /***
	     * méthode qui convertie les données brutes en données exploitable par l'IHM.
	     * @param {(T|T[])[]} data les données brutes.
	     * @return {Array<any>} renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
	     */
	    protected transformDataSync(data: (T | T[])[]): Array<any>;
	    /**
	     * Fonction de tri
	     * @param {SortData[]} sort  données de tri
	     * @param {(a: any, b: any) => number} Fonction de comparaison.
	     */
	    protected sortData(sort: SortData[], compare?: any): void;
	    /***
	     * Fonction de tri
	     * @param {SortData[]} sortData.
	     * @param {(a: any, b: any) => number} Fonction de comparaison.
	     * @example
	     * dataSource.on("sort", (SortedResult)=>{
	     *       //staff
	     *   })
	     * dataSource.sort(sortData);
	     * @void
	     */
	    sort(sortDatas: SortData[], compare?: (a: any, b: any) => number): void;
	    /***
	     * Renvoie un sous-ensemble des resultats filtrés
	     * @param config correspond soit aux critères de filtrage soit à une fonction (appelée à chaque itération) {@link https://lodash.com/docs/#filter}
	     * @param cancelFilterHistory false si on souhaite garder un historique des filtres true sinon. false par défaut
	     * @example
	     * dataSource.on("filter", (filteredResult)=>{
	     *       //staff
	     *   })
	     * dataSource.filter(config, cancelFilterHistory);
	     * @void
	     */
	    filter(config: any, cancelFilterHistory?: boolean): void;
	    /***
	     * Annule tous les filtres et restaure les valeurs d'origine.
	     * dataSource.cancelFilter();
	     * @void
	     */
	    cancelFilter(): void;
	    /***
	     * Permet de selectionner un element ou des elements du datasource
	     * déclenche un evènement "select".
	     * @param args correspond aux éléments sélectionnées
	     * @param index dans le cas de la selection d'une ligne
	     * @example
	     * dataSource.on("select", (selectedItems)=>{
	     *       //staff
	     *   })
	     * dataSource.select(items);
	     * @void
	     */
	    select(args: any): void;
	    /***
	     * Supprime toute sélection dans le datasource.
	     * @void
	     */
	    selectClean(flag: boolean): void;
	    /**
	     * reconstitue un objet parametre du fetch
	     * @param {string} attrName nom de l'attribut ajouter
	     * @param {objet} value valeur de l'attribut ajouter
	     * @param {objet=} param
	     */
	    protected getFetchArgs(attrName: string, value: any, param?: any): any;
	}
	
}

declare module "hornet-js-core/src/component/datasource/paginate-datasource" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { DataSource }  from "hornet-js-core/src/component/datasource/datasource";
	import { DataSourceMap }  from "hornet-js-core/src/component/datasource/config/datasource-map";
	import { DataSourceConfig }  from "hornet-js-core/src/component/datasource/config/service/datasource-config";
	import { DataSourceConfigPage }  from "hornet-js-core/src/component/datasource/config/service/datasource-config-page";
	import { SortData }  from "hornet-js-core/src/component/sort-data";
	import { DataSourceOption }  from "hornet-js-core/src/component/datasource/options/datasource-option";
	export const ITEMS_PER_PAGE_ALL: number;
	/**
	 * @enum enumeration pour la navigation dans le paginateur
	 */
	export enum Direction {
	    PREVIOUS = -1,
	    NEXT = -2,
	    FIRST = -3,
	    LAST = -4,
	}
	/***
	 * @description Interface de representation d'une pagination
	 * @interface
	  */
	export interface Pagination {
	    /** index de la page actuelle */
	    pageIndex?: number;
	    /** nombre d'items pas page */
	    itemsPerPage: number;
	    /** nombre d'items total */
	    totalItems?: number;
	    /** nombre de pages */
	    nbPages?: number;
	}
	/***
	 * @description Interface de representation d'une pagination
	 * @interface
	  */
	export interface ServiceResult<T> {
	    pagination: Pagination;
	    list: Array<T>;
	}
	/***
	 * @classdesc Classe de representation d'une pagination
	 * @class
	  */
	export class Paginator<T> {
	    private _pagination;
	    private items;
	    private _sort;
	    /**
	     * @constructs
	     * @param {Pagination} pagination configuration de la pagination
	     */
	    constructor(pagination: Pagination);
	    readonly pagination: Pagination;
	    sort: any;
	    private calculateNbPages(itemsTot?);
	    /**
	     * Methode de gestion de la pagination
	     * @param {(number|Direction)} page numero de la page ou la direction, première page à index 1.
	     */
	    paginate(page: number | Direction): Array<T>;
	    /**
	     * Extraction des données de la page de pagination
	     * @param {Array<T>} itemsTot liste pour vant servir pour l'extraction
	     * @param {boolean} forceUpdate force la mise a jour et va lire de itemsTot sinon prend dans la variable d'instance
	     */
	    extractPage(itemsTot: Array<T>, forceUpdate?: boolean): Array<T>;
	    /**FIRST
	     * Change le nombre d'items par page
	     * @param {number} itemsPerPage nombre d'items par page
	     */
	    setItemsPerPage(itemsPerPage: number): void;
	    reset(): void;
	    /**
	     * initialise les differentes pages suivant l'objet de pagination
	     * @param {Array<T>} itemsTot liste des items à decouper en page
	     * @param {number} totalItems nombre total d'items (pagination serveur)
	     */
	    preparePagination(itemsTot: Array<T>, totalItems?: number): void;
	    /**
	     * initialise les differentes pages suivant l'objet de pagination
	     * @param {Array<T>} itemsTot liste des items à decouper en page
	     * @param {number} totalItems nombre total d'items (pagination serveur)
	     */
	    setCurrentPage(items: Array<T>, totalItems?: number): void;
	}
	/***
	 * @classdesc Classe de base des datasources
	 * elle contient une methode pour récupérer des datas, varie selon le type de datasource;
	 * elle implémente une methode qui transforme les données récupérées selon une classe de mapping  {@link DataSourceMap} afin de l'exploiter directement par l'IHM.
	 * @class
	 * @extends EventEmitter
	 */
	export class PaginateDataSource<T> extends DataSource<T> {
	    protected config: DataSourceConfig | DataSourceConfigPage | Array<T>;
	    keysMap: DataSourceMap;
	    options: DataSourceOption[];
	    /***
	     * composant de pagination
	     * @instance
	     */
	    private _paginator;
	    /***
	     * @param {(DataSourceConfig|DataSourceConfigPage|Array<T>)} config accepte soit une liste de l'éléments Array<T>, soit un service DataSourceConfig | DataSourceConfigPage
	     * @param {Pagination} pagination pagination à appliquer.
	     * @param {DataSourceMap} keysMap  utilisée pour la transformation des resultats du fetch.
	     * @param {Object} options liste de paramètres supplémentaires à transmettre au fetch
	     */
	    constructor(config: DataSourceConfig | DataSourceConfigPage | Array<T>, pagination: Pagination, keysMap: DataSourceMap, options?: DataSourceOption[]);
	    private initPaginateDataSource();
	    /***
	     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
	     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
	     * Déchenche un event init
	     */
	    init(args?: any): void;
	    pagination: Pagination;
	    private updatePaginator(items, totalItems?);
	    /***
	     * Réinitialise la pagination et envoie un event de pagination
	     */
	    protected initPaginator(): void;
	    /***
	     * Réinitialise le sort
	     */
	    protected initSort(): void;
	    /***
	     * @inheritdoc
	     */
	    deleteAll(): void;
	    /***
	     * @inheritdoc
	     * @param {boolean} reloadPage indicateur pour recharger la page en cours, sinon ce sera la première page.
	     */
	    reload(reloadPage?: boolean, forceUpdate?: boolean): void;
	    /***
	     * @inheritdoc
	     */
	    fetch(triggerFetch: Boolean, args?: any, noSave?: boolean): void;
	    /***
	     * @inheritdoc
	     */
	    protected fetchData(triggerFetch: Boolean, args?: any): Promise<Array<T>>;
	    /***
	     * méthode qui appelle (juste après un fetch) la fonction de {@link Datasource#transformData} et déclenche un evènement "fetch" lorsque les données sont disponibles
	     * @param result les données brutes.
	     * @return renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
	     */
	    protected transformData(result: any): Promise<Array<any>>;
	    /***
	     * @inheritdoc
	     */
	    sort(sort: SortData[], compare?: (a: any, b: any) => number): void;
	    /***
	     * Renvoie un sous-ensemble des resultats filtrés
	     * @param config correspond soit aux critères de filtrage soit à une fonction (appelée à chaque itération) {@link https://lodash.com/docs/#filter}
	     * @param cancelFilterHistory false si on souhaite garder un historique des filtres true sinon. false par défaut
	     * @example
	     * dataSource.on("filter", (filteredResult)=>{
	     *       //staff
	     *   })
	     * dataSource.filter(config, cancelFilterHistory);
	     * @void
	     */
	    filter(config: any, cancelFilterHistory?: boolean): void;
	    /***
	     * Ajout un élément ou des éléments au result du datasource
	     * cette action déclenche l'évènement add.
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @example
	     * dataSource.on("add", (IncreasedResult)=>{
	     *       //staff
	     *   })
	     * dataSource.add();
	     * @void
	     */
	    add(triggerFetch: Boolean, ...items: (T | T[])[]): void;
	    /***
	     * @inheritdoc
	     */
	    protected addData(triggerFetch?: boolean, ...items: (T | T[])[]): Promise<Array<any>>;
	    /***
	     * @inheritdoc
	     */
	    protected deleteData(triggerFetch?: boolean, ...items: (T | T[])[]): Promise<Array<any>>;
	    /***
	     * enlève un élément ou des éléments au result du datasource
	     * cette action déclenche l'évènement delete
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
	     * @void
	     */
	    delete(triggerFetch: Boolean, ...items: (T | T[])[]): void;
	    /**
	     * navigue vers une page
	     * @param {(number|Direction)} page la page a extraire
	     */
	    goToPage(page: number | Direction): void;
	    /**
	     * retourne les items d'une page en particulier
	     * @param {(number|Direction)} page la page a extraire
	     */
	    getItemsByPage(page: number | Direction): any;
	    /**
	     * redéclanche la navigation de la page en cours, si la page en cours n'est pas initialisé ou va sur la première
	     * @param {boolean} forceUpdate indicateur pour redéclancher le requêtage
	     */
	    reloadPage(forceUpdate?: boolean): void;
	    /**
	     * change le nombre d'items par page
	     * @param {number} itemsPerPage items par page
	     */
	    updatePerPage(itemsPerPage: number): void;
	    /***
	     * @inheritdoc
	     */
	    protected getFetchArgs(attrName: string, value: any, param?: any): any;
	    /***
	     * Supprime toute sélection dans le datasource.
	     * @void
	     */
	    selectClean(flag: boolean): void;
	    /**
	     * Sélectionne des items dans le datasource.
	     * Dans le cadre d'un datasource paginate, les items devront obligatoirement avoir un attribut id pour être pris en compte.
	     * @param {any[]} items les éléments à sélectionnés dans le datasource.
	     */
	    protected _currentItemSelected: any;
	    /**
	     * Sélectionne des items dans le datasource.
	     * Dans le cadre d'un datasource paginate, les items devront obligatoirement avoir un attribut id pour être pris en compte.
	     * @param {any[]} items les éléments à sélectionnés dans le datasource.
	     * @param index de la ligne selectionnée
	     */
	    select(items: any[]): void;
	    /**
	     * Enregistre la sélection courante dans le datasource.
	     */
	    protected saveSelected(): void;
	    /**
	     * Récupère la sélection courante + la selection existante
	     * @returns {any}
	     */
	    protected getAllSelected(): any;
	    /**
	     * renvoie les valeurs sélectionnées du datasource.
	     */
	    readonly selected: any;
	}
	
}

declare module "hornet-js-core/src/component/datasource/config/datasource-map" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/***
	 * @classdesc Classe de mapping entre les champs ihm et les données brutes
	 * @class
	 * { attribut_IHM : attribut_data}
	 */
	export class DataSourceMap {
	}
	
}

declare module "hornet-js-core/src/component/datasource/options/datasource-option" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { SortData }  from "hornet-js-core/src/component/sort-data";
	import { SpinnerType }  from "hornet-js-core/src/services/hornet-superagent-request";
	export interface DataSourceOption {
	    sendToFetch(): boolean;
	}
	export enum CompareMethod {
	    COMPARE_DEFAULT = 1,
	    COMPARE_WITH_LOWERCASE = 2,
	    COMPARE_WITH_UPPERCASE = 3,
	}
	export type CompareFn = (a: any, b: any) => number;
	/**
	 * Option de tri par defaut dans un datasourcede
	 */
	export class DefaultSort implements DataSourceOption {
	    sort: SortData[];
	    initCompare: CompareMethod | CompareFn;
	    sendFetch: boolean;
	    /***
	     * @param {SortData[]} sort  données de tri
	     * @param {(a: any, b: any) => number} Fonction de comparaison (optionnel).
	     * @param {boolean} sendFetch définit si l'option doit être envoyée au fetch ou pas.
	     *
	     */
	    constructor(sort: SortData[], initCompare?: CompareMethod | CompareFn, sendFetch?: boolean);
	    /**
	     * définit si l'option doit être envoyée au fetch ou pas
	     * @returns {boolean}
	     */
	    sendToFetch(): boolean;
	    compare: (a: any, b: any) => number;
	}
	export class SpinnerOption implements DataSourceOption {
	    type: SpinnerType;
	    sendFetch: boolean;
	    /**
	     * @param {SpinnerType} type : type de spinner
	     * @param {boolean} sendFetch définit si l'option doit être envoyée au fetch ou pas.
	     */
	    constructor(type: SpinnerType, sendFetch?: boolean);
	    /**
	     * définit si l'option doit etre envoyée au fetch ou pas
	     * @returns {boolean}
	     */
	    sendToFetch(): boolean;
	}
	/**
	 * Mode d'initialisation de l'init dans un datasource
	 */
	export class InitAsync implements DataSourceOption {
	    isAsync: boolean;
	    sendFetch: boolean;
	    /**
	     * @param {boolean} isAsync : type d'initialisation
	     * @param {boolean} sendFetch définit si l'option doit être envoyée au fetch ou pas.
	     */
	    constructor(isAsync: boolean, sendFetch?: boolean);
	    /**
	     * définit si l'option doit etre envoyée au fetch ou pas
	     * @returns {boolean}
	     */
	    sendToFetch(): boolean;
	}
	
}

declare module "hornet-js-core/src/component/datasource/config/service/datasource-config-page" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
	/**
	 * @classdesc Classe de configuration pour les datasources de type service
	 * @class
	 */
	export class DataSourceConfigPage {
	    page: IHornetPage<any, any>;
	    method: Function;
	    fetchAttrName: string;
	    constructor(page: IHornetPage<any, any>, method: Function, fetchAttrName?: string);
	}
	
}

declare module "hornet-js-core/src/component/datasource/config/service/datasource-config" {
	/**
	 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * Ce logiciel est un programme informatique servant à faciliter la création
	 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
	 * <p/>
	 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
	 * respectant les principes de diffusion des logiciels libres. Vous pouvez
	 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
	 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
	 * sur le site "http://www.cecill.info".
	 * <p/>
	 * En contrepartie de l'accessibilité au code source et des droits de copie,
	 * de modification et de redistribution accordés par cette licence, il n'est
	 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
	 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
	 * titulaire des droits patrimoniaux et les concédants successifs.
	 * <p/>
	 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
	 * associés au chargement,  à l'utilisation,  à la modification et/ou au
	 * développement et à la reproduction du logiciel par l'utilisateur étant
	 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
	 * manipuler et qui le réserve donc à des développeurs et des professionnels
	 * avertis possédant  des  connaissances  informatiques approfondies.  Les
	 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
	 * logiciel à leurs besoins dans des conditions permettant d'assurer la
	 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
	 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
	 * <p/>
	 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
	 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
	 * termes.
	 * <p/>
	 * <p/>
	 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
	 * <p/>
	 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
	 * <p/>
	 * This software is a computer program whose purpose is to facilitate creation of
	 * web application in accordance with french general repositories : RGI, RGS and RGAA.
	 * <p/>
	 * This software is governed by the CeCILL license under French law and
	 * abiding by the rules of distribution of free software.  You can  use,
	 * modify and/ or redistribute the software under the terms of the CeCILL
	 * license as circulated by CEA, CNRS and INRIA at the following URL
	 * "http://www.cecill.info".
	 * <p/>
	 * As a counterpart to the access to the source code and  rights to copy,
	 * modify and redistribute granted by the license, users are provided only
	 * with a limited warranty  and the software's author,  the holder of the
	 * economic rights,  and the successive licensors  have only  limited
	 * liability.
	 * <p/>
	 * In this respect, the user's attention is drawn to the risks associated
	 * with loading,  using,  modifying and/or developing or reproducing the
	 * software by the user in light of its specific status of free software,
	 * that may mean  that it is complicated to manipulate,  and  that  also
	 * therefore means  that it is reserved for developers  and  experienced
	 * professionals having in-depth computer knowledge. Users are therefore
	 * encouraged to load and test the software's suitability as regards their
	 * requirements in conditions enabling the security of their systems and/or
	 * data to be ensured and,  more generally, to use and operate it in the
	 * same conditions as regards security.
	 * <p/>
	 * The fact that you are presently reading this means that you have had
	 * knowledge of the CeCILL license and that you accept its terms.
	 *
	 */
	/**
	 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Created by framarc on 6/13/17.
	 */
	import { IService }  from "hornet-js-core/src/services/service-api";
	/***
	 * @classdesc Classe configuration pour les datasources de type Services
	 * @class
	 */
	export class DataSourceConfig {
	    scope: IService;
	    methodName: string;
	    fetchAttrName: string;
	    constructor(scope: IService, methodName: string, fetchAttrName?: string);
	}
	
}
