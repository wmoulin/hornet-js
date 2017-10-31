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
import { Button, ButtonProps, ButtonState } from "src/widget/button/button";
import * as classNames from "classnames";
import * as _ from "lodash";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.action-button");

/**
 * Enumeration des types d'action
 */
export enum TypeAction {
    ACTION_MASSE = 1,
    ACTION_UNITAIRE = 2
}

export interface ActionButtonProps extends ButtonProps {
    srcImg?: JSX.Element | string;
    classNameImg?: string;
    typeAction?: TypeAction;
    messageAlert?: string;
    titleAlert?: string;
    action?: Function;
    showAlert?: Function;
    priority?: boolean;
    visible?: Function;
    selectedItems?: any;
    items?: any[];
    onKeyDown?: any;
    displayedWithoutResult?:boolean;
}

export interface ActionButtonState extends ButtonState {
    visible?: Boolean;
}

export class ActionButton<P extends ActionButtonProps, S extends ActionButtonState> extends Button<ActionButtonProps, ActionButtonState> {

    static defaultProps = _.assign(Button.defaultProps, {
        displayedWithoutResult: false
    });

    public state: S;
    public readonly props: Readonly<ActionButtonProps>;

    constructor(props?: ActionButtonProps, context?: any) {
        super(props, context);
        if (props.url) {
            this.state.url = this.genUrlWithParams(props.url, props.value);
        }

        this.state.visible = true;
        if (props.visible) {
            this.state.visible = props.visible(this.props.value);
        }
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render actionButtons");

        let classes: ClassDictionary = {};
        if (this.props.className) {
            classes[this.props.className] = true;
        }

        classes["picto-svg"] = true;
        classes["button-action"] = true;

        let img = null;
        if (typeof this.props.srcImg === "string") {
            img = <img
                src={this.props.srcImg}
                className={this.props.classNameImg}
                alt={this.props.title}/>;
        } else {
            img = this.props.srcImg;
        }

        let keyDownFunction = null;
        if(this.props.onKeyDown) {
            keyDownFunction = (e) => {
                this.props.onKeyDown(e, this.props.onClick || this.onClick)
            }
        }


        return (
            this.state.visible ?
                <a href={this.props.url || "#"}
                   className={classNames(classes)}
                   title={this.props.title}
                   aria-label={this.props.title}
                   onClick={this.props.onClick || this.onClick}
                   onKeyDown={keyDownFunction}
                   aria-haspopup={this.props.hasPopUp}
                >
                    {img}
                    <span className="label-button-action">{this.props.label}</span>
                </a>
                : null
        );
    }


    /**
     * Click sur le lien
     */
    onClick(e: React.MouseEvent<HTMLElement>): void {
        if (this.props.messageAlert) {
            e.stopPropagation();
            this.props.showAlert(this.props.messageAlert, this.props.titleAlert, this.onAction);
        } else {
            this.onAction();
        }
    }

    /**
     * action sur la confirmation
     */
    onAction(): void {
        if (this.state.url) {
            window.location.href = this.state.url;
        } else if (this.props.action) {
            this.props.action(this.props.value, this.props.selectedItems);
        }
    }
}
