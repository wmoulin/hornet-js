///<reference path="../../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");

var _ = utils._;
var logger = utils.getLogger("hornet-js-component.navigation.utils.navigation-utils");

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
     * Retourne la clé de la configuration du menu associée à l'url courante
     * @param navigationData
     * @param currentUrl
     * @return {NavigationItem|string}
     */
    static retrievePageTextKey(navigationData:Array<NavigationItem>, currentUrl:string):string {
        var retour = NavigationUtils._retrievePageTextItem(navigationData, currentUrl);
        return retour && retour.text;
    }

    static getCurrentItem(navigationData:Array<NavigationItem>, currentUrl:string):NavigationItem {
        return this._retrievePageTextItem(navigationData, currentUrl);
    }

    /**
     * Retrouve l'item de la configuration du menu associé à l'url courante
     * @param navigationData
     * @param currentUrl
     * @return {NavigationItem}
     * @private
     */
    private static _retrievePageTextItem(navigationData:Array<NavigationItem>, currentUrl:string):NavigationItem {
        var currentNavigationItem:NavigationItem = undefined;

        logger.trace("current début:", currentUrl);

        for (var i = 0; i < navigationData.length; i++) {
            var navigationItem = navigationData[i];

            logger.trace(navigationItem);
            if (_.startsWith(currentUrl, navigationItem.url)) {
                //On a un bon candidat
                logger.trace("Bon candidat");
                currentNavigationItem = NavigationUtils._getItemWithLongerUrl(currentNavigationItem, navigationItem);
            }

            // Un item peut ne pas avoir d'url mais ses fils oui, il faut donc aller regarder
            if (navigationItem.submenu) {
                logger.trace("parcours des sous menus");
                var tempNavigationData = NavigationUtils._retrievePageTextItem(navigationItem.submenu, currentUrl);
                currentNavigationItem = NavigationUtils._getItemWithLongerUrl(currentNavigationItem, tempNavigationData);
            }
        }
        logger.trace("current fin :", currentNavigationItem);
        return currentNavigationItem;
    }
    /**
     * Retourne l'item ayant l'url la plus longue
     * @param left
     * @param right
     * @return {NavigationItem}
     * @private
     */
    private static _getItemWithLongerUrl(left:NavigationItem, right:NavigationItem) {
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
    static applyTitlePageOnClient(titlePage:string) {
        if (!utils.isServer && titlePage) {
            //côté client
            document.title = titlePage;
        }
    }

}

