	/// <reference path="../definition.d.ts" />
declare module "hornet-js-components/src/hornet-component" {
	import React = require("react");
	import BaseStore = require("fluxible/addons/BaseStore");
	class HornetComponent<P, S> extends React.Component<P, S> {
	    static displayName: string;
	    constructor(props?: any, context?: any);
	    getStore: <ST extends BaseStore>(store: {
	        new (dispatcher: IDispatcher): ST;
	    }) => ST;
	    executeAction: (action: Function, data?: any) => void;
	    genUrlTheme: (path: string) => string;
	    genUrl: (path?: string) => string;
	    getContextPath: () => string;
	    genUrlStatic: (path?: string) => string;
	    i18n: (keysString: string) => any;
	    throttle: (fn: Function, conf?: any) => Function;
	    /**
	     * Fonction à utiliser dans une annotation TypeScript pour appliquer les mixins.
	     * Exemple:
	     * @HornetComponent.ApplyMixins()
	     * class HomePage extends HornetComponent<any,any> {
	     * [...]
	     * }
	     * @param mixins Un tableau optionnel de mixins à appliquer sur le composant
	     * @param applyDefaultMixins Indique si les mixins par défaut doivent être appliqués. true par défaut
	     */
	    static ApplyMixins(mixins?: any[], applyDefaultMixins?: boolean): ClassDecorator;
	    /**
	     * Fonction à utiliser dans une annotation TypeScript pour automatiquement binder une méthode sur l'instance du composant.
	     * Exemple:
	     * class MyComponent extends HornetComponent<any,any> {
	     * [...]
	     * @HornetComponent.AutoBind
	     * onSubmit() {
	     *  [...]
	     * }
	     * [...]
	     * }
	     * @return {any}
	     *
	     */
	    static AutoBind: MethodDecorator & ClassDecorator;
	}
	export = HornetComponent;
	
}

declare module "hornet-js-components/src/button/button-props" {
	import React = require("react");
	export interface ButtonProps {
	    item?: ItemProps;
	    disabled?: boolean;
	}
	export interface ItemProps {
	    type?: string;
	    id?: string;
	    name?: string;
	    value?: string;
	    onClick?: React.MouseEventHandler;
	    className?: string;
	    label?: string;
	    title?: string;
	}
	
}

declare module "hornet-js-components/src/button/button" {
	import React = require("react");
	import PropTypesNs = require("hornet-js-components/src/button/button-props");
	class Button extends React.Component<PropTypesNs.ButtonProps, any> {
	    static displayName: string;
	    static propTypes: {
	        item: React.Validator<any>;
	        disabled: React.Requireable<any>;
	    };
	    static defaultProps: {
	        disabled: boolean;
	    };
	    render(): JSX.Element;
	}
	export = Button;
	
}

declare module "hornet-js-components/src/dialog/alert-props" {
	import React = require("react");
	export interface AlertProps extends React.Props<any> {
	    isVisible?: boolean;
	    onClickOk?: React.MouseEventHandler;
	    onClickCancel?: React.MouseEventHandler;
	    onClickClose?: React.MouseEventHandler;
	    title?: string;
	    message: string;
	    valid?: string;
	    cancel?: string;
	    validTitle?: string;
	    cancelTitle?: string;
	    underlayClickExits?: boolean;
	    escapeKeyExits?: boolean;
	}
	
}

declare module "hornet-js-components/src/dialog/alert" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/dialog/alert-props");
	class Alert extends HornetComponent<PropTypesNs.AlertProps, any> {
	    static displayName: string;
	    static propTypes: {
	        isVisible: React.Requireable<any>;
	        onClickOk: React.Requireable<any>;
	        onClickCancel: React.Requireable<any>;
	        onClickClose: React.Requireable<any>;
	        title: React.Requireable<any>;
	        message: React.Validator<any>;
	        valid: React.Requireable<any>;
	        cancel: React.Requireable<any>;
	        validTitle: React.Requireable<any>;
	        cancelTitle: React.Requireable<any>;
	        underlayClickExits: React.Requireable<any>;
	        escapeKeyExits: React.Requireable<any>;
	    };
	    static defaultProps: {
	        isVisible: boolean;
	        underlayClickExits: boolean;
	        escapeKeyExits: boolean;
	    };
	    constructor(props?: PropTypesNs.AlertProps, context?: any);
	    render(): JSX.Element;
	    /**
	     * Configuration du bouton OK
	     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (boolean|string), onClick: (*|defaultFunction)}}
	     * @private
	     */
	    private _configOKButton();
	    /**
	     * Configuration du bouton ANNULER
	     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (*|string|cancel), onClick: (*|defaultFunction)}}
	     * @private
	     */
	    private _configCancelButton();
	    /**
	     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getValid();
	    /**
	     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getCancel();
	    /**
	     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getValidTitle();
	    /**
	     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getCancelTitle();
	}
	export = Alert;
	
}

declare module "hornet-js-components/src/dialog/modal-props" {
	import React = require("react");
	export interface ModalProps extends React.Props<any> {
	    onClickClose?: React.MouseEventHandler;
	    isVisible: boolean;
	    title?: string;
	    hideTitleBar?: boolean;
	    hideCloseBar?: boolean;
	    closeLabel?: string;
	    closeSymbole?: string;
	    className?: string;
	    underlayClass?: string;
	    initialFocus?: string;
	    alert?: boolean;
	    underlayClickExits?: boolean;
	    escapeKeyExits?: boolean;
	    verticallyCenter?: boolean;
	    focusDialog?: boolean;
	    manageFocus?: boolean;
	    onShow?: Function;
	}
	
}

declare module "hornet-js-components/src/dialog/modal" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/dialog/modal-props");
	class Modal extends HornetComponent<PropTypesNs.ModalProps, any> {
	    static displayName: string;
	    static propTypes: {
	        onClickClose: React.Requireable<any>;
	        isVisible: React.Validator<any>;
	        title: React.Requireable<any>;
	        hideTitleBar: React.Requireable<any>;
	        hideCloseBar: React.Requireable<any>;
	        closeLabel: React.Requireable<any>;
	        closeSymbole: React.Requireable<any>;
	        className: React.Requireable<any>;
	        underlayClass: React.Requireable<any>;
	        initialFocus: React.Requireable<any>;
	        alert: React.Requireable<any>;
	        underlayClickExits: React.Requireable<any>;
	        escapeKeyExits: React.Requireable<any>;
	        verticallyCenter: React.Requireable<any>;
	        focusDialog: React.Requireable<any>;
	        manageFocus: React.Requireable<any>;
	        onShow: React.Requireable<any>;
	    };
	    static defaultProps: {
	        isVisible: boolean;
	        hideTitleBar: boolean;
	        hideCloseBar: boolean;
	        alert: boolean;
	        underlayClickExits: boolean;
	        verticallyCenter: boolean;
	        focusDialog: boolean;
	    };
	    constructor(props?: PropTypesNs.ModalProps, context?: any);
	    shouldComponentUpdate(nextProps: any, nextState: any): boolean;
	    render(): JSX.Element;
	    /**
	     * Extrait le titre passé dans les propriétés du composant ou indique un titre par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getTitle();
	    /**
	     * Extrait le label de fermeture passé dans les propriétés du composant ou indique un label par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getCloseLabel();
	    /**
	     * Extrait le symbole de fermeture dans les propriétés du composant ou indique un symbole par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getCloseSymbole();
	}
	export = Modal;
	
}

declare module "hornet-js-components/src/dialog/react-aria-modal" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	class ReactAriaModal extends HornetComponent<any, any> {
	    static displayName: string;
	    static propTypes: {
	        underlayClass: React.Requireable<any>;
	        underlayColor: React.Requireable<any>;
	        underlayClickExits: React.Requireable<any>;
	        escapeKeyExits: React.Requireable<any>;
	        alert: React.Requireable<any>;
	        dialogClass: React.Requireable<any>;
	        dialogId: React.Requireable<any>;
	        focusDialog: React.Requireable<any>;
	        initialFocus: React.Requireable<any>;
	        titleId: React.Requireable<any>;
	        titleText: React.Requireable<any>;
	        verticallyCenter: React.Requireable<any>;
	        onShow: React.Requireable<any>;
	        onExit: React.Validator<any>;
	        manageFocus: React.Requireable<any>;
	        mounted: React.Requireable<any>;
	    };
	    static defaultProps: {
	        mounted: boolean;
	        manageFocus: boolean;
	        underlayClickExits: boolean;
	        underlayColor: string;
	        escapeKeyExits: boolean;
	    };
	    static number: number;
	    renderModal(): void;
	    removeModal(): void;
	    render(): any;
	    componentWillMount(): void;
	    componentDidMount(): void;
	    componentDidUpdate(prevProps: any): void;
	    componentWillUnmount(): void;
	}
	export = ReactAriaModal;
	
}

declare module "hornet-js-components/src/icon/icon-props" {
	import React = require("react");
	export interface IconProps extends React.Props<any> {
	    src: string;
	    alt: string;
	    idImg?: string;
	    classImg?: string;
	    url: string;
	    title: string;
	    idLink?: string;
	    classLink?: string;
	    target?: string;
	    onClick?: React.MouseEventHandler;
	}
	
}

declare module "hornet-js-components/src/icon/icon" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/icon/icon-props");
	class Icon extends HornetComponent<PropTypesNs.IconProps, any> {
	    static displayName: string;
	    static propTypes: {
	        src: React.Validator<any>;
	        alt: React.Validator<any>;
	        idImg: React.Requireable<any>;
	        classImg: React.Requireable<any>;
	        url: React.Validator<any>;
	        title: React.Validator<any>;
	        idLink: React.Requireable<any>;
	        classLink: React.Requireable<any>;
	        target: React.Requireable<any>;
	        onClick: React.Requireable<any>;
	    };
	    /**
	     * Retire le focus de l'élément une fois cliqué de façon à permettre de scroller ou mettre le focus sur les
	     * notifications éventuellement présentées suite à l'action.
	     * @param event évènement
	     * @private
	     */
	    private _iconOnClick(event);
	    render(): JSX.Element;
	}
	export = Icon;
	
}

declare module "hornet-js-components/src/navigation/menu-constantes" {
	export var MENU_ROOT: string;
	export var LVL_SEPARATOR: string;
	
}

declare module "hornet-js-components/src/notification/notification-message-item" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/notification/notification-props");
	class MessageItem extends HornetComponent<PropTypesNs.MessageItemProps, any> {
	    static displayName: string;
	    static propTypes: {
	        text: React.Validator<any>;
	        field: React.Requireable<any>;
	        anchor: React.Requireable<any>;
	    };
	    setFocus(e: React.MouseEvent): void;
	    _renderLink(): JSX.Element;
	    _renderSpan(): JSX.Element;
	    render(): JSX.Element;
	}
	export = MessageItem;
	
}

declare module "hornet-js-components/src/notification/notification-props" {
	import React = require("react");
	export interface NotificationProps extends React.Props<any> {
	    isModal?: boolean;
	    errorsTitle?: string;
	    infosTitle?: string;
	}
	export interface MessageItemProps extends React.Props<any> {
	    field?: string;
	    text: string;
	    anchor?: string;
	}
	
}

declare module "hornet-js-components/src/notification/notification" {
	
}

declare module "hornet-js-components/src/spinner/spinner-props" {
	import React = require("react");
	export interface SpinnerProps extends React.Props<any> {
	    scheduleDelayInMs?: number;
	    minimalShowTimeInMs?: number;
	    loadingTitle?: string;
	    loadingText?: string;
	    imageLoadingUrl?: string;
	}
	
}

declare module "hornet-js-components/src/spinner/spinner" {
	import React = require("react/addons");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/spinner/spinner-props");
	import fluxInformationsStore = require("hornet-js-core/src/stores/flux-informations-store");
	class Spinner extends HornetComponent<PropTypesNs.SpinnerProps, any> {
	    static displayName: string;
	    static propTypes: {
	        scheduleDelayInMs: React.Requireable<any>;
	        minimalShowTimeInMs: React.Requireable<any>;
	        loadingTitle: React.Requireable<any>;
	        loadingText: React.Requireable<any>;
	        imageLoadingUrl: React.Requireable<any>;
	    };
	    static defaultProps: {
	        scheduleDelayInMs: number;
	        minimalShowTimeInMs: number;
	    };
	    static storeListeners: {
	        _scheduleStoreCheck: typeof fluxInformationsStore[];
	    };
	    constructor(props?: PropTypesNs.SpinnerProps, context?: any);
	    /**
	     * Fonction appelée lors d'une modification du store.
	     * Elle planifie la récupération d'une valeur dans un délai configuré dans la propriété "scheduleDelayInMs".
	     */
	    _scheduleStoreCheck(): void;
	    /**
	     * Fonction qui demande la récupération des valeurs dans le store
	     * Si le composant est actuellement affiché et que le temps configuré dans la propriété "minimalShowTimeInMs" n"est pas atteint,
	     * alors une replanification est effectuée plutot qu"un appel au store
	     *
	     * @private
	     */
	    private _retrieveOrScheduleStoreValueRecuperation();
	    /**
	     * Change la visibilité du composant selon l'état du store
	     */
	    private _retrieveStoreValue();
	    render(): JSX.Element;
	    private _renderDefaultSpinnerContent();
	    /**
	     * Return l'url de l'image spinner
	     * @returns Url image spinner
	     * @private
	     */
	    private _getSpinnerImage();
	    /**
	     * Extrait le libelle loadingText passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getLoadingText();
	    /**
	     * Extrait le libelle loadingTitle passé dans les propriétés du composant ou indique un libellé par défaut
	     * @returns Titre
	     * @private
	     */
	    private _getLoadingTitle();
	}
	export = Spinner;
	
}

declare module "hornet-js-components/src/tab/tab-props" {
	import React = require("react");
	export interface TabProps extends React.Props<any> {
	    /** Titre de l'onglet (affiché dans la barre d'onglets) */
	    title?: string;
	    tabId?: string;
	    panelId?: string;
	    isVisible?: boolean;
	    form?: any;
	}
	export interface TabsProps extends React.Props<any> {
	    tabId?: string;
	    panelId?: string;
	    selectedTabIndex?: number;
	    title?: string;
	    form?: any;
	}
	
}

declare module "hornet-js-components/src/tab/tab" {
	import React = require("react/addons");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/tab/tab-props");
	class Tab extends HornetComponent<PropTypesNs.TabProps, any> {
	    static displayName: string;
	    static propTypes: {
	        title: React.Requireable<any>;
	        tabId: React.Requireable<any>;
	        panelId: React.Requireable<any>;
	        isVisible: React.Requireable<any>;
	        form: React.Requireable<any>;
	    };
	    static defaultProps: {
	        tabId: string;
	        panelId: string;
	    };
	    render(): JSX.Element;
	}
	export = Tab;
	
}

declare module "hornet-js-components/src/tab/tabs" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropTypesNs = require("hornet-js-components/src/tab/tab-props");
	class Tabs extends HornetComponent<PropTypesNs.TabsProps, any> {
	    static displayName: string;
	    static propTypes: {
	        tabId: React.Requireable<any>;
	        panelId: React.Requireable<any>;
	        selectedTabIndex: React.Requireable<any>;
	        title: React.Requireable<any>;
	        form: React.Requireable<any>;
	    };
	    static defaultProps: {
	        tabId: string;
	        panelId: string;
	        selectedTabIndex: number;
	    };
	    constructor(props?: PropTypesNs.TabsProps, context?: any);
	    componentWillReceiveProps(nextProps: any): void;
	    render(): JSX.Element;
	    private _getTabs(children);
	    private _showPanel(index);
	}
	export = Tabs;
	
}

declare module "hornet-js-components/src/tool-tip/tool-tip-props" {
	export interface ToolTipProps {
	    src?: string;
	    icoToolTip?: string;
	    alt: string;
	    idImg?: string;
	    classImg?: string;
	    idSpan?: string;
	    classSpan?: string;
	}
	
}

declare module "hornet-js-components/src/tool-tip/tool-tip" {
	import React = require("react");
	import HornetComponent = require("hornet-js-components/src/hornet-component");
	import PropsNs = require("hornet-js-components/src/tool-tip/tool-tip-props");
	class ToolTip extends HornetComponent<PropsNs.ToolTipProps, any> {
	    static displayName: string;
	    static propTypes: {
	        src: React.Requireable<any>;
	        icoToolTip: React.Requireable<any>;
	        alt: React.Validator<any>;
	        idImg: React.Requireable<any>;
	        classImg: React.Requireable<any>;
	        idSpan: React.Requireable<any>;
	        classSpan: React.Requireable<any>;
	    };
	    static defaultProps: {
	        classImg: string;
	        classSpan: string;
	        icoToolTip: string;
	    };
	    render(): JSX.Element;
	}
	export = ToolTip;
	
}

declare module "hornet-js-components/src/navigation/store/navigation-base-store" {
	import BaseStore = require("fluxible/addons/BaseStore");
	class NavigationBaseStore extends BaseStore {
	    static storeName: string;
	    private menuItems;
	    static handlers: any;
	    constructor(dispatcher: any);
	    getConfigMenu(): any;
	    rehydrate(state: any): void;
	    dehydrate(): any;
	}
	export = NavigationBaseStore;
	
}

declare module "hornet-js-components/src/navigation/utils/navigation-utils" {
	export interface NavigationItem {
	    submenu: Array<NavigationItem>;
	    text: string;
	    url: string;
	    visibleDansMenu: boolean;
	    visibleDansPlan: boolean;
	}
	/**
	 * Apporte des méthodes utilitaires pour gérer les aspects navigation (titre de pages, etc..)
	 */
	export class NavigationUtils {
	    /**
	     * Retourne la clé de la configuration du menu associée à l'url courante
	     * @param navigationData
	     * @param currentUrl
	     * @return {NavigationItem|string}
	     */
	    static retrievePageTextKey(navigationData: Array<NavigationItem>, currentUrl: string): string;
	    static getCurrentItem(navigationData: Array<NavigationItem>, currentUrl: string): NavigationItem;
	    /**
	     * Retrouve l'item de la configuration du menu associé à l'url courante
	     * @param navigationData
	     * @param currentUrl
	     * @return {NavigationItem}
	     * @private
	     */
	    private static _retrievePageTextItem(navigationData, currentUrl);
	    /**
	     * Retourne l'item ayant l'url la plus longue
	     * @param left
	     * @param right
	     * @return {NavigationItem}
	     * @private
	     */
	    private static _getItemWithLongerUrl(left, right);
	    /**
	     * Change le titre de la page côté client
	     * @param titlePage
	     */
	    static applyTitlePageOnClient(titlePage: string): void;
	}
	
}

declare module "hornet-js-components/src/table/actions/table-actions" {
	import Action = require("hornet-js-core/src/actions/action");
	import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
	export class SaveState extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export class ResetTableStore extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export class SavePagination extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export class SaveSelectedItems extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export class SaveTableFilters extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	export class SortData extends Action<ActionsChainData> {
	    execute(resolve: any, reject: any): void;
	}
	
}

declare module "hornet-js-components/src/table/store/table-store-data" {
	export class TableStoreData implements TableStoreBase {
	    pagination: TableStoreBasePagination;
	    sort: TableStoreBaseSort;
	    defaultSort: TableStoreBaseSort;
	    filters: TableStoreBaseFilter;
	    selectedItems: Array<any>;
	    constructor();
	}
	export class TableStoreDataPagination implements TableStoreBasePagination {
	    itemsPerPage: number;
	    pageIndex: number;
	    totalItems: number;
	    constructor();
	}
	export class TableStoreDataSort implements TableStoreBaseSort {
	    key: string;
	    dir: string;
	    type: string;
	    constructor();
	}
	export interface TableStoreBase {
	    pagination: TableStoreBasePagination;
	    sort: TableStoreBaseSort;
	    defaultSort: TableStoreBaseSort;
	    filters: TableStoreBaseFilter;
	}
	export interface TableStoreBasePagination {
	    itemsPerPage: number;
	    pageIndex: number;
	    totalItems: number;
	}
	export interface TableStoreBaseSort {
	    key: string;
	    dir: string;
	    type: string;
	}
	export interface TableStoreBaseFilter {
	    key: string;
	    value: string;
	    type: string;
	}
	
}

declare module "hornet-js-components/src/table/store/table-store-interface" {
	/**
	 * Interface de typage des stores applicatifs pour l'utilisation des tableaux
	 */
	interface ITableStore {
	    getAllResults(): any;
	    getFilters(): any;
	    getCriterias(): any;
	}
	export = ITableStore;
	
}

declare module "hornet-js-components/src/table/store/table-store" {
	import BaseStore = require("fluxible/addons/BaseStore");
	import I = require("hornet-js-components/src/table/store/table-store-data");
	class TableStore extends BaseStore {
	    static storeName: string;
	    private tableStoreData;
	    static handlers: any;
	    constructor(dispatcher: any);
	    updateData(key: string, value: any): void;
	    getPaginationData(key: string): I.TableStoreBasePagination;
	    getPaginationNewData(key: string): I.TableStoreBasePagination;
	    getSortData(key: string): I.TableStoreBaseSort;
	    getFilterData(key: string): I.TableStoreBaseFilter;
	    getSelectedItems(key: string): any;
	    _getTableStoreData(key: string): I.TableStoreData;
	    rehydrate(state: any): void;
	    dehydrate(): any;
	}
	export = TableStore;
	
}
