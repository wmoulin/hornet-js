/**
 * Classe utilisée uniquement côté serveur.
 */
"use strict";

class I18nLoader {
    constructor() {
    }

    getMessages(locale:Array<string>):string {
        throw new Error("You should extend this class to use it");
    }
}
export = I18nLoader;
