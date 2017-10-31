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
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { DomAdapter } from "src/widget/form/dom-adapter";
import { NotificationType, Notifications } from "hornet-js-core/src/notification/notification-manager";
import { UploadedFile } from "hornet-js-core/src/data/file";

import * as _ from "lodash";
import ErrorObject = ajv.ErrorObject;
import DependenciesParams = ajv.DependenciesParams;

const IntlMessageFormat = require("intl-messageformat");

export abstract class FormUtils {

    /**
     * Extrait le nom du champ depuis l'erreur de validation indiquée
     * Le nom du champ peut être un "path" tel que "ville.pays.id".
     * @param error une erreur de validation ajv
     * @return le nom du champ, ou une chaîne vide si non renseigné
     */
    static extractFieldName(error: ErrorObject): string {
        let fieldName: string = "";
        if (error) {
            if (error.dataPath && error.dataPath.length > 1) {
                let offset: number = 0;
                if (error.dataPath.charAt(0) == ".") {
                    offset = 1;
                }
                fieldName = error.dataPath.substring(offset);
            }
            if (error.keyword == "required") {
                if (error.params && (error.params as DependenciesParams).missingProperty) {
                    if (fieldName) {
                        fieldName += ".";
                    }
                    fieldName += (error.params as DependenciesParams).missingProperty;
                }
            }
        }
        return fieldName;
    }

    /**
     * Génère le message d'erreur correspondant au mot-clé et au champ indiqués
     * @param keyword mot clé de validation json-schema
     * @param fieldName nom du champ (peut être un "path" tel que "ville.pays.id")
     * @param fieldsMessages messages spécifiques aux champs du formulaire
     * @param genericValidationMessages messages d'erreur génériques
     * @param complement
     * @return le message ou undefined lorsqu'aucun n'est défini pour le mot-clé indiqué
     */
    static extractMessage(keyword: string, fieldName: string, fieldsMessages?: any, genericValidationMessages?: any, complement?: any): string {
        let message: string;
        let specificMessage: any = _.get(fieldsMessages, fieldName + "." + keyword);

        if (_.isString(specificMessage)) {

            message = specificMessage;
            if (complement) {
                complement["field"] = fieldName;
                let intlMsg = new IntlMessageFormat(specificMessage);
                message = intlMsg.format(complement);
            }

        } else if (genericValidationMessages) {
            let genericMessage: any = genericValidationMessages[keyword] || genericValidationMessages["generic"];
            if (_.isString(genericMessage)) {
                let intlMsg = new IntlMessageFormat(genericMessage);
                message = intlMsg.format({field: fieldName});
            }
        }
        return message;
    }


    /**
     * Traite les erreurs de validation de formulaire : renvoie des notifications d'erreur.
     * @param errors liste d'erreurs éventuellement vide
     * @param fields Liste des champs du formulaire
     * @param fieldsMessages messages spécifiques aux champs du formulaire
     * @param genericValidationMessages messages d'erreur génériques
     * @return {Notifications} les notifications correspondant aux erreurs de validation
     */
    static getErrors(errors: Array<ErrorObject>, fields: { [key: string]: DomAdapter<any, any> }, fieldsMessages?: any, genericValidationMessages?: any): Notifications {
        let notificationsError: Notifications = new Notifications();

        for (let index: number = 0; index < errors.length; index++) {
            let error = errors[index];
            let erreurNotification = new NotificationType();
            erreurNotification.id = "ACTION_ERREUR_" + index;
            erreurNotification.text = error.message;
            let fieldName: string = FormUtils.extractFieldName(error);
            if (fieldName) {

                erreurNotification.anchor = fieldName + "_anchor";
                erreurNotification.field = fieldName;
                erreurNotification.additionalInfos = error.params;

                let complement: any = {};

                // Gestion des champs editables d'un tableau
                if (fields[fieldName] && fields[fieldName].props && fields[fieldName].props.title) {
                    let data = fieldName.split(".");
                    if (!isNaN(data[data.length - 2] as any)) {
                        fieldName = data[data.length - 1];
                        complement = {complement: (parseInt(data[data.length - 2]) + 1).toString()};
                    }
                }

                let message: string = FormUtils.extractMessage(error.keyword, fieldName, fieldsMessages, genericValidationMessages, complement);
                if (message) {
                    /* Surcharge du message produit par ajv */
                    erreurNotification.text = message;
                }
            }
            notificationsError.addNotification(erreurNotification);
        }
        return notificationsError;
    }


    /**
     * Récupère les informations du fichier éventuellement déjà sélectionné associé à un champ de type "file"
     * @param inputItem champ de formulaire de type envoi de fichier
     * @returns {UploadedFile} une instance de UploadedFile ou undefined
     */
    static extractFileData(inputItem: HTMLInputElement): UploadedFile {
        let selectedFile: UploadedFile;
        if (inputItem.dataset && inputItem.dataset["fileId"]) {
            selectedFile = {
                id: parseInt(inputItem.dataset["fileId"]),
                originalname: inputItem.dataset["fileOriginalname"],
                name: inputItem.dataset["fileName"],
                mimeType: inputItem.dataset["fileMimeType"],
                encoding: inputItem.dataset["fileEncoding"],
                size: parseInt(inputItem.dataset["fileSize"]),
                buffer: null
            };
        }
        return selectedFile;
    }
}