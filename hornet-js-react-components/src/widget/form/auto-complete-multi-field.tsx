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
import * as React from "react";
import { HornetBasicFormFieldProps, HornetClickableProps, HornetWrittableProps } from "src/widget/form/abstract-field";

import { AutoCompleteField, AutoCompleteFieldProps } from "src/widget/form/auto-complete-field";
import { AutoCompleteSelector } from "src/widget/form/auto-complete-selector";
import * as _ from "lodash";
import {
    HornetComponentChoicesProps
} from "hornet-js-components/src/component/ihornet-component";
import { HornetComponentDatasourceProps } from "src/widget/component/hornet-component";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";

import { AutoCompleteState } from "src/widget/form/auto-complete-state";
import FormEvent = __React.FormEvent;
import HTMLAttributes = __React.HTMLAttributes;
import ComponentClass = __React.ComponentClass;


const logger = Utils.getLogger("hornet-js-react-components.widget.form.auto-complete-multi-field");


/**
 * Propriétés du composant d'auto-complétion
 */
export interface AutoCompleteMultiFieldProps extends HornetWrittableProps,
    HornetClickableProps,
    HornetBasicFormFieldProps,
    HornetComponentDatasourceProps,
    HornetComponentChoicesProps {
    name: string;
    /** Longueur minimale de texte libre permettant la proposition des choix */
    minValueLength?: number;
    /** Nombre maximum de choix à proposer */
    maxElements?: number;
    /** Délai minimal en millisecondes entre deux déclenchements de l'action de chargement de choix */
    delay?: number;
    /** Hauteur maximum de la popin de choix à proposer (en pixels) */
    maxHeight?: number;
    /** Lance un init sur le datasource à l'initialisation du composant */
    init?: boolean;

    autoCompleteState?: AutoCompleteState;
    /* définit si l'autocomplete est editable ou non*/
    writable?: boolean;
    /*message qui s'affiche lors de la selection des items **/
    itemSelectedLabel?: string;
    /** force de nettoyage de la zone de saisie sur la sortie du champ **/
    cleanFilterOnBlur?: boolean
    /** surcharge du label lors qu'on a pas de resultat **/
    noResultLabel?: String;
}

/**
 * Composant d'auto-complétion  a choix multiple.
 */
export class AutoCompleteMultiField<P extends AutoCompleteMultiFieldProps, S> extends AutoCompleteField<AutoCompleteMultiFieldProps> {

    public readonly props: Readonly<AutoCompleteMultiFieldProps>;

    protected autocompleteContainer: HTMLDivElement;

    constructor(props: P, context?: any) {
        super(props, context);
        this.state.itemSelectedLabel = "";
        this.state.multiple = true
    }

    /**
     * @inheritDoc
     * @param {AutoCompleteFieldProps} nextProps
     * @param nextState
     * @param nextContext
     */
    componentWillUpdate(nextProps: AutoCompleteFieldProps, nextState: any, nextContext: any): void {
        super.componentWillUpdate(nextProps, nextState, nextContext)
        if (this.state.delay != nextState.delay) {
            /* Le délai d'appel de l'action a changé : on doit donc refaire ici l'encaspulation avec _.throttle */
            this._throttledTriggerAction = _.throttle(this.triggerAction, nextState.delay);
        }
    }

    /**
     * @inheritDoc AutoCompleteField
     */
    componentDidMount() {
        super.componentDidMount();
        if (this.textInput && this.textInput.placeholder == "") {
            this.textInput.placeholder = this.state.itemSelectedLabel.replace('{count}', 0) || this.i18n("form.autoCompleteField.selectedItem", { "count": 0 });
        }
    }

    /**
     * ferme la liste de choix de l'autocomplete lors d'un clic en dehors
     */
    eventClickListener(): void {
        let focus = document.activeElement;
        let container = this.autocompleteContainer;
        if (container && focus && focus != container) {
            if (!container.contains(focus)) {
                this.hideChoices();
            }
        }
    }

    /**
     * Génère le rendu spécifique du champ
     * @returns {any}
     */
    renderWidget(): JSX.Element {
        logger.trace("auto-complete multiple render");
        let shouldShow: boolean = this.shouldShowChoices();

        let hasError = this.hasErrors() ? " has-error" : "";
        let className = " autocomplete-content" + hasError;
        if (this.state.className) {
            className += " " + this.state.className;
        }

        let htmlProps: HTMLAttributes<HTMLElement> = this.getHtmlProps();
        htmlProps = _.assign(htmlProps, {
            "onKeyDown": this.handleOnKeyDown,
            "onFocus": this.handleOnFocus,
            "onBlur": this.handleOnBlur,
            "onDoubleClick": this.handleOnFocus,
            "onClick": this.handleOnFocus,
            "onChange": this.handleChangeTextInput,
            "autoComplete": "off",
            "aria-autocomplete": "list",
            "aria-expanded": shouldShow,
            "aria-owns": this.state.ariaSelectorId,
            "aria-activedescendant": shouldShow ? this.state.ariaSelectorId + "_" + this.state.selectedIndex : undefined,
            "id": this.state.id ? this.state.id : this.getFreeTypingFieldName(),
            "type": "text",
            "name": this.getFreeTypingFieldName(),
            "className": className
        } as HTMLAttributes<HTMLElement>);

        let classNameContainer = "autocomplete-container";
        //if (this.getTotalSelectedItems() != 0 && this.state.listDefaultValue && this.state.listDefaultValue.length > 0) {
        if (this.getTotalSelectedItems() != 0 && this.textInput && this.textInput.value != "" && this.textInput.value.length > 0) {
            classNameContainer += " badge-autocomplete-selected-items-before"
        }
        /* Le champ caché contient l'identifiant de l'élément sélectionné. C'est cet identifiant qui est ensuite
         utilisé par les actions. */
        return (

            <div className={classNameContainer} data-badge={this.getTotalSelectedItems()}
                ref={(elt) => this.autocompleteContainer = elt}>
                <input type="hidden" name={this.getValueFieldName()} ref={this.registerHiddenInput}
                    data-multiple={true} />

                {/* Champ de saisie libre */}
                <input {...htmlProps}
                    ref={this.registerTextInput}
                    data-multiple={true}
                    readOnly={!this.props.writable || this.state.readOnly}
                    data-writable={this.props.writable}
                    />

                <AutoCompleteSelector
                    ref="selector"
                    choices={this.state.choices}
                    onOptionSelected={this.onListWidgetSelected}
                    selectorId={this.state.ariaSelectorId}
                    maxHeight={this.props.maxHeight}
                    showComponent={shouldShow}
                    isMultiple={true}
                    choicesSelected={this.state.listDefaultValue}
                    autoCompleteState={this.autoCompleteState}
                    disabled={this.state.disabled || this.state.readOnly}
                    noResultLabel={this.state.noResultLabel}
                    />
            </div>
        );
    }

    /**
     * navigation dans les choix
     * @param {number} delta
     */
    protected navigateInChoices(delta: number) {

        let newIndex: number = this.state.selectedIndex === null ? (delta === 1 ? 0 : delta) : this.state.selectedIndex + delta;
        let choicesLength: number = this.state.choices ? this.state.choices.length : 0;

        if (newIndex < 0) {
            //On va à la fin
            newIndex += choicesLength;
        } else if (newIndex >= choicesLength) {
            //On retourne au début
            newIndex = 0;
        }

        //on sélectionne le choix sur lequel on se trouve
        this.setState({ selectedIndex: newIndex }, () => {
            this.selectCurrentIndex();
            this.autoCompleteState.setFocusOn(this.state.selectedIndex, this.hiddenInput.value, newIndex);

        });

        // On s'assure de l'affichage de la liste déroulante
        if (this.state.shouldShowChoices) {
            this.showChoices();
        };
    }

    /**
     * Fonction appelée lors d'un appui de touche sur le champ de saisie libre
     * @param e évènement
     * @protected
     */
    protected handleOnKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        /* L'attribut DOM onKeyDown est éventuellement aussi renseigné sur le composant auto-complete */
        if (this.state.onKeyDown) {
            this.state.onKeyDown(event);
        }

        let key: number = e.keyCode;
        let shouldShow: boolean = this.state.shouldShowChoices === true;

        if (key == KeyCodes.DOWN_ARROW) {
            if (this.isValidText(this.textInput.value)) {
                if (e.altKey) {
                    this.handleOnFocus(e);
                } else {
                    this.navigateInChoices(1);
                }
            } else {
                if (e.altKey) {
                    this.handleOnFocus(e);
                } else {
                    this.navigateInChoices(1);
                }
            }
            e.preventDefault();
        } else if (key == KeyCodes.UP_ARROW) {
            if (e.altKey) {
                this.hideChoices();
            } else {
                this.navigateInChoices(-1);
            }
            e.preventDefault();
        } else if (key == KeyCodes.ESCAPE) {
            this.hideChoices();
            e.preventDefault();
        } else if (e.keyCode == KeyCodes.SPACEBAR && !this.state.writable) {

            if (shouldShow && !this.state.readOnly && !this.state.disabled) {
                let indexSelected: number = this.autoCompleteState.choiceFocused;
                let listDefaultValue: number[] = (this.state.listDefaultValue) ? _.cloneDeep(this.state.listDefaultValue) : [];
                let itemSelected;

                this.state.choices.map((item, index) => {
                    if (indexSelected === index) {
                        itemSelected = item;
                    }
                });

                if (itemSelected) {
                    this.computeCurrentValues(itemSelected.value);
                }
            }
            e.preventDefault();
        } else if (e.keyCode == KeyCodes.ENTER && this.state.writable) {
            if (shouldShow && !this.state.readOnly && !this.state.disabled) {
                let indexSelected: number = this.autoCompleteState.choiceFocused;
                let listDefaultValue: number[] = (this.state.listDefaultValue) ? _.cloneDeep(this.state.listDefaultValue) : [];
                let itemSelected;

                this.state.choices.map((item, index) => {
                    if (indexSelected === index) {
                        itemSelected = item;
                    }
                });

                if (itemSelected) {
                    this.computeCurrentValues(itemSelected.value);
                }
            } else if (!shouldShow) {
                this.showChoices();
            }
            e.preventDefault();
        } else if (key == KeyCodes.TAB) {
            this.selectCurrentIndex();
            this.hideChoices();
        } else if (key == KeyCodes.HOME) {
            if (shouldShow) {
                this.state.selectedIndex = null;
                this.navigateInChoices(1);
            } else {
                this.state.selectedIndex = 0;
                this.selectCurrentIndex();
                this.hideChoices();
            }
            e.preventDefault();
        } else if (key == KeyCodes.END) {
            if (shouldShow) {
                this.state.selectedIndex = null;
                this.navigateInChoices(-1);
            } else {
                this.state.selectedIndex = this.state.choices.length - 1;
                this.selectCurrentIndex();
                this.hideChoices();
            }
            e.preventDefault();
        }

        // Action lorsqu'on appuie la touche controle
        if (e.ctrlKey) {
            if (e.keyCode == 65) {

                logger.trace(" Autocomplete multiple ctrl+A ");

                let listDefaultValue: string[] = (this.state.listDefaultValue && this.state.listDefaultValue instanceof Array) ? _.cloneDeep(this.state.listDefaultValue) : [];

                if (listDefaultValue.length == (this.refs.selector as AutoCompleteSelector).props.choices.length) {
                    listDefaultValue = [];
                    this.changeSelectedChoice();
                    this.setState({ listDefaultValue: [] });
                } else {

                    if (listDefaultValue.length < (this.refs.selector as AutoCompleteSelector).props.choices.length) {
                        listDefaultValue = [];
                    }

                    (this.refs.selector as AutoCompleteSelector).props.choices.map((item) => {
                        if (typeof (listDefaultValue.push) == "function") {
                            listDefaultValue.push(item.value);
                        }
                    });

                    this.setState({ listDefaultValue: listDefaultValue });
                    this.changeSelectedChoice();
                }
                this.setCurrentValue(listDefaultValue);
            }
        }
    }

    /**
     * Fonction déclenchée sur une modification du champ de saisie libre
     * @param event
     */
    protected handleChangeTextInput(event: FormEvent<HTMLElement>): void {

        logger.trace("auto-complete multiple handleChangeTextInput");

        /* L'attribut DOM onChange est éventuellement aussi renseigné sur le composant auto-complete */
        if (this.state.onChange) {
            this.state.onChange(event);
        }

        let newText: string = this.getCurrentText();

        if (this.refs.selector) {
            (this.refs.selector as AutoCompleteSelector).setCurrentTypedText(newText);
        }
        /* Le texte a changé donc on réinitialise la valeur */
        this.resetSelectedValue();

        if (this.isValidText(newText)) {
            logger.trace("auto-complete : prise en compte du texte saisi : ", newText);
            this._throttledTriggerAction(newText);
        } else {
            this.hideChoices();
        }

        if (this.state.choices[ 0 ] && this.state.choices.length === 1 && _.deburr(newText).toLowerCase() == _.deburr(this.state.choices[ 0 ].text).toLowerCase()) {
            this.changeSelectedChoice();
        }
        if (newText.length == 0) {
            this.setChoices(this.state.allChoices, () => { //setState
                if (this.state.allChoices.length > 0) {
                    this.showChoices();
                }
            });
        } else {
            this.forceUpdate();
        }
    }

    /**
     * créer la liste des values
     * @param value
     */
    computeCurrentValues(value: any): this {
        let res;
        if ((value as any) instanceof Array) {
            res = value;
        } else {
            let listDefaultValue: string[] = (this.state.listDefaultValue && this.state.listDefaultValue instanceof Array) ? _.cloneDeep(this.state.listDefaultValue) : [];
            if (value) {
                let index = listDefaultValue.indexOf(value);
                if (index !== -1) {
                    listDefaultValue.splice(index, 1);
                } else {
                    listDefaultValue.push(value);
                }
            } else {
                listDefaultValue = [];
            }
            res = listDefaultValue;
        }
        this.setState({ listDefaultValue: res });
        return this.setCurrentValue(res);
    }

    /**
     * set la value
     * @param value
     */
    setCurrentValue(value: any): this {
        super.setCurrentValue(value);
        if (this.textInput) {
            this.textInput.placeholder = this.state.itemSelectedLabel.replace('{count}', value ? value.length : 0) || this.i18n("form.autoCompleteField.selectedItem", { "count": value ? value.length : 0 });
        }
        this.changeSelectedChoice();

        if (value) {
            this.props.dataSource.select(value);
        } else {
            this.props.dataSource.selectClean(true)
        }

        return this;
    }

    /**
     * @inheritDoc
     * Fonction appelée lorsque l'utilisateur a choisi un élément de la liste de choix pour nettoyer le currentText du selector
     * Ici on diffère du normal, car cette gestion est propre à ce dernier.
     */
    public changeSelectedChoice(choice?: any) {
        if (this.refs.selector) {
            (this.refs.selector as AutoCompleteSelector).setCurrentTypedText("");
        }
    }

    /**
     * ajout d'un listener sur les clic
     */
    public showChoices(): void {
        if (this.state.shouldShowChoices !== true && this.state.focused) {
            if (this.isValidText(this.textInput.value) || this.textInput.value.length == 0 || !this.props.writable || this.state.readOnly || this.state.disabled) {
                this.setState({ shouldShowChoices: true }, () => {
                    window.addEventListener("click", this.eventClickListener);
                });
            }
        }

    }

    /**
     * suppression du listener sur les clic
     */
    public hideChoices(): void {
        if (this.state.shouldShowChoices !== false) {
            this.setState({ shouldShowChoices: false }, () => {
                window.removeEventListener("click", this.eventClickListener);
            });
        }
    }

    /**
     * Gestion de l'évènement onFocus pour le champ de saisie libre.
     * @param event
     */
    protected handleOnFocus(event: any): void {

        if (this.state.onSelected) {
            this.hideChoices();
        }
        this.typedValueOnFocus = this.getCurrentText();
        this.state.focused = true;

        this.showChoices();
        /* L'attribut DOM onBlur est éventuellement aussi renseigné sur le composant auto-complete */
        if (this.state.onFocus) {
            this.state.onFocus(event);
        }

        if (this.state.allChoices) {
            if (this.isValidText(this.typedValueOnFocus)) {
                logger.trace("auto-complete : prise en compte du texte présent au focus : ", this.typedValueOnFocus);
                this._throttledTriggerAction(this.typedValueOnFocus);
                this.changeSelectedChoiceWhenOneChoice(this.typedValueOnFocus);
            } else {

                this.setChoices(this.state.allChoices, () => { //setState
                    if (this.state.allChoices.length > 0) {
                        this.showChoices();
                    }
                });
            }
        } else {
            this.showChoices();
        }
        if (!this.hiddenInput || this.hiddenInput.value.length == 0) {
            this.clearFilterData();
        } else {
            this.autoCompleteState.setFocusOn(this.state.selectedIndex, this.hiddenInput.value, null);
        }
    }

    /**
     * Fonction déclenchée lorsque le champ de saisie libre perd le focus
     * @param event
     */
    protected handleOnBlur(event: React.FocusEvent<HTMLElement>): void {
        if (this.state.onSelected) {
            this.state.onSelected = false;
        } else {
            this.state.focused = false;
            /* L'attribut DOM onBlur est éventuellement aussi renseigné sur ce composant auto-complete */
            if (this.state.onBlur) {
                this.state.onBlur(event);
            }

            let currentText = this.getCurrentText();
            if (this.state.allChoices) {
                this.state.allChoices.filter((choice: any) => {
                    let res = false;
                    if (!choice.text) {
                        res = choice.text.toLowerCase() === currentText.toLowerCase()
                    }
                    return res;
                });
            }
            this.hideChoices();
            this.isUpdated = false;
        }

        if (this.getTotalSelectedItems() == 0 || this.props.cleanFilterOnBlur) {
            //supprime la saisie pour voir le placeholder et reinitialisation du selecteur,
            // equivalent this.resetSelectedText(), mais ne provoque pas de nouveau rendu
            this.textInput.value = "";
            (this.refs.selector as AutoCompleteSelector).state.currentTypedText = "";
        }

        /* if (this.refs.selector) {
             (this.refs.selector as AutoCompleteSelector).state.currentTypedText = "";
         }
         let value = this.state.listDefaultValue;
         if (this.textInput) {
             this.textInput.placeholder = this.state.itemSelectedLabel.replace('{count}', value ? value.length : "") || this.i18n("form.autoCompleteField.selectedItem", {"count": value ? value.length : ""});
         }*/

    }

    /**
     * Fonction appelée lorsque l'utilisateur clique sur un item de la liste des valeurs possibles
     * @param event
     */
    protected getTotalSelectedItems(): number {
        return this.state.currentValue ? this.state.currentValue.length : 0;
    }

    /**
     * Fonction appelée lorsque l'utilisateur clique sur un item de la liste des valeurs possibles
     * @param event
     */
    protected onListWidgetSelected(event: __React.MouseEvent<HTMLElement>): void {
        logger.trace("Selection Multiple click");
        let selectedValue = event.currentTarget[ "getAttribute" ]("data-real-value");
        if (event.target !== event.currentTarget) {
            this.state.onSelected = true;
        }
        this.computeCurrentValues(selectedValue);
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

    }

}