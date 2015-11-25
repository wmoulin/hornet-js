///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var utils = require("hornet-js-utils");
var HornetCache = require("src/cache/hornet-cache");
var logger = utils.getLogger("hornet-js-core.services.superagent-hornet-plugins");
var WError = utils.werror;
var _ = utils._;
var HEADER_CSRF_NAME = "x-csrf-token";
var HEADER_LOGIN_PAGE = "x-is-login-page";
/**
 * Plugin SuperAgent ajoutant le header csrf lors de l'envoi des requêtes et gérant la récupération du nouveau token lors du retour
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
function CsrfPlugin(request) {
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
        };
    }
}
exports.CsrfPlugin = CsrfPlugin;
/**
 * Plugin SuperAgent ajoutant la gestion du cache sur la requête courante
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
function MiseEnCachePlugin(timetoliveInCache) {
    if (timetoliveInCache === void 0) { timetoliveInCache = -1; }
    return function (request) {
        var url = request.url;
        var oldEndFunction = request.end;
        var oldSetFunction = request.set;
        var storedSetParameters = [];
        //On remplace la fonction end pour aller chercher dans le cache avant de lancer l'api
        request.end = function (callbackEndMethod) {
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
                oldEndFunction.call(request, MiseEnCachePlugin._getMethodeEndForCache(url, callbackEndMethod, timetoliveInCache));
                return null;
            });
            return request;
        };
        // On remplace la fonction 'set' pour ne pas instancier la requête malgré tout (sur NodeJs), voir superagent/lib/node/index.js, fonction Request.prototype.set
        request.set = function (field, val) {
            var param = { field: field, val: val };
            logger.trace("Enregistrement de l'appel à set avec:", param);
            storedSetParameters.push(param);
            return this;
        };
    };
}
exports.MiseEnCachePlugin = MiseEnCachePlugin;
/**
 * Function du plugin MiseEnCachePlugin qui modifie le callback du service pour stocker dans le cache le résultat de la requête
 * @param url clé dans le cache
 * @param callback callback passé à la méthode end
 * @returns {function(any, any): undefined} fonction
 * @private
 */
MiseEnCachePlugin._getMethodeEndForCache = function _getMethodeEndForCache(url, callbackEndMethod, timetoliveInCache) {
    return function (err, res) {
        if (!err && res) {
            logger.debug("Mise en cache de la réponse à l'appel de l url:", url);
            var reponseCopy = MiseEnCachePlugin._cloneResponse(res);
            HornetCache
                .getInstance()
                .miseEnCacheAsynchrone(url, reponseCopy, timetoliveInCache)
                .finally(function () {
                logger.debug("Sauvegarde dans le cache effectuée, appel de la méthode de callback");
                // On appelle la vrai méthode avec la copie pour s'assurer de ne pas avoir de différence de comportement entre cache / pas de cache
                callbackEndMethod(err, reponseCopy);
            });
        }
        else {
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
MiseEnCachePlugin._cloneResponse = function _cloneResponse(res) {
    return {
        body: res.body,
        header: res.header,
        ok: res.ok,
        status: res.status,
        type: res.type
    };
};
/**
 * Plugin SuperAgent détectant une redirection vers la page de login et redirigant le navigateur vers cette page.
 * Pour détecter cette redirection il recherche dans les headers de la réponse le header 'x-is-login-page' valant "true"
 * @param request
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
function RedirectToLoginPagePlugin(request) {
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
        };
    }
}
exports.RedirectToLoginPagePlugin = RedirectToLoginPagePlugin;
/**
 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
 * @param nom du localstorage
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
function addParamFromLocalStorage(param, localStorageName) {
    return function (request) {
        if (utils.isServer) {
            var callbacksStorage = utils.callbacksLocalStorage.getStorage(localStorageName);
            // var callbacksStorage = require("hornet-js-utils/src/callbacks-local-storage").getStorage(localStorageName);
            var paramValue = callbacksStorage.get(param);
            var query = request.query;
            query[param] = paramValue;
            logger.trace("Ajout des paramètres superAgent,", param, ":", paramValue);
            request.query(query);
        }
    };
}
exports.addParamFromLocalStorage = addParamFromLocalStorage;
/**
 * Plugin SuperAgent ajoutant les données telques le tid et le user à la requête du serveur
 * @param nom du localstorage
 * @return {HornetSuperAgentRequest}
 * @constructor
 */
function addParam(param, paramValue) {
    return function (request) {
        if (utils.isServer) {
            var query = request.query;
            query[param] = paramValue;
            logger.trace("Ajout des paramètres superAgent,", param, ":", paramValue);
            request.query(query);
        }
    };
}
exports.addParam = addParam;
//# sourceMappingURL=superagent-hornet-plugins.js.map