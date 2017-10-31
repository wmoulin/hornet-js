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
import * as classNames from "classnames";
import * as _ from "lodash";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { CheckBox } from "src/widget/form/checkbox";
import { AutoCompleteState } from "src/widget/form/auto-complete-state";
import MouseEventHandler = __React.MouseEventHandler;
import CSSProperties = __React.CSSProperties;
import * as React from "react";

const logger = Utils.getLogger("hornet-js-react-components.widget.form.auto-complete-selector");

/**
 * Propriétés de la liste de choix pour le composant d'auto-complétion
 */
export interface AutoCompleteSelectorProps extends HornetComponentProps {
    choices?: Array<any>;
    onOptionSelected: MouseEventHandler<HTMLElement>;
    currentTypedText?: string;

    // todo: A supprimer suite à l'usage de AutompleteState ?!?
    currentIndex?: number;
    selectorId: string;
    showComponent?: boolean;
    maxHeight?: number;
    isMultiple?: boolean;
    choicesSelected?: string | string[];
    autoCompleteState: AutoCompleteState;
    readOnly?: boolean;
    disabled?: boolean;
    noResultLabel?: String;
}

/**
 * Liste de choix de l'auto completion
 */
export class AutoCompleteSelector extends HornetComponent<AutoCompleteSelectorProps, any> {

    static defaultProps = {
        onOptionSelected: function (event: __React.MouseEvent<HTMLElement>): void {
            event.preventDefault();
        },
        currentTypedText: "",
        showComponent: true,
        choices: [],
        readOnly: false,
        disabled: false
    };


    protected liElts: HTMLElement[];
    protected liReact: JSX.Element[];
    protected choicesSelected: string | string[];

    private noResultLabelDefault: string = AutoCompleteSelector.getI18n("form.autoCompleteField.noResultLabel");

    constructor(props, context?: any) {
        super(props, context);
        this.state.maxLengthItem = 0;
        this.props.autoCompleteState.on(AutoCompleteState.FOCUS_CHANGE_EVENT, this.handleFocus);
        this.liElts = [];
        this.liReact = [];
        this.choicesSelected = [];
    }
    shouldComponentUpdate(nextProps: AutoCompleteSelectorProps, nextState: any, nextContext: any) {
        super.componentWillUpdate(nextProps, nextState, nextContext);
        return true;
    }
    // Setters
    public setChoices(value: Array<any>, callback?: () => any): this {
        this.setState({ choices: value }, callback);
        return this;
    }

    public setOnOptionSelected(value: MouseEventHandler<HTMLElement>, callback?: () => any): this {
        this.setState({ onOptionSelected: value }, callback);
        return this;
    }

    setCurrentTypedText(currentTypedText: string, callback?: () => any): this {
        this.setState({ currentTypedText: currentTypedText }, callback);
        return this;
    }

    public setCurrentIndex(value: number, callback?: () => any): this {
        this.setState({ currentIndex: value }, callback);
        return this;
    }

    public setSelectorId(value: string, callback?: () => any): this {
        this.setState({ selectorId: value }, callback);
        return this;
    }


    public setShowComponent(value: string, callback?: () => any): this {
        this.setState({ showComponent: value }, callback);
        return this;
    }
    /**
     * Fonction appelée lors du click sur un élément de la liste
     **/
    private onListClick(event: __React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        this.state.onListClick = true;
        return this.state.onOptionSelected(event);
    }

    /**
     * Fonction appelée pour scroller de un item vers le bas
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    scrollDown(element: HTMLElement, checkedElement: HTMLElement) {
        element.scrollTop += ((checkedElement.offsetTop + checkedElement.offsetHeight) - ((element.scrollTop ? element.scrollTop : 5) + element.offsetHeight)) + 5;
    }

    /**
     * Fonction appelée pour scroller de un item vers le haut
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    scrollUp(element: HTMLElement, checkedElement: HTMLElement) {
        element.scrollTop -= (((element.scrollTop ? element.scrollTop : 5) - checkedElement.offsetTop + 5));
    }

    /**
     * Fonction appelée pour scroller au début de la liste
     * @param {HTMLElement} element la liste déroulante
     **/
    scrollToBegin(element: HTMLElement) {
        element.scrollTop = 0;
    }

    /**
     * Fonction appelée pour scroller à la toute fin de la liste
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    scrollToEnd(element: HTMLElement, checkedElement: HTMLElement) {
        element.scrollTop = element.offsetHeight - checkedElement.offsetHeight;
    }

    /**
     * Fonction appelée tester si la position de l'élément est en amont dans la liste
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    isBefore(element: HTMLElement, checkedElement: HTMLElement) {
        return (checkedElement.offsetTop < (element.scrollTop ? element.scrollTop : 5));
    }

    /**
     * Fonction appelée tester si la position de l'élément est en aval dans la liste
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    isAfter(element: HTMLElement, checkedElement: HTMLElement) {
        return (checkedElement.offsetTop + checkedElement.offsetHeight >= (element.scrollTop ? element.scrollTop : 5) + element.offsetHeight);
    }

    /**
     * Fonction appelée la taille  de l'écart
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    hasBigGap(element: HTMLElement, checkedElement: HTMLElement) {
        return Math.abs(checkedElement.offsetTop - (element.scrollTop ? element.scrollTop : 5)) > element.offsetHeight;
    }

    /**
     * Fonction appelée pour position la liste directement sur l'élément
     * @param {HTMLElement} element la liste déroulante
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    goToElement(element: HTMLElement, checkedElement: HTMLElement) {
        element.scrollTop = checkedElement.offsetTop - 5;
    }

    /**
     * Fonction appelée pour scroller vers un élément
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    scrollToElement(checkedElement: HTMLElement) {

        let element = document.getElementById(this.state.selectorId);
        if (this.isBefore(element, checkedElement)) {
            if (this.hasBigGap(element, checkedElement)) {
                this.goToElement(element, checkedElement)
            } else {
                this.scrollUp(element, checkedElement)
            }
        } else if (this.isAfter(element, checkedElement)) {
            if (this.hasBigGap(element, checkedElement)) {
                this.goToElement(element, checkedElement)
            } else {
                this.scrollDown(element, checkedElement)
            }
        }
        this.setActive(checkedElement);
    }

    /**
     * Fonction appelée pour déselectionner
     **/
    protected cleanActived() {
        let lastCheckedElement = document.querySelectorAll("#" + _.replace(this.state.selectorId, ".", "\\.") + " .autocomplete-item-active");
        if (lastCheckedElement) {
            _.forEach(lastCheckedElement, (item) => {
                item.className = "autocomplete-item";
            })
        }
    }

    /**
     * Fonction appelée pour activer un item
     * @param {HTMLElement} checkedElement l'élément sélectionné
     **/
    protected setActive(checkedElement: HTMLElement) {
        this.cleanActived();
        if (checkedElement) {
            checkedElement.focus();
            checkedElement.className = "autocomplete-item autocomplete-item-active";
        }
    }

    /**
     * Fonction appelée pour scroller vers un élément par son id
     * @param {string} id l'élément sélectionné
     **/
    scrollToElementById(id: string) {
        let checkedElement = document.getElementById(id);
        this.scrollToElement(checkedElement);
    }

    /**
     * Lorsque l'element selectionné change, on scroll vers celui-ci
     */
    componentDidUpdate() {
        this.cleanActived();
        let element = document.getElementById(this.state.selectorId);
        if (!this.state.onListClick) {
            if (this.state.autoCompleteState.choiceFocused !== undefined) {
                let idToScroll = this.state.selectorId + "_" + this.state.autoCompleteState.choiceFocused;
                let checkedElement = document.getElementById(idToScroll);
                this.setActive(checkedElement)
                if (checkedElement) {
                    checkedElement.className = "autocomplete-item autocomplete-item-active";
                    this.scrollToElement(checkedElement);
                }
            } else {
                element.scrollTop = 5;
            }
        }
        this.state.onListClick = false
    }


    /**
     * Retourne le rendu de la liste de choix
     **/
    private renderOptionList(): JSX.Element[] {
        logger.trace("render AutoCompleteSelector option list");
        let res: JSX.Element[] = [];

        if (this.state.choices) {
            this.state.choices.forEach((choice, indexTab) => {
                if (choice) {
                    let choiceTextFormatted: string = _.deburr(choice.text).toLowerCase();
                    let currentTextFormatted: string = _.deburr(this.state.currentTypedText).toLowerCase();
                    let index = choiceTextFormatted.indexOf(currentTextFormatted);
                    if (index === -1) {
                        if (currentTextFormatted != "") {
                            return null;
                        } else {
                            index = 0;
                        } // Valeur saisie non présente
                    }

                    let classes: ClassDictionary = {
                        "autocomplete-item": true,
                        //"autocomplete-item-active": this.props.autoCompleteState.choiceFocused === indexTab
                    };

                    let classList: string = classNames(classes);

                    res.push((
                        <li onMouseDown={!this.props.readOnly && !this.props.disabled ? this.onListClick : null}
                            id={this.state.selectorId + "_" + indexTab}
                            className={classList}
                            data-real-text={choice.text}
                            data-real-value={choice.value}
                            role="option"
                            key={"autocomplete-" + choice.text + "-" + choice.value}
                            ref={(liElt) => {
                                if (liElt != null) this.liElts.push(liElt);
                            }
                            }
                            >

                            {choice.text ? choice.text.substring(0, index) : ""}
                            <b>
                                {this.state.currentTypedText}
                            </b>
                            {choice.text ? choice.text.substring(index + this.state.currentTypedText.length) : ""}

                        </li>
                    ));
                }
            })
        }
        return res;
    }

    /**
     * indique un clic sur une checkbox
     **/
    multiClick() {
        this.state.onListClick = true;
    }


    /**
     * Retourne le rendu de la liste de choix
     **/
    private renderOptionMultipleList(): JSX.Element[] {

        logger.trace("render AutoCompleteSelector option multiple");
        let res: JSX.Element[] = [];
        if (this.state.choices) {
            this.state.choices.forEach((choice, indexTab) => {
                if (choice) {

                    let choiceTextFormatted: string = _.deburr(choice.text).toLowerCase();
                    let currentTextFormatted: string = _.deburr(this.state.currentTypedText).toLowerCase();

                    let index = choiceTextFormatted.indexOf(currentTextFormatted);
                    if (index === -1) return null; // Valeur saisie non présente

                    let classes: ClassDictionary = {
                        "autocomplete-item": true,
                        "autocomplete-item-active": this.props.autoCompleteState.choiceFocused === indexTab
                    };

                    let checkboxChecked: boolean = false;

                    if (_.indexOf(this.props.choicesSelected, choice.value) > -1) {
                        checkboxChecked = true;
                    }
                    let classList: string = classNames(classes);
                    res.push((
                        <li
                            onMouseDown={!this.props.readOnly && !this.props.disabled ? this.onListClick : null}
                            id={this.state.selectorId + "_" + indexTab}
                            className={classList}
                            data-real-text={choice.text}
                            data-real-value={choice.value}
                            role="option"
                            key={"autocomplete-" + choice.text + "-" + choice.value}
                            ref={(liElt) => {
                                if (liElt != null) this.liElts.push(liElt);
                            }
                            }
                            >
                            <CheckBox onMouseUp={this.multiClick} label={choice.text} onChange={() => { } } checked={checkboxChecked} readOnly={this.props.readOnly} disabled={this.props.disabled} />
                        </li>
                    ));
                }
            })
        }
        return res;
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render AutoCompleteSelector");
        this.liElts = [];
        this.liReact = (this.props.isMultiple) ? this.renderOptionMultipleList() : this.renderOptionList();

        // On construit le ul englobant
        let classes: ClassDictionary = {
            "autocomplete-selector": true,
            "widget-positioned": true,
            "autocomplete-selector-hidden": this.state.showComponent === false
        };
        let classList: string = classNames(classes);

        let styleUl: CSSProperties = {
            "minWidth": "100%",
            "maxHeight": this.props.maxHeight ? this.props.maxHeight + "px" : "none"
        };

        if (this.props.maxHeight) {
            styleUl.overflow = "auto"
        }

        let classesContent: ClassDictionary = {
            "autocomplete-content-selector": true
        };

        let no_result: JSX.Element = (
            <div style={{ fontStyle: "italic" }}>{this.state.noResultLabel ? this.state.noResultLabel : this.noResultLabelDefault}</div>
        )

        let classContentList: string = classNames(classesContent);
        return (
            <div className={classList}>
                <div className={classContentList}>
                    <ul className="autocomplete-selector-list" role="listbox" id={this.state.selectorId} style={styleUl}>
                        {this.liReact.length > 0 ? this.liReact : no_result}
                    </ul>
                </div>
            </div>
        );
    }

    /**
     * Fonction appelée pour scroller vers un élément
     * @param {number} oldChoiceFocused l'ancien indice de l'élément sélectionné
     * @param {number} newChoiceFocused l'indice de l'élément sélectionné
     * @param {string} value l'élément sélectionné
     * @param {number} index l'élément sélectionné
     **/
    handleFocus(oldChoiceFocused, newChoiceFocused, value: string, index: number) {
        if (value && value.length > 0) {
            let elmt = document.querySelector("#" + _.replace(this.state.selectorId, ".", "\\.") + " [data-real-value='" + value + "']");
            if (elmt) {
                this.scrollToElement(elmt as HTMLElement);
                let _index = _.findIndex(this.liElts, elmt);
                this.state.autoCompleteState.choiceFocused = _index;
                this.setFocusElement(elmt as HTMLElement);
            }
        } else {
            if (newChoiceFocused !== undefined && newChoiceFocused != null && newChoiceFocused >= 0 && this.liElts.length > 0) {
                let elmt = this.liElts[ newChoiceFocused ];
                if (elmt && this.props.isMultiple) {
                    this.setFocusElement(elmt);
                } else {
                    if (elmt && (elmt.getAttribute("data-real-value") === value)) {
                        this.setFocusElement(elmt);
                    }
                }
            } else {
                this.scrollToBegin(document.getElementById(this.state.selectorId));
            }
        }
    }

    /**
     * Fonction appelée pour focus un item
     * @param {HTMLElement} elmt l'élément sélectionné à focus
     **/
    setFocusElement(elmt: HTMLElement) {
        this.scrollToElement(elmt);
    }
}