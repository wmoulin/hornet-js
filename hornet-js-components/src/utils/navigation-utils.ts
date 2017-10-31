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
 * hornet-js-components - Interfaces des composants web de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import * as MenuConstants from "src/utils/menu-constantes";
import { AuthUtils, UserInformations } from "hornet-js-utils/src/authentication-utils";
import {IMenuItem} from "src/component/imenu-item";
import * as _ from "lodash";

const logger = Utils.getLogger("hornet-js-component.navigation.utils.navigation-utils");

export interface NavigationItem {
    submenu:Array<NavigationItem>;
    text:string;
    url: string;
    visibleDansMenu: boolean;
    visibleDansPlan: boolean;
}

/**
 * Apporte des méthodes utilitaires pour gérer les aspects navigation (titre de pages, etc..)
 */
export class NavigationUtils {

    /**
     * Retourne toute la configuration Menu
     * @returns {any}
     */
    public static getConfigMenu() {
        return _.cloneDeep(Utils.getCls("hornet.menuConfig") || []);
    }

    /**
     *  Construit le tableau de menu en supprimant les liens auquel l'utilisateur n'a pas accès et en ajoutant les
     * attributs id et level sur chaque item
     * @param items
     * @param user
     * @param isForPlan
     * @param itemParent
     * @param level
     * @returns {IMenuItem[]}
     */
    public static getFilteredConfigNavigation(items:IMenuItem[], user:UserInformations, isForPlan?:boolean, itemParent?:IMenuItem, level?:number):IMenuItem[] {
        let currentItems:IMenuItem[] = [];
        let idParent:string = MenuConstants.MENU_ROOT.substring(0, MenuConstants.MENU_ROOT.length - 1);
        if (itemParent) {
            idParent = itemParent.id;
        }
        if(!level) {
            level = 0;
        }

        for (let i = 0; i < items.length; i++) {
            let item:IMenuItem = items[i];
            if (!item.rolesAutorises || (item.rolesAutorises && AuthUtils.isAllowed(user, _.isArray(item.rolesAutorises) ? item.rolesAutorises as any : [item.rolesAutorises]))) {
                let typeNavigation = (isForPlan) ? "visibleDansPlan" : "visibleDansMenu";
                if (item[typeNavigation]) {
                    logger.trace("L'utilisateur a accès au menu:", item.text);
                    //item.index = indexParent + currentItems.length;
                    item.id = idParent + MenuConstants.LVL_SEPARATOR + currentItems.length;
                    item.level = level;
                    if (item.submenu) {
                        item.submenu = NavigationUtils.getFilteredConfigNavigation(item.submenu, user, isForPlan, item, level + 1);
                    }
                    currentItems.push(item);
                } else {
                    logger.trace("L'élément ", item.text, " n'est pas visible dans les menus.");
                }
            } else {
                logger.trace("L'utilisateur n'a pas accès au menu:", item.text);
            }
        }

        return currentItems;
    }

    /**
     * Retourne la clé de la configuration du menu associée à l'url courante
     * @param navigationData
     * @param currentUrl
     * @return {NavigationItem|string}
     */
    static retrievePageTextKey(navigationData:Array<NavigationItem>, currentUrl:string):string {
        let retour = NavigationUtils.retrievePageTextItem(navigationData, currentUrl);
        return retour && retour.text;
    }

    static getCurrentItem(navigationData:Array<NavigationItem>, currentUrl:string):NavigationItem {
        return this.retrievePageTextItem(navigationData, currentUrl);
    }

    /**
     * Retrouve l'item de la configuration du menu associé à l'url courante
     * @param navigationData
     * @param currentUrl
     * @return {NavigationItem}
     */
    private static retrievePageTextItem(navigationData:Array<NavigationItem>, currentUrl:string):NavigationItem {
        let currentNavigationItem:NavigationItem = undefined;
        logger.trace("current début:", currentUrl);

        if(navigationData && navigationData.length > 0) {
            for (let i = 0; i < navigationData.length; i++) {
                let navigationItem = navigationData[i];

                logger.trace(navigationItem);
                /* test pour voir si l'Url ne se finit pas par un nombre si c'est le cas on supprimer pour avoir le fil d'arianne *
                 - exemple /partenaire/editer/56  devient --> partenaire/editer
                 */
                if (navigationItem.url && currentUrl.match(RegExp(navigationItem.url, "gi"))) {
                    //On a un bon candidat
                    logger.trace("Bon candidat");
                    currentNavigationItem = NavigationUtils.getItemWithLongerUrl(currentNavigationItem, navigationItem);
                }

                // Un item peut ne pas avoir d'url mais ses fils oui, il faut donc aller regarder
                if (navigationItem.submenu) {
                    logger.trace("parcours des sous menus");
                    let tempNavigationData: NavigationItem = NavigationUtils.retrievePageTextItem(navigationItem.submenu, currentUrl);
                    currentNavigationItem = NavigationUtils.getItemWithLongerUrl(currentNavigationItem, tempNavigationData);
                }
            }
            logger.trace("current fin :", currentNavigationItem);
        }
        return currentNavigationItem;
    }
    /**
     * Retourne l'item ayant l'url la plus longue
     * @param left
     * @param right
     * @return {NavigationItem}
     */
    private static getItemWithLongerUrl(left:NavigationItem, right:NavigationItem):NavigationItem {
        if (!left) {
            return right;
        }
        if (!right) {
            return left;
        }
        if ((left.url || "").length > (right.url || "").length) {
            return left;
        } else {
            return right;
        }
    }
    /**
     * Change le titre de la page côté client
     * @param titlePage
     */
    static applyTitlePageOnClient(titlePage:string):void {
        if (!Utils.isServer && titlePage) {
            //côté client
            document.title = titlePage;
        }
    }

    /**
     * Permet d'afficher un élément en lui ajoutant la classe MASKED_CLASSNAME (par défaut "masked")
     * @param element
     */
    public static hideElement(element):void {
        if (!element.classList.contains(MenuConstants.MASKED_CLASSNAME)) {
            element.classList.add(MenuConstants.MASKED_CLASSNAME);
        }
    }

    /**
     * teste si un element est visible dans la navigation
     * @param element
     * @returns {boolean}
     */
    public static isVisible(element):boolean {
       return !(element.classList.contains(MenuConstants.MASKED_CLASSNAME));
    }

    /**
     * Permet de masquer un élément en lui ôtant la classe MASKED_CLASSNAME (par défaut "masked")
     * @param element
     */
    public static showElement(element):void {
        element.classList.remove(MenuConstants.MASKED_CLASSNAME);
    }

    /**
     * Teste si un sous-menu existe
     * @param element
     * @returns {boolean}
     */
    public static haveSubMenu(element):boolean {
        return element.classList.contains(MenuConstants.HAVING_SUBMENU_CLASSNAME);
    }

    /**
     * Parcourt tout l'arbre d'un lien depuis son parent de plus haut niveau et affiche/masque ses parents
     * @param element
     * @param hideElement
     * @param hideOthersNodesElements
     */
    public static rideDownElementAndToggle(element:HTMLElement, hideElement?:boolean, hideOthersNodesElements?:boolean):void {
        let depth:number = element.id.replace(/[^0-9]/g, "").length;
        let familyElementId:number = parseInt(element.id.replace(MenuConstants.MENU_ROOT, "").substr(0, 1));
        let selector:string = MenuConstants.MENU_ROOT + familyElementId;

        /* Fermeture de tous les éléments autres que la branche sur laquelle on est positionné */
        if(hideOthersNodesElements) {
            let configMenu:any = NavigationUtils.getConfigMenu(),
                user:any = Utils.getCls("hornet.user"),
                items = NavigationUtils.getFilteredConfigNavigation(configMenu, user),
                nbMax = items.length + 1; // ajoute 1 pour infosComplémentaires

            for(let i = 0; i < nbMax; i++) {
                if(i != familyElementId) {
                    let elementToHide = document.getElementById(MenuConstants.MENU_ROOT + i);
                    if(elementToHide) {
                        NavigationUtils.rideDownElementAndToggle(elementToHide, true);
                    }
                }
            }
        }

        let myElement = document.getElementById(selector);
        if(myElement) {
            for (let i = 0; i < depth; i++) {
                if (myElement.classList && myElement.classList.contains(MenuConstants.HAVING_SUBMENU_CLASSNAME)) {
                    if (myElement.nextSibling && myElement.nextSibling.localName == "li") {
                        if (hideElement) {
                            // TODO à corriger : il faut aussi cacher les sous éléments (cf. mantis 58700)
                            NavigationUtils.hideElement(myElement.nextSibling);
                        } else {
                            NavigationUtils.showElement(myElement.nextSibling);
                        }
                    }
                    myElement = document.getElementById(selector + MenuConstants.LVL_SEPARATOR + "0");
                }
            }
        }
    }

    /**
     * @param item
     * @returns {boolean} true lorsqu'au moins un sous-menu est visible
     */
    public static hasVisibleSubMenu(item):boolean {
        let isVisible:boolean = false;
        if (item.submenu) {
            isVisible = false;
            for (let i = 0; i < item.submenu.length && !isVisible; i++) {
                isVisible = item.submenu[i].visibleDansMenu;
            }
        }
        return isVisible;
    }

    /**
     * Positionne le focus sur un élément selon son ID
     * @param id identifiant HTML de l'élément
     */
    public static setFocus(id: string): void {
        let element: HTMLElement = document.getElementById(id);
        if (element && element.focus) {
            element.focus();

            /* On affiche tous les éléments parents de l'élément sélectionné en partant du root */
            NavigationUtils.rideDownElementAndToggle(element, false, true);
        }
    }
}

