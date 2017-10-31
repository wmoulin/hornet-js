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

import * as classNames from "classnames";
import * as _ from "lodash";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { DomAdapter } from "src/widget/form/dom-adapter";
import { FieldError, FieldErrorProps } from "src/widget/form/field-error";
import { INotificationType } from "hornet-js-core/src/notification/notification-manager";
import { HTML_ATTRIBUTES } from "src/widget/form/html-attributes";
import { ToolTip } from "src/widget/tool-tip/tool-tip";

import ComponentClass = __React.ComponentClass;
import ReactElement = __React.ReactElement;
import HTMLAttributes = __React.HTMLAttributes;
import ReactNode = __React.ReactNode;
import ClipboardEventHandler = __React.ClipboardEventHandler;
import CompositionEventHandler = __React.CompositionEventHandler;
import FocusEventHandler = __React.FocusEventHandler;
import FormEventHandler = __React.FormEventHandler;
import ReactEventHandler = __React.ReactEventHandler;
import KeyboardEventHandler = __React.KeyboardEventHandler;
import MouseEventHandler = __React.MouseEventHandler;
import DragEventHandler = __React.DragEventHandler;
import TouchEventHandler = __React.TouchEventHandler;
import UIEventHandler = __React.UIEventHandler;
import WheelEventHandler = __React.WheelEventHandler;
import AnimationEventHandler = __React.AnimationEventHandler;
import TransitionEventHandler = __React.TransitionEventHandler;

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.abstract-field");

/**
 * Propriétés standards pour un élément HTML
 */
export interface HornetBasicFormFieldProps
    extends HTMLStandardConfigAttributes,
        HTMLStandardFormAttributes,
        HTMLStandardGlobalAttributes,
        HTMLStandardPresentationAttributes,
        HornetFormFieldProps,
        ReactBasicDOMAttributes,
        ReactFormDOMAttributes,
        HornetComponentProps {
    name: string;
}

export interface HornetWrittableProps
    extends ReactClipboardDOMAttributes,
        ReactFormDOMAttributes,
        ReactKeyboardDOMAttributes {
}

export interface HornetClickableProps
    extends ReactBasicMouseDOMAttributes,
        ReactSelectDOMAttributes {
}


export interface HornetMediaProps
    extends HTMLStandardMediaAttributes,
        ReactMediaDOMAttributes,
        ReactImageDOMAttributes {
}

export interface HornetDraggableProps
    extends HTMLStandardGlobalAttributes,
        ReactDragDOMAttributes,
        HornetClickableProps {
}

export interface HTMLStandardConfigAttributes {
    accept?: string;
    acceptCharset?: string;
    action?: string;
    autoComplete?: string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    defaultChecked?:boolean;
    classID?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    disabled?: boolean;
    download?: any;
    encType?: string;
    high?: number;
    href?: string;
    hrefLang?: string;
    htmlFor?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    list?: string;
    low?: number;
    manifest?: string;
    method?: string;
    multiple?: boolean;
    name?: string;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    role?: string;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    sizes?: string;
    summary?: string;
    target?: string;
    type?: string;
    useMap?: string;
}

export interface HTMLStandardFormAttributes {
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    noValidate?: boolean;
    required?: boolean;
    wrap?: string;
}

export interface HTMLStandardGlobalAttributes {
    accessKey?: string;
    className?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    data?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    spellCheck?: boolean;
    style?: React.CSSProperties;
    tabIndex?: number;
    title?: string;
}

export interface HTMLStandardMediaAttributes {
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    async?: boolean;
    autoPlay?: boolean;
    capture?: boolean;
    controls?: boolean;
    coords?: string;
    crossOrigin?: string;
    kind?: string;
    label?: string;
    loop?: boolean;
    media?: string;
    mediaGroup?: string;
    muted?: boolean;
    poster?: string;
    preload?: string;
    src?: string;
    srcLang?: string;
    srcSet?: string;
    wmode?: string;
}

export interface HTMLStandardMetaAttributes {
    content?: string;
    httpEquiv?: string;
}

export interface HTMLStandardPresentationAttributes {
    alt?: string;
    autoFocus?: boolean;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    cols?: number;
    colSpan?: number;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    icon?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    rows?: number;
    rowSpan?: number;
    scope?: string;
    scoped?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    span?: number;
    srcDoc?: string;
    start?: number;
    step?: number | string;
    width?: number | string;
}

export interface HTMLRDFaAttributes {

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

}

export interface HTMLNonStandardAttributes {

    // Non-standard Attributes
    autoCapitalize?: string;
    autoCorrect?: string;
    autoSave?: string;
    color?: string;
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
    results?: number;
    security?: string;
    unselectable?: boolean;
    label?:string;
}

export interface HornetHTMLAttributes extends HTMLStandardConfigAttributes, HTMLStandardFormAttributes, HTMLStandardGlobalAttributes, HTMLStandardMediaAttributes,
    HTMLStandardMetaAttributes, HTMLStandardPresentationAttributes,
    HTMLNonStandardAttributes, HTMLRDFaAttributes {

}

export interface HornetProps extends HornetReactDOMAttributes, HornetHTMLAttributes {

}

/*Interfaces evennements*/
export interface HornetReactDOMAttributes
    extends ReactClipboardDOMAttributes,
        ReactComposeDOMAttributes,
        ReactFocusDOMAttributes,
        ReactFormDOMAttributes,
        ReactImageDOMAttributes,
        ReactKeyboardDOMAttributes,
        ReactMediaDOMAttributes,
        ReactBasicMouseDOMAttributes,
        ReactDragDOMAttributes,
        ReactSelectDOMAttributes,
        ReactTouchDOMAttributes,
        ReactScrollDOMAttributes,
        ReactWheelDOMAttributes,
        ReactAnimationDOMAttributes,
        ReactTransitionDOMAttributes,
        ReactBasicDOMAttributes {
}

export interface ReactMouseDOMAttributes
    extends ReactBasicMouseDOMAttributes,
        ReactDragDOMAttributes {
}

export interface ReactClipboardDOMAttributes {
    onCopy?: ClipboardEventHandler<HTMLInputElement>;
    onCut?: ClipboardEventHandler<HTMLInputElement>;
    onPaste?: ClipboardEventHandler<HTMLInputElement>;
}

export interface ReactComposeDOMAttributes {
    onCompositionEnd?: CompositionEventHandler<HTMLElement>;
    onCompositionStart?: CompositionEventHandler<HTMLElement>;
    onCompositionUpdate?: CompositionEventHandler<HTMLElement>;
}

export interface ReactFocusDOMAttributes {
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

export interface ReactFormDOMAttributes {
    onChange?: FormEventHandler<HTMLElement>;
    onInput?: FormEventHandler<HTMLElement>;
    onSubmit?: FormEventHandler<HTMLElement>;
}

export interface ReactImageDOMAttributes {
    onLoad?: ReactEventHandler<HTMLElement>;
    onError?: ReactEventHandler<HTMLElement>; // also a Media Event
}

export interface ReactKeyboardDOMAttributes {
    onKeyDown?: KeyboardEventHandler<HTMLElement>;
    onKeyPress?: KeyboardEventHandler<HTMLElement>;
    onKeyUp?: KeyboardEventHandler<HTMLElement>;
}

export interface ReactMediaDOMAttributes {
    onError?: ReactEventHandler<HTMLElement>; // also a Media Event
    onAbort?: ReactEventHandler<HTMLMediaElement>;
    onCanPlay?: ReactEventHandler<HTMLMediaElement>;
    onCanPlayThrough?: ReactEventHandler<HTMLMediaElement>;
    onDurationChange?: ReactEventHandler<HTMLMediaElement>;
    onEmptied?: ReactEventHandler<HTMLMediaElement>;
    onEncrypted?: ReactEventHandler<HTMLMediaElement>;
    onEnded?: ReactEventHandler<HTMLMediaElement>;
    onLoadedData?: ReactEventHandler<HTMLMediaElement>;
    onLoadedMetadata?: ReactEventHandler<HTMLMediaElement>;
    onLoadStart?: ReactEventHandler<HTMLMediaElement>;
    onPause?: ReactEventHandler<HTMLMediaElement>;
    onPlay?: ReactEventHandler<HTMLMediaElement>;
    onPlaying?: ReactEventHandler<HTMLMediaElement>;
    onProgress?: ReactEventHandler<HTMLMediaElement>;
    onRateChange?: ReactEventHandler<HTMLMediaElement>;
    onSeeked?: ReactEventHandler<HTMLMediaElement>;
    onSeeking?: ReactEventHandler<HTMLMediaElement>;
    onStalled?: ReactEventHandler<HTMLMediaElement>;
    onSuspend?: ReactEventHandler<HTMLMediaElement>;
    onTimeUpdate?: ReactEventHandler<HTMLMediaElement>;
    onVolumeChange?: ReactEventHandler<HTMLMediaElement>;
    onWaiting?: ReactEventHandler<HTMLMediaElement>;
}

export interface ReactBasicMouseDOMAttributes {
    onClick?: MouseEventHandler<HTMLElement>;
    onContextMenu?: MouseEventHandler<HTMLElement>;
    onDoubleClick?: MouseEventHandler<HTMLElement>;
    onMouseDown?: MouseEventHandler<HTMLElement>;
    onMouseEnter?: MouseEventHandler<HTMLElement>;
    onMouseLeave?: MouseEventHandler<HTMLElement>;
    onMouseMove?: MouseEventHandler<HTMLElement>;
    onMouseOut?: MouseEventHandler<HTMLElement>;
    onMouseOver?: MouseEventHandler<HTMLElement>;
    onMouseUp?: MouseEventHandler<HTMLElement>;
}

export interface ReactDragDOMAttributes {
    onDrag?: DragEventHandler<HTMLElement>;
    onDragEnd?: DragEventHandler<HTMLElement>;
    onDragEnter?: DragEventHandler<HTMLElement>;
    onDragExit?: DragEventHandler<HTMLElement>;
    onDragLeave?: DragEventHandler<HTMLElement>;
    onDragOver?: DragEventHandler<HTMLElement>;
    onDragStart?: DragEventHandler<HTMLElement>;
    onDrop?: DragEventHandler<HTMLElement>;
}

export interface ReactSelectDOMAttributes {
    onSelect?: ReactEventHandler<HTMLElement>;
}

export interface ReactTouchDOMAttributes {
    onTouchCancel?: TouchEventHandler<HTMLElement>;
    onTouchEnd?: TouchEventHandler<HTMLElement>;
    onTouchMove?: TouchEventHandler<HTMLElement>;
    onTouchStart?: TouchEventHandler<HTMLElement>;
}

export interface ReactScrollDOMAttributes {
    onScroll?: UIEventHandler<HTMLElement>;
}

export interface ReactWheelDOMAttributes {
    onWheel?: WheelEventHandler<HTMLElement>;
}

export interface ReactAnimationDOMAttributes {
    onAnimationStart?: AnimationEventHandler<HTMLElement>;
    onAnimationEnd?: AnimationEventHandler<HTMLElement>;
    onAnimationIteration?: AnimationEventHandler<HTMLElement>;
}

export interface ReactTransitionDOMAttributes {
    onTransitionEnd?: TransitionEventHandler<HTMLElement>;
}

export interface ReactBasicDOMAttributes {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string;
    };
}

export interface HornetFormFieldProps {
    /** Nom du champ. Il peut s'agir d'un "path" dans la hiérarchie d'objets de données extraites depuis le formulaire,
     * ou servant à l'initialiser. Exemple : "ville.pays.id" */
    name: string;
    label?: string;
    abbr?: string;
    /** Classe(s) CSS du bloc englobant le libellé et le champ de formulaire */
    groupClass?: string;
    /** Classe(s) CSS du libellé */
    labelClass?: string;
    /** Classe(s) CSS du champ de formulaire */
    fieldClass?: string;
    /* Texte de l'infobulle */
    toolTip?: string;
    /* Icône d'infobulle */
    icoToolTip?: string;
    /** Préfixe (texte ou noeud) éventuellement ajouté entre le libellé et le champ de saisie.
     * Exemples : <Field prefix="M." name="nom"/> <Field prefix={<strong>M.</strong>} name="nom"/>*/
    prefix?: any;
    /** Suffixe (texte ou noeud) éventuellement ajouté après le champ de saisie.
     * Exemples : <Field name="taille" suffix="cm"/> <Field name="taille" suffix={<strong>cm</strong>} />*/
    suffix?: any;
    /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
    markRequired?: boolean;
    /** Titre à afficher sous l'asterisque lorsque le champ est obligatoire */
    requiredLabel?: string;
    imgFilePath?: string;

    // Hornet specific Attributes
    /* Valeur du champ */
    currentValue?: string | string[];

    /** Composant générant le rendu d'erreurs de validation liées au champ */
    errorComponent?: ComponentClass<FieldErrorProps>;

    /** Erreurs de validation */
    errors?: INotificationType[];

    // gestion des champs sur une ligne
    inline?: InlineStyle;
}

export enum InlineStyle {
    NONE,
    FIELD,
    ALL
}

export interface AbstractFieldProps extends HornetBasicFormFieldProps {

}

/**
 * Représente un champ de formulaire.
 */
export abstract class AbstractField<P extends AbstractFieldProps, S> extends DomAdapter<AbstractFieldProps, any> {

    /** Valeurs par défaut des propriétés */
    static defaultProps: any = {
        /* Le libellé occupe la moitié du neoud parent */
        labelClass: "",
        /* Le champ occupe la moitié du neoud parent */
        fieldClass: "",
        icoToolTip: "/img/tooltip/tooltip.svg",
        markRequired: true,
        errorComponent: FieldError,
        lang: (Utils.getCls("hornet.internationalization") && Utils.getCls("hornet.internationalization").lang) ? Utils.getCls("hornet.internationalization").lang : "fr",
        inline: InlineStyle
    };

    static Inline = InlineStyle;

    constructor(props?: AbstractFieldProps, context?: any) {
        super(props, context);
        this.makeState(this.state);
    }


    componentDidMount() {
        this.mounted = true;
        if (this.htmlElement) {
            this.htmlElement.addEventListener("focus", this.handleSimulateScroll);
        } else {
            if (this.multipleElement) {
                for (let element in this.multipleElement) {
                    this.multipleElement[element].addEventListener("focus", this.handleSimulateScroll);
                }
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.htmlElement) {
            this.htmlElement.removeEventListener("focus", this.handleSimulateScroll);
        } else {
            if (this.multipleElement) {
                for (let element in this.multipleElement) {
                    this.multipleElement[element].removeEventListener("focus", this.handleSimulateScroll);
                }
            }
        }
    }

    /**
     * Génère l'état interne du composant à partir des propriétés indiquées
     * @param props
     */
    makeState<S>(state: AbstractFieldProps): void {
        this.processHtmlProps(state);
    }

    // Setters

    setAbbr(abbr: string, callback?: () => any): this {
        this.setState({abbr: abbr}, callback);
        return this;
    }

    setGroupClass(groupClass: string, callback?: () => any): this {
        this.setState({groupClass: groupClass}, callback);
        return this;
    }

    setLabelClass(labelClass: string, callback?: () => any): this {
        this.setState({labelClass: labelClass}, callback);
        return this;
    }

    setFieldClass(fieldClass: string, callback?: () => any): this {
        this.setState({fieldClass: fieldClass}, callback);
        return this;
    }

    setToolTip(toolTip: string, callback?: () => any): this {
        this.setState({toolTip: toolTip}, callback);
        return this;
    }

    setIcoToolTip(icoToolTip: string, callback?: () => any): this {
        this.setState({icoToolTip: icoToolTip}, callback);
        return this;
    }

    setPrefix(prefix: any, callback?: () => any): this {
        this.setState({prefix: prefix}, callback);
        return this;
    }

    setSuffix(suffix: any, callback?: () => any): this {
        this.setState({suffix: suffix}, callback);
        return this;
    }

    setMarkRequired(markRequired: boolean, callback?: () => any): this {
        this.setState({markRequired: markRequired}, callback);
        return this;
    }

    setrequiredLabel(requiredLabel: string, callback?: () => any): this {
        this.setState({requiredLabel: requiredLabel}, callback);
        return this;
    }

    setImgFilePath(imgFilePath: string, callback?: () => any): this {
        this.setState({imgFilePath: imgFilePath}, callback);
        return this;
    }


    setErrorComponent(errorComponent: ComponentClass<FieldErrorProps>, callback?: () => any): this {
        this.setState({errorComponent: errorComponent}, callback);
        return this;
    }

    setErrors(errors: INotificationType[], callback?: () => any): this {
        this.setState({errors: errors}, callback);
        return this;
    }

    /**
     * @override
     */
    setAttribute(name: string, value: any): this {
        super.setAttribute(name, value);
        /* L'adaptateur DOM met à jour l'élément dans le DOM : on met ici à jour l'état interne du composant */
        let newState = {};
        newState[name] = value;
        this.setState(newState);
        return this;
    }

    /**
     * @override
     */
    setCurrentChecked(value): this {
        super.setCurrentChecked(value);
        /* L'adaptateur DOM met à jour l'élément dans le DOM : on met ici à jour l'état interne du composant */
        this.setState({currentChecked: value});
        return this;
    }

    /**
     * @override
     */
    setCurrentValue(value: any): this {
        super.setCurrentValue(value);
        /* L'adaptateur DOM met à jour l'élément dans le DOM : on met ici à jour l'état interne du composant */
        this.setState({currentValue: value});
        return this;
    }

    /**
     * @override
     */
    setReadOnly(value: any): this {
        this.setState({readOnly: value});
        return this;
    }

    /**
     * @override
     */
    setDisabled(value: any): this {
        this.setState({disabled: value});
        return this;
    }

    hasErrors(): boolean {
        let fieldErrors: INotificationType[] = null;
        if (this.state.errors) {
            fieldErrors = this.state.errors.filter(function(error: INotificationType): boolean {
                return (error.field == this.state.name || error.additionalInfos.linkedFieldsName == this.state.name);
            }, this);
        }
        if (fieldErrors && (fieldErrors.length > 0)) {
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        let type: string = this.state.type;
        if (type) {
            type = type.toLowerCase();
        }

        let cx = classNames(
            this.state.groupClass,
            "abstractfield-container",
            {
                "inline": this.state.inline == InlineStyle.ALL,
                "readonly": this.state.readOnly
            }
        );

        /* On ne génère pas le rendu du label et des div conteneurs lorsque le champ est caché */
        return ((type == "hidden") ? this.renderWidget() :
                <div className={cx}>
                    {this.state.label ? this.renderLabel(this.state.id,
                        this.state.name, this.state.label, this.state.required) : null}
                    {this.renderField()}
                </div>
        );
    }

    /**
     * Met à jour l'état interne avec les nouvelles propriétés.
     * Surcharge la méthode parente : les attributs HTML standards sont initialisés via la fonction générique setAttribute.
     * @param nextProps nouvelles propriétés
     * @param nextContext nouveau contexte
     * @override
     */
    componentWillReceiveProps(nextProps: any, nextContext: any): void {
        for (let key in nextProps) {
            /* On doit s'assurer que chaque propriété a effectivement changé, car componentWillReceiveProps peut aussi
             * être appelée alors qu'aucune propriété n'a changé (cf.http://facebook.github.io/react/blog/2016/01/08/A-implies-B-does-not-imply-B-implies-A.html)
             * Dans ce cas cela poserait problème, car l'état pourrait avaoir été modifié
             * via un setter alors que la propriété utilisée initialement pour le constructeur n'a pas changé.*/
            if (this.props[key] != nextProps[key]) {
                if (key in HTML_ATTRIBUTES) {
                    /* Propriété HTML standard */
                    this.setAttribute(key, nextProps[key]);
                } else {
                    /* Propriété spécifique hornet : un 'setter' est certainement présent */
                    let setterName: string = _.camelCase("set " + (key));
                    if (this[setterName]) {
                        this[setterName](nextProps[key]);
                    } else {
                        let state: S;
                        state[key] = nextProps[key];
                        this.setState(state);
                    }
                }
            }
        }
    }

    /**
     * Génère le rendu des erreurs de validation éventuelles
     */
    renderErrors(): ReactElement<FieldErrorProps> {
        let fieldErrorProps: FieldErrorProps = {
            errors: this.state.errors,
            fieldName: this.state.name,
            hideError: this.state.hideError
        };
        // get the field error component by state ?
        let Error = this.state.errorComponent;
        return <Error {...fieldErrorProps} />;
    }

    /**
     * Génère le rendu du libellé pour le champ
     * @param fieldId identifiant du champ
     * @param fieldName nom du champ
     * @param label libellé à afficher
     * @param required indique si le champ est obligatoire
     * @returns {any}
     */
    renderLabel(fieldId: string, fieldName: string, label: string, required: boolean): JSX.Element {
        let urlTheme = this.state.imgFilePath || AbstractField.genUrlTheme(),
            urlIcoTooltip = urlTheme + this.state.icoToolTip;

        if ((this.state as any).abbr && !this.state.lang) {
            logger.warn("Field ", fieldName, " Must have lang with abbr configuration");
        }

        let ariaDescribedby = {"aria-describedby": fieldName + "Tooltip"};

        return (
            <div className={this.state.labelClass + " label-container"}>
                <label htmlFor={fieldId} id={fieldName + "Label"}
                       className="label-content" {...this.state.toolTip ? ariaDescribedby : null}>
                    {(this.state.abbr) ?
                        <abbr lang={this.state.lang} title={this.state.abbr}>
                            <span className="label-abbr">{label}</span>
                        </abbr> : <span className="label">{label}</span>}

                    {required && this.state.markRequired ?
                        <span className="label-required"><abbr title={this.getRequiredLabel()}>*</abbr></span> : null}

                    {this.state.toolTip ?
                        <ToolTip alt={this.state.toolTip} src={urlIcoTooltip} idSpan={fieldName + "Tooltip"}/> : null}
                </label>
            </div>
        );
    }

    protected getRequiredLabel(): string {
        let requiredLabel: string = this.state.requiredLabel;
        if (!requiredLabel) {
            let i18nRequiredLabel = this.i18n("form.requiredLabel");
            if (i18nRequiredLabel) {
                requiredLabel = i18nRequiredLabel;
            } else {
                requiredLabel = "Obligatoire";
            }
        }
        return requiredLabel;
    }

    /**
     * Applique certaines règles par défaut sur les propriétés HTML standards
     * @param propriétés à traiter. Cet objet est éventuellement modifié.
     */
    processHtmlProps(state: AbstractFieldProps): void {
        if (state) {

            /* Si l'id n'est pas explicitement spécifié, on lui affecte la même valeur que le nom, car il sera utilisé
             * comme ancre pour les messages d'erreur de validation */
            if (state.name && !state.id) {
                state.id = state.name;
            }
            /* Lorsque le champ est requis, ajoute automatiquement la propriété "aria-required" pour assurer le maximum
             de compatibilité avec les outils d'accessibilité */
            if (state.required === true) {
                state["aria-required"] = true;
            }
        }
    }

    /**
     * @returns {TResult} les propriétés html standard de ce champ
     */
    getHtmlProps(): AbstractFieldProps {
        /* On n'inclut pas les propriétés spécifiques qui ne concernent pas un champ HTML standard */
        let htmlProps: AbstractFieldProps = {name: ""};
        for (let key in this.state) {
            if (key in HTML_ATTRIBUTES) {
                htmlProps[key] = this.state[key];
            }
        }

        if (this.hasErrors()) {
            htmlProps["aria-describedby"] = `${this.state.name}-error`;
        }

        this.processHtmlProps(htmlProps);
        delete htmlProps["label"];
        return htmlProps;
    }


    /**
     * Génère le rendu de l'élément permettant la saisie. A implémenter dans les sous-classes.
     */
    abstract renderWidget(): JSX.Element;

    /**
     * Génère le rendu des élements assurant la saisie des valeurs
     * @returns {any}
     */
    renderField(): JSX.Element {
        return (
            <div className={this.state.fieldClass + " abstractfield-field-content"}>
                {this.state.prefix ? <span className="abstractfield-field-prefix">{this.state.prefix}</span> : null}
                {this.renderWidget()}
                {this.state.suffix ? <span className="abstractfield-field-suffix">{this.state.suffix}</span> : null}
                {this.renderErrors()}
            </div>
        );
    }

    /**
     *  Lorsque le champ prends le focus on verifie qu'il n'est pas caché par le bandeau
     *  si c'est le cas on effecteur un scroll du double de la hauteur du bandeau
     */
    handleSimulateScroll() {
        let elementWithFocusPosTop = this.htmlElement ? this.htmlElement.getBoundingClientRect().top : this.multipleElement[0].getBoundingClientRect().top;
        let stickyElmtPos = (document.getElementById("banner")) ? document.getElementById("banner").offsetHeight : null;

        if (elementWithFocusPosTop <= stickyElmtPos) {
            window.scrollBy(0, -(window.innerHeight / 2));
        }
    }

}