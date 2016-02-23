"use strict";
/**
 * Type d'objet qui est transféré d'une action à une autre (d'une promise à une autre)
 * Les chaines d'actions peuvent étendre cette classe pour ajouter des attributs spécifiques.
 *
 */
import superagent = require("superagent");

class ActionsChainData {

    /**
     * Le mimeType demandé par le client
     */
    requestMimeType:string;

    /**
     * Le MimeType du résultat à retourner au client
     */
    responseMimeType:string;

    /**
     * Le résultat à retourner au client.
     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
     */
    result:any;

    /**
     * La dernière erreur technique produite
     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
     */
    lastError:any;

    /**
     * Les erreurs présentes dans un formulaire
     * Si ce champ est valorisé, il sera prioritaire sur les autres rendus (composant / json)
     */
    formError:any;

    /**
     * Boolean indiquant que l'accès à la ressource courante n'est pas autorisé pour l'utilisateur courant
     * @type {boolean}
     */
    isAccessForbidden:boolean = false;

    parseResponse(res:superagent.Response) {
        this.result = res.body || {"status": res.status};
        this.responseMimeType = res.type || "application/json";
        return this;
    }

    withBody(body:any) {
        this.result = body;
        return this;
    }

    withResponseMimeType(responseMimeType:string) {
        this.responseMimeType = responseMimeType;
        return this;
    }
}

export = ActionsChainData;
