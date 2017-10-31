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

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as React from "react";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { DomAdapter } from "src/widget/form/dom-adapter";
import * as _ from "lodash";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.form");

export interface AbstractFormProps extends HornetComponentProps {
    /** Indique que les champs enfants sont en lecture seule */
    readOnly?: boolean;

    /** Indique que les champs enfatns sont désactivés */
    disabled?: boolean;
}


/**
 * Composant permettant de rendre un formulaire Hornet de manière standardisée
 */
export abstract class AbstractForm<P extends AbstractFormProps, S> extends HornetComponent<P, any> {

    /** Référence vers le formulaire HTML */
    protected formElement: HTMLFormElement;
    protected fieldSetElement: HTMLFieldSetElement;

    /** Valeur de propriétés par défaut */
    static defaultProps: any = {
        readOnly: false,
        disabled: false
    };

    constructor(props?: P, context?: any) {
        super(props, context);
    }

    setReadOnly(value: boolean, callback?: () => any): this {
        this.setState({readOnly: value}, callback);
        /* Propage la propriété à tous les champs du groupe */
        this.updateReadOnlyFields(value);
        return this;
    }

    setDisabled(value: boolean, callback?: () => any): this {
        this.setState({disabled: value}, callback);
        /* Propage la propriété à tous les champs du groupe */
        this.updateDisabledFields(value);
        return this;
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.propagateParentState();
    }

    registerForm(formInstance: React.ReactInstance): void {
        this.formElement = formInstance as HTMLFormElement;
        if (this.formElement) {
            this.formElement["__component"] = this;
        }
    }

    registerFieldSet(fieldSetInstance: React.ReactInstance): void {
        this.fieldSetElement = fieldSetInstance as HTMLFieldSetElement;
        if (this.fieldSetElement) {
            this.fieldSetElement["__component"] = this;
        }
    }

    /**
     * Met à jour la propriété readOnly sur chacun des champs enfants
     * @param isReadOnly valeur à assigner à la propriété 'readOnly'
     * @return cet objet
     */
    private updateReadOnlyFields(isReadOnly: boolean): this {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            if (field.props && field.props.writable && !isReadOnly) {
                if (field.setState && (field && (field as any).mounted)) {
                    field.setState({readOnly: isReadOnly});
                } else {
                    field.setReadOnly(isReadOnly);
                }
            } else if (field.getAttribute("data-writable") !== "false") {
                field.setReadOnly(isReadOnly);
            } else {
                field.setReadOnly(true);
            }
            return true;
        });
        return this;
    }

    /**
     * Met à jour la propriété disabled sur chacun des champs enfants
     * @param isDisabled valeur à assigner à la propriété 'disabled'
     * @return cet objet
     */
    private updateDisabledFields(isDisabled: boolean): this {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            // if (field instanceof AbstractField) {
            if (field.setState && (field && (field as any).mounted)) {
                field.setState({disabled: isDisabled});
            } else {
                field.setDisabled(isDisabled);
            }
            // }
            return true;
        });
        return this;
    }

    /**
     * Propage les propriétés devant être transmises aux champs enfants
     */
    protected propagateParentState(): void {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            if (this.state.readOnly == true) {
                field.setReadOnly(this.state.readOnly);
            }
            if (this.state.disabled == true) {
                field.setDisabled(this.state.disabled);
            }
            return true;
        }, this);
    }

    /**
     * @returns {{}} un object associant les noms de champ aux composants HTML ou React correspondants
     */
    protected abstract extractFields(): { [key: string]: DomAdapter<any, any> };

    /**
     * Extrait les données du formulaire
     * @param removeEmptyStrings indique si les champs ayant pour valeur une chaîne de caractères vide ne doivent pas
     * être présents dans l'objet résultat.
     * @returns {Object}
     */
    extractData(removeEmptyStrings: boolean = true): Object {
        let data: Object = {};
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        for (let name in fields) {
            let value: any = fields[name].getCurrentValue();
            if (value != "" || !removeEmptyStrings) {
                _.set(data, name, value);
            } else {
                /* Le champ est vide : si son nom correspond à une arborescence d'objets, on s'assure tout de même
                que l'objet parent existe */
                let lastDotIndex = name.lastIndexOf(".");
                if (lastDotIndex > 0) {
                    let parentPath: string = name.substring(0, lastDotIndex);
                    if (_.get(data, parentPath) == null) {
                        _.set(data, parentPath, {});
                    }
                }
            }
        }
        return data;
    }
}