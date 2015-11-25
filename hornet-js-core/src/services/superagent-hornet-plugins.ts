///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>

"use strict";
import utils = require("hornet-js-utils");
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");
import HornetCache = require("src/cache/hornet-cache");

var logger = utils.getLogger("hornet-js-core.services.superagent-hornet-plugins");
var WError = utils.werror;
var _ = utils._;

var HEADER_CSRF_NAME:string = "x-csrf-token";
var HEADER_LOGIN_PAGE:string = "x-is-login-page";

/**
 * Plugin SuperAgent ajoutant le header csrf lors de l'envoi des requêtes et gérant la récupération du nouveau token lors du retour
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
export function CsrfPlugin(request:HornetSuperAgentRequest) {
    if (!utils.isServer) {
        // Ajout du token à l'envoi
        request.set(HEADER_CSRF_NAME, utils.csrf || "no-token");

        // Gestion du token de retour
        var realRequest = request.callback;
        request.callback = function (err, res) {
            if (res && res.get(HEADER_CSRF_NAME)) {
                utils.csrf = res.get(HEADER_CSRF_NAME);
            }
            realRequest.call(this, err, res);
        }
    }
}

/**
 * Plugin SuperAgent ajoutant la gestion du cache sur la requête courante
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
export function MiseEnCachePlugin(timetoliveInCache:number = -1) {
    return function (request:HornetSuperAgentRequest) {
        var url = request.url;
        var oldEndFunction = request.end;
        var oldSetFunction = request.set;
        var storedSetParameters = [];

        //On remplace la fonction end pour aller chercher dans le cache avant de lancer l'api
        request.end = function (callbackEndMethod:Function) {
            HornetCache
                .getInstance()
                .getItem(url)
                .then(function (response) {
                logger.debug("Bypass appel API: retour du contenu du cache");
                //if (utils.isServer) {
                //    try {
                //        // Sur le client il n'y a rien à annuler mais sur NodeJS il faut effectuer une annulation sinon un event est envoyé et fait planter le serveur
                //        request.abort();
                //    } catch (error) {
                //        logger.warn("Erreur d'annulation de la requête car présence de cache:", error);
                //    }
                //}
                callbackEndMethod(undefined, response);
            }).catch(function () {
                logger.debug("Pas de valeur en cache, appel de l'API");

                _.forEach(storedSetParameters, function (param) {
                    logger.debug("Rejoue du header:", param.field);
                    oldSetFunction.call(request, param.field, param.val);
                });

                oldEndFunction.call(request, (<any>MiseEnCachePlugin)._getMethodeEndForCache(url, callbackEndMethod, timetoliveInCache));
                return null;
            });

            return request;
        };

        // On remplace la fonction 'set' pour ne pas instancier la requête malgré tout (sur NodeJs), voir superagent/lib/node/index.js, fonction Request.prototype.set
        request.set = <any>function (field:any, val:any) {
            var param = {field: field, val: val};
            logger.trace("Enregistrement de l'appel à set avec:", param);
            storedSetParameters.push(param);
            return this;
        }
    }
}


/**
 * Function du plugin MiseEnCachePlugin qui modifie le callback du service pour stocker dans le cache le résultat de la requête
 * @param url clé dans le cache
 * @param callback callback passé à la méthode end
 * @returns {function(any, any): undefined} fonction
 * @private
 */
(<any>MiseEnCachePlugin)._getMethodeEndForCache = function _getMethodeEndForCache(url:string, callbackEndMethod:Function, timetoliveInCache:number) {
    return function (err, res) {
        if (!err && res) {
            logger.debug("Mise en cache de la réponse à l'appel de l url:", url);
            var reponseCopy = (<any>MiseEnCachePlugin)._cloneResponse(res);
            HornetCache
                .getInstance()
                .miseEnCacheAsynchrone(url, reponseCopy, timetoliveInCache)
                .finally(function () {
                    logger.debug("Sauvegarde dans le cache effectuée, appel de la méthode de callback");
                    // On appelle la vrai méthode avec la copie pour s'assurer de ne pas avoir de différence de comportement entre cache / pas de cache
                    callbackEndMethod(err, reponseCopy);
                }
            );
        } else {
            logger.debug("Retour en erreur, aucune mise en cache");
            callbackEndMethod(err, res);
        }
    };
};

/**
 * Fonction du plugin MiseEnCachePlugin qui clone les paramètres interessants d'une réponse.
 * La raison est que sur NodeJs la propriété 'body' n'est pas énumérable, on reconstruit donc un objet spécial pour le cache
 * Note: Possible de d'override cette méthode si d'autres paramètres doivent être ajoutés
 * @param res
 * @return {{body: (any|HTMLElement|req.body|{x-csrf-token}), header: any, ok: any, status: any, type: any}}
 * @private
 */
(<any>MiseEnCachePlugin)._cloneResponse = function _cloneResponse(res:any) {
    return {
        body: res.body,
        header: res.header,
        ok: res.ok,
        status: res.status,
        type: res.type
    };
}


/**
 * Plugin SuperAgent détectant une redirection vers la page de login et redirigant le navigateur vers cette page.
 * Pour détecter cette redirection il recherche dans les headers de la réponse le header 'x-is-login-page' valant "true"
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
export function RedirectToLoginPagePlugin(request:HornetSuperAgentRequest) {
    if (!utils.isServer) {
        // Gestion du header
        var realRequest = request.callback;
        request.callback = function (err, res) {
            if (res && res.get(HEADER_LOGIN_PAGE) == "true") {
                var loginUrl = utils.buildContextPath(utils.appSharedProps.get("loginUrl"));
                logger.debug("Redirection vers la page:", loginUrl);
                window.location.href = loginUrl + "?previousUrl=" + window.location.href;
            }
            realRequest.call(this, err, res);
        }
    }
}

/**
 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
 * @param nom du localstorage
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
export function addParamFromLocalStorage(param:string, localStorageName?:string) {
    return (request:HornetSuperAgentRequest) => {
        if (utils.isServer) {
            var callbacksStorage = utils.callbacksLocalStorage.getStorage(localStorageName);
           // var callbacksStorage = require("hornet-js-utils/src/callbacks-local-storage").getStorage(localStorageName);
            var paramValue = callbacksStorage.get(param);
            var query = request.query;
            query[param] = paramValue;

            logger.trace("Ajout des paramètres superAgent,", param,":", paramValue);
            request.query(query);
        }
    }
}

/**
 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
 * @param nom du localstorage
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
export function addParam(param:string, paramValue:any) {
    return (request:HornetSuperAgentRequest) => {
        if (utils.isServer) {
            var query = request.query;
            query[param] = paramValue;

            logger.trace("Ajout des paramètres superAgent,", param,":", paramValue);
            request.query(query);
        }
    }
}