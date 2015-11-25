"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var MenuConstants = require("src/navigation/menu-constantes");

var logger = utils.getLogger("hornet-js-components.navigation.menu-link");

/**
 * Lien d"un élément de menu
 * @type {ComponentClass<P>}
 */
var MenuLink = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        id: React.PropTypes.object,

        url: React.PropTypes.object,
        level: React.PropTypes.number,
        text: React.PropTypes.string,

        /* Object représentant l'élément de menu */
        item: React.PropTypes.object,
        /* Fonction servant à propager la modification l'état de visibilité du sous-menu*/
        setSubmenuVisibleHandler:React.PropTypes.func,
        /* Indique si le lien ne passe par le routeur */
        dataPassThru:React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            item: {},
            setSubmenuVisibleHandler: function() {},
            dataPassThru: false
        };
    },

    /**
     * @param nextProps nouvelles propriétés
     * @param nextState nouvel état
     * @return {boolean} toujours false car les propriétés de ce composant servent uniquement à l'initialiser et il n'a pas d'état
     */
    shouldComponentUpdate: function(nextProps, nextState) {
        return false;
    },

    /**
     * Gestion de l'évènement d'entrée de la souris sur l'élément
     * @param e évènement
     */
    _handleMouseEnter: function (e) {
        var element = document.getElementById(this.props.item.id);
        if (element && element.focus) {
            element.focus();
        }
        this.props.setSubmenuVisibleHandler(true);
    },

    render: function () {
        var {item} = this.props;
        logger.trace("MenuLink.render item.id : ", item.id);
        var attributesA = {};
        attributesA["href"] = (item.url) ? this.genUrl(item.url) : "#";

        var url = "#";
        if (item.url) {
            url = this.genUrl(item.url);
        }
        attributesA["href"] = url;

        var hasSubMenu = this.hasVisibleSubMenu(item);
        attributesA["className"] = hasSubMenu ? "having-sub-nav" : null;
        attributesA["id"] = item.id;
        attributesA["data-indice"] = item.id;
        attributesA["role"] = "menuitem";
        attributesA["aria-haspopup"] = (hasSubMenu) ? "true" : null;
        if(this.props.dataPassThru) {
            attributesA["data-pass-thru"] = "true";
        }
        /* On se branche sur les évènements React onMouseEnter et onMouseLeave car plusieurs évènements
         onMouseOver et onMouseOut sont déclenchés et génèrent donc un rendu React pour le survol d'un même élément de menu */
        attributesA["onMouseEnter"] = this._handleMouseEnter;
        /* On n'accède pas aux éléments de menu (autres que le premier) via la tabulation */
        if(item.id == MenuConstants.MENU_ROOT + "0") {
            attributesA["tabIndex"] = 0;
        } else {
            attributesA["tabIndex"] = -1;
        }
        var subMenuLibelle = this.i18n("navigation.submenu");
        return (
        <a {...attributesA}>
            <div>
                {this.i18n(item.text)}
                {this._getImgSubMenu(item, subMenuLibelle)}
            </div>
        </a>);
    },

    /**
     * @param item
     * @returns {boolean} true lorsqu'au moins un sous-menu est visible
     */
    hasVisibleSubMenu: function (item) {
        var isVisible = false;
        if (item.submenu) {
            isVisible = false;
            for (var i = 0; i < item.submenu.length && !isVisible; i++) {
                isVisible = item.submenu[i].visibleDansMenu;
            }
        }
        return isVisible;
    },

    /**
     * Permet de générer l'image adéquate selon la profondeur
     * @param item
     * @returns {string}
     * @private
     */
    _getImgSubMenu: function (item, libelle) {
        var imgSubMenu = "";

        if (item.submenu && this.hasVisibleSubMenu(item)) {
            var props = {};
            var srcImg = (item.level == 0) ? "/img/menu/picto_fleche.png" : "/img/menu/vertical-menu-submenu-indicator.png";
            props["alt"] = libelle + this.i18n(item.text);
            props["src"] = this.genUrlTheme(srcImg);
            props["className"] = "subnav-0";
            imgSubMenu = <img {...props}/>;
        }

        return imgSubMenu
    }
});

module.exports = MenuLink;