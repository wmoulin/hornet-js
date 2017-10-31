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

var Ajv = require("ajv");

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
};

/**
 * Résultat de validation
 */
export interface IValidationResult {
    /** Indique si les données sont valides */
    valid: boolean;

    /** Tableau d'erreurs de validation éventuelles */
    errors: Array<ajv.ErrorObject>
};

/**
 * Contient tous les éléments nécessaires à une validation de données
 */
export class DataValidator {

    /**
     * Options de validation ajv par défaut, utilisables côté client et serveur (les dates sont supposées être des
     * chaînes de caractères au format ISO 8601)
     */
    static DEFAULT_VALIDATION_OPTIONS: ajv.Options = {
        /* Activation des mots clé json-schema v5 (https://github.com/json-schema/json-schema/wiki/v5-Proposals) */
        v5: true,
        /* Valide tous les champs : ne s'arrête pas à la première erreur */
        allErrors: true,
        /* Convertit les chaînes de caractères vers le type indiqué dans le schéma de validation */
        coerceTypes: true,
        /* Prend en compte les valeurs par défaut éventuellement présentes dans le schéma */
        useDefaults: true,
        /* Mode de validation complet : impacte les formats date, time, date-time, uri, email, et hostname.
        En mode 'full', les champs de format "email' sont validés en appliquant la RFC 5322. */
        format: "full"
    };

    /** Schéma de validation au format json-schema */
    schema: any;

    /** Options de validation ajv (cf. http://epoberezkin.github.io/ajv/#options) */
    options: ajv.Options;

    /**
     * Valideurs customisés : permettent d'implémenter et de chaîner des règles de validation difficiles à mettre
     * en oeuvre simplement avec un schéma json-schema. Ils sont appliqués après la validation basée sur le schéma
     * de validation, donc les données du formulaire ont déjà éventuellement bénéficié de la coercition de types. */
    customValidators: ICustomValidation[];

    constructor(schema?: any, customValidators?: ICustomValidation[], options = DataValidator.DEFAULT_VALIDATION_OPTIONS) {
        this.schema = schema;
        this.customValidators = customValidators;
        this.options = options;
    }

    /**
     * Exécute la validation
     * @param data données à valider
     * @return {IValidationResult} résultat de la validation
     */
    validate(data: any): IValidationResult {
        let result: IValidationResult = {
            valid: true,
            errors: []
        };
        if (this.schema) {
            let ajvInstance: ajv.Ajv = Ajv(this.options);
            require('ajv-keywords')(ajvInstance);
            result.valid = ajvInstance.validate(this.schema, data);
            result.errors = ajvInstance.errors || [];
        }

        /* Prise en compte des valideurs customisés éventuels */
        if (this.customValidators) {
            for (let index in this.customValidators) {
                if (this.customValidators[index] && (typeof this.customValidators[index] != "function")) {
                    let customResult: IValidationResult = this.customValidators[index].validate(data);

                    if (!customResult.valid && customResult.errors) {
                        result.errors = result.errors.concat(customResult.errors);
                    }
                    result.valid = result.valid && customResult.valid;
                }
            }
        }

        if (result.errors && Array.isArray(result.errors)) {
            for (let index in result.errors) {
                result.errors[index].dataPath = result.errors[index].dataPath.replace("'][", ".").replace("['", "").replace("]", "");
            }
        }

        return result;
    }

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
    static transformRequiredStrings(hornetSchema: any): any {
        var resultSchema: any;
        if (hornetSchema) {
            resultSchema = _.cloneDeep(hornetSchema);
            resultSchema.required = resultSchema.required || [];
            // TODO à appliquer récursivement, chaque champ pouvant lui même être un objet
            for (var fn in resultSchema.properties) {
                var field = resultSchema.properties[fn];
                if (field.required === true && field.type == "string") {
                    field.minLength = 1;
                    if (resultSchema.required.indexOf(fn) == -1) {
                        resultSchema.required.push(fn);
                    }
                    delete field.required;
                }
            }
            /* Aucune propriété n'est requise : on supprime dans ce cas la propriété required pour être compatible avec ajv */
            if (resultSchema.required.length == 0) {
                delete resultSchema.required;
            }
        }
        return resultSchema;
    }
}