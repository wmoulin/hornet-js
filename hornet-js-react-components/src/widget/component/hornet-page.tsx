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
import { RouteInfos } from "hornet-js-core/src/routes/abstract-routes";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
import { HornetComponent } from "src/widget/component/hornet-component";
import { IService } from "hornet-js-core/src/services/service-api";
import { CHANGE_URL_WITH_DATA_EVENT, HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { UPDATE_PAGE_EXPAND } from "src/widget/screen/layout-switcher";
import { URL_CHANGE_EVENT } from "hornet-js-core/src/routes/router-client-async-elements";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { fireHornetEvent } from "hornet-js-core/src/event/hornet-event";
import { ExpandingLayoutRequest } from "hornet-js-core/src/services/expanding-layout-request";
import { UPDATE_PAGE_EXPAND_MENU } from "src/widget/screen/layout-switcher";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.component.hornet-page");

/**
 * Propriétés HornetPage
 */
export interface HornetPageProps extends HornetComponentProps {
    /**
     * Largeur maximale de la zone de travail en pixel
     * Utilisé par le composant LayoutSwitcher pour agrandir ou rétrécir la
     * zone de travail
     */
    workingZoneWidth?: string;
    /**
     * Largeur maximale de la zone de travail en pixel utilisée
     * Utilisé par le composant LayoutSwitcher
     */
    currentWorkingZoneWidth?: string;
    /**
     * Nom du className a utiliser pour les
     * layout sensitive components (composant qui s'étendent)
     * Utilisés par le composant LayoutSwitcher
     */
    classNameExpanded?: string;
    /**
     * données transmise par la page précédente
     */
    navigateData?: any;
    hasError?: boolean;
    error?: any;
}

/**
 * Composant de haut-niveau : correspond à une page.
 */
export class HornetPage<T extends IService, P extends HornetPageProps, S extends HornetPageProps> extends HornetComponent<HornetPageProps, S> implements IHornetPage<P, S> {


    static defaultProps = {};

    /**
     * Permet de stocker les informations de page liées à la route:
     * exemple: /:mode/:id
     */
    protected attributes;

    /**
     * Service de la page
     */
    protected service: T;

    /**
     * Service middleware pour le layout
     */
    protected layoutService: ExpandingLayoutRequest = new ExpandingLayoutRequest();

    /**
     * @returns {any} les informations de routage associées à la page
     */
    protected getRouteInfos(): RouteInfos {
        return Utils.getCls("hornet.routeInfos") || {
            getAttributes: function () {
                return {};
            }
        };
    }
    
    /**
     * Permet d'effectuer les appels d'API et initialisations éventuellement nécessaires une fois le composant page
     * monté côté client.
     */
    public prepareClient(): void {
        logger.trace("prepareClient HornetPage.");
    }
    
    /**
     * Permet d'effectuer les appels d'API et initialisations éventuellement nécessaires une fois le composant page
     * monté côté client et après le componentDidUpdate.
     */
    public updateClient(): void {
        logger.trace("updateClient HornetPage.");
    }

    constructor(props?: P, context?: any) {
        super(props, context);
        this.attributes = _.assign({}, this.getRouteInfos().getAttributes());
        if (this.getRouteInfos().getService && this.getRouteInfos().getService()) {
            this.service = new (this.getRouteInfos().getService() as Class<T>)() as T;
        }
        if (!this.props.workingZoneWidth) {
            this.copyInitialPropsToState({workingZoneWidth: "1200px"}, this.state);
        }
        this.handleStyleAndWidth();
    }

    /**
     * @override
     */
    componentDidMount(): void {
        super.componentDidMount();
        if (!Utils.isServer && !this.hasError) {
            this.prepareClient();
        }
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps, prevState, prevContext: any): void {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        if (!Utils.isServer && !this.hasError) {
            this.updateClient();
        }
    }

    componentWillUpdate(nextProps: P, nextState: S, nextContext: any) {
        super.componentWillUpdate(nextProps, nextState, nextContext);
    }

    componentWillReceiveProps(nextProps: P, nextContext: any) {
        super.componentWillReceiveProps(nextProps, nextContext);
        this.attributes = _.assign({}, this.getRouteInfos().getAttributes());
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true , error: error});
        let errorReport = {
            componentName: this.constructor["name"],
            method: "render",
            methodArguments: arguments,
            props: this.props,
            state: this.state,
            error: error
        };
        this.getErrorHandler()(errorReport, this.getErrorComponent());
        // You can also log the error to an error reporting service
    }

    render(): JSX.Element | false {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return super.render();
    }

    /**
     * renvoie le service de la page
     */
    getService(): T {
        return this.service as T
    }

    /**
     * Ecoute l'évenement UPDATE_PAGE_EXPAND provenant du composant Hornet LayoutSwitcher
     * @param specifiedMaxWidth
     */
    listenUpdatePageExpandEvent(): void {
        this.listen(UPDATE_PAGE_EXPAND, (ev: HornetEvent<boolean>) => {
            this.layoutService.isExpandedLayout().then((retourApi: any) => {
                let body = retourApi.body;
                if (body && body.isExpandedLayout) {
                    this.fetchHtmlElementsToSetClassBy("mainLayoutClassNameExpanded", "mainLayoutClassName", this.state.workingZoneWidth);
                    this.setIsLayoutExpandedThroughService(false);
                } else {
                    this.fetchHtmlElementsToSetClassBy("mainLayoutClassName", "mainLayoutClassNameExpanded");
                    this.setIsLayoutExpandedThroughService(true);
                }
            });
        });
    }

    /**
     *
     * @param currentClassName
     * @param newClassName
     * @param specifiedMaxWidth
     */
    private fetchHtmlElementsToSetClassBy(currentClassName: string, newClassName: string, specifiedMaxWidth?: string): void {
        if (!Utils.isServer) {
            let htmlElements: HTMLCollectionOf<Element> = document.getElementsByClassName(currentClassName);
            if (htmlElements && htmlElements.length > 0) {
                for (var i = htmlElements.length - 1; i >= 0; --i) {
                    this.majCssStyleExpand(htmlElements, i, currentClassName, newClassName, specifiedMaxWidth);
                }
            }
        }
    }

    /**
     *
     * @param htmlElements
     * @param i
     * @param currentClassName
     * @param newClassName
     * @param specifiedMaxWidth
     */
    private majCssStyleExpand(htmlElements: HTMLCollectionOf<Element>, i: number, currentClassName: string, newClassName: string, specifiedMaxWidth?: string) {
        let element = document.getElementById(htmlElements[i].id);

        if (element && element.classList) {
            let elementClasses = element.classList;
            elementClasses.remove(currentClassName);
            elementClasses.add(newClassName);

            if (specifiedMaxWidth) {
                element.style.maxWidth = specifiedMaxWidth;
            } else {
                element.style.maxWidth = "";
            }
        }
    }

    /**
     * Méthode permettant à l'écoute du changement d'Url afin de changer le titre de la page
     */
    listenUrlChangeEvent(): void {
        this.listen(URL_CHANGE_EVENT, (ev) => {

            let currentPath = ev.detail.newPath,
                title = NavigationUtils.retrievePageTextKey(NavigationUtils.getConfigMenu(), currentPath);

            NavigationUtils.applyTitlePageOnClient(this.i18n(title));
        });
    }

    /**
     *
     * @param value
     */
    private setIsLayoutExpandedThroughService(value: boolean) {
        this.layoutService.setExpandedLayout({isExpandedLayout: value}).then((retourApi) => {
            logger.trace("Retour API ExpandingLayoutRequest.setExpandedLayout :", retourApi.body.isExpandedLayout);
            Utils.appSharedProps.set("isExpandedLayout", retourApi.body.isExpandedLayout);
            fireHornetEvent(UPDATE_PAGE_EXPAND_MENU.withData(true));
        });
    }

    /**
     * Définis le style à positionner dans le state classNameExpanded
     * et la taille max pour le state currentWorkingZoneWidth
     * Ces states sont utilisées par le composant LayoutSwitcher
     * pour étendre les composants
     */
    private handleStyleAndWidth() {
        // préparation de la taille pour le layout expanding
        let maxWidth;
        let classNameExpanded = "mainLayoutClassNameExpanded";
        if (!(Utils.appSharedProps.get("isExpandedLayout"))) {
            maxWidth = this.state.workingZoneWidth;
            classNameExpanded = "mainLayoutClassName";
        }
        this.copyInitialPropsToState({
            currentWorkingZoneWidth: maxWidth,
            classNameExpanded: classNameExpanded
        }, this.state);
    }

    /**
     * permet de changer d'url en passant des données à la page suivante
     * @param {string} url - Url à charger
     * @param {any} data - données à passer à la page suivante
     * @param {() => void} cb - callback
     */
    protected navigateTo(url: string, data: any, cb: () => void) {
        this.fire(CHANGE_URL_WITH_DATA_EVENT.withData({url: url, data: data, cb: cb}));
    }

    /**
     * Supprime les données de navigation
     */
    protected deleteNavigateData() {
        Utils.setCls("hornet.navigateData", {});
    }
}