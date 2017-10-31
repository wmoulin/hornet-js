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
import {
    AbstractField,
    HornetClickableProps,
    HornetBasicFormFieldProps,
    InlineStyle
} from "src/widget/form/abstract-field";
import * as _ from "lodash";
import {
    HornetComponentChoicesProps
} from "hornet-js-components/src/component/ihornet-component";
import { HornetComponentDatasourceProps } from "src/widget/component/hornet-component";
import { IHornetComponentDatasource } from "hornet-js-components/src/component/ihornet-component";
import * as classNames from "classnames";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";

import { AbstractFieldDatasource } from "src/widget/form/abstract-field-datasource";
const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.radios-field");

/**
 * Propriétés d'un champ de formulaire de type groupe de boutons radios
 */
export interface RadiosFieldProps extends HornetClickableProps,
    HornetBasicFormFieldProps,
    HornetComponentDatasourceProps,
    HornetComponentChoicesProps {
    /* Valeur booléenne pour un champ de type case à cocher */
    currentChecked?: boolean;
    data?: any;
    name: string;
}

/**
 * Composant groupe de boutons radio
 */
export class RadiosField extends AbstractFieldDatasource<RadiosFieldProps, any> {

    public readonly props:Readonly<RadiosFieldProps>;

    static defaultProps = _.assign(_.cloneDeep(AbstractField.defaultProps), {
        labelClass: "blocLabelUp",
        valueKey: "value",
        labelKey: "label",
        inline: InlineStyle.NONE
    });

    constructor(props?: any, context?: any) {
        super(props, context);
        if (this.state.dataSource && this.state.data) {
            throw new Error("Le RadiosField " + this.state.name + " possède une props dataSource et une props data");
        }
    }

    public setData(value: any) {
        /** liste des choix disponibles */
        this.setState({data: value});
    }

    /**
     * enregistre la liste des choix possibles
     */
    protected setItem() {
        this.setState({items: this.props.dataSource.results});
        /* permet de faire appel a la méthode setCurrentValue de dom-adapter pour cocher les valeurs*/
        this.setCurrentValue(this.state.currentValue);
    }

    handleClick(event) {
        if (this.props.dataSource) {
            this.props.dataSource.select(event.nativeEvent.target.id);
        }
    }

    /**
     * Génère le rendu des radio boutons à partir d'un dataSource
     * @returns {any}
     */
    private renderRadioItemdataSource(): JSX.Element {
        if (this.state.items && this.state.items.length > 0) {
            return this.state.items.map(this.renderRadioItem);
        }
    }

    /**
     * Génère le rendu d'un radio bouton et son libellé
     * @param choice choix sélectionnable
     * @param id number position in array
     * @returns {any}
     */
    private renderRadioItem(choice: any, id: number): JSX.Element {
        // key in html props
        interface HtmlPropsInterface {
            name?: string;
            label?: string;
            lang?: string;
            id?: string;
            readOnly?: boolean;
            disabled?: boolean;
            dataSource?: DataSource<any>;
            type?: any;
            currentValue?: any;
            defaultChecked?: any;
            value?: any;
            data?: any;
        }

        /* On n'inclut pas les propriétés spécifiques ou celles dont on surcharge la valeur */
        let htmlProps: HtmlPropsInterface = _.omit(
            this.getHtmlProps(),
            [
                "dataSource",
                "type",
                "currentValue",
                "defaultChecked",
                "value",
                "id",
                "data"
            ]
        );

        if (this.state.currentChecked != null) {
            _.assign(htmlProps, {"defaultChecked": this.state.currentChecked});

        }

        if(this.state.readOnly && !this.state.disabled) {
            htmlProps.disabled = true;
        }

        let cx = classNames({
            "fl radio-inline": this.state.inline == InlineStyle.ALL || this.state.inline == InlineStyle.FIELD
        });

        let label = choice.label ?
            choice[this.state.labelKey] :
            choice[this.state.valueKey];

        let idInput = `${this.state.name}-${label}`;
        let key = `${idInput}-${choice.value}`;
        // positioning an input inside a label
        // see @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#Usage_notes
        return (
            <li key={key}
                className={cx}>
                <label className="radio-label"
                       title={label}
                       htmlFor={idInput}
                >
                    <input {...htmlProps}
                           ref={(elt) => this.registerHtmlElement(elt)}
                           type="radio"
                           onClick={this.handleClick}
                           value={choice[this.state.valueKey]}
                           id={idInput}
                    />
                    <span className="outer">
                    </span>
                    {label}
                </label>
            </li>
        );
    }

    /**
     * @override
     * Génère le rendu du libellé pour le champ
     * l'override permet de supprimer le for du label
     * @param fieldId identifiant du champ
     * @param fieldName nom du champ
     * @param label libellé à afficher
     * @param required indique si le champ est obligatoire
     * @returns {any}
     */
    renderLabel(fieldId: string, fieldName: string, label: string, required: boolean): JSX.Element {

        let hasData = this.state.data && this.state.data.length > 0;
        let hasDataSource = this.state.dataSource && this.state.dataSource.results && this.state.dataSource.results.length > 0;
        let id = "";
        if (hasData) {
            id = fieldId + "-" + this.state.data[0][this.state.labelKey];
        }

        if (hasDataSource) {
            id = fieldId + "-" + this.state.items[0][this.state.labelKey];
        }

        return super.renderLabel(id, fieldName, label, required);
    }

    /**
     * Génère le rendu spécifique du champ : un groupe de boutons radio correspondant au tableau choices
     * @returns {any}
     */
    renderWidget(): JSX.Element {
        let cx = classNames(
            "radio",
            {"flex-container": this.state.inline},
            {"inline": this.state.inline == RadiosField.Inline.ALL}
        );

        let hasData = this.state.data && this.state.data.length > 0;
        let hasDataSource = this.state.dataSource && this.state.dataSource.results && this.state.dataSource.results.length > 0;

        return (
            <ul className={cx}>
                {hasData ? this.state.data.map(this.renderRadioItem) : null}
                {hasDataSource ? this.renderRadioItemdataSource() : null}
                {!hasData && !hasDataSource ?
                    <input ref={(elt) => this.registerHtmlElement(elt)} type="hidden" name={this.state.name}
                           id={this.state.name}/> : null}
            </ul>
        );
    }
}
