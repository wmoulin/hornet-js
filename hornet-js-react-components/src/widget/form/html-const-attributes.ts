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

import {
    HTMLStandardConfigAttributes,
    HTMLStandardFormAttributes,
    HTMLStandardGlobalAttributes,
    HTMLStandardMediaAttributes,
    HTMLStandardMetaAttributes,
    HTMLStandardPresentationAttributes,
    HTMLRDFaAttributes,
    HTMLNonStandardAttributes,
    ReactClipboardDOMAttributes,
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
    ReactBasicDOMAttributes
} from "src/widget/form/abstract-field";


// TODO tetaudf - retirer les constantes en évitant la valorisation explicite grâce au décorateur @AutoInit
export const HTML_STANDARD_CONFIG_ATTRIBUTES: HTMLStandardConfigAttributes = {
    accept: "",
    acceptCharset: "",
    action: "",
    autoComplete: "",
    charSet: "",
    challenge: "",
    checked: true,
    classID: "",
    dateTime: "",
    default: true,
    defer: true,
    disabled: true,
    download: null,
    encType: "",
    high: 1,
    href: "",
    hrefLang: "",
    htmlFor: "",
    inputMode: "",
    integrity: "",
    is: "",
    keyParams: "",
    keyType: "",
    list: "",
    low: 1,
    manifest: "",
    method: "",
    multiple: true,
    name: "",
    open: true,
    optimum: 1,
    pattern: "",
    placeholder: "",
    radioGroup: "",
    readOnly: true,
    rel: "",
    role: "",
    sandbox: "",
    scrolling: "",
    seamless: true,
    sizes: "",
    summary: "",
    target: "",
    type: "",
    useMap: ""
};

export const HTML_STANDARD_FORM_ATTRIBUTES: HTMLStandardFormAttributes = {
    form: "",
    formAction: "",
    formEncType: "",
    formMethod: "",
    formNoValidate: true,
    formTarget: "",
    noValidate: true,
    required: true,
    wrap: ""
};

export const HTML_STANDARD_GLOBAL_ATTRIBUTES: HTMLStandardGlobalAttributes = {
    accessKey: "",
    className: "",
    contentEditable: true,
    contextMenu: "",
    data: "",
    dir: "",
    draggable: true,
    hidden: true,
    id: "",
    lang: "",
    spellCheck: true,
    style: null,
    tabIndex: 1,
    title: ""
};

export const HTML_STANDARD_MEDIA_ATTRIBUTES: HTMLStandardMediaAttributes = {
    allowFullScreen: true,
    allowTransparency: true,
    async: true,
    autoPlay: true,
    capture: true,
    controls: true,
    coords: "",
    crossOrigin: "",
    kind: "",
    label: "",
    loop: true,
    media: "",
    mediaGroup: "",
    muted: true,
    poster: "",
    preload: "",
    src: "",
    srcLang: "",
    srcSet: "",
    wmode: ""
};

export const HTML_STANDARD_META_ATTRIBUTES: HTMLStandardMetaAttributes = {
    content: "",
    httpEquiv: ""
};

export const HTML_STANDARD_PRESENTATION_ATTRIBUTES: HTMLStandardPresentationAttributes = {
    alt: "",
    autoFocus: true,
    cellPadding: "",
    cellSpacing: "",
    cols: 1,
    colSpan: 1,
    frameBorder: "",
    headers: "",
    height: "",
    icon: "",
    marginHeight: 1,
    marginWidth: 1,
    max: "",
    maxLength: 1,
    min: "",
    minLength: 1,
    rows: 1,
    rowSpan: 1,
    scope: "",
    scoped: true,
    selected: true,
    shape: "",
    size: 1,
    span: 1,
    srcDoc: "",
    start: 1,
    step: "",
    width: ""
};

export const HTML_RDFA_ATTRIBUTES: HTMLRDFaAttributes = {
    about: "",
    datatype: "",
    inlist: null,
    prefix: "",
    property: "",
    resource: "",
    typeof: "",
    vocab: ""
};

export const HTML_NON_STANDARD_ATTRIBUTES: HTMLNonStandardAttributes = {
    autoCapitalize: "",
    autoCorrect: "",
    autoSave: "",
    color: "",
    itemProp: "",
    itemScope: true,
    itemType: "",
    itemID: "",
    itemRef: "",
    results: 1,
    security: "",
    unselectable: true
};

export const REACT_CLIPBOARD_DOM_ATTRIBUTES: ReactClipboardDOMAttributes = {
    onCopy: null,
    onCut: null,
    onPaste: null
};

export const REACT_COMPOSE_DOM_ATTRIBUTES: ReactComposeDOMAttributes = {
    onCompositionEnd: null,
    onCompositionStart: null,
    onCompositionUpdate: null
};

export const REACT_FOCUS_DOM_ATTRIBUTES: ReactFocusDOMAttributes = {
    onFocus: null,
    onBlur: null
};

export const REACT_FORM_DOM_ATTRIBUTES: ReactFormDOMAttributes = {
    onChange: null,
    onInput: null,
    onSubmit: null
};

export const REACT_IMAGE_DOM_ATTRIBUTES: ReactImageDOMAttributes = {
    onLoad: null,
    onError: null
};

export const REACT_KEYBOARD_DOM_ATTRIBUTES: ReactKeyboardDOMAttributes = {
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null
};

export const REACT_MEDIA_DOM_ATTRIBUTES: ReactMediaDOMAttributes = {
    onAbort: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onDurationChange: null,
    onEmptied: null,
    onEncrypted: null,
    onEnded: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onProgress: null,
    onRateChange: null,
    onSeeked: null,
    onSeeking: null,
    onStalled: null,
    onSuspend: null,
    onTimeUpdate: null,
    onVolumeChange: null,
    onWaiting: null
};

export const REACT_BASIC_MOUSE_DOM_ATTRIBUTES: ReactBasicMouseDOMAttributes = {
    onClick: null,
    onContextMenu: null,
    onDoubleClick: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null
};

export const REACT_DRAG_DOM_ATTRIBUTES: ReactDragDOMAttributes = {
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null
};

export const REACT_SELECT_DOM_ATTRIBUTES: ReactSelectDOMAttributes = {
    onSelect: null
};

export const REACT_TOUCH_DOM_ATTRIBUTES: ReactTouchDOMAttributes = {
    onTouchCancel: null,
    onTouchEnd: null,
    onTouchMove: null,
    onTouchStart: null
};

export const REACT_SCROLL_DOM_ATTRIBUTES: ReactScrollDOMAttributes = {
    onScroll: null
};

export const REACT_WHEEL_DOM_ATTRIBUTES: ReactWheelDOMAttributes = {
    onWheel: null
};

export const REACT_ANIMATION_DOM_ATTRIBUTES: ReactAnimationDOMAttributes = {
    onAnimationStart: null,
    onAnimationEnd: null,
    onAnimationIteration: null
};

export const REACT_TRANSITION_DOM_ATTRIBUTES: ReactTransitionDOMAttributes = {
    onTransitionEnd: null
};

export const REACT_BASIC_DOM_ATTRIBUTES: ReactBasicDOMAttributes = {};

// TODO tetaudf utiliser un decorator @AutoInit pour ne plus avoir à déclarer un objet avec des valeurs par défaut
// TODO tetaudf ex : @AutoInit
// TODO tetaudf      HTML_STANDARD_CONFIG_ATTRIBUTES: HTMLStandardConfigAttributes;
export class HtmlAttributes {

    static HTML_STANDARD_CONFIG_ATTRIBUTES: HTMLStandardConfigAttributes = HTML_STANDARD_CONFIG_ATTRIBUTES;

    static HTML_STANDARD_FORM_ATTRIBUTES: HTMLStandardFormAttributes = HTML_STANDARD_FORM_ATTRIBUTES;

    static HTML_STANDARD_GLOBAL_ATTRIBUTES: HTMLStandardGlobalAttributes = HTML_STANDARD_GLOBAL_ATTRIBUTES;

    static HTML_STANDARD_MEDIA_ATTRIBUTES: HTMLStandardMediaAttributes = HTML_STANDARD_MEDIA_ATTRIBUTES;

    static HTML_STANDARD_META_ATTRIBUTES: HTMLStandardMetaAttributes = HTML_STANDARD_META_ATTRIBUTES;

    static HTML_STANDARD_PRESENTATION_ATTRIBUTES: HTMLStandardPresentationAttributes = HTML_STANDARD_PRESENTATION_ATTRIBUTES;

    static HTML_RDFA_ATTRIBUTES: HTMLRDFaAttributes = HTML_RDFA_ATTRIBUTES;

    static HTML_NON_STANDARD_ATTRIBUTES: HTMLNonStandardAttributes = HTML_NON_STANDARD_ATTRIBUTES;

    static REACT_CLIPBOARD_DOM_ATTRIBUTES: ReactClipboardDOMAttributes = REACT_CLIPBOARD_DOM_ATTRIBUTES;

    static REACT_COMPOSE_DOM_ATTRIBUTES: ReactComposeDOMAttributes = REACT_COMPOSE_DOM_ATTRIBUTES;

    static REACT_FOCUS_DOM_ATTRIBUTES: ReactFocusDOMAttributes = REACT_FOCUS_DOM_ATTRIBUTES;

    static REACT_FORM_DOM_ATTRIBUTES: ReactFormDOMAttributes = REACT_FORM_DOM_ATTRIBUTES;

    static REACT_IMAGE_DOM_ATTRIBUTES: ReactImageDOMAttributes = REACT_IMAGE_DOM_ATTRIBUTES;

    static REACT_KEYBOARD_DOM_ATTRIBUTES: ReactKeyboardDOMAttributes = REACT_KEYBOARD_DOM_ATTRIBUTES;

    static REACT_MEDIA_DOM_ATTRIBUTES: ReactMediaDOMAttributes = REACT_MEDIA_DOM_ATTRIBUTES;

    static REACT_BASIC_MOUSE_DOM_ATTRIBUTES: ReactBasicMouseDOMAttributes = REACT_BASIC_MOUSE_DOM_ATTRIBUTES;

    static REACT_DRAG_DOM_ATTRIBUTES: ReactDragDOMAttributes = REACT_DRAG_DOM_ATTRIBUTES;

    static REACT_SELECT_DOM_ATTRIBUTES: ReactSelectDOMAttributes = REACT_SELECT_DOM_ATTRIBUTES;

    static REACT_TOUCH_DOM_ATTRIBUTES: ReactTouchDOMAttributes = REACT_TOUCH_DOM_ATTRIBUTES;

    static REACT_SCROLL_DOM_ATTRIBUTES: ReactScrollDOMAttributes = REACT_SCROLL_DOM_ATTRIBUTES;

    static REACT_WHEEL_DOM_ATTRIBUTES: ReactWheelDOMAttributes = REACT_WHEEL_DOM_ATTRIBUTES;

    static REACT_ANIMATION_DOM_ATTRIBUTES: ReactAnimationDOMAttributes = REACT_ANIMATION_DOM_ATTRIBUTES;

    static REACT_TRANSITION_DOM_ATTRIBUTES: ReactTransitionDOMAttributes = REACT_TRANSITION_DOM_ATTRIBUTES;

    static REACT_BASIC_DOM_ATTRIBUTES: ReactBasicDOMAttributes = REACT_BASIC_DOM_ATTRIBUTES;
};