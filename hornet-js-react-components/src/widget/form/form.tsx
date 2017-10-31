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
import { Notification } from "src/widget/notification/notification";
import { AbstractField } from "src/widget/form/abstract-field";
import { AbstractForm, AbstractFormProps } from "src/widget/form/abstract-form";
import { UploadFileField } from "src/widget/form/upload-file-field";
import { FormUtils } from "src/widget/form/form-utils";
import { DomAdapter } from "src/widget/form/dom-adapter";
import { AutoCompleteField, AutoCompleteFieldProps } from "src/widget/form/auto-complete-field";
import {
    INotificationType,
    Notifications,
    NotificationManager
} from "hornet-js-core/src/notification/notification-manager";
import { CheckBoxField } from "src/widget/form/checkbox-field";
import { IValidationResult, ICustomValidation, DataValidator } from "hornet-js-core/src/validation/data-validator";
import * as classNames from "classnames";
import * as _ from "lodash";
import ErrorObject = ajv.ErrorObject;
import { SelectField } from "src/widget/form/select-field";
import { ButtonsArea } from "src/widget/form/buttons-area";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.form");

/**
 * Propriétés du formulaire hornet.
 */
export interface FormProps extends AbstractFormProps {
    /** Nom du formulaire */
    name?: string;
    /** Fonction déclenchée lors de la soumission du formulaire, lorsque celui-ci est valide */
    onSubmit?: (data: any) => void;
    /** Fonction déclenchée lors de la modification d'un champ du formulaire */
    onFormChange?: __React.FormEventHandler<HTMLElement>;
    /** Lorsque mis à true, le message d'information concernant les champs obligatoires est masqué.
     * Ignoré lorsque markRequired est à false car le message n'a pas lieu d'être affiché. */
    isMandatoryFieldsHidden?: boolean;
    /** Sous-titre éventuel */
    subTitle?: string;
    /** Texte descriptif éventuel */
    text?: string;
    /** Nom de la classe CSS à affecter au formulaire. */
    className?: string;
    /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
    markRequired?: boolean;
    /** Path permettant de surcharger les pictogrammes/images **/
    imgFilePath?: string;
    /** Schema JSON de validation */
    schema?: any;
    /** Options de validation ajv (cf. http://epoberezkin.github.io/ajv/#options) */
    validationOptions?: ajv.Options;
    /** Messages spécifiques à ce formulaire : utilisés pour la génération des messages d'erreur de validation */
    formMessages?: any;
    /**
     * Valideurs customisés : permettent d'implémenter et de chaîner des règles de validation difficiles à mettre
     * en oeuvre simplement avec un schéma json-schema. Ils sont appliqués après la validation basée sur le schéma
     * de validation, donc les données du formulaire ont déjà éventuellement bénéficié de la coercition de types. */
    customValidators?: ICustomValidation[];
    /** Données initiales du formulaire */
    defaultValues?: any;

    /** Identifiant du groupe de notifications auquel seront rattachées les notifications d'erreurs de validation
     * de ce formulaire */
    notifId?: string;

    /** Lorsqu'égal à true, les boutons de validation ne sont pas affichés */
    hideButtons?: boolean;
}


/**
 * Composant permettant de rendre un formulaire Hornet de manière standardisée
 */
export class Form extends AbstractForm<FormProps, any> {

    static idx = 0;

    private debouncedValidateAndSubmit: any;

    /** Valeur de propriétés par défaut */
    static defaultProps: FormProps = _.assign(_.cloneDeep(AbstractForm.defaultProps), {
        markRequired: true,
        isMandatoryFieldsHidden: false,
        subTitle: null,
        className: "formRecherche",
        customValidators: [],
        validationOptions: DataValidator.DEFAULT_VALIDATION_OPTIONS
    });

    constructor(props?: FormProps, context?: any) {
        super(props, context);

        let calendarLocale = this.i18n("calendar");
        if (calendarLocale == null) {
            calendarLocale = {};
        }

        /* Messages génériques */
        /* Configuration locale des calendriers et dates */
        this.state.calendarLocale = calendarLocale;
        this.state.customNotif = props.notifId != null;
        this.state.notifId = props.notifId != null ? props.notifId : "Form-" + (Form.idx++);
    }

    // Setters (pas de setter sur defaultValues, car cette propriété sert uniquement lors du montage initial du composant

    setName(value: string, callback?: () => any): this {
        this.setState({name: value}, callback);
        return this;
    }

    setOnSubmit(handler: (data: any) => void, callback?: () => any): this {
        this.setState({onSubmit: handler}, callback);
        return this;
    }

    setOnFormChange(handler: __React.FormEventHandler<HTMLElement>, callback?: () => any): this {
        this.setState({onFormChange: handler}, callback);
        return this;
    }

    setIsMandatoryFieldsHidden(value: boolean, callback?: () => any): this {
        this.setState({isMandatoryFieldsHidden: value}, callback);
        return this;
    }

    setSubTitle(value: string, callback?: () => any): this {
        this.setState({subTitle: value}, callback);
        return this;
    }

    setText(value: string, callback?: () => any): this {
        this.setState({text: value}, callback);
        return this;
    }

    setClassName(value: string, callback?: () => any): this {
        this.setState({className: value}, callback);
        return this;
    }

    setMarkRequired(value: boolean, callback?: () => any): this {
        this.setState({markRequired: value}, callback);
        /* Propagation de la propriété aux champs Hornet appartenant à ce formulaire */
        this.updateMarkRequiredFields(value);
        return this;
    }

    setImgFilePath(value: string, callback?: () => any): this {
        this.setState({imgFilePath: value}, callback);
        /* Propagation de la propriété aux champs Hornet appartenant à ce formulaire */
        this.updateImagFilePathFields(value);
        return this;
    }

    setSchema(value: any, callback?: () => any): this {
        this.setState({schema: value}, callback);
        return this;
    }

    setValidationOptions(value: ajv.Options, callback?: () => any): this {
        this.setState({validationOptions: value}, callback);
        return this;
    }

    setFormMessages(value: any, callback?: () => any): this {
        this.setState({formMessages: value}, callback);
        return this;
    }

    setCustomValidators(value: ICustomValidation[], callback?: () => any): this {
        this.setState({customValidators: value}, callback);
        return this;
    }

    setNotifId(value: string, callback?: () => any): this {
        if (value != null) {
            this.setState({notifId: value, customNotif: true}, callback);
        } else {
            this.setState({notifId: "Form-" + (Form.idx++), customNotif: false}, callback);
        }
        return this;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        NotificationManager.clean(this.state.notifId);
        if (this.formElement) {
            this.formElement["__component"] = null;
        }
    }

    componentDidMount(): void {
        super.componentDidMount();
        /* On évite la soumission intempestive du formulaire en cas de clics répétés ou de touche entrée maintenue
         sur le bouton de soumission*/
        this.debouncedValidateAndSubmit = _.debounce(this.validateAndSubmit, 500);
        if (this.state.defaultValues) {
            this.updateFields(this.state.defaultValues);
        }
        if (!this.isOneRequired(this.state.children)) {
            this.setMarkRequired(false);
        }
    }


    /**
     * Met à jour la propriété markRequired sur chacun des champs héritant de AbstractField contenus dans le formulaire
     * @param isMarkRequired valeur à assigner à la propriété 'markRequired'
     * @return ce formulaire
     */
    private updateMarkRequiredFields(isMarkRequired: boolean): this {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        /* Met à jour l'affichage de chaque champ en cas de readOnly*/
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            if (field instanceof AbstractField) {
                (field as AbstractField<any, any>).setMarkRequired(isMarkRequired);
            }
            return true;
        });
        return this;
    }

    /**
     * Met à jour la propriété imgFilePath sur chacun des champs héritant de AbstractField contenus dans le formulaire
     * @param imgFilePath valeur à assigner à la propriété 'imgFilePath'
     * @return ce formulaire
     */
    private updateImagFilePathFields(imgFilePath: string): this {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            if (field instanceof AbstractField) {
                (field as AbstractField<any, any>).setImgFilePath(imgFilePath);
            }
            return true;
        });
        return this;
    }

    /**
     * Met à jour les valeurs courantes des champs du formulaire
     * @param data données du formulaire (clé : nom du champ -> valeur du champ)
     */
    updateFields(data: any): void {
        let fields = this.extractFields();
        this.propagateParentState();
        for (let nameField in fields) {
            let val = _.get(data, nameField);
            if (val != null) {
                if (fields[nameField] instanceof CheckBoxField) {
                    /* Traitement spécifique pour une checkbox : on affecte currentChecked lorsque la valeur est booléenne*/
                    // if (val === true || val === false) {
                    //     fields[name].setCurrentValue("");
                    fields[nameField].setCurrentChecked(val as boolean);
                    // } else {
                    //     fields[name].setCurrentValue(val);
                    // }
                } else {
                    if (fields[nameField] instanceof SelectField || fields[nameField] instanceof AutoCompleteField) {
                        if (val instanceof Array) {
                            let choices = [];
                            /** TODO : a deplace dans le composant autocompleteField */
                            if (fields[nameField].state.multiple) {
                                for (let i = 0; i < fields[nameField].state.allChoices.length; i++) {
                                    let choice = fields[nameField].state.allChoices[i];
                                    for (let j = 0; j < val.length; j++) {
                                        if (val[j].toString() == choice["value"]) {
                                            choices.push(choice["value"]);
                                            break;
                                        }
                                    }
                                }
                            } else {
                                for (let i = 0; i < fields[nameField].state.dataSource.length; i++) {
                                    let choice = fields[nameField].state.dataSource[i];
                                    for (let j = 0; j < val.length; j++) {
                                        if (val[j].toString() == choice[fields[nameField].state.valueKey]) {
                                            choices.push(choice[fields[nameField].state.valueKey]);
                                            break;
                                        }
                                    }
                                }
                            }
                            fields[nameField].setCurrentValue(choices);
                        } else {
                            fields[nameField].setCurrentValue(val);
                        }
                    } else {
                        /* Traitement des champs radio et select en mode readOnly */
                        if ((fields[nameField].state.choices) && (this.state.readOnly || fields[nameField].state.readOnly )) {

                            for (let i = 0; i < fields[nameField].state.dataSource.length; i++) {
                                let choice = fields[nameField].state.dataSource[i];
                                if (val.toString() == choice[fields[nameField].state.valueKey]) {
                                    fields[nameField].setCurrentValue(choice[fields[nameField].state.valueKey]);
                                    break;
                                }
                            }
                        } else {
                            fields[nameField].setCurrentValue(val);
                        }
                    }
                }
            } else {
                if (fields[nameField] instanceof CheckBoxField) {
                    fields[nameField].setCurrentChecked(false);
                } else {
                    fields[nameField].setCurrentValue(null);
                }
            }
        }
    }

    /**
     * Traitement spécifique des notifications concernant les champs d'autocomplétion
     * @param fields champs du formulaire
     * @param notifs notifications d'erreurs de validation
     */
    private processAutocompleteErrors(fields: { [key: string]: DomAdapter<any, any> }, notifs: Notifications): void {
        let processedNotifs: Array<INotificationType> = notifs.getNotifications().map(
            function(notif: INotificationType): INotificationType {
                /* Parcours de tous les champs */
                Object.keys(fields).every(function(key: string): boolean {
                    let field: DomAdapter<any, any> = fields[key];
                    if (field instanceof AutoCompleteField) {
                        let autoField: AutoCompleteField<AutoCompleteFieldProps> = field as AutoCompleteField<AutoCompleteFieldProps>;
                        /* La notification référence le nom global du champ d'auto-complétion
                         ou bien le champ caché contenant la valeur :
                         on modifie cette référence pour pointer vers le champ de saisie libre */
                        // if (notif.field == autoField.getAttribute("name") ||
                        if (notif.field == autoField.state.name ||
                            notif.field == (autoField.getValueFieldName())) {
                            notif.field = autoField.getFreeTypingFieldName();

                            /* Fin de la boucle de parcours des auto-complete */
                            return false;
                        }
                    }
                    return true;
                }, this);
                return notif;
            }, this);
        notifs.setNotifications(processedNotifs);
    }

    /**
     * Déclenche les notifications correspondant aux éventuelles erreurs de validation
     * @param errors erreurs de validation de formulaire, éventuellement vides
     */
    private notifyErrors(errors: Array<ErrorObject>): void {
        if (errors) {
            let fieldsMessages = this.state.formMessages && this.state.formMessages.fields;
            let genericValidationMessages = this.i18n("form.validation");
            let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();

            let notificationsError: Notifications = FormUtils.getErrors(errors, fields, fieldsMessages, genericValidationMessages);

            /* Post-traitement des notifications concernant les champs d'autocomplétion */
            this.processAutocompleteErrors(fields, notificationsError);

            /* Met à jour les erreurs affichées par chaque composant champ */
            Object.keys(fields).every(function(key: string): boolean {
                let field: DomAdapter<any, any> = fields[key];
                if (field instanceof AbstractField) {
                    field.setErrors(notificationsError.getNotifications());
                }
                return true;
            });

            /* Emission des notifications */
            NotificationManager.notify(null, notificationsError);
        }
    }

    /**
     * Transforme les valeurs des champs déclarés avec le format "date-time" dans le schéma de validation :
     * effectue la conversion depuis la locale courante, vers le format ISO 8601. Ceci permet une validation isomorphique
     * côté client comme serveur en utilisant le même schéma, et la conversion automatique en objet Date côté backend REST
     * reste possible.
     * @param schema schéma de validation JSON-Schema
     * @param data données de formualaire
     */
    private transformDatesToISO(schema: any, data: any): void {
        if (schema && schema.properties && data) {
            let propNames: string[] = Object.keys(schema.properties);
            let property: any, propName: string;
            for (let i: number = 0; i < propNames.length; i++) {
                propName = propNames[i];
                property = schema.properties[propName];
                if (property.type == "object") {
                    /* Appel récursif sur les éventuelles propriétés incluses dans le sous-schéma */
                    this.transformDatesToISO(property, data[propName]);
                } else if (property.format == "date-time") {
                    if (data[propName]) {
                        let date: Date = Utils.dateUtils.parseInTZ(data[propName], this.state.calendarLocale.dateFormat);
                        if (date) {
                            /* La chaîne de caractères est une date valide pour la locale : on convertit en représentation ISO 8601.*/
                            data[propName] = date.toISOString();
                        }
                        /* Sinon la valeur incorrecte est conservée*/
                    }
                }
            }
        }
    }


    /**
     * Déclenche la validation du formulaire, notifie les erreurs éventuelles et exécute la fonction
     * onSubmit présente dans les propriétés s'il n'y a pas d'erreurs
     * @private
     */
    public validateAndSubmit() {
        if (this.formElement) {
            logger.trace("Validation et envoi du formulaire");

            let data = this.extractData();


            let options: ajv.Options = this.state.validationOptions;
            let schema = DataValidator.transformRequiredStrings(this.state.schema);

            this.transformDatesToISO(this.state.schema, data);
            let validationRes: IValidationResult = new DataValidator(schema, this.state.customValidators, options).validate(data);

            if (!validationRes.valid) {
                this.notifyErrors(validationRes.errors);
            } else {
                this.cleanFormErrors();
                if (this.state.onSubmit) {
                    this.state.onSubmit(data);
                }
            }
        }
    }

    /**
     * Supprime les nofifications d'erreurs et les erreurs associées à chaque champ de ce formulaire
     */
    cleanFormErrors(): void {
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        for (let fieldName in fields) {
            let field: DomAdapter<any, any> = fields[fieldName];
            if (field instanceof AbstractField) {
                (field as AbstractField<any, any>).setErrors(null);
            }
        }
        NotificationManager.clean(this.state.notifId);
    }

    /**
     * Met à jour les valeurs courantes des champs du formulaire et
     * supprime les nofifications d'erreurs et les erreurs associées à chaque champ de ce formulaire
     * @param data données du formulaire (clé : nom du champ -> valeur du champ)
     */
    updateFieldsAndClean(data: any) {
        this.updateFields(data);
        this.cleanFormErrors();
    }

    /**
     * Méthode permettant d'alimenter le bloc Notifications d'erreurs puis de déléguer l'évent au composant parent
     * @param e
     * @private
     */
    private _submitHornetForm(e: React.SyntheticEvent<HTMLElement>): void {
        /* e.preventDefault ne doit pas être 'débouncée', sinon la soumission par défaut du formulaire serait effectuée */
        e.preventDefault();

        this.debouncedValidateAndSubmit();
    }

    /** @override */
    protected propagateParentState(): void {
        /* Le composant parent se charge de propager les propriétés readOnly et disabled */
        super.propagateParentState();
        let fields: { [key: string]: DomAdapter<any, any> } = this.extractFields();
        Object.keys(fields).every(function(key: string): boolean {
            let field: DomAdapter<any, any> = fields[key];
            if (field instanceof AbstractField) {
                (field as AbstractField<any, any>).setMarkRequired(this.state.markRequired);
                (field as AbstractField<any, any>).setImgFilePath(this.state.imgFilePath);
            }
            return true;
        }, this);
    }

    /** @override */
    protected extractFields(): { [key: string]: DomAdapter<any, any> } {
        let fields: { [key: string]: DomAdapter<any, any> } = {};
        if (this.formElement) {
            for (let index = 0; index < this.formElement.elements.length; index++) {

                let item: Element = this.formElement.elements[index];
                if (item["name"]) {
                    if (item["__component"]) {
                        fields[item["name"]] = item["__component"];
                    } else {
                        if (fields[item["name"]]) {
                            fields[item["name"]].addHtmlElement(item);
                        } else {
                            fields[item["name"]] = new DomAdapter<any, any>();
                            fields[item["name"]].registerHtmlElement(item);
                        }
                    }
                }
            }
        }
        return fields;
    }

    /**
     * Méthode permettant de déterminer si le formulaire dispose d'un champ de type UploadFileField
     * Dans ce cas, on ajoute la propriété ["encType"] = "multipart/form-data" au formulaire
     * @param items
     * @returns {boolean}
     */
    private isMultiPartForm(items: Array<React.ReactChild>): boolean {

        let isMultiPart: boolean = false;

        React.Children.map(items, (child: React.ReactChild) => {
            if (!isMultiPart) {
                if (child != null) {
                    if (child["props"] && child["props"].children) {
                        isMultiPart = this.isMultiPartForm(child["props"].children);
                    }
                    if (!isMultiPart && ( child as React.ReactElement<any> ).type === UploadFileField) {
                        isMultiPart = true;
                    }
                }
            }
        });

        return isMultiPart;
    }

    /**
     * Méthode permettant de déterminer s'il y a au moins un champ requis.
     * @param items
     * @returns {boolean}
     */
    private isOneRequired(items: Array<React.ReactChild>): boolean {

        let isOneRequired: boolean = false;
        React.Children.map(items, (child: React.ReactChild) => {
            if (!isOneRequired) {
                if (child != null) {
                    if (child["props"] && child["props"].children) {
                        isOneRequired = this.isOneRequired(child["props"].children);
                    }
                    if (!isOneRequired && ( child as any).props && ( child as any).props.required == true) {
                        isOneRequired = true;
                    }
                }
            }
        });
        return isOneRequired;
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        let classes: ClassDictionary = {
            "form": true,
            "clear": true,
            /* Application du style CSS readonly à tout le bloc lorsque tous les champs sont en lecture seule */
            "readonly": this.state.readOnly
        };

        logger.trace("render(), HornetForm ");

        let customNotif = null;
        if (!this.state.customNotif) {
            customNotif = (<Notification id={this.state.notifId}/>);
        }

        /* La validation de formulaire HTML 5 est désactivée (noValidate="true") :
         on s'appuie uniquement sur la validation à la soumission et on a ainsi un rendu cohérent entre navigateurs. */

        let formProps = {
            name: this.state.name,
            className: this.state.className,
            method: "post",
            onSubmit: this._submitHornetForm,
            noValidate: true,
            onChange: this.state.onFormChange ? this.state.onFormChange : undefined,
            ref: this.registerForm
        };

        if (this.isMultiPartForm(this.state.children)) {
            formProps["encType"] = "multipart/form-data";
        }
        return (
            <section className="form-container">
                {customNotif}
                <div className={classNames(classes)}>
                    <form  {...formProps}>
                        {(this.state.subTitle || this.state.text
                            || (this.state.markRequired && !this.state.isMandatoryFieldsHidden)) ?
                            <div className="form-titles">
                                {this.state.subTitle ? <h1 className="form-soustitre">{this.state.subTitle}</h1> : null}
                                {this.state.text ? <p className="form-texte">{this.state.text}</p> : null}
                                {this.state.markRequired && !this.state.isMandatoryFieldsHidden ?
                                    <p className="discret">{this.i18n("form.fillField")}</p> : null}
                            </div>
                            : null}
                        {(this.state.children) ?
                            <div className="form-content">
                                <div>
                                    {this.state.children}
                                </div>
                            </div>
                            : null}
                    </form>
                </div>
            </section>
        );
    }

    /**
     * retourne un tableau de bouton pour la validation du formulaire
     * @param children
     * @returns {Array<any>}
     */
    private getButtonsArea(children): Array<any> {
        let tableauButtonsArea: Array<any> = [];
        React.Children.map(children, function(child: any) {
            if (child.type === ButtonsArea) {
                tableauButtonsArea.push(child);
            }
        });
        return tableauButtonsArea;
    }

}