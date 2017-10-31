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

import * as React from "react";
import { HornetComponent } from "src/widget/component/hornet-component";
import { FormUtils } from "src/widget/form/form-utils";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.dom-adapter");

/**
 * Adaptateur DOM pour un champ de formulaire
 */
export class DomAdapter<P, S> extends HornetComponent<P, S> {

    /** Nom du champ */
    private name;
    /** Type HTML */
    private type;
    /** Référence vers l'élément react */
    protected htmlElement: any;

    protected multipleElement: Array<any>;

    constructor(props?: P, context?: any) {
        super(props, context);
    }

    private getElementType(elt) {
        let tag = this.htmlElement.tagName.toLowerCase();
        let type = null;
        if (tag == "input") {
            type = this.htmlElement["type"];
        } else if (tag == "textarea") {
            type = "textarea";
        } else if (tag == "select") {
            type = "select";
        }
        return type;
    }

    getHornetForm() {
        if (this.htmlElement) {
            return this.htmlElement.form.__component;
        } else {
            return this.multipleElement[0].form.__component;
        }
    }

    registerHtmlElement(elt) {
        if (elt == null) {
            if (this.htmlElement) {
                this.htmlElement["__component"] = null;
            }
            this.name = null;
            this.type = null;
            this.htmlElement = null;
        } else {
            if (this.htmlElement) {
                this.addHtmlElement(elt);
            } else {
                this.htmlElement = elt;
                this.name = this.htmlElement.name;
                this.type = this.getElementType(elt);
                this.htmlElement["__component"] = this;
            }
        }
    }

    addHtmlElement(elt) {
        if (this.htmlElement) {
            let type = this.getElementType(elt);
            if (this.type == type && type == "radio") {
                this.multipleElement = [];
                this.multipleElement.push(this.htmlElement);
                elt["__component"] = this;
                this.multipleElement.push(elt);
                this.htmlElement = null;
            } else {
                logger.error("DomAdapter.addHtmlElement > different or unallowed types : " + this.type + " and " + type);
            }
        } else {
            elt["__component"] = this;
            this.multipleElement.push(elt);
        }
    }

    /**
     * Renvoie la valeur de la propriété HTML indiquée
     * @param name nom de la propriété
     * @returns {string} la valeur ou null si la propriété n'est pas définie
     */
    getAttribute(name): string {
        return this.htmlElement.getAttribute(name);
    }

    /**
     * Initialise la propriété HTML avec la valeur indiquée
     * @param name nom de la propriété
     * @param value valeur
     * @returns {DomAdapter} cette instance
     */
    setAttribute(name: string, value: string): this {
        if (this.htmlElement) {
            this.htmlElement.setAttribute(name, value);
        } else if (this.multipleElement) {
            for (let i = 0; i < this.multipleElement.length; i++) {
                this.multipleElement[i].setAttribute(name, value);
            }
        }
        return this;
    }

    /**
     * Pour une case à cocher, initialise la propriété checked
     * @param value booléen
     * @returns {DomAdapter} cette instance
     */
    setCurrentChecked(value: boolean): this {
        if (this.htmlElement && this.type == "checkbox") {
            this.htmlElement.checked = value;
        }
        return this;
    }

    /**
     * Initialise la valeur courante du champ de formulaire
     * @param value valeur à utiliser
     * @returns {DomAdapter} cette instance
     */
    setCurrentValue(value: any): this {
        let strValue: string = (value != null && value.toString) ? value.toString() : "";
        let type: string = this.type;
        if (type) {
            type = type.toLowerCase();
        }
        if (this.htmlElement) {
            if (type == "text" || type == "textarea" || type == "hidden" || type == "checkbox"
                || (type == "select" && this.htmlElement.multiple === false)) {
                this.htmlElement.value = (this.htmlElement.dataset && this.htmlElement.dataset.multiple === "true") ? (value ? JSON.stringify(value) : "") : strValue;

            } else if (type == "select"/*select multiple*/) {
                if (value instanceof Array) {
                    this.htmlElement.value = null;
                    value.forEach((val) => {
                        for (let i = 0; i < this.htmlElement.options.length; i++) {
                            if (this.htmlElement.options[i].value == val) {
                                this.htmlElement.options[i].selected = true;
                                return;
                            }
                        }
                    });

                } else {
                    this.htmlElement.value = value;
                }
            }

        } else if (this.multipleElement) {
            for (let i = 0; i < this.multipleElement.length; i++) {
                if (this.multipleElement[i].value == strValue) {
                    this.multipleElement[i].checked = true;
                } else {
                    this.multipleElement[i].checked = false;
                }
            }
        }
        return this;
    }

    /**
     * Renvoie la valeur courante du champ de formulaire
     * @returns {null}
     */
    getCurrentValue(): any {
        let val: any = null;
        if (this.htmlElement) {
            let type: string = this.type;
            if (type) {
                type = type.toLowerCase();
            }
            if (type == "text" || type == "textarea" || type == "hidden"
                || (type == "select" && this.htmlElement.multiple === false)) {

                try {
                    if (Array.isArray(JSON.parse(this.htmlElement.value))) {
                        val = JSON.parse(this.htmlElement.value);
                    } else {
                        val = this.htmlElement.value;
                    }
                } catch (e) {
                    val = this.htmlElement.value;
                }
            } else if (type == "select"/*select multiple*/) {
                val = [];
                /* Note : l'attribut selectedOptions n'est pas supporté par Internet Explorer */
                for (let i = 0; i < (this.htmlElement as HTMLSelectElement).options.length; i++) {
                    let option: HTMLOptionElement = (this.htmlElement as HTMLSelectElement).options[i] as HTMLOptionElement;
                    if (option.selected) {
                        val.push(option.value);
                    }
                }
            } else if (type == "checkbox") {
                // if(!_.isEmpty(this.htmlElement.value) && this.htmlElement.value != "on") {
                //     /* Cas où une valeur est explicitement spécifiée */
                //     if (this.htmlElement.checked) {
                //         val = this.htmlElement.value;
                //     } else {
                //         val = "";
                //     }
                // } else {
                /* Pas de valeur spécifique : la valeur est un booléen égal à checked */
                val = this.htmlElement.checked;
                // }
            } else if (type == "file") {
                let fileList: FileList = this.htmlElement.files;
                if (fileList && fileList.length >= 1) {
                    /* Pour simplifier la validation et la transmission via super-agent,
                     un seul fichier par champ de type "file" est pris en compte */
                    val = fileList[0];
                } else {
                    /* Aucun fichier n'a été sélectionné : on récupère les informations de celui qui avait
                     éventuellement déjà été transmis */
                    // TODO à réactiver : voir pourquoi le composant UploadFileField ne peut être utilisé
                    val = FormUtils.extractFileData(this.htmlElement as HTMLInputElement);
                }
            }

        } else if (this.multipleElement) {
            for (let i = 0; i < this.multipleElement.length; i++) {
                if (this.multipleElement[i].checked) {
                    val = this.multipleElement[i].value;
                    break;
                }
            }
        }

        return val;
    }


    /**
     * Bascule le champ en readOnly
     * @param value valeur à utiliser
     * @returns {DomAdapter} cette instance
     */
    setReadOnly(value: any): this {
        if (this.htmlElement) {
            this.htmlElement.readOnly = value;
            if (value) {
                this.htmlElement.classList.add("readonly");
            } else {
                this.htmlElement.classList.remove("readonly");
            }
        }
        return this;
    }

    /**
     * Bascule le champ en readOnly
     * @param value valeur à utiliser
     * @returns {DomAdapter} cette instance
     */
    setDisabled(value: any): this {
        if (this.htmlElement) {
            this.htmlElement.disabled = value;
        }
        return this;
    }
}