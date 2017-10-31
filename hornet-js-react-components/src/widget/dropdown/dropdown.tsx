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
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { DropdownItem } from "src/widget/dropdown/dropdown-item";
import { Picto } from "src/img/picto";
import * as classNames from "classnames";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import EventHandler = __React.EventHandler;


export enum Position {
    BOTTOMLEFT = 0,
    BOTTOMRIGHT = 1,
    TOPLEFT = 2,
    TOPRIGHT = 3

}

/**
 * Propriétés Dropdown
 */
export interface DropdownProps extends HornetComponentProps {

    id: string;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
    className?: string;
    label?: string;
    /** className facultatif à appliquer au label */
    labelClassName?: string;
    disabled?: boolean;
    icon?: string;
    items?: any;
    valueCurrent?: number;
    ariaLabel?: string;
    /** parametre pour afficher le dropdown qui prendre en valeur un enum Position (ci-dessus) */
    position?: Position;
    /** Option qui affiche ou non la petite fleche pour la box dropdown */
    drawArrow?: boolean;
    /** boolean qui cache ou non le dropdown apres le click sur un item */
    closeClick?: boolean;
    title?: string;
}

/**
 * Composant Dropdown
 */
export class Dropdown extends HornetComponent<DropdownProps, any> {

    static defaultProps = {
        disabled: false,
        position: Position.BOTTOMRIGHT,
        drawArrow: true,
        closeClick: true
    };
    /** bouton du dropdown */
    button: any;
    /** Liste des items du dropdown */
    items = [];
    dropDown: any;
    /** Tableau pour matcher Enum avec className */
    lstPosition = ["position-bottom-left", "position-bottom-right", "position-top-left", "position-top-right"];
    boxStyle: any;
    arrowStyle: any;

    constructor(props, context?: any) {
        super(props, context);
        this.state.isActive = false;
    }

    componentDidUpdate() {
        // when the component is updated
        // make sure you remove the listener on document
        // and the component panel is not expand
        if (typeof document !== undefined && !this.state.isActive) {
            document.removeEventListener("click", this.handleExpandOutside, false);
        }
        // add event listener for clicks on document
        // when state is expand
        else if (typeof document !== undefined && this.state.isActive) {
            document.addEventListener("click", this.handleExpandOutside, false);
        }
    }

    componentDidMount() {
        this.calculPositionBox();
    }

    componentWillUpdate() {
        this.calculPositionBox();
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        let dropdownClasses: ClassDictionary = {
            "dropdown-container": true
        };

        if (this.state.className) {
            dropdownClasses[this.state.className] = true;
        }

        let img = null;
        if (typeof this.props.icon == "string") {
            img = <span className={"icon " + this.props.icon}/>;
        } else {
            img = this.props.icon;
        }

        let labelClass = this.props.labelClassName || "dropdown-label-span";

        return (
            <div id={this.state.id} title={this.state.title} className={classNames(dropdownClasses)}>
                <a
                    onClick={this.handleClick.bind(this)}
                    onKeyDown={this.handleKeyDownDropDown}
                    role="button"
                    aria-haspopup="true"
                    href="#"
                    tabIndex={0}
                    aria-label={this.props.ariaLabel}
                    ref={button => this.button = button}
                    className={`dropdown-button button-action`}
                    disabled={this.state.disabled}
                    aria-expanded={this.state.isActive ? "true" : "false"}
                >
                    <span
                        className={"label" + " " + labelClass}>{this.props.label ? this.props.label : this.props.valueCurrent}</span>
                    {img}
                </a>
                {this.renderDropDown()}
            </div>
        );
    }

    /**
     * Rendu type Dropdown
     * @returns {any}
     * @private
     */
    renderDropDown(): JSX.Element {
        let items;
        const buildItem = (item, index) => {
            return <DropdownItem
                label={item.label}
                action={item.action}
                url={item.url}
                className={item.className}
                srcImg={item.srcImg}
                key={`dropdown-${this.props.id}-${index}`}
                handleKeyDown={this.handleKeyDownDropDownItem}
                getRef={item => this.items.push(item)}
                disabled={item.disabled}
                valueCurrent={item.valueCurrent}
            />;
        };

        if (this.state.items && this.state.items.length > 0) {
            items = this.state.items.map((item, index) => buildItem(item, index));
        } else if (this.state.children && this.state.children.length > 0) {

            items = [];
            this.state.children.map((item, index) => {
                items.push(React.cloneElement(item, {
                    key: `li-dropdown-${this.props.id}-${index}`,
                    onKeyDown: this.handleKeyDownDropDownItem,
                    ref: item => this.items.push(item)
                }));
            });
        }

        let dropDownClasses: ClassDictionary = {
            "dropdown-content": true,
            "dropdown-content-hidden": !this.state.isActive
        };
        let classStyle = this.lstPosition[this.props.position];
        let position = (this.props.drawArrow) ? classStyle : "";

        return (
            <div id={this.state.id + "content"} className={classStyle + " " + classNames(dropDownClasses)}
                 style={this.boxStyle}>
                <ul
                    className={"dropdown-list " + position}
                    ref={dropDown => this.dropDown = dropDown}
                    role="list"
                    aria-expanded={this.state.isActive}
                >
                    <span style={this.arrowStyle} className={"arrow " + position}/>
                    {items}
                </ul>
            </div>);
    }


    calculPositionBox() {
        let valRightArrow = 0, valLeftBox = 0, valLeftArrow = 0;
        let widthIcon = this.button.getElementsByClassName("icon")[0].getBoundingClientRect().width;
        let widthLabel = this.button.getElementsByClassName("label")[0].getBoundingClientRect().width;
        switch (this.props.position) {

            case Position.BOTTOMRIGHT:
            case Position.TOPRIGHT:
                /* 5px decalement de la box -0.5em // -5px suppression de la moitié de la fleche*/
                valRightArrow = (widthIcon / 2) + 5;
                this.arrowStyle = {
                    right: valRightArrow + "px"
                };
                break;
            case Position.TOPLEFT:
            case Position.BOTTOMLEFT:
                if (this.props.valueCurrent) {
                    valLeftBox = widthLabel;
                }
                valLeftArrow = (widthIcon / 2);
                this.arrowStyle = {
                    left: valLeftArrow + "px"
                };
                this.boxStyle = {
                    left: valLeftBox + "px"
                };
                break;
        }
    }

    /* Evenement sur le onClick */
    handleClick() {
        /* on ferme que si on a le droit ( par defaut oui ) */
        if (this.state.isActive && this.state.closeClick) {
            this.closePanel();
        } else if (!this.state.isActive) { /* sinon on ouvre que si c'est fermé */
            this.openPanel();
        }
    }

    /**
     * ouvre le dropdown et focus le premier enfant
     */
    openPanel() {
        this.setState({isActive: true}, () => {
            this.dropDown.firstElementChild.nextElementSibling.firstElementChild.focus();
        });
    }

    /**
     * ferme le dropdown et focus le bouton parent
     */
    closePanel() {
        this.setState({isActive: false}, () => {
            this.button.focus();
        });
    }

    /**
     * Gère les événements clavier sur le dropdown
     * @param e Event
     */
    handleKeyDownDropDown = (e) => {
        switch (e.keyCode) {
            // la touche echappe ferm le panneau
            case KeyCodes.ESCAPE:
                this.handleClick();
                break;

            // la barre d'espace ouvre ou ferme le
            // panneau suivant son état
            case KeyCodes.SPACEBAR:
                e.preventDefault();
                if (!this.state.isActive) {
                    this.handleClick();
                }
                break;

            default:
                break;
        }
    };

    /**
     * Gère les événements clavier sur un item du dropdown
     *
     * @param e Event
     * @param action Function
     * @param url String
     */
    handleKeyDownDropDownItem = (e, action, url) => {
        // current event
        let item;

        switch (e.keyCode) {
            // la touche echappe ferme le panneau
            case KeyCodes.ESCAPE:
                this.closePanel();
                break;

            // la barre d'espace execute l'action
            // portée par l'item et ferme le
            // panneau
            case KeyCodes.SPACEBAR:
                e.preventDefault();
                if (this.state.isActive) {
                    if (typeof action != "undefined") action();
                    else if (url != "undefined") window.location.href = url;
                    this.handleClick();
                }
                break;

            case KeyCodes.UP_ARROW:
                e.preventDefault();
                if ((e.currentTarget as any).parentNode.previousElementSibling) {
                    item = (e.currentTarget as any).parentNode.previousElementSibling.firstElementChild;
                    if (item) item.focus();
                }
                break;
            case KeyCodes.TAB:
                if (e.shiftKey) { /** SHIFT+TAB */
                    if ((e.currentTarget as any).parentNode.previousElementSibling.nodeName != "LI") {
                        this.closePanel();
                    }
                }
                else { /** TAB */
                    if (!(e.currentTarget as any).parentNode.nextElementSibling) {
                        this.closePanel();
                    }
                }
                break;
            case KeyCodes.DOWN_ARROW:
                e.preventDefault();
                if ((e.currentTarget as any).parentNode.nextElementSibling) {
                    item = (e.currentTarget as any).parentNode.nextElementSibling.firstElementChild;
                    if (item) item.focus();
                }
                break;
            default:
                break;
        }
    };

    /**
     * Ferme la liste lorsque le clic est en dehors de la div
     * @param e Event
     */
    handleExpandOutside(e) {
        e.stopPropagation();
        if (document.getElementById(this.state.id + "content") != null) {
            if (!document.getElementById(this.state.id + "content").contains(e.target)) {
                // the click was outside your component, so handle closing here
                this.setState({isActive: false});
            } else {
                this.handleClick();
            }
        }
    }
}
