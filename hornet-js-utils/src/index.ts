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
 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

// Inclusion du polyfill pour faire fonctionner firefox et IE
require("src/extended/capture_stack_trace_polyfill");

/* Inclusion du shim object.assign : Firefox < 34 */
if (!Object["assign"]) {
    require("object.assign").shim();
}
/* Inclusion du polyfill es6-promise */
if (typeof Promise === "undefined") {
    require("es6-promise").polyfill();
}

// propagation dynamique de la variable NODE_ENV vers le client
if (typeof window !== "undefined" && window["Mode"]) {
    process.env.NODE_ENV = window["Mode"];
}

//permet de changer la serialisation json des types dates
//cette surcharge est destinée à disparaitre lorsque les hornet-js-bean-converteurs seront créés
Date.prototype.toJSON = function(){ return this.getTime(); }


import { Register } from "src/common-register";
import { Logger } from "src/logger";
import { DateUtils } from "src/date-utils";
import { ConfigLib } from "src/config-lib";
import { AppSharedProps } from "src/app-shared-props";
import { ContinuationLocalStorage } from "src/continuation-local-storage";
import * as _ from "lodash";

export class Utils {
    static isServer:boolean = Register.isServer;
    static getLogger:(category:any, buildLoggerFn?:(category:string)=>void)=>Logger = Register.getLogger;

    static dateUtils = DateUtils;

    static appSharedProps = AppSharedProps;
    private static _config:ConfigLib;
    private static _contextPath:string;

    static log4js:any;
    static notify:(nid, errors, infos?)=>void;

    static registerGlobal<T>(paramName:string, value:T):T {
        return Register.registerGlobal(paramName, value);
    }

    static set config(configLib) {
        Utils._config = configLib;
        Utils._contextPath = undefined;
    }

    static get config() {
        return Utils._config;
    }

    /**
     * Retourne le contextPath courant de l"application.
     * Ce context ne contient pas de "/" de fin et commence forcément par un "/"
     * @return {string}
     */
    static getContextPath() {
        if (_.isUndefined(Utils._contextPath)) {
            var context = Utils.config.getOrDefault("contextPath", "");
            if (!_.startsWith(context, "/")) {
                // On force le démarrage par un slash
                context = "/" + context;
            }
            if (_.endsWith(context, "/")) {
                // On enlève le slash de fin si présent
                context = context.substr(0, context.length - 1);
            }
            Utils._contextPath = context;
        }
        return Utils._contextPath;
    }

    /**
     * Ajoute le contextPath à l'url passée en paramètre si besoin
     * @param path
     * @return {string}
     */
    static buildContextPath(path:string = "") {
        var retour = path;

        var contextPath = Utils.getContextPath();
        if (path === "" || (_.startsWith(path, "/") && !_.startsWith(path, contextPath))) {
            // On ne prend que les urls relatives à la racine (=> commence par "/")
            // On ne concatène que lorsque ca ne commence pas déja par le contextPath
            retour = contextPath + path;
        }

        if (_.endsWith(retour, "/")) {
            // On enlève toujours le dernier slash
            retour = retour.substr(0, retour.length - 1);
        }

        return retour;
    }

    /**
     * Ajoute le staticPath à l'url passée en paramètre si besoin
     * @param path
     * @return {string}
     */
    static buildStaticPath(path:string) {
        let retour = path;

        let contextPath = Utils.getContextPath();
            if (_.startsWith(path, "/") && !_.startsWith(path, contextPath)) {
                // On ne prend que les urls relatives à la racine (=> commence par "/")
                // On ne concatène que lorsque ca ne commence pas déja par le contextPath
                retour = contextPath + Utils.getStaticPath() + path;
            }

            if (_.endsWith(retour, "/")) {
                // On enlève toujours le dernier slash
                retour = retour.substr(0, retour.length - 1);
            }

            return retour;

    }

    static getStaticPath() {
        var staticpath = "";

        // mantis 53394 - Pour le mode full spa :
        // tout ce qui est dans /static est en fait déployé directement a la racine du serveur web
        // => pas besoin de prefixer les requetes par /static
        // Solution : utiliser une proprieté de configuration pour ce préfixe : "fullSpa.staticPath"
        // Mode fullSpa actif : utiliser la propriété fullSpa.staticPath, qui doit être configurée à vide ou à "/"
        // Mode avec serveur node : on utilise le prefixe "/static"
        if (!Utils.isServer && Utils.config.getOrDefault("fullSpa.enabled", false)) {
            staticpath = Utils.config.getOrDefault("fullSpa.staticPath", "");
        } else {
            staticpath = "/static";
            // if (process.env.NODE_ENV === "production") {
            staticpath += "-" + AppSharedProps.get("appVersion");
            // }
        }
        return staticpath;
    }

    static setConfigObj(theConfig: Object) {
        var config: ConfigLib = new ConfigLib();
        config.setConfigObj(theConfig);
        Utils.config = config;
    }

    /**
     * Fonction retournant le continuationlocalstorage hornet ou un storage applicatif
     * @param localStorageName Nom du localStorage, par défaut HornetContinuationLocalStorage
     * @return {any}
     */
    static getContinuationStorage(localStorageName?: string): any {
        return ContinuationLocalStorage.getContinuationStorage(localStorageName);
    }

    /**
     * Fonction retournant la valeur associée à la key du CLS.
     * @param key: clé de la valeur à retourner
     * @param localStorageName: Nom du localStorage, par défaut HornetContinuationLocalStorage
     * @returns {any}
     */
    static getCls(key: string, localStorageName?: string): any {
        return ContinuationLocalStorage.get(key, localStorageName);
    }

    /**
     * Fonction settant la valeur associée à la key du CLS.
     * @param key: clé de la valeur à retourner
     * @param localStorageName: Nom du localStorage, par défaut HornetContinuationLocalStorage
     * @returns {any}
     */
    static setCls(key: string, value: any, localStorageName?: string): any {
        return ContinuationLocalStorage.set(key, value, localStorageName);
    }


    /**
     * Permet de récupérer la valeur d'un objet, peu importe sa profondeur
     * exemple:
     * var o:any = {a:"a", b: {c:{d: "TEST"}}};
     * utils.getValueObject(o, "a.b.c.d") => null
     * utils.getValueObject(o, "b.c.d") => TEST
     * @param object
     * @param chaine
     * @returns {any}
     */
    static getValueObject(object: any, chaine: string) {
        var tab = (chaine ? chaine.split('.') : []),
            newObject: any = object,
            lastValue: any = null,
            first: any = _.first(tab);

        // tant que l'on en a un
        while (first && newObject) {
            // si l'on a bien la propriété demandée
            if (_.has(newObject, first) || _.isFunction(newObject[first])) {
                newObject = _.isFunction(newObject[first]) ? newObject[first]() : newObject[first];
                // s'il en reste plus qu'un
                if (tab.length == 1) {
                    // on a trouvé notre propriété
                    lastValue = newObject;
                }

                // on enlève le premier
                tab = _.drop(tab);

                // et on réaffecte la prochaine propriété
                first = _.first(tab);
            }
            else {
                break;
            }
        }
        return lastValue;
    }
}

if (Utils.isServer) {
    var config: ConfigLib = new ConfigLib();
    config.loadServerConfigs();
    Utils.config = Utils.registerGlobal("config", config);
}

if (!Utils.isServer) {
    Utils.log4js = Utils.registerGlobal("log4js", require("src/extended/log4js"));
}
