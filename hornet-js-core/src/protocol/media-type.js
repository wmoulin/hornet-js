///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
var ActionsChainData = require("src/routes/actions-chain-data");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.protocol.media-type");
var WError = utils.werror;
var _ = utils._;
var memorystream = utils.memorystream;
var MediaType = (function () {
    function MediaType() {
    }
    MediaType.readJsonFromSuperAgent = function (api, agent, resolve, reject, message) {
        agent.end(api.endFunction(resolve, reject, message));
    };
    MediaType.readStreamFromSuperAgent = function (api, agent, resolve, reject, message) {
        var stream = new memorystream();
        // Le 'on()' est sur SuperAgent, pas sur le stream (attention, le 'pipe()' retourne le stream)
        agent.on("end", function () {
            var res = agent.res; // (this = request superagent)
            if (res) {
                var responseContentType = res.headers["content-type"];
                resolve(new ActionsChainData().withBody(stream).withResponseMimeType(responseContentType));
            }
            else {
                reject(new WError(undefined, "[KO]: " + message));
            }
        })
            .pipe(stream); // Le pipe() appelle la méthode end() sur la request
    };
    MediaType._fromParameter = function (parameter) {
        var mediaType = null;
        _.forOwn(MediaType, function (value) {
            if (value && value.PARAMETER && value.PARAMETER === parameter) {
                mediaType = value;
                return false;
            }
        });
        return mediaType;
    };
    MediaType._fromMime = function (mimeType) {
        var mediaType = null;
        _.forOwn(MediaType, function (value) {
            if (value && value.MIME && value.MIME === mimeType) {
                mediaType = value;
                return false;
            }
        });
        return mediaType;
    };
    MediaType.fromParameter = function (parameter) {
        return MediaType._fromParameter(parameter) || MediaType.DEFAULT;
    };
    MediaType.fromMime = function (parameter) {
        return MediaType._fromMime(parameter) || MediaType.DEFAULT;
    };
    /**
     * Renvoie true si le format demandé par le client demande un rendu de composant ou redirect
     * Renvoie false si le format est géré par l'application et doit envoyé tel quel au client.
     * @param mimeType
     * @returns {boolean}
     */
    MediaType.isRenderNeeded = function (mimeType) {
        return MediaType._fromMime(mimeType) === null;
    };
    /**
     * Renvoie true si le format demandé par le client est en fait une redirection serveur (json)
     * @param mimeType
     * @returns {boolean}
     */
    MediaType.isRedirect = function (mimeType) {
        return mimeType === this.JSON.MIME;
    };
    MediaType.MEDIATYPE_PARAMETER = "mediaType";
    MediaType.JSON = {
        PARAMETER: "json",
        MIME: "application/json",
        readFromSuperAgent: MediaType.readJsonFromSuperAgent
    };
    MediaType.XLS = {
        PARAMETER: "xls",
        MIME: "application/vnd.ms-excel",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    MediaType.CSV = {
        PARAMETER: "csv",
        MIME: "text/csv",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    MediaType.PDF = {
        PARAMETER: "pdf",
        MIME: "application/pdf",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    // Attention à ne pas déclarer le DEFAUT avant sa valeur
    MediaType.DEFAULT = MediaType.JSON;
    return MediaType;
})();
module.exports = MediaType;
//# sourceMappingURL=media-type.js.map