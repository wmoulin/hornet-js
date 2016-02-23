"use strict";
import HornetSuperAgentRequest = require("src/services/hornet-superagent-request");
import ServiceApi = require("src/services/service-api");
import ActionsChainData = require("src/routes/actions-chain-data");
import utils = require("hornet-js-utils");

var logger = utils.getLogger("hornet-js-core.protocol.media-type");
var WError = utils.werror;
var _ = utils._;
var memorystream = utils.memorystream;

class MediaType {

    static MEDIATYPE_PARAMETER = "mediaType";

    static JSON = {
        PARAMETER: "json",
        MIME: "application/json",
        readFromSuperAgent: MediaType.readJsonFromSuperAgent
    };
    static XLS = {
        PARAMETER: "xls",
        MIME: "application/vnd.ms-excel",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    static CSV = {
        PARAMETER: "csv",
        MIME: "text/csv",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    static PDF = {
        PARAMETER: "pdf",
        MIME: "application/pdf",
        readFromSuperAgent: MediaType.readStreamFromSuperAgent
    };
    // Attention à ne pas déclarer le DEFAUT avant sa valeur
    static DEFAULT = MediaType.JSON;

    static readJsonFromSuperAgent(api:ServiceApi, agent:HornetSuperAgentRequest, resolve, reject, message:string) {
        agent.end(api.endFunction(resolve, reject, message));

    }

    static readStreamFromSuperAgent(api:ServiceApi, agent:HornetSuperAgentRequest, resolve, reject, message:string) {
        var stream = new memorystream();

        // Le 'on()' est sur SuperAgent, pas sur le stream (attention, le 'pipe()' retourne le stream)
        agent.on("end", () => {
                var res = agent.res; // (this = request superagent)
                if (res) {
                    var responseContentType = res.headers["content-type"];
                    resolve(new ActionsChainData().withBody(stream).withResponseMimeType(responseContentType));
                } else {
                    var errorMess:string = "[KO] : " + message;
                    logger.error(errorMess);
                    var error = new WError(errorMess);
                    error.name = " ";
                    reject(error);
                }
            })
            .pipe(stream); // Le pipe() appelle la méthode end() sur la request

    }

    static _fromParameter(parameter:string):any {
        var mediaType = null;
        _.forOwn(MediaType, function (value) {
            if (value && value.PARAMETER && value.PARAMETER === parameter) {
                mediaType = value;
                return false;
            }
        });
        return mediaType;
    }

    static _fromMime(mimeType:string):any {
        var mediaType = null;
        _.forOwn(MediaType, function (value) {
            if (value && value.MIME && value.MIME === mimeType) {
                mediaType = value;
                return false;
            }
        });
        return mediaType;
    }

    static fromParameter(parameter:string):any {
        return MediaType._fromParameter(parameter) || MediaType.DEFAULT;
    }

    static fromMime(parameter:string):any {
        return MediaType._fromMime(parameter) || MediaType.DEFAULT;
    }

    /**
     * Renvoie true si le format demandé par le client demande un rendu de composant ou redirect
     * Renvoie false si le format est géré par l'application et doit envoyé tel quel au client.
     * @param mimeType
     * @returns {boolean}
     */
    static isRenderNeeded(mimeType:string):boolean {
        return MediaType._fromMime(mimeType) === null;
    }

    /**
     * Renvoie true si le format demandé par le client est en fait une redirection serveur (json)
     * @param mimeType
     * @returns {boolean}
     */
    static isRedirect(mimeType:string):boolean {
        return mimeType === this.JSON.MIME;
    }

}

export = MediaType;
