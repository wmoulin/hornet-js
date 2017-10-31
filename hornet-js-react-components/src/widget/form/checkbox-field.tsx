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

import {
    AbstractField,
    HornetBasicFormFieldProps,
    HornetClickableProps,
    InlineStyle
} from "src/widget/form/abstract-field";
import * as _ from "lodash";
import * as classNames from "classnames";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";


export interface CheckBoxFieldProps extends HornetClickableProps,
    HornetBasicFormFieldProps {
    /* Valeur booléenne pour un champ de type case à cocher */
    currentChecked?: boolean;
    /*Le champs est un switch*/
    switch?: boolean;
    /*Label du champ si celui-ci est un switch. format : {on:"", off:""}*/
    labelOnOff?: any;
}

/**
 * Champ de formulaire Hornet de type Checkbox
 */
export class CheckBoxField extends AbstractField<CheckBoxFieldProps, any> {

    public readonly props:Readonly<CheckBoxFieldProps>;
    public state: any;

    static defaultProps = _.assign(AbstractField.defaultProps, {
        switch: false
    });

    constructor(props?: CheckBoxFieldProps, context?: any) {
        super(props, context);


        if (props.readOnly) {
            // permet de désactiver le click lorsqu'uniquement readOnly par défaut
            this.copyInitialPropsToState({readOnly: true, disabled: true} as any, this.state);
        }

        if (!this.props.labelOnOff) {
            this.state.labelOnOff = {
                "on": this.i18n("form.checkbox.booleanOui"),
                "off": this.i18n("form.checkbox.booleanNon")
            };
        }
    }

    /**
     * Génère le rendu spécifique du champ
     * @returns {any}
     * @override
     */
    renderWidget(): JSX.Element {

        let cx = classNames(
            this.state.groupClass,
            "checkbox-container",
            {
                "inline": this.state.inline == InlineStyle.ALL || this.state.inline == InlineStyle.FIELD,
                "readonly": this.state.readOnly
            }
        );

        let htmlProps = this.getHtmlProps();
        if (this.state.currentChecked != null) {
            _.assign(htmlProps, {"defaultChecked": this.state.currentChecked});
        }

        if(this.state.readOnly && !this.state.disabled) {
            htmlProps.disabled = true;
        }

        let element: JSX.Element;
        if (this.state.readOnly) {
            delete htmlProps["onChange"];
        }
        if (this.state.switch) {
            element = this.renderSwitch(htmlProps);
        } else {
            element = this.renderCheckbox(htmlProps);
        }

        return (
            <section className={cx}>
                {element}
            </section>
        );
    }

    /**
     * Génère le rendu du champ en mode switch
     * @returns {any}
     */
    renderSwitch(htmlProps): JSX.Element {
        let labelOn = this.state.labelOnOff.on;
        let labelOff = this.state.labelOnOff.off;
        return (
            <div className="switch-content">
                <label className="switch" onKeyDown={this.handleKeyDown}>
                    <input ref={(elt) => this.registerHtmlElement(elt)} type="checkbox"
                           className="switch-input" {...htmlProps} value="true"/>
                    <span data-off={labelOff} data-on={labelOn} className="switch-label"></span>
                    <span className="switch-handle"></span>
                </label>
            </div>
        );
    }

    /**
     * Génère le rendu du champ en mode checkbox
     * @returns {any}
     */
    renderCheckbox(htmlProps): JSX.Element {

        let classNamesSpan: ClassDictionary = {
            check: true,
            readonly: this.state.readOnly
        };

        return (
            <div className="checkbox-container">
                <label className="checkbox-content" onKeyDown={this.handleKeyDown}>
                    <input ref={(elt) => this.registerHtmlElement(elt)} type="checkbox"  {...htmlProps} value="true"/>
                    <span className="checkbox-material">
                        <span className={classNames(classNamesSpan)}></span>
                    </span>
                </label>
            </div>
        );
    }

    /**
     * prise en compte de la navigation clavier pour les touches entrée et espace
     * @param e
     */
    private handleKeyDown(e) {
        if (e.keyCode == KeyCodes.ENTER) {
            this.setCurrentChecked(!this.getCurrentValue());
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
