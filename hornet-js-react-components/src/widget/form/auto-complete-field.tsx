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
import {
    AbstractField,
    HornetBasicFormFieldProps,
    HornetClickableProps,
    HornetWrittableProps
} from "src/widget/form/abstract-field";
import { AutoCompleteSelector } from "src/widget/form/auto-complete-selector";
import { FieldErrorProps } from "src/widget/form/field-error";
import * as _ from "lodash";
import {
    HornetComponentChoicesProps
} from "hornet-js-components/src/component/ihornet-component";
import { HornetComponentDatasourceProps } from "src/widget/component/hornet-component";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import { INotificationType } from "hornet-js-core/src/notification/notification-manager";
import { AutoCompleteState } from "src/widget/form/auto-complete-state";
import { DataSourceMaster } from "hornet-js-core/src/component/datasource/datasource-master";
import { AbstractFieldDatasource } from "src/widget/form/abstract-field-datasource";
import FormEvent = __React.FormEvent;
import HTMLAttributes = __React.HTMLAttributes;
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { Logger } from "hornet-js-utils/src/logger";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.auto-complete-field");


export enum FilterTextType {
    beginWith = 1,
    indexOf = 2
}

/**
 * Propriétés du composant d'auto-complétion
 */
export interface AutoCompleteFieldProps extends HornetWrittableProps,
    HornetClickableProps,
    HornetBasicFormFieldProps,
    HornetComponentDatasourceProps,
    HornetComponentChoicesProps {
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

    filterText?: FilterTextType | Function;

    name: string;

    /** surcharge du label lors qu'on a pas de resultat **/
    noResultLabel?: String;
}

/**
 * Composant d'auto-complétion.
 * Les fonctions getCurrentValue et setCurrentValue s'appuient sur le champ caché contenant la valeur sélectionnée.
 */
export class AutoCompleteField<P extends AutoCompleteFieldProps> extends AbstractFieldDatasource<AutoCompleteFieldProps, any> {

    public readonly props: Readonly<AutoCompleteFieldProps>;

    static defaultProps: any = _.assign({
        minValueLength: 1,
        readOnly: false,
        disabled: false,
        delay: 1000,
        valueKey: "value",
        labelKey: "text",
        maxHeight: null,
        writable: true,
        filterText: FilterTextType.indexOf
    }, AbstractField.defaultProps);


    protected _throttledTriggerAction: Function;

    /** Référence vers le champ caché contenant la valeur de l'élément sélectionné */
    protected hiddenInput: HTMLInputElement;

    /** Référence vers le champ de saisie libre */
    protected textInput: HTMLInputElement;

    protected autoCompleteState: AutoCompleteState;

    /** Indicateur si la valeur dans l'autocomplete a changé depuis le dernier focus */
    protected isUpdated: boolean;
    protected typedValueOnFocus: string;

    constructor(props: P, context?: any) {
        super(props, context);

        let ariaSelectorId: string = props.name + "_select";

        //liste des choix possibles
        this.state.choices = [];

        //item sélectionné
        this.state.selectedIndex = null;
        //indique si la liste des choix est visible ou non
        this.state.shouldShowChoices = false;
        //identifiant du selector
        this.state.ariaSelectorId = ariaSelectorId;
        //loader
        this.state.isApiLoading = false;
        if (this.props.dataSource.results) {
            //liste de tous les choix (non filtré par le texte)
            this.state.allChoices = this.props.dataSource.results;
        }

        this.autoCompleteState = new AutoCompleteState();
    }

    /**
     * Setter indiquant que l'API est en cours d'exécution
     * @param value valeur à utiliser
     * @param callback fonction de callback éventuelle
     * @returns {AutoComplete}
     */
    public setIsApiLoading(value: boolean, callback?: () => any): this {
        this.setState({ isApiLoading: value }, callback);
        return this;
    }

    /**
     * Setter des choix du composant
     * @param value tableau de choix
     * @param callback fonction de callback éventuelle
     * @returns {AutoComplete}
     */
    setChoices(value: any[], callback?: () => any): this {
        this.setState({ choices: value }, callback);
        return this;
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {

        if (!Utils.isServer) {
            if (!_.isUndefined(this.props[ "var" ])) {
                logger.warn("The var props is only available in DEV");
            }
        }

        this.mounted = true;
        logger.trace("auto-complete componentDidMount");

        this._throttledTriggerAction = _.throttle(this.triggerAction, this.state.delay);

        this.props.dataSource.on("fetch", this.fetchEventCallback);
        this.props.dataSource.on("add", this.addEventCallback);
        this.props.dataSource.on("delete", this.setResultCallback);
        this.props.dataSource.on("sort", this.setResultCallback);
        this.props.dataSource.on("filter", this.filterEventCallback);
        this.props.dataSource.on("init", this.initEventCallback);
        this.props.dataSource.on("loadingData", this.displaySpinner);

    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        super.componentWillUnmount();

        this.mounted = false;
        this.props.dataSource.removeListener("fetch", this.fetchEventCallback);
        this.props.dataSource.removeListener("add", this.addEventCallback);
        this.props.dataSource.removeListener("filter", this.filterEventCallback);
        this.props.dataSource.removeListener("init", this.initEventCallback);
        this.props.dataSource.removeListener("delete", this.setResultCallback);
        this.props.dataSource.removeListener("sort", this.setResultCallback);
        this.props.dataSource.removeListener("loadingData", this.displaySpinner);

    }

    /**
     * @inheritDoc
     */
    componentWillUpdate(nextProps: AutoCompleteFieldProps, nextState: any, nextContext: any): void {
        super.componentWillUpdate(nextProps, nextState, nextContext);
        if (this.state.delay != nextState.delay) {
            /* Le délai d'appel de l'action a changé : on doit donc refaire ici l'encaspulation avec _.throttle */
            this._throttledTriggerAction = _.throttle(this.triggerAction, nextState.delay);
        }
    }

    /**
     * @inheritDoc
     */
    shouldComponentUpdate(nextProps: AutoCompleteFieldProps, nextState: any, nextContext: any) {
        super.componentWillUpdate(nextProps, nextState, nextContext);
        if (this.state.shouldShowChoices != nextState.shouldShowChoices
            || this.state.listDefaultValue !== nextState.listDefaultValue
            || ((nextState.choices && !this.state.choices)
                || (!nextState.choices && this.state.choices)
                || (nextState.choices && this.state.choices.length != nextState.choices.length))
            || !_.isEqual(nextState.choices, this.state.choices)
            || (this.state.errors != nextState.errors)
            || (this.state.readOnly != nextState.readOnly)
            || (this.state.disabled != nextState.disabled)
        ) {
            return true;
        }
        return false;
    }

    /**
     * Génère le rendu spécifique du champ
     * @returns {any}
     */
    renderWidget(): JSX.Element {
        logger.trace("auto-complete  render");
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

        /* Le champ caché contient l'identifiant de l'élément sélectionné. C'est cet identifiant qui est ensuite
         utilisé par les actions. */
        return (

            <div className="autocomplete-container">
                <input type="hidden" name={this.getValueFieldName()} ref={this.registerHiddenInput} />

                {/* Champ de saisie libre */}
                <input {...htmlProps}
                    ref={this.registerTextInput}
                    readOnly={!this.props.writable} data-writable={this.props.writable}
                    />
                <AutoCompleteSelector
                    ref="selector"
                    choices={this.state.choices}
                    onOptionSelected={this.onListWidgetSelected}
                    selectorId={this.state.ariaSelectorId}
                    maxHeight={this.props.maxHeight}
                    showComponent={shouldShow}
                    choicesSelected={this.state.listDefaultValue}
                    autoCompleteState={this.autoCompleteState}
                    disabled={this.state.disabled || this.state.readOnly}
                    noResultLabel={this.state.noResultLabel}
                    />
            </div>
        );
    }

    /**
     *
     * @param result
     */
    protected fetchEventCallback(result) {
        this.choicesLoaderCallback(result);
        //dans le cas writable, le composant n'a pas besoin de recharger la liste des choix
        // elle est disponible directement
        if (this.props.writable) {
            if (!this.state.onListWidgetSelected) {
                this.prepareChoices(true);
            } else {
                this.prepareChoices(false);
            }
        }
        this.state.onListWidgetSelected = false;
    }

    /**
     * récupération des choix dans le datasource
     * @param result
     */
    protected addEventCallback(result) {
        this.setResultCallback(result)
    }

    /**
     * récupération des choix dans le datasource
     * @param result
     */
    protected setResultCallback(result) {
        this.state.allChoices = this.props.dataSource.results;
    }

    /**
     * récupération des choix possibles dans le datasource
     * @param filtered
     */
    protected filterEventCallback(filtered) {
        this.state.allChoices = filtered;
        this.choicesLoaderCallback(filtered);
    }

    /**
     * récupération des choix à l'initialisation
     * @param result
     */
    protected initEventCallback(result) {
        this.state.allChoices = result;
    }

    /**
     * retourne le texte saisi
     * @return {any} le texte actuellement saisi dans le champ de saisie libre
     */
    getCurrentText(): string {
        let text: string = "";
        if (this.textInput) {
            text = this.textInput.value;
        }
        return text;
    }

    /**
     * Modifie la valeur du texte présent dans l'input
     * @param value texte à mettre dans l'input
     */
    setCurrentText(value: string): void {
        this.textInput.value = value;
    }

    /**
     * Réinitialise le champs autocomplete
     */
    public resetField() {
        this.resetSelectedValue();
        this.resetSelectedText();
        this.state.selectedIndex = -1;
        return this;
    }

    /**
     * Réinitialise la valeur de l'élément sélectionné contenu dans le champ caché
     */
    protected resetSelectedValue(): void {
        if (this.hiddenInput) {
            this.hiddenInput.value = "";
        }
        this.autoCompleteState.choiceFocused = null;
        this.state.selectedIndex = -1;
    }

    /**
     * Réinitialise la valeur de l'élément sélectionné contenu dans le champ caché
     */
    protected resetSelectedText(): void {
        if (this.textInput) {
            this.textInput.value = "";
        }
        if (this.refs.selector) {
            (this.refs.selector as AutoCompleteSelector).setCurrentTypedText("");
        }
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
            if (e.altKey) {
                this.autoCompleteState.setFocusOn(this.state.selectedIndex, this.hiddenInput.value, null);
                this.showChoices();
            } else {
                this.navigateInChoices(1);
                this.isUpdated = true;
            }
            e.preventDefault();
        } else if (key == KeyCodes.UP_ARROW) {
            if (e.altKey) {
                this.hideChoices();
            } else {
                this.navigateInChoices(-1);
                this.isUpdated = true;
            }
            e.preventDefault();
        } else if (key == KeyCodes.ESCAPE) {
            //test si une valeur existait
            if (this.hiddenInput.value) {
                this.selectedChoice(this.hiddenInput.value);
                this.selectCurrentIndex();
            }
            // On demande le masquage des choix
            this.hideChoices();
            e.preventDefault();
        } else if (key == KeyCodes.ENTER) {
            //valide un choix si on est sur un autocomplete simple et writable
            //ne fait rien sinon (valide le formulaire)
            if (this.state.shouldShowChoices && this.state.writable) {
                e.preventDefault();
                this.validateSelectedValue(shouldShow);
            }
        } else if (key == KeyCodes.SPACEBAR && !this.state.writable) {
            //valide un choix si on est sur un autocomplete et non writable
            if (this.state.shouldShowChoices) {
                e.preventDefault();
                this.validateSelectedValue(shouldShow);
            }
        } else if (key == KeyCodes.TAB && !e.shiftKey && this.state.shouldShowChoices) {
            this.tabHandlerForValueChange(e, shouldShow);
        } else if (key == KeyCodes.TAB && e.shiftKey) {
            this.tabHandlerForValueChange(e, shouldShow);
        } else if (key == KeyCodes.HOME) {
            if (shouldShow) {
                this.state.selectedIndex = null;
                this.navigateInChoices(1);
            } else {
                this.state.selectedIndex = 0;
                this.selectCurrentIndex();
                this.hideChoices();
            }
            this.isUpdated = true;
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
            this.isUpdated = true;
            e.preventDefault();
        }
    }

    /**
     * gère la tabulation
     * @param {__React.KeyboardEvent<HTMLElement>} e
     * @param {boolean} shouldShow
     * @param {boolean} preventDefault
     */
    private tabHandlerForValueChange(e: __React.KeyboardEvent<HTMLElement>, shouldShow: boolean) {
        if (this.isUpdated) {
            this.validateSelectedValue(shouldShow);
            this.isUpdated = false;
        } else {
            this.selectCurrentIndex();
            this.hideChoices();
        }
    }

    /**
     * valide le choix sélectionné
     * @param shouldShow indique si les résultats doivent être affichés
     */
    protected validateSelectedValue(shouldShow: boolean): void {
        if (shouldShow) {
            // place le selectedIndex sur le choix
            if (!this.state.selectedIndex) {
                this.state.choices.map((element, index) => {
                    if (element.text == this.getCurrentText()) {
                        this.state.selectedIndex = index;
                    }
                });
            }
            //choix sélectionné
            let selection: any = (this.state.choices[ this.state.selectedIndex ] || this.state.allChoices[ this.state.selectedIndex ]);

            if (selection != null) {
                this.setCurrentValue(selection.value);
                this.props.dataSource.select(selection.value);
            } else {
                this.setCurrentValue(null);
                this.props.dataSource.select(null);
            }

            this.selectCurrentIndex();
            this.hideChoices();
        } else {
            this.showChoices();
        }
    }

    /**
     * Gestion de l'évènement onFocus pour le champ de saisie libre.
     * @param event
     */
    protected handleOnFocus(event: any): void {
        this.typedValueOnFocus = this.getCurrentText();
        this.state.focused = true;
        this.showChoices();
        /* L'attribut DOM onBlur est éventuellement aussi renseigné sur le composant auto-complete */
        if (this.state.onFocus) {
            this.state.onFocus(event);
        }

        if (this.state.allChoices) {
            if (this.isValidText(this.typedValueOnFocus) || !this.props.writable) {
                logger.trace("auto-complete : prise en compte du texte présent au focus : ", this.typedValueOnFocus);
                if (!this.props.dataSource.status) {
                    this.props.dataSource.init();
                } else {
                    if ((!this.props.writable) ||this.state.choices.length == 0 && this.hiddenInput.value) {
                        this.setChoices(this.state.allChoices, () => { //setState
                            if (this.state.allChoices.length > 0) {
                                let index = _.findIndex(this.state.allChoices, { text: this.typedValueOnFocus });
                                this.state.selectedIndex = index===undefined? -1: index;
                                this.showChoices();
                                this.changeSelectedChoiceWhenOneChoice(this.typedValueOnFocus);
                            }
                        });
                    }
                }
                //this._throttledTriggerAction(this.typedValueOnFocus);

                this.changeSelectedChoiceWhenOneChoice(this.typedValueOnFocus);

            } else {
                this.setChoices(this.state.allChoices, () => { //setState
                    if (this.state.allChoices.length > 0) {
                        this.showChoices();
                        this.state.selectedIndex = -1;
                        this.autoCompleteState.setFocusOn(this.state.selectedIndex, "", null);
                    }
                });
            }
        } else {
            this.showChoices();
        }
        if (!this.hiddenInput || this.hiddenInput.value.length == 0 || !this.textInput || this.textInput.value.length == 0) {
            this.clearFilterData();
            this.state.selectedIndex = -1;
            this.autoCompleteState.setFocusOn(this.state.selectedIndex, "", null);
        } else {
            this.state.selectedIndex = _.findIndex(this.state.allChoices, { text: this.typedValueOnFocus });
            this.autoCompleteState.setFocusOn(this.state.selectedIndex, this.hiddenInput.value, null);
        }
    }

    /**
     * Fonction déclenchée lorsque le champ de saisie libre perd le focus
     * @param event
     */
    protected handleOnBlur(event: React.FocusEvent<HTMLElement>): void {
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

        if (!this.hiddenInput || !this.hiddenInput.value || this.hiddenInput.value.length == 0) {
            this.clearFilterData();
            if (!this.state.isShiftTab) this.props.dataSource.select(null);
        } else {
            this.props.dataSource.select(this.hiddenInput.value);
        }

        this.hideChoices();
        this.isUpdated = false;
    }

    /**
     * indique aux élément esclave qu'un filter a été fait sur le maitre si le datasource en est un
     */
    clearFilterData() {
        if (this.props.dataSource instanceof DataSourceMaster) {
            (this.props.dataSource as DataSourceMaster<any>).getSlaves().forEach((item: DataSource<any>) => {
                item.emit("filter", []);
            })
        }
    }

    /**
     * Fonction déclenchée sur une modification du champ de saisie libre
     * @param event
     */
    protected handleChangeTextInput(event: FormEvent<HTMLElement>): void {

        logger.trace("auto-complete handleChangeTextInput");
        /* Le texte a changé donc on réinitialise la valeur */
        this.resetSelectedValue();
        this.state.selectedIndex = null;

        /* L'attribut DOM onChange est éventuellement aussi renseigné sur le composant auto-complete */
        if (this.state.onChange) {
            this.state.onChange(event);
        }

        let newText = this.getCurrentText();

        this.clearFilterData();
        this.isUpdated = true;

        if (this.refs.selector) {
            (this.refs.selector as AutoCompleteSelector).setCurrentTypedText(newText);
        }

        if (this.isValidText(newText)) {
            logger.trace("auto-complete : prise en compte du texte saisi : ", newText);
            this._throttledTriggerAction(newText);
        } else {
            this.hideChoices();
        }

        if (newText.length == 0) {
            this.setChoices(this.state.allChoices, () => { //setState
                if (this.state.allChoices.length > 0) {
                    this.showChoices();
                } else {
                    this.props.dataSource.select(null);
                }
            });
        }
    }

    /**
     * si il n'y a plus qu'un choix écrit dans sa totalité,
     * valid ele choix
     * @param {string} newText
     */
    protected changeSelectedChoiceWhenOneChoice(newText: string): void {
        if (this.state.choices && this.state.choices[ 0 ] && this.state.choices.length === 1
            && _.deburr(newText).toLowerCase() == _.deburr(this.state.choices[ 0 ].text).toLowerCase()) {
            this.changeSelectedChoice(this.state.choices[ 0 ]);
            this.props.dataSource.select(this.state.choices[ 0 ].value);
            this.autoCompleteState.setFocusOn(0, this.state.choices[ 0 ].value, 0)
        }
    }

    /**
     * change la valeur courrante
     * @param value
     * @returns {this}
     */
    setCurrentValue(value: any): this {
        super.setCurrentValue(value);
        this.setState({ listDefaultValue: value });
        return this;
    }

    /**
     * Déclenche le chargement des éléments correspondant au texte saisi
     * @param newText texte saisi
     */
    protected triggerAction(newText: string) {
        this.setIsApiLoading(true);
        this.props.dataSource.fetch(true, newText, true);
    }

    /**
     * Controle la longeur du text saisie avant de déclancher la recherche
     * @param cnt : boolean
     */
    protected isMaxElementNumberReached(cnt: number): boolean {
        return this.state.maxElements && cnt >= this.state.maxElements;
    }

    /**
     * Charge la liste de choix dans le composant
     */
    protected prepareChoices(display = true) {
        let newChoices = [];
        let cnt: number = 0;
        if (this.state.choices) {
            this.state.choices.map((choice: any) => {
                if (this.findText(choice, this.getCurrentText().toLowerCase()) && !this.isMaxElementNumberReached(cnt)) {
                    newChoices.push(choice);
                    cnt++;
                }
            });
        }

        // mets a jour la liste des choix
        this.setChoices(newChoices, () => {
            if (newChoices.length > 0 && display) {
                //si il n'y a plus qu'un choix on le valide
                this.changeSelectedChoiceWhenOneChoice(this.getCurrentText());
                this.showChoices();
            } else {
                this.hiddenInput.value = "";
                this.props.dataSource.select(null);
                this.showChoices();
            }
        });
    }

    /**
     * Fonction déclenchée une fois les éléments de choix obtenus par la fonction choicesLoader
     * @param resultItems éléments obtenus. ceux-ci doivent contenir une propr
     */
    protected choicesLoaderCallback(resultItems: any[]): void {
        this.setIsApiLoading(false);
        this.setChoices(resultItems);
    }

    /**
     * test si le choix choice commence par current
     * @param choice
     * @param current
     * @returns {boolean}
     */
    protected startsWithText(choice: any, current: string) {
        let choiceText: string = choice ? choice[ "text" ] ? choice[ "text" ].toLowerCase() : null : null;
        return _.startsWith(choiceText, current);
    }

    /**
     * teste si le texte current est contenu dans le choix choice
     * @param choice
     * @param current
     * @returns {boolean}
     */
    protected indexOfText(choice: any, current: string) {
        let choiceText: string = choice ? choice[ "text" ] ? choice[ "text" ].toLowerCase() : null : null;
        if (choiceText && (choiceText.indexOf(current) >= 0)) {
            return true;
        }
        return false;
    }

    /**
     * indique si le texte current se trouve dans le choix
     * @param choice
     * @param current
     * @returns {boolean}
     */
    protected findText(choice: any, current: string) {

        if (typeof this.props.filterText == "function") {
            return this.props.filterText(choice, current)
        } else if (this.props.filterText == FilterTextType.beginWith) {
            return this.startsWithText(choice, current);
        } else if (this.props.filterText == FilterTextType.indexOf) {
            return this.indexOfText(choice, current);
        }

        return false;
    }

    /**
     * Fonction appelée lorsque l'utilisateur a choisi un élément de la liste de choix.
     * @param choice élément sélectionné
     */
    public changeSelectedChoice(choice?: any) {
        if (this.refs.selector) {
            (this.refs.selector as AutoCompleteSelector).setCurrentTypedText("");
        }

        this.textInput.value = choice ? choice.text : "";
        this.hiddenInput.value = choice ? choice.value : "";
    }

    /**
     * Recupere l'index de l'element selectionné
     * @param choice
     */
    selectedChoice(choice) {
        let indexSelected = null;
        if (this.state.choices) {
            this.state.choices.map((item, index) => {
                if (item.value == choice) {
                    indexSelected = index;
                }
            });
            this.setCurrentValue(choice);
        }
    }

    /**
     * Fonction appelée lorsque l'utilisateur clique sur un item de la liste des valeurs possibles
     * @param event
     */
    protected onListWidgetSelected(event: __React.MouseEvent<HTMLElement>): void {
        let selectedText = event.currentTarget[ "getAttribute" ]("data-real-text");
        let selectedValue = event.currentTarget[ "getAttribute" ]("data-real-value");

        /* On n'utilise pas la syntaxe getAttribute dataset.realText car la propriété dataset n'est pas définie sous IE10 */
        if (selectedValue) {
            logger.trace("Selection click [", selectedValue, "]:", selectedText);
            let index = _.findIndex(this.state.choices, { text: selectedText });
            this.state.selectedIndex = index;
            this.autoCompleteState.choiceFocused = index;
            this.changeSelectedChoice({ text: selectedText, value: selectedValue });
            this.hiddenInput.value = selectedValue;
            this.selectedChoice(selectedValue);
            this.props.dataSource.select(selectedValue);
        }
        this.state.onListWidgetSelected = true;
        this.hideChoices();
    }

    /**
     * Retourne true si le texte indiqué correspond aux critères de taille minimale
     * @param text
     * @returns {boolean}
     * @protected
     */
    protected isValidText(text: string) {
        return (text != null && text.length >= this.state.minValueLength);
    }

    /**
     * Navigue au sein de la liste de choix
     * @param delta {number} indique de combien d'éléments on doit se déplacer par rapport à l'élément actuellement sélectionné
     * @protected
     */
    protected navigateInChoices(delta: number) {

        let newIndex: number = this.state.selectedIndex === null ? (delta === 1 ? 0 : delta) : this.state.selectedIndex + delta;
        let choicesLength: number = this.state.choices ? this.state.choices.length : 0;

        if (newIndex < 0) {
            //On va à la fin
            newIndex = choicesLength - 1;
        } else if (newIndex >= choicesLength) {
            //On retourne au début
            newIndex = 0;
        }

        // on valide le choix sur lequel on est
        this.setState({ selectedIndex: newIndex }, () => {
            this.selectCurrentIndex();
            if (!this.state.shouldShowChoices) {
                let selection: any = (this.state.choices[ this.state.selectedIndex ]);
                if (selection != null) {

                    this.changeSelectedChoice(selection);
                    this.setCurrentValue(selection.value);
                }
            }
            this.autoCompleteState.setFocusOn(this.state.selectedIndex, this.hiddenInput.value, newIndex);

        });

        // On s'assure de l'affichage de la liste déroulante
        if (this.state.shouldShowChoices) {
            this.showChoices()
        }
    }

    /**
     * Selectionne l'élement actuellement en surbrillance dans la liste de choix
     * @return boolean si une sélection a effectivement eu lieu
     * @protected
     */
    protected selectCurrentIndex(): boolean {
        let selection: any = (this.state.choices || [])[ this.state.selectedIndex ];
        if (selection != null) {
            this.changeSelectedChoice(selection);
            return true;
        }
        return false;
    }

    /**
     * Demande l'affichage du composant de choix
     * @public
     */
    public showChoices(): void {
        if (this.state.shouldShowChoices !== true && this.state.focused) {
            if (this.isValidText(this.textInput.value) || this.textInput.value.length == 0 || !this.props.writable) {
                this.setState({ shouldShowChoices: true });
            }
        }
    }

    /**
     * Demande le masquage du composant de choix
     * @public
     */
    public hideChoices(): void {
        if (this.state.shouldShowChoices !== false) {
            this.setState({ shouldShowChoices: false });
        }
    }

    /**
     * @return {boolean} true si le composant de liste doit s'afficher
     * @protected
     */
    protected shouldShowChoices(): boolean {
        return this.state.shouldShowChoices === true;
    }

    /**
     * @return {string} le nom du champ caché contenant la valeur
     */
    getValueFieldName(): string {
        return this.state.name + "." + this.state.valueKey;
    }

    /**
     * @return {string} le nom du champ de saisie libre
     */
    getFreeTypingFieldName(): string {
        return this.state.name + "." + this.state.labelKey;
    }

    /**
     * Surcharge le rendu des erreurs de validation : le nom du champ à mettre en évidence est le champ de saisie libre
     * @override
     */
    renderErrors(): __React.ReactElement<FieldErrorProps> {
        let fieldErrorProps: FieldErrorProps = {
            errors: this.state.errors,
            fieldName: this.getFreeTypingFieldName()
        };

        let basicFieldErrorProps: FieldErrorProps = {
            errors: this.state.errors,
            fieldName: this.state.name
        };

        let Error = this.state.errorComponent;
        return (
            <div>
                <Error {...fieldErrorProps} />
                <Error {...basicFieldErrorProps} />
            </div>
        );
    }

    /**
     * On enregistre également le champ contenant la valeur dans la classe parente DomAdapter, ce qui fait les liens
     entre le formulaire, le champ HTML et le composant React.
     * @param hiddenInput
     */
    protected registerHiddenInput(hiddenInput: HTMLInputElement): void {
        this.hiddenInput = hiddenInput;
        this.registerHtmlElement(hiddenInput);
    }

    /**
     *  Conserve la valeur du champs saisie
     * @param textInput
     */
    protected registerTextInput(textInput: HTMLInputElement): void {
        this.textInput = textInput;
    }

    /** on mets le focus sur l'input */
    public setFocus() {
        this.state.focused = true;
        this.textInput.focus();
        return this;
    }

    /**
     * teste si le composant a des erreurs
     * @override
     */
    hasErrors() {
        let fieldErrors: INotificationType[] = null;
        if (this.state.errors) {
            fieldErrors = this.state.errors.filter(function (error: INotificationType): boolean {
                let name = this.state.name + "." + this.state.labelKey;
                return (error.field == name || error.field == this.state.name);
            }, this);
        }
        if (fieldErrors && (fieldErrors.length > 0)) {
            return true;
        }

        return false;
    }
}