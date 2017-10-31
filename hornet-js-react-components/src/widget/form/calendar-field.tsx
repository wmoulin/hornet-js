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
    HornetBasicFormFieldProps,
    HornetClickableProps,
    HornetWrittableProps
} from "src/widget/form/abstract-field";
import { Modal } from "src/widget/dialog/modal";
import * as _ from "lodash";
import * as moment from "moment";
import { DateUtils } from "hornet-js-utils/src/date-utils";
import { InputField, InputFieldProps } from "src/widget/form/input-field";
import { KEYNAMES } from "hornet-js-components/src/event/key-codes";


const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.calendar-fied");

let RcCalendar = null;
let defaultLocale = DateUtils.default_locale;

/**
 * Propriétés du composant calendrier.
 */
export interface CalendarFieldProps extends InputFieldProps {
    /** Titre du champ, utilisé comme texte alternatif à l'image du bouton d'ouverture de calendrier.
     * Si non spécifié, le libellé calendar.agendaTitle est utilisé. */
    title?: string;
    /* Format(s) de saisie de date : surcharg(ent) éventuellement le format de date défini dans la locale */
    dateFormats?: string[];
    /* Année par défaut à utiliser lorsque le format n'inclut pas la date (par ex. 'dd/MM') */
    defaultYear?: number;
    /* Détermine si le bouton d'ouverture de calendrier est affiché */
    isDatePicker?: boolean;
    /*texte présent dans les inputs lorsque la date n'est pas renseignée*/
    placeHolder?: string;
    /** validation lors du submot formulaire */
    valideOnForm?: boolean;
    onValueChange?: (value: string) => void;
}

/**
 * Etat du composant calendrier
 */
export interface CalendarFieldState {
    isVisible?: boolean,
    strValue?: string,
    calendarLocale?: any,
    inputSize?: number,
    onValueChange?: (value: string) => void;
}


if (!Utils.isServer) {
    logger.trace("Execution sur le CLIENT(NAVIGATEUR)");
    RcCalendar = require("rc-calendar");
    /* Patch de la méthode getTitleString utilisée pour afficher la date correspondant au jour survolé dans le calendrier */
    let rcCalendarUtil = require("rc-calendar/lib/util/index");

    if (rcCalendarUtil && rcCalendarUtil.getTitleString) {
        rcCalendarUtil.getTitleString = (value?: string) => {
            /* On renvoie une chaîne vide car le formattage de la date dépend de la locale qui est propre à chaque
             instance de calendar. */
            return "";
        };
    }
} else {
    logger.trace("Execution sur le SERVEUR");
}

/**
 * Composant Calendrier
 */
export class CalendarField<P extends CalendarFieldProps, S extends CalendarFieldState>
    extends InputField<CalendarFieldProps, CalendarFieldState> {

    private hasKeyPress: boolean = false;

    readonly props: Readonly<CalendarFieldProps>;

    static defaultProps = _.assign(AbstractField.defaultProps, {
        disabled: false,
        isDatePicker: true,
        valideOnForm: true
    });

    constructor(props?: P, context?: any) {
        super(props, context);

        let calendarLocale = Utils.getCls("hornet.internationalization") ?
            this.i18n("calendar") : {"dateFormat": "DD/MM/YYYY"};

        /*récupération de la locale d'internationalisation*/
        let internationalisation = Utils.getCls("hornet.internationalization");
        let language: any;
        if (internationalisation) {
            language = internationalisation.locale;
        } else {
            language = defaultLocale;
        }

        /* attribut HTML size du champ de saisie */
        let inputSize: number = calendarLocale.dateFormat.length;

        this.state.isVisible = false;
        this.state.calendarLocale = calendarLocale;
        this.state.language = language;
        this.state.inputSize = inputSize;
        if (!props.placeHolder) {
            this.state.placeHolder = this.i18n("calendar.placeHolder");
        }
        this.state.currentValue = "";
        this.state.messageValidation = this.i18n("form.validation.format", {field: this.state.label});
    }

    /**
     * Récupère le format d'affichage des dates
     */
    private getFormat() {
        let internationalisation = Utils.getCls("hornet.internationalization");
        let dateFormat = internationalisation.messages.calendar.dateFormat;
        return dateFormat;
    }

    /**
     * Génère le rendu spécifique du champ : un datePicker
     * @returns {any}
     */
    renderWidget(): JSX.Element {

        logger.trace("render CalendarField");

        let reactIconTag;
        let reactCalendarDialogueTag;

        if (this.state.isDatePicker) {
            reactIconTag =
                <button className="agenda icon" type="button" onClick={this.showCalendar}
                        disabled={this.state.readOnly || this.state.disabled} aria-haspopup={true}>
                    <img src={CalendarField.genUrlTheme("/img/calendar/icon_calendar.svg")}
                         alt={this.state.title || this.state.calendarLocale.agendaTitle}/>
                </button>;


            /*RcCalendar prend un Moment en paramètre*/
            let date = _.clone(this.state.currentValue);
            let currentDate: any;
            if (!date) {
                currentDate = moment();
            } else {
                currentDate = moment(date, this.state.calendarLocale.dateFormat);
            }
            if (!currentDate.isValid()) {
                currentDate = moment();
            }
            currentDate.locale(this.state.language);
            let format = this.getFormat();
            if (format instanceof Array) {
                format = format[0];
            }

            reactCalendarDialogueTag =
                <Modal ref="maModal"
                       underlayClickExits={true}
                       escapeKeyExits={true}
                       title={this.state.calendarLocale.choiceDate}
                >
                    {!Utils.isServer ?
                        <RcCalendar
                            formatter={format}
                            defaultValue={currentDate}
                            onSelect={this.setValueAndCloseCalendar}
                            locale={this.state.calendarLocale}
                            format={format}
                            showDateInput={false}
                        /> :
                        null
                    }
                </Modal>;
        }

        let htmlProps: __React.HTMLAttributes<HTMLElement> = this.getHtmlProps();

        let formatedValue = this.state.currentValue.length >= 1
            ? this.state.currentValue
            : "";

        htmlProps = _.assign(htmlProps, {
            type: "text",
            size: this.state.inputSize,
            value: formatedValue,
            onChange: this.handleInputChange,
            onKeyPress: this.handleInputKeyPress,
            onBlur: this.handleInputLeave
        } as __React.HTMLAttributes<HTMLElement>);

        if ((htmlProps as any).label == htmlProps.title) {
            htmlProps.title = undefined;
        }
        (htmlProps as any).label = undefined;

        let hasError = this.hasErrors() ? " has-error" : "";

        let placeHolder = (!this.state.disabled && !this.state.readOnly)
            ? this.state.placeHolder
            : null
        ;

        return (
            <div className="calendar-container">
                <input {...htmlProps}
                       ref={(elt) => this.registerHtmlElement(elt)}
                       className={"calendar-input" + hasError}
                       placeholder={placeHolder}
                />
                {!this.state.readOnly && !this.state.disabled && this.state.currentValue ? this.renderResetButton() : null}
                {reactIconTag}
                {reactCalendarDialogueTag}
            </div>
        );
    }

    /**
     * @override
     */
    setCurrentValue(value: any): this {
        let res = value || "";
        if (typeof value === "number") {
            res = this.formatCalendarDate(value, this.state.calendarLocale);
        } else if (value instanceof Date) {
            res = this.formatCalendarDate(value.getTime(), this.state.calendarLocale);
        }
        this.setState({currentValue: res, valued: (value !== "" && value), errors: []}, () => {
            if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
        });
        return this;
    }

    /**time
     * @override
     */
    resetValue(): void {
        let res = this.formatCalendarDate(null, this.state.calendarLocale);

        this.setState({currentValue: res, valued: false}, () => {
            if (this.state.onSelect) {
                if (this.state.onSelect) {
                    this.state.onSelect(res);
                }
            }
            if (this.state.onChange) {
                this.state.onChange(null);
            }
            if (this.state.onValueChange) {
                this.state.onValueChange(this.state.currentValue);
            }

            if (this.htmlElement && this.htmlElement.onchange) {
                this.htmlElement.onchange();
            }

        });
    }

    /**
     * Méthode délenchée lors d'une intéraction avec le champ input du composant Calendar
     * @param e
     */
    private handleInputChange(e: React.SyntheticEvent<HTMLElement>): void {
        /* L'attribut DOM onChange est éventuellement aussi renseigné sur le composant */
        if (this.state.onChange) {
            this.state.onChange(e);
        }

        let input: HTMLInputElement = e.target as HTMLInputElement;

        if (input.value && !this.state.valued) {
            this.setState({valued: true});
        } else if (!input.value && this.state.valued) {
            this.setState({valued: false});
        }

        if (this.state.currentValue != input.value) {
            this.setState({currentValue: input.value}, () => {
                if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
            });
        }
    }

    /**
     * Méthode délenchée lorsque l'utilisateur quitte l'input du composant Calendar
     * @param e
     */
    private handleInputLeave(e: React.SyntheticEvent<HTMLElement>): void {
        /* transforme la date au format définit */
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let text = input.value;

        if (text.length > 0) {
            let format = this.getFormat();
            let time = moment(text, format, true);
            if (time.isValid()) {
                if (format instanceof Array) {
                    let newText = time.format(format[0]);
                    this.setState({currentValue: newText}, () => {
                        if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
                    });
                } else {
                    let newText = time.format(format);
                    this.setState({currentValue: newText});
                }
            } else {
                if (this.state.valideOnForm) {
                    this.setState({currentValue: text}, () => {
                        if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
                    });
                } else {
                    if (this.hasKeyPress) {
                        this.setState({errors: [{field: this.state.name, text: this.state.messageValidation}]}, () => {
                            this.htmlElement.focus();
                        });
                        this.hasKeyPress = false;
                    } else {
                        this.setState({currentValue: "", errors: []}, () => {
                            if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
                        });
                    }
                }
            }
        }

        if (this.props.onBlur) {
            this.props.onBlur((e as React.FocusEvent<HTMLInputElement>));
        }
    }

    /**
     * Controle des touches claviers
     * @param e
     */
    private handleInputKeyPress(e: React.KeyboardEvent<HTMLElement>): void {

        let text = (e.target as HTMLInputElement).value;
        let time = moment(text, this.getFormat());

        if (this.state.onKeyPress) {
            this.state.onKeyPress(event);
        }

        let key: string = e.key;

        if (key == KEYNAMES.ArrowDown) {

            if (time.isValid()) {
                time.add(1, "days");
                this.setState({currentValue: time.toDate()}, () => {
                    if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
                });
            }

            e.preventDefault();
        } else if (key == KEYNAMES.ArrowUp) {
            if (time.isValid()) {
                time.add(1, "days");
                this.setState({currentValue: time.toDate()}, () => {
                    if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
                });
            }
            e.preventDefault();
        } else if (key == KEYNAMES.Home) {
            this.setState({currentValue: new Date()}, () => {
                if (this.state.onValueChange) this.state.onValueChange(this.state.currentValue);
            });

            e.preventDefault();
        } else if ((/[-.\/]/.test(key)) || (/\d/.test(key))
            || ((key.toUpperCase() == "A" || key.toUpperCase() == "C" || key.toUpperCase() == "V" || key.toUpperCase() == "X") && e.ctrlKey)) {
            if (key != "Tab") {
                this.hasKeyPress = true;
            }
        } else if (key != KEYNAMES.Enter) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /**
     * @param time temps en millisecondes depuis Epoch
     * @param calendarLocale propriétés localisées du calendrier
     */
    public formatCalendarDate(time: any, calendarLocale: any): string {
        let strValue: string;
        try {
            if (time) {
                let format = this.getFormat();
                strValue = moment(time).format(format);

            }
        } catch (err) {
            logger.trace("Erreur pour formater la date suivante:", err);
        }
        if (!strValue) {
            strValue = "";
        }

        logger.trace("Date formatée : ", strValue + "  -- à partir de la valeur", time);
        return strValue;
    }

    /**
     * Met à jour la valeur et déclenche la fermeture de la popup de calendrier
     * @param value {Moment} instance de Moment
     */
    public setValueAndCloseCalendar(value: any): void {

        if (value != null) {
            this.setState({
                currentValue: this.formatCalendarDate(value, this.state.calendarLocale),
                valued: value != ""
            }, () => {
                this.hideCalendar();
                if (this.state.onSelect) {
                    this.state.onSelect(value);
                }

                if (this.state.onValueChange) {
                    this.state.onValueChange(this.state.currentValue);
                }
            });
        } else {
            if (this.state.onSelect) {
                this.state.onSelect(value);
            }

            if (this.state.onValueChange) {
                this.state.onValueChange(value);
            }
        }
    }

    /**
     * Permet de mettre à jour la valeur du datePicker
     * @param value
     * @returns {this}
     */
    public setValue(value: any) {
        this.setState({
            currentValue: this.formatCalendarDate(value, this.state.calendarLocale),
            valued: value != ""
        });
        return this;
    }


    /**
     * Permet d'afficher la modal contenant le calendier
     * @returns {Calendar}
     */
    public showCalendar() {
        if (!this.state.disabled && !this.state.readOnly) {
            (this.refs.maModal as Modal).open();
        }
        return this;
    }

    /**
     * Permet de masquer la modal contenant le calendier
     * @returns {Calendar}
     */
    public hideCalendar() {
        (this.refs.maModal as Modal).close();
        return this;
    }

    getCurrentValue(): Date {
        if (this.state.valideOnForm) {
            return Utils.dateUtils.parseInTZ(this.state.currentValue, this.getFormat(), Utils.dateUtils.TZ_EUROPE_PARIS) || this.state.currentValue;
        } else {
            return Utils.dateUtils.parseInTZ(this.state.currentValue, this.getFormat(), Utils.dateUtils.TZ_EUROPE_PARIS);
        }
    }
}