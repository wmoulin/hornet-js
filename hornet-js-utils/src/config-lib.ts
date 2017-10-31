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

import { Register } from "src/common-register";
import { Logger } from "src/logger";

const logger: Logger = Register.getLogger("hornet-js-utils.config-lib");

/**
 * Classe gérant l'accès à l'objet de configuration
 */
export class ConfigLib {
    private _configObj: any;

    constructor() {
    }

    /**
     * Force l'utilisation d'un objet de configuration spécifique, pour les tests ou pour le navigateur
     * @param configObj
     */
    setConfigObj(configObj: Object) {
        this._configObj = configObj;
    }

    /**
     * Charge les configurations Serveur.
     *  - répertoire ./config pour le mode DEV
     *  - répertoire APPLI + INFRA pour le mode PRODUCTION (process.env.HORNET_CONFIG_DIR_APPLI & process.env.HORNET_CONFIG_DIR_INFRA)
     */
    loadServerConfigs() {
        let appliFolder = process.env.HORNET_CONFIG_DIR_APPLI;
        if (appliFolder) {
            process.env.NODE_CONFIG_DIR = appliFolder;
            logger.trace("Chargement de la configuration APPLI (Variable process.env.HORNET_CONFIG_DIR_APPLI) dans ", appliFolder);
        } else {
            logger.trace("Chargement de la configuration APPLI en mode DEV", "./config");
        }
        this._configObj = require("config");
        logger.trace("Configuration APPLI : ", JSON.stringify(this._configObj));

        let infraFolder = process.env.HORNET_CONFIG_DIR_INFRA;
        if (infraFolder) {
            process.env.NODE_CONFIG_DIR = infraFolder;
            logger.trace("Chargement de la configuration INFRA (Variable process.env.HORNET_CONFIG_DIR_INFRA) dans ", infraFolder);
            let infraConf = this._configObj.util.loadFileConfigs();
            logger.trace("Configuration INFRA : ", JSON.stringify(infraConf));
            this._configObj.util.extendDeep(this._configObj, infraConf);
            logger.trace("Configuration mergée : ", JSON.stringify(this._configObj));
        }
        this.checkVariables(this._configObj);

    }

    getConfigObj(): any {
        return this._configObj;
    }

    checkVariables(obj: any): void {
        let _check = (obj: any): any => {
            let retry: any = false;
            for (let i in obj) {
                let type = typeof obj[i];
                if (type === "function") continue;

                if (type === "object") {
                    retry |= _check(obj[i]);

                } else if (type === "string") {
                    let variables = obj[i].match(/\$\{[^\}]+\}/g);
                    if (variables && variables.length > 0) {
                        retry = true;
                        variables.forEach((variable) => {
                            obj[i] = obj[i].replace(variable, this.get(variable.substring(2, variable.length - 1)));
                        });
                    }
                }
            }
            return retry;
        };

        if (_check(obj)) {
            this.checkVariables(obj);
        }
    }

    /**
     * <p>Get a configuration value</p>
     *
     * <p>
     * This will return the specified property value, throwing an exception if the
     * configuration isn't defined.  It is used to assure configurations are defined
     * before being used, and to prevent typos.
     * </p>
     *
     * @method get
     * @param property {string} - The configuration property to get. Can include '.' sub-properties.
     * @return value {mixed} - The property value
     */
    get(property: string): any {
        if (property === null || property === undefined) {
            throw new Error("Calling config.get with null or undefined argument");
        }
        let value = ConfigLib.getImpl(this._configObj, property);

        // Produce an exception if the property doesn't exist
        if (value === undefined) {
            throw new Error("Configuration property '" + property + "' is not defined");
        }

        // Return the value
        return value;
    }

    /**
     * <p>Get a configuration value, or get defaultValue if no configuration value</p>
     * @param property
     * @param defaultValue value if property doesn't exist
     * @return {any}
     */
    getOrDefault(property: string, defaultValue: Object): any {
        try {
            return this.get(property);
        } catch (error) {
            try {
                logger.warn("PROPERTY NOT DEFINED :", property, ", DEFAULT VALUE APPLY :", defaultValue);
            } catch (error) {
                // MBC - fullSpa - logger pas encore disponible
                logger.trace("PROPERTY NOT DEFINED :", property, ", DEFAULT VALUE APPLY :", defaultValue);
            }
            return defaultValue;
        }
    }

    /**
     * Get the configuration value if the property exists
     * No warning in case there is non configuration
     * @param property
     * @returns {any}
     */
    getIfExists(property: string): any {
        if (this.has(property)) {
            return this.get(property);
        }
        return null;
    }

    /**
     * Test that a configuration parameter exists
     *
     *
     * @method has
     * @param property {string} - The configuration property to test. Can include '.' sub-properties.
     * @return isPresent {boolean} - True if the property is defined, false if not defined.
     */
    has(property: string): any {
        if (property === null || property === undefined) {
            return false;
        }

        return ConfigLib.getImpl(this._configObj, property) !== undefined;
    }


    /**
     * Underlying get mechanism
     *
     * @private
     * @method getImpl
     * @param object {object} - Object to get the property for
     * @param property {string | array[string]} - The property name to get (as an array or '.' delimited string)
     * @return value {mixed} - Property value, including undefined if not defined.
     */
    private static getImpl(object: any, property: any): any {
        let elems = Array.isArray(property) ? property : property.split(".");
        let name = elems[0];
        let value = object[name];
        if (elems.length <= 1) {
            return value;
        }
        if (typeof value !== "object") {
            return undefined;
        }
        return ConfigLib.getImpl(value, elems.slice(1));
    }
}

