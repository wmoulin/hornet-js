"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var PageInformationStore = require("hornet-js-core/src/stores/page-informations-store");

var logger = utils.getLogger("hornet-js-components.navigation.plan");

/**
 * Génère le plan de l'application à partir de la configuration de navigation.
 */
var Plan = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        /** Classe du "store" contenant la configuration de navigation */
        store: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        var configMenu = this.getStore(this.props.store).getConfigMenu();
        return {
            // Initialisation du composant par défaut
            datas: this._prepareItemsArray(configMenu)
        };
    },

    /**
     * Constuit le tableau de menu en supprimant les liens auquel l'utilisateur n'a pas accès
     * @param items Le tableau courant
     * @param itemParent L"item parent du tableau courant, objet vide pour le tableau de premier niveau
     * @returns {*}
     * @private
     */
    _prepareItemsArray: function (items) {
        var currentItems = [];
        var informationStore = this.getStore(PageInformationStore);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.rolesAutorises || (item.rolesAutorises && informationStore.userHasRole(item.rolesAutorises))) {
                logger.trace("L'utilisateur a accès au menu:", item.text);
                currentItems.push(item);

                if (item.submenu) {
                    item.submenu = this._prepareItemsArray(item.submenu);
                }
            } else {
                logger.trace("L'utilisateur n'a pas accès au menu:", item.text);
            }
        }
        return currentItems;
    },

    _generateItem: function (item) {

        if (item.submenu) {
            var element = (item.url) ? this._generateLink(item) : this.i18n(item.text);

            if(element) {
                return React.createElement("li", null, element,
                    React.createElement("ul", null, item.submenu.map(this._generateItem)));
            }

        }
        else {
            return (item.visibleDansPlan) ? React.createElement("li", null, this._generateLink(item)) : null;
        }
    },

    _generateLink: function (item) {
        var text = this.i18n(item.text);
        var title = this.i18n(item.text);
        if (item.title) {
            title = this.i18n(item.title);
        }else{
            logger.warn("item.title non présent : ", item.title);
        }

        if (text != title) {
            return (<a href={this.genUrl(item.url)} title={title}>{text}</a>)
        } else {
            return (<a href={this.genUrl(item.url)} >{text}</a>)
        }
    },

    render: function () {
        var items = this.state.datas.map(this._generateItem);
        return (
            React.createElement("div", null,
                React.createElement("ul", {"className": "pap"}, {items})
            )
        )
    }
});


module.exports = Plan;