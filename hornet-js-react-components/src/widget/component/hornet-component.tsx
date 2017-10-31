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
import * as _ from "lodash";
import { UserInformations } from "hornet-js-utils/src/authentication-utils";
import {
    fireHornetEvent,
    HornetEvent,
    listenHornetEvent,
    listenOnceHornetEvent,
    removeHornetEvent
} from "hornet-js-core/src/event/hornet-event";
import {
    DEFAULT_ERROR_HANDLER,
    HornetComponentErrorHandler
} from "hornet-js-core/src/component/hornet-component-errors";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { HornetComponentProps, IHornetComponent, HornetComponentState } from "hornet-js-components/src/component/ihornet-component";
import { HornetPage } from "src/widget/component/hornet-page";
import { I18nUtils } from "hornet-js-utils/src/i18n-utils";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { AbstractFieldProps } from "src/widget/form/abstract-field";

const pathToRegexp = require('path-to-regexp');

const logger = Utils.getLogger("hornet-js-react-components.widget.component.hornet-component");

export interface HornetComponentDatasourceProps {

    name?: string;
    /**
     * Défini un datasource.
     */
    dataSource?: DataSource<any>;
    /**
     * Permet de cacher le spinner du composant.
     */
    hideSpinner?:boolean;

    /**
     * Permet de surchager le message
     */
    loadingMessage? : any;
}


export enum Alignment {
    CENTER,
    LEFT,
    RIGHT
}

/**
 * Classe parente des composants graphiques Hornet basés sur React.
 */
export class HornetComponent<P extends HornetComponentProps, S extends HornetComponentState> extends React.Component<P, S> implements IHornetComponent<P, S> {

    /** Indique si les erreurs sont encapsulées de façon à rediriger vers la page d'erreur*/
    static ERROR_MANAGED: boolean = true;

    /** Page d'erreur à afficher en cas d'erreur technique */
    static ERROR_COMPONENT: Class<HornetPage<any, any, any>>;

    constructor(props?: P, context?: any) {
        super(props, context);
        this.state = {} as S;
        this.autobinding();
        if (!Utils.isServer) this.errorManagement();
        /* On alimente automatiquement l'état interne du composant avec toutes les propriétés */
        this.copyInitialPropsToState(this.props, this.state);
    }

    private rendering = false;
    protected hasError = false;

    protected mounted = false;

    /* Chargement des données USer */
    protected user: UserInformations = Utils.getCls("hornet.user");

    componentWillMount(): void {
        // gestion de l'injection automatique des instances de composants avec props "var=()=>{}"
        if (!Utils.isServer) {
            if (!_.isUndefined(this.props[ "var" ]) && _.isFunction(this.props[ "var" ])) {
                this.props[ "var" ](this);
            }
        }
    }

    componentDidMount(): void {
        this.mounted = true;
    }

    componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void {

    }

    componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void {

    }

    componentWillUnmount(): void {
        if (!_.isUndefined(this.props[ "var" ]) && _.isFunction(this.props[ "var" ])) {
            this.props[ "var" ](null);
        }
        this.mounted = false;
    }

    /**
     * Met à jour l'état interne avec les nouvelles propriétés
     * @param nextProps nouvelles propriétés
     * @param nextContext nouveau contexte
     */

    componentWillReceiveProps(nextProps: P, nextContext: any): void {
        for (let key in nextProps) {
            /* On doit s'assurer que chaque propriété a effectivement changé, car componentWillReceiveProps peut aussi
             * être appelée alors qu'aucune propriété n'a changé
             * (cf.http://facebook.github.io/react/blog/2016/01/08/A-implies-B-does-not-imply-B-implies-A.html)
             *
             * On ne veut pas dans ce cas écraser l'état avec l'ancienne propriété. En effet l'état peut avaoir été modifié
             * via un setter alors que la propriété utilisée initialement pour le constructeur n'a pas changé.*/
            if (!_.isEqual((this as any).props[key], nextProps[key])) {
                /* On se base sur le 'setter' portant le même nom que la propriété */
                let setterName: string = _.camelCase("set " + (key));
                if (this[setterName]) {
                    this[setterName](nextProps[key]);
                } else {
                    let state: any = {};
                    state[key] = nextProps[key];
                    this.setState(state);
                }
            }
        }
    }


    /**
     * A surcharger éventuellement.
     * @return {boolean} true lorsque toutes les fonctions du composant doivent être encapsulées en s'appuyant
     * sur le gestionnaire d'erreurs (getErrorHandler()) et le composant d'affichage erreur (getErrorComponent()).
     */
    isErrorManaged(): boolean {
        return HornetComponent.ERROR_MANAGED;
    }

    /**
     * A surcharger éventuellement.
     * @return {Class<HornetPage<any, any>>} la page à afficher en cas d'erreur
     */
    getErrorComponent(): Class<HornetPage<any, any, any>> {
        return HornetComponent.ERROR_COMPONENT;
    }

    /**
     * A surcharger éventuellement.
     * @return {HornetComponentErrorHandler} la fonction implémentant le comportement à adopter en cas d'erreur
     */
    getErrorHandler(): HornetComponentErrorHandler {
        return DEFAULT_ERROR_HANDLER;
    }

    protected copyInitialPropsToState(props: P, state: any) {
        for (let i in props) {
            state[i] = props[i];
        }
    }

    private autobinding() {
        let blacklist = {constructor: 1, errorManagement: 1, wrapMethod: 1};
        for (let fn in this) {
            if (_.isFunction(this[fn]) && !(fn in blacklist)) {
                this[fn] = this[fn]["bind"](this);
            }
        }
    }

    /**
     * Si la gestion des erreurs est activée, encapsule toutes les fonctions de ce composant avec une gestion d'erreur
     * commune.
     */
    private errorManagement() {
        /* Fonctions à ne pas encapsuler */
        let blacklist = {constructor: 1, errorManagement: 1, wrapMethod: 1};
        if (this.isErrorManaged()) {
            for (let fn in this) {
                if (_.isFunction(this[fn]) && !(fn in blacklist)) {
                    //this.wrapMethod(fn);
                }
            }

        }
    }

    /**
     * Permet d'écouter un évènement
     * @param event
     * @param callback
     * @param capture
     */
    listen<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture: boolean = true): void {
        if (!Utils.isServer) {
            listenHornetEvent(event, callback, capture);
        }
    }

    /**
     * Permet de n'écouter qu'une seule foix un évènement
     * @param event
     * @param callback
     * @param capture
     */
    listenOnce<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture: boolean = true): void {
        if (!Utils.isServer) {
            listenOnceHornetEvent(event, callback, capture);
        }
    }

    /**
     * Permet d'émettre un évènement
     * @param event
     * @param eventOptions
     */
    fire<T extends HornetEvent<any>>(event: T, eventOptions: any = {}): void {
        fireHornetEvent(event, eventOptions);
    }

    /**
     * Permet de supprimer un évènement
     * @param event
     * @param callback
     * @param capture
     */
    remove<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture: boolean = true): void {
        removeHornetEvent(event, callback, capture);
    }


    /**
     * Méthode permettant d'enrober un composant
     * @param method
     */
    private wrapMethod(method) {
        let unwrapped = this[method];
        let self = this;
        self[method] = function() {
            try {
                if (method == "render") self.rendering = true;

                return unwrapped.apply(undefined, arguments);
            } catch (e) {
                if (!e["hasBeenReported"] && (!self.rendering || method == "render")) {
                    let errorReport = {
                        componentName: self.constructor["name"],
                        method: method,
                        methodArguments: arguments,
                        props: self.props,
                        state: self.state,
                        error: e
                    };
                    e["hasBeenReported"] = true;
                    self.getErrorHandler()(errorReport, self.getErrorComponent());
                }

                // cas de la méthode "render" pour laquelle il faut au moins renvoyer null
                // pour ne pas corrompre React
                if (method == "render") {
                    self.hasError = true;
                    return null;
                } else if (!e["hasBeenThrown"]) {
                    e["hasBeenThrown"] = true;
                    throw e;
                }
            } finally {
                if (method == "render") self.rendering = false;
            }
        };
    }

    /**
     * Retourne les éléments enfants d'un composant du type passé en paramètre
     * @param ComponentType
     * @returns {Array}
     */
    protected getChildrenOf(ComponentType): any[] {
        let children = [];

        React.Children.map(this.props.children, (child: React.ReactChild) => {
            if ((child as React.ReactElement<any>).type === ComponentType) {

                if((child as React.ReactElement<any>).props.children) {
                    if (Array.isArray((child as React.ReactElement<any>).props.children)) {
                        children = (child as React.ReactElement<any>).props.children;
                    } else {
                        children.push((child as React.ReactElement<any>).props.children);
                    }
                }
            }
        });



        return children.filter((element) => (element != null && element));
    }

    /**
     * Retourne les éléments enfants d'un composant du type passé en paramètre
     * @param ComponentType
     * @returns {Array}
     */
    public static getChildrenFrom(parent, componentType): any[] {
        let children = [];

        React.Children.map(parent.props.children, (child: React.ReactChild) => {
            if ((child as React.ReactElement<any>).type === componentType) {
                if (Array.isArray((child as React.ReactElement<any>).props.children)) {
                    children = (child as React.ReactElement<any>).props.children;
                } else {
                    children.push((child as React.ReactElement<any>).props.children);
                }
            }
        });

        return children;
    }

    /**
     * Retourne les éléments enfants d'un composant du type passé en paramètre
     * @param ComponentType
     * @returns {Array}
     */
    protected getComponentBy(ComponentType): any[] {
        let children;
        React.Children.map(this.props.children, (child: React.ReactChild) => {
            if ((child as React.ReactElement<any>).type === ComponentType) {
                children = child;
            }
        });
        return children;
    }

    /**
     * Retourne les éléments enfants d'un composant du type passé en paramètre
     * @param ComponentType
     * @returns {Array}
     */
    public static getComponentFromParentBy(parent, ComponentType): any[] {
        let children;
        React.Children.map(parent.props.children, (child: React.ReactChild) => {
            if ((child as React.ReactElement<any>).type === ComponentType) {
                children = child;
            }
        });
        return children;
    }

    /**
     * Retourne les éléments enfants d'un composant du type passé en paramètre
     * @param ComponentType
     * @returns {Array}
     */
    protected getComponentsBy(ComponentType): any[] {
        let children = [];
        React.Children.map(this.props.children, (child: React.ReactChild) => {
            if ((child as React.ReactElement<any>).type === ComponentType) {
                children.push(child);
            }
        });
        return children;
    }

    /***
     * Méthode déterminant si un des enfant dont le parent est de type Component est de type ComponentType
     * @param Component: composant dont les enfants sont à rechercher
     * @param ComponentType: type de composant à rechercher
     * @returns {boolean}
     */
    protected hasChildrenOfComponentTypeOf(Component, ComponentType): boolean {
        let elements: any[] = this.getChildrenOf(Component);
        let nbMax = elements.length;
        for (let i = 0; i < nbMax; i++) {
            if (elements[i] && (elements[i] as React.ReactElement<any>).type === ComponentType) {
                return true;
            }
        }

        return false;
    }

    /**
     * Wrap un composant avec de nouvelles props pour eviter le cloneElement
     * @param {HornetComponent} ComponentToWrap composant à wrapper
     * @param {Object} otherProps nouvelle props à ajouter
     */
    wrap<P, S>(ComponentToWrap, otherProps: P, thisProps = this.props) {


        let myProps = {};
        this.copyInitialPropsToState(thisProps, myProps);
        this.copyInitialPropsToState((otherProps as any), myProps);

        let elt = React.createElement(ComponentToWrap, myProps, thisProps.children);
        return elt;
    }


    /**
     * Wrap un composant avec de nouvelles props pour eviter le cloneElement
     * @param {HornetComponent} ComponentToWrap composant à wrapper
     * @param {HornetComponent} componentProps props du composant à wrapper
     * @param {Object} otherProps nouvelle props à ajouter
     */
    static wrap<P, S>(ComponentToWrap, hornetComponentContext: HornetComponent<HornetComponentProps,HornetComponentState>, componentProps: P, otherProps: P) {
        class WrapComponent extends HornetComponent<P, S> {

            public componentToWrap;

            constructor(props?: P, context?: any) {
                super(props, context);
                this.componentWillUnmount.bind(this.getThisBind());
                this.componentWillMount.bind(this.getThisBind());
            }

            render() {
                return (
                    <ComponentToWrap {...componentProps} {...otherProps} >
                        {(componentProps as any).children}
                    </ComponentToWrap>
                );
            }

            public setState() {
                this.componentToWrap.setState(arguments)
            }

            public getThisBind():HornetComponent<HornetComponentProps,HornetComponentState> {
                if ((hornetComponentContext as any).getThisBind) {
                    return (hornetComponentContext as any).getThisBind();
                }
                return hornetComponentContext;
            }
        }


        (WrapComponent as any).defaultProps = ComponentToWrap.defaultProps || {};

        if ((componentProps as any).var) {
            (WrapComponent as any).defaultProps.var = (componentProps as any).var;
        }

        if ((componentProps as any).ref) {
            (WrapComponent as any).defaultProps.ref = (componentProps as any).ref;
        }


        // on retourne notre wrapper
        return (WrapComponent as any)
    }


    /**
     * Méthode permettant de merger proprement des objects
     * @param obj1
     * @param obj2
     * @returns {any}
     */
    static mergeObjects(obj1, obj2) {

        let merge = (finalObj, obj) => {

            if(typeof obj == "object") {
                let keys = Object.keys(obj);
                if (Array.isArray(keys) && keys.length > 0) {
                    keys.map((key) => {
                        finalObj[key] = obj[key];
                    });
                }
            }
            return finalObj;
        };


        let finalObj:any = merge({}, obj1);
        return merge(finalObj, obj2);
    }

    /**
     * @param path éventuel chemin relatif à l'url de base du thème
     * @return l'url du thème CSS courant
     */
    static genUrlTheme(path?: string): string {
        return HornetComponent.genUrlThemeEmbedded(path);
    }

    /**
     * @param path éventuel chemin relatif à l'url de base du thème embarqué
     * @return l'url du thème CSS embarqué
     */
    static genUrlThemeEmbedded(path?: string): string {

        let themeUrl = "";
        let property: string = "themeName";
        if (Utils.config.has(property)) {
            let themeName = Utils.config.getOrDefault(property, "");
            if (themeName) {
                themeUrl = Utils.buildStaticPath("/" + themeName + (path === undefined ? "" : path));
            }
        }

        return themeUrl;
    }

    /**
     * @param l'url de base du thème externe
     * @return l'url du thème CSS embarqué
     */
    static genUrlThemeExternal(path?: string): string {
        let themeUrl = "";
        let property: string = "themeHost";
        if (Utils.config.has(property)) {
            themeUrl = Utils.config.get(property);
            if (themeUrl) {
                themeUrl = themeUrl + (path === undefined ? "" : path);
            }
        }
        return themeUrl;
    }

    /**
     * Méthode permettant de générer une Url
     * @param path
     * @returns {string}
     */
    genUrl(path: string): string {
        return Utils.buildContextPath(path);
    }

    /**
     * Permet de générer une Url de l'application depuis une url paramétrée
     * @param path
     * @param item
     * @returns {string}
     */
    genUrlWithParams(path: string, item: any): string {
        return Utils.buildContextPath(pathToRegexp.compile(path)(item));
    }

    /**
     * Récupère le contexte Applicatif
     * @returns {string}
     */
    getContextPath(): string {
        return Utils.getContextPath();
    }

    /**
     * Permet de générer l'url vers les répertoires static de l'application
     * @param path
     * @returns {string}
     */
    genUrlStatic(path: string): string {
        return Utils.buildStaticPath(path);
    }


    /**
     * Permet de récupérer tous les messages liés à l'internationalisation ainsi que la local
     * @returns {any} un objet contenant la locale et les messages internationalisés à utiliser.
     */
    protected static getInternationalization(): any {
        return Utils.getCls("hornet.internationalization");
    }

    /**
     * Renvoie le ou les messages internationalisés correspondant à la clé indiquée, après avoir remplacé les valeurs paramétrables
     * avec celles indiquées.
     * @param keysString clé de message internationalisé
     * @param values valeurs de remplacement éventuelles
     * @param internationalization paramètre optionnel contenant les messages internationalisés et la locale
     * @returns {any} une chaîne de caractères ou un objet contenant des messages
     */
    public static getI18n(keysString: string, values?: any, internationalization: any = HornetComponent.getInternationalization()): any {
        return I18nUtils.getI18n(keysString, values, internationalization);
    }

    /**
     * Renvoie le ou les messages internationalisés correspondant à la clé indiquée, après avoir remplacé les valeurs paramétrables
     * avec celles indiquées.
     * @param keysString clé de message internationalisé
     * @param values valeurs de remplacement éventuelles
     * @returns {any} une chaîne de caractères ou un objet contenant des messages
     */
    public i18n(keysString: string, values?: any): any {
        return HornetComponent.getI18n(keysString, values);
    }

    /**
     * Retourne la valeur de la ressource si la property n'est pas initialisée
     * @param property : valeur à vérifié si elle est initialisée
     * @param ressource : valeur par défaut à retourner si la première n'est pas initialisée
     * @returns {any}
     */
    protected initRessourceProperty(property: any, ressource: string): any {
        let res: any = property;
        if (!res) {
            res = ressource;
        }
        return res;
    }

    /**
     * Méthode indiquant si le userAgent mentionne l'utilison en cours depuis un périphérique
     * mobile
     * Attention userAgent n'est pas ce qu'il y a de plus fiable.
     * @returns {boolean}
     */
    protected isMobile() {

        let isMobile = false;
        if (!Utils.isServer) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                isMobile = true;
            }
        }
        return isMobile;
    }
}
