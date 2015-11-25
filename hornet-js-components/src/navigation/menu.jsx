"use strict";
var utils = require("hornet-js-utils");
var React = require("react");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");

var MenuNavigation = require("src/navigation/menu-navigation");
var InfosComplementaires = require("src/navigation/menu-infos-complementaires");
var MenuConstants = require("src/navigation/menu-constantes");

var _ = utils._;
var logger = utils.getLogger("hornet-js-components.navigation.menu");

var Menu = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        /** Classe du "store" contenant la configuration de navigation */
        store: React.PropTypes.func.isRequired,
        /** Eléments fils */
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getInitialState: function () {
        var menuStore = this.getStore(this.props.store);
        var configMenu = _.cloneDeep(menuStore.getConfigMenu());
        var items = this._prepareItemsArray(configMenu, {}, 0);

        return {
            // Initialisation du composant par défaut
            i18n: this.i18n("menu"),
            items: items
        };
    },

    /**
     * Construit le tableau de menu en supprimant les liens auquel l'utilisateur n'a pas accès et en ajoutant les attributs id et level sur chaque item
     * @param items Le tableau courant
     * @param itemParent L'item parent du tableau courant, objet vide pour le tableau de premier niveau
     * @param level niveau de sous-menu à affecter aux éléments (0 pour la racine du menu)
     * @returns {*}
     * @private
     */
    _prepareItemsArray: function (items, itemParent, level) {
        var currentItems = [];
        var informationStore = this.getStore(PageInformationStore);
        var idParent = MenuConstants.MENU_ROOT.substring(0, MenuConstants.MENU_ROOT.length - 1);
        if(itemParent.id) {
            idParent = itemParent.id;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.rolesAutorises || (item.rolesAutorises && informationStore.userHasRole(item.rolesAutorises))) {
                if(item.visibleDansMenu) {
                    logger.trace("L'utilisateur a accès au menu:", item.text);
                    //item.index = indexParent + currentItems.length;
                    item.id = idParent + MenuConstants.LVL_SEPARATOR + currentItems.length;
                    item.level = level;
                    if (item.submenu) {
                        item.submenu = this._prepareItemsArray(item.submenu, item, level + 1);
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
    },


    render: function () {
        return (
            <nav id="nav" aria-label={this.state.i18n.mainMenu} data-title="Menu" className="menuHaut">
                <MenuNavigation items={this.state.items} level={0} isVisible={true}
                                infosComplementaires={this._getInfosComplementaires()}/>
            </nav>
        );
    },

    _getInfosComplementaires: function () {
        //tag seulement de type InfosComplementaires
        return React.Children.map(this.props.children, function (child) {
            if (child.type.displayName === InfosComplementaires.displayName) {
                return child;
            }
        });
    }
});

module.exports = Menu;