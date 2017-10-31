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
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";

import * as _ from "lodash";
import * as superagent from "superagent";
import { Response } from "superagent";
import { HornetRequest, HornetSuperAgentRequest, SpinnerType } from "src/services/hornet-superagent-request";
import { ServiceEvent } from "src/event/hornet-event";
import * as superAgentPlugins from "src/services/superagent-hornet-plugins";
import { IHornetComponentAsync } from "hornet-js-components/src/component/ihornet-component";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { MediaTypes } from "src/protocol/media-type";
import { BackendApiResult, NodeApiResult, BackendApiError, NodeApiError } from "src/services/service-api-results";
import { manageError } from "src/component/error-manager";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { HornetCache } from "src/cache/hornet-cache";
import { HornetPlugin } from "hornet-js-core/src/services/superagent-hornet-plugins";

const logger: Logger = Utils.getLogger("hornet-js-core.services.hornet-agent");

import { Promise } from "hornet-js-utils/src/promise-api";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// wrap http & https afin de sécuriser l'utilisation de "continuation-local-storage" (perte ou mix de contexte) //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as http from "http";
import * as https from "https";

if (http[ "__old_http_request" ] == undefined) {
    http[ "__old_http_request" ] = http.request;
    https[ "__old_https_reques" ] = https.request;

    (<any>http).request = function () {
        var req = http[ "__old_http_request" ].apply(http, arguments);
        Utils.getContinuationStorage().bindEmitter(req);
        return req;
    };

    (<any>https).request = function () {
        var req = https[ "__old_https_reques" ].apply(https, arguments);
        Utils.getContinuationStorage().bindEmitter(req);
        return req;
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export enum CacheKey {
    URL,
    URL_DATA
}


/**
 * Cette classe sert à encapsuler les appels à SuperAgent pour ajouter des plugins au besoin
 * @class
 */
export class HornetSuperAgent {

    // enable\disable le cache pour cette requête
    private enableCache: boolean = false;

    // défini le temps de mis en cache
    private timeToLiveInCache: number;

    // défini le mode de génération de clé pour le cache
    private cacheKey: CacheKey = CacheKey.URL;

    // permet de désactiver l'évènement. Notamment utilisé pour l'affichage du spinner
    private noEventFired: boolean = false;

    private superAgentRequest: any;

    public plugins: HornetList<HornetPlugin>;

    public response: Response;

    constructor(timeToliveInCache?: number, cacheKey?: CacheKey) {
        let plugins = [];
        let cacheConf = this.getCacheConfig();
        let globalCacheActivated = cacheConf.enabled;

        if (globalCacheActivated) {
            this.enableCache = true;
            if (_.isNumber(timeToliveInCache)) {
                this.timeToLiveInCache = timeToliveInCache;
            } else {
                this.timeToLiveInCache = cacheConf.timetolive || 3600;
            }
            if (cacheKey && CacheKey[ cacheKey ]) {
                this.cacheKey = cacheKey;
            } else {
                this.cacheKey = cacheConf.cacheKey || CacheKey.URL;
                if (!CacheKey[ this.cacheKey ]) {
                    this.cacheKey = CacheKey.URL;
                }
            }
            logger.debug("Activation du cache pour", this.timeToLiveInCache, "s");
        } else {
            logger.debug("Cache de requêtes désactivé, l'appel à cette méthode n'active donc PAS le cache");
        }


        if (!Utils.isServer) {
            // Correction Bug IE Afin de pallier au problème de cache sur les services:
            plugins.push(new HornetPluginConfig("noCacheIEPlugin", superAgentPlugins.noCacheIEPlugin, null));

            plugins.push(new HornetPluginConfig("CsrfPlugin", superAgentPlugins.CsrfPlugin, null));
            plugins.push(new HornetPluginConfig("RedirectToLoginPagePlugin", superAgentPlugins.RedirectToLoginPagePlugin, null));
        }

        plugins.push(new HornetPluginConfig("AddParamFromLocalStorageTid", superAgentPlugins.AddParamFromLocalStorage, [ "hornet.tid" ]));
        plugins.push(new HornetPluginConfig("AddParamFromLocalStorageUser", superAgentPlugins.AddParamFromLocalStorage, [ "hornet.user" ]));

        this.plugins = new HornetList(plugins);
    }

    protected getCacheConfig(): any {
        let globalCache = Utils.config.getIfExists("cache") || {enabled: false};
        if (globalCache) {
            if (!Utils.isServer) {
                if (globalCache.client) {
                    globalCache = globalCache.client;
                }
            } else {
                if (globalCache.server) {
                    globalCache = globalCache.server;
                }
            }
        }
        return globalCache;
    }

    /**
     * Initialise une instance de superagent en ajoutant les plugins et header
     * @returns {SuperAgentRequest}
     * @protected
     */
    protected initSuperAgent(request: HornetRequest): superagent.SuperAgentRequest {

        if (!this.superAgentRequest) {
            this.superAgentRequest = superagent(request.method || "get", request.url);

            this.plugins.list.forEach((name: String) => {
                let config: HornetPluginConfig<any> = this.plugins.mapPlugins[ "" + name ];
                let fnt = config.clazz[ "getPlugin" ];
                let plugin = fnt.apply(null, config.args)
                this.superAgentRequest.use(plugin);
            });
            this.superAgentRequest.set("X-Requested-With", "XMLHttpRequest");

        }

        return this.superAgentRequest;
    }

    /**
     * Lancement des évents à lancer côté client lors d'une request
     * @param  boolean value indicateur de lancement ou reception d'une requete
     * @param  SpinnerType [spinner=SpinnerType.Default] type de gestion des spinner associés à la requête
     * @returns HornetAgent
     * */
    protected setClientEventForRequest(value: boolean, spinner: SpinnerType = SpinnerType.Default): void {

        /** Selection de l'évent à envoie côté client en fonction du spinner*/
        switch (spinner) {
            case SpinnerType.Component:
                ServiceEvent.setRequestComponentInProgress(value);
                break;
            case SpinnerType.Default:
                ServiceEvent.setRequestInProgress(value);
                break;
        }
    }

    /**
     * Methode executer sur l'envoi d'une requete (gestion spinner et du cache)
     * @param {HornetRequest} request requete à envoyer 
     * @returns HornetAgent
     * */
    protected preProcessRequest(request: HornetRequest): Promise<Response> {
        if (!Utils.isServer) {
            this.setClientEventForRequest(true, request.spinnerType);
        }
        if ((this.enableCache || request.timeToLiveInCache) && request.method === "get") {
            return this.getFromCache(request);
        } else if (this.enableCache && (request.method === "post" || request.method === "put" || request.method === "patch")) {
            return this.removeInCache(request);
        }
    }

    /**
     * Methode executer sur  la reception d'une requete (gestion spinner et du cache)
     * @param {HornetRequest} request requete envoyée 
     * @param {Response} response réponse recue
     * @returns Response
     * */
    protected postProcessRequest(request: HornetRequest, response: Response): Response {
        if ((this.enableCache || request.timeToLiveInCache) && response && request.method === "get" && !request.noCached) {
            this.setInCache(response, request, request.timeToLiveInCache || this.timeToLiveInCache);
        }
        if (!Utils.isServer) {
            this.setClientEventForRequest(false, request.spinnerType);
            return this.manageClientResult(response);
        } else {
            return this.manageServerResult(response);
        }
    }

    /**
     * send a request
     * @param {HornetRequest} request objet representant une requête (methode 'get' par defaut)
     * @param {NodeJS.WritableStream} pipedStream flux bindé sur la reponse superagent
     * @returns {Promise<Response>}
     */
    public fetch(request: HornetRequest, pipedStream?: NodeJS.WritableStream): Promise<Response> {

        return Promise.resolve(true)
            .then(() => {
                return this.preProcessRequest(request);
            }).then((cacheResponse) => {
                let p: Promise<Response>;
                if (cacheResponse) {
                    p = Promise.resolve(cacheResponse);
                } else {
                    p = new Promise<any>((resolve, reject) => {
                        let ha: superagent.SuperAgentRequest = this.initSuperAgent(request);
                        ha.accept((request.typeMime && request.typeMime.MIME) || "json"); // ajoute le format attendu sinon json par defaut
                        if (request.headers) {
                            for (let header in request.headers) {
                                ha.set(header, request.headers[ header ]);
                            }
                        }

                        if (!Utils.isServer) {
                            if (request.typeMime && request.typeMime.MIME != MediaTypes.JSON.MIME) {
                                (ha as any).responseType('blob');
                            }
                        }

                        if (request.ca) (ha as any).ca(request.ca);
                        if (request.key) (ha as any).key(request.key);
                        if (request.cert) (ha as any).cert(request.cert);
                        if (request.progress) ha.on("progress", request.progress);

                        if (request.attach && request.attach.length > 0) {
                            (<any>ha).field("content", JSON.stringify(request.data));
                            request.attach.forEach((attachFile) => {
                                ha.attach(attachFile.field, <any>attachFile.file, attachFile.fileName);
                            });
                        } else {
                            ha.type((request.headers && request.headers.contentType) || "json"); // ajoute le format envoyé sinon json par defaut
                            ha.send(request.data); // ajout du body
                        }

                        if (pipedStream) {
                            pipedStream[ 'contentType' ](request.typeMime.MIME);
                            pipedStream[ 'attachment' ]("export." + request.typeMime.SHORT);

                            resolve(ha.pipe(pipedStream));

                        } else {
                            resolve(ha); // lance la requete
                            /* equivalent
                            ha.end(function(err, res){
                                if (err) reject(err); else resolve(res);
                            });*/
                        }
                    });
                }
                return p.then((response: Response) => {
                    this.response = response;
                    return this.postProcessRequest(request, response);
                });
            }).catch((e) => {
                // en cas d'erreur un ferme le spinner
                this.postProcessRequest(request, null);

                if (e.response && e.response.body && this.hasHornetBody(e.response.body)) {
                    let result: NodeApiResult = e.response.body;
                    if (result.errors && result.errors.length != 0) {
                        // Erreur(s)
                        let execp = NodeApiError.parseError(result.errors, e.status).toJsError();
                        if (result.hasTechnicalError) {
                            throw execp;
                        } else {
                            manageError(execp, Utils.getCls("hornet.appConfig").errorComponent);
                            return result as any;
                        }
                    }
                }
                throw e;
            });
    }

    /**
     * Formate la réponse pour le client afin de traiter les erreurs automatiquement
     * @param {Response} response reponse de superagent
     */
    private manageClientResult(response: Response): any {
        // try catch car impossible de catcher les erreurs asynchrones sur le Client
        if (response) {
            if (response.body && this.hasHornetBody(response.body)) {
                // Result OK || Erreur gérée par node
                let result: NodeApiResult = response.body;

                if (result.errors.length == 0) {
                    return result.data;
                } else {
                    // Erreur(s)
                    let e = NodeApiError.parseError(result.errors, response.status).toJsError();
                    if (result.hasTechnicalError) {
                        throw e;
                    } else {
                        manageError(e, Utils.getCls("hornet.appConfig").errorComponent);
                        return result;
                    }
                }
            } else {
                let regexp = response.header[ 'content-type' ].match(/([a-zA-Z]+)\/([a-zA-Z0-9.-]+)/);
                if ("application/json" != regexp[ 0 ].toLowerCase()) {
                    
                    let attachFilename = response.header[ 'content-disposition' ] ? response.header[ 'content-disposition' ].match(/attachment; filename="([^"]+)"/) : undefined;
                    
                    // extract file name from header response
                    if (attachFilename) {
                        attachFilename = attachFilename[1];
                    } else {
                        attachFilename = "export." + MediaTypes.fromMime(regexp[0]).SHORT;
                    }

                    let res = response[ "xhr" ].response;
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(res instanceof Blob ? res : new Blob([res], {"type": regexp[0]}), attachFilename);
                    }
                    else {
                        let elemt = {a: null};
                        elemt.a = document.createElement('a');
                        elemt.a.href = window.URL.createObjectURL(res instanceof Blob ? res : new Blob([res], {"type": regexp[0]}), {oneTimeOnly: true}); // xhr.response is a blob
                        elemt.a.download = attachFilename; // Set the file name.
                        elemt.a.style.display = 'none';
                        document.body.appendChild(elemt.a);
                        elemt.a.click();
                        delete elemt.a;
                    }
                }
            }
            return response;
        }
    }

    /**
     * Formate la réponse pour le serveur afin de traiter les erreurs automatiquement
     * @param {Response} response reponse de superagent
     */
    protected manageServerResult(response: Response): any {

        if (response && response.body && this.hasHornetBody(response.body)) {
            // Result OK || Erreur gérée par la backend
            var result: BackendApiResult = response.body;

            if (result.errors.length == 0) {
                // Pas d'erreur >> on appelle le cb fourni par l'application
                if (response.type && response.type != MediaTypes.JSON.MIME) {
                    return response;
                }
                return result.data;

            } else {
                throw BackendApiError.parseError(result.errors, response.status).toJsError();
            }

        } else {
            return response;
        }
    }

    /**
     * Test si c'est un format Hornet
     * @param {Response.body} body reponse de superagent
     */
    private hasHornetBody(body): boolean {
        return [ "hasTechnicalError", "hasBusinessError", "status", "url", "data", "errors" ].every((key) => {
            return key in body;
        });
    }

    /**
     * Construction d'une erreur hornet et appel du manager d'erreurs
     */
    private manageError(err) {
        // Erreur non gérée par le nodejs ! Réseau etc ...
        var error = new TechnicalError("ERR_TECH_UNKNOWN", {
            errorMessage: err.message,
            httpStatus: 500 /*(TODO res || {url}).status*/,
            errorCause: err
        }, err);

        // pas de callback custom > on appelle le ClientErrorManager
        manageError(error, Utils.getCls("hornet.appConfig").errorComponent);
    }

    /**
     * Lecture dans le cache
     * @param {string} url url de la requête
     */
    private getFromCache(request: HornetRequest): Promise<any> {
        return HornetCache.getInstance().getItem(this.generateCacheKey(request)).then(function (response) {
            logger.debug("Bypass appel API: retour du contenu du cache");
            return response;
        }).catch((e) => {
            logger.trace(e);
            logger.debug("Pas de valeur en cache, appel de l'API");
        });
    }

    /**
     * Mise en cache de la reponse
     * @param {Response} response reponse de superagant
     * @param {HornetRequest} request requête à mettre en cache
     * @param {number} timetoliveInCache durée de vie dans le cache
     */
    private setInCache(response: Response, request: HornetRequest, timetoliveInCache: number) {

        logger.debug("Mise en cache de la réponse à l'appel de l url:", request.url);
        var reponseCopy = this.cloneResponse(response);

        return HornetCache
            .getInstance()
            .setCacheAsynchrone(this.generateCacheKey(request), reponseCopy, timetoliveInCache)
            .finally(function () {
                logger.debug("Sauvegarde dans le cache effectuée");
                return response;
            }
            );
    }

    /**
     * Nettoyage en cache de la requete
     * @param {HornetRequest} request requête à mettre en cache
     */
    private removeInCache(request: HornetRequest): Promise<any> {

        logger.debug("Suppression en cache de l url:", request.url);
        let keys: Array<Promise<any>> = [ HornetCache.getInstance().clearCacheAsynchrone(this.generateCacheKey(request)).catch((e) => {
            logger.trace(e);
            logger.debug("Pas de valeur en cache à supprimer");
            return null;
        }) ];

        if (request.cacheLinkKey) {
            request.cacheLinkKey.forEach((key) => {
                keys.push(HornetCache.getInstance().clearCacheAsynchrone(key).catch((e) => {
                    logger.trace(e);
                    logger.debug("Pas de valeur en cache à supprimer");
                    return null;
                }));
            });
        }

        Promise.all(keys).then(() => {
            logger.debug("Suppression dans le cache effectuée");
            return null;
        });

        return Promise.resolve(null);
    }
    /**
     * Génère la clé utilisée pour le cache
     * @param {HornetRequest} request requête pour la génération de la clé (url + param)
     */
    protected generateCacheKey(request: HornetRequest): string {
        let key = request.url;
        if (request.data && request.cacheKey == CacheKey.URL_DATA) {
            let separator = "?";
            let dataSort = Object.keys(request.data).sort();
            for (let data in dataSort) {
                key += separator + data + "=" + JSON.stringify(dataSort[ data ]);
                separator = "&"
            }
        }
        return key;
    }

    /**
     * clone les paramètres interessants d'une réponse.
     * La raison est que sur NodeJs la propriété 'body' n'est pas énumérable, on reconstruit donc un objet spécial pour le cache
     * Note: Possible de d'override cette méthode si d'autres paramètres doivent être ajoutés
     * @param res
     * @return {{body: (any|HTMLElement|req.body|{x-csrf-token}), header: any, ok: any, status: any, type: any}}
     * @protected
     */
    protected cloneResponse(res: Response) {
        return {
            body: res.body,
            header: res.header,
            ok: res.ok,
            status: res.status,
            type: res.type
        };
    };

    /**
     * nettoyage des data (suppression des null (Button)).
     * @param {object} data
     * @protected
     */
    protected cleanData(data: any) {
        for (let attr in data) {
            if (data[ attr ] == null) delete data[ attr ];
        }
    };
}

export class HornetPluginConfig<T>{
    constructor(readonly name: string, readonly clazz: Class<T>, readonly args: Array<any>) {
    }
}

/**
 * Classe d'encapsulation de liste
 * @class
 */
export class HornetList<T extends HornetPlugin> {

    public list: String[] = [];
    public mapPlugins = {};

    constructor(list?: Array<HornetPluginConfig<T>>) {
        list.forEach((pluginConfig) => {
            this.list.push(pluginConfig.name);
            this.mapPlugins[ pluginConfig[ "name" ] ] = pluginConfig;
        });
    }

    addBefore(newElt: HornetPluginConfig<T>, Elt: HornetPluginConfig<T>) {
        let idx = -1;

        this.list.forEach((name, index) => {
            idx = index;
            if (idx == -1 && name === Elt.name) {
                this.mapPlugins[ newElt[ "name" ] ] = newElt;
                idx = index;
            }
        });

        if (idx === -1) {
            throw new Error("L'élément de base n'a pas été trouvé dans le tableau " +
                ">> impossible d'insérer le nouvel élément avant.");
        } else {
            this.list.splice(idx, 0, newElt.name);
        }
        return this;
    }

    addAfter(newElt: HornetPluginConfig<T>, Elt: HornetPluginConfig<T>) {
        let idx = -1;

        this.list.forEach((name, index) => {
            idx = index;
            if (idx == -1 && name === Elt.name) {
                this.mapPlugins[ newElt[ "name" ] ] = newElt;
                idx = index;
            }
        });
        if (idx === -1) {
            throw new Error("L'élément de base n'a pas été trouvé dans le tableau " +
                ">> impossible d'insérer le nouvel élément après.");
        } else {
            this.list.splice(idx + 1, 0, newElt.name);
        }

        return this;
    }

    remove(Elt: HornetPluginConfig<T>) {
        let idx = -1;

        this.list.forEach((name, index) => {
            idx = index;
            if (idx == -1 && name === Elt.name) {
                idx = index;
            }
        });
        if (idx === -1) {
            throw new Error("L'élément de base n'a pas été trouvé dans le tableau " +
                ">> suppression impossible.");
        } else {
            delete this.mapPlugins[ Elt[ "name" ] ];
            this.list.splice(idx, 1);
        }
        return this;
    }

    push(newElt: HornetPluginConfig<T>) {
        this.mapPlugins[ newElt[ "name" ] ] = newElt;
        this.list.push(newElt.name);
        return this;
    }
}

