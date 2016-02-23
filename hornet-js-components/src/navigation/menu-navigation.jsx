"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var MenuConstants = require("src/navigation/menu-constantes");
var MenuLink = require("src/navigation/menu-link");
var classNames = require("classnames");

var keyEvent = utils.keyEvent;
var logger = utils.getLogger("hornet-js-components.navigation.menu-navigation");

/**
 * Elément de menu
 * @type {ComponentClass<P>}
 */
var MenuItem = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        item: React.PropTypes.shape({
            id: React.PropTypes.string,
            level: React.PropTypes.number,
            submenu: React.PropTypes.array,
            visibleDansMenu: React.PropTypes.boolean
        }),
        isSubMenu: React.PropTypes.bool,
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            item: {},
            isSubMenu: false
        };
    },

    getInitialState: function () {
        return {
            isSubMenuVisible: false
        };
    },

    /**
     * @param nextProps nouvelles propriétés
     * @param nextState nouvel état
     * @return {boolean} true uniquement lorsque l"état change ET que l"élément a un sous-menu
     * car les propriétés servent uniquement à initialiser ce composant et seul le sous-menu dépend de l"état
     */
    shouldComponentUpdate: function(nextProps, nextState) {
        var shouldUpdate = false;
        if (this.props.item && this.props.item.submenu && nextState.isSubMenuVisible != this.state.isSubMenuVisible) {
            shouldUpdate = true;
        }
        return shouldUpdate;
    },

    /**
     * Initialise l"état isSubMenuVisible avec le paramètre visible
     * @param visible {boolean} valeur à affecter à l"état
     * @private
     */
    _setSubMenuVisibile: function(visible) {
        this.setState({isSubMenuVisible: visible});
    },

    /**
     * Gestion de l"évènement où l"élément reçoit le focus
     * @param e évènement
     */
    _handleFocus: function (e) {
        this._setSubMenuVisibile(true);
    },

    /**
     * Gestion de l"évènement où l"élément perd la sélection
     * @param e évènement
     */
    _handleUnSelected: function (e) {
        this._setSubMenuVisibile(false);
    },

    render: function () {
        var {item, isSubMenu} = this.props;
        if (item.visibleDansMenu) {
            logger.trace("MenuItem.render item.id : ", item.id);
            var attributesLi = {};
            attributesLi["className"] = (isSubMenu) ? "sub-nav-item" : "nav-item";
            attributesLi["onFocus"] = this._handleFocus;
            attributesLi["onMouseLeave"] = attributesLi["onBlur"] = this._handleUnSelected;
            attributesLi["role"] = (item.level < 2) ? "presentation" : null;

            var subMenu = null;
            if (item.submenu) {
                subMenu =
                    <MenuNavigation
                        items={item.submenu}
                        level={item.level + 1}
                        isVisible={this.state.isSubMenuVisible}
                        idParent={item.id}
                        imgFilePath={this.props.imgFilePath}
                    />
            }
            return (
                <li {...attributesLi}>
                    <MenuLink
                        item={item}
                        setSubmenuVisibleHandler={this._setSubMenuVisibile}
                        imgFilePath={this.props.imgFilePath}
                    />
                    {subMenu}
                </li>
            )
        }
        else {
            return null;
        }
    }
});

/**
 * Groupe d'éléments de mnu
 * @type {ComponentClass<P>}
 */
var MenuNavigation = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        /* Elements du même niveau de menu */
        items: React.PropTypes.array.isRequired,
        level: React.PropTypes.number,
        isVisible: React.PropTypes.bool,
        idParent: React.PropTypes.string,
        infosComplementaires: React.PropTypes.object,
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            items: [],
            level: 0
        };
    },

    render: function () {
        var {level, isVisible} = this.props;
        logger.trace("MenuNavigation.render idParent : ", this.props.idParent);
        var infoComplementaires = null;

        // Menu de premier niveau
        if (this.props.level == 0) {
            infoComplementaires = this.props.infosComplementaires;
        }

        var isSubMenu = (this.props.level != 0),
            imgFilePath = this.props.imgFilePath;
        var items = this.props.items.map(function (item) {
            if (item.visibleDansMenu) {
                return <MenuItem item={item} isSubMenu={isSubMenu} key={item.text + item.url} imgFilePath={imgFilePath} />;
            }
        });

        var classes = {
            "nav": true,
            "sub-nav-1": (level == 1),
            "sub-nav-2": (level == 2),
            "masked": !isVisible
        };

        var attributesUl = [];
        attributesUl["className"] = classNames(classes);

        if (level == 0) {
            /* le premier niveau de menu est horizontal */
            attributesUl["onKeyDown"] = this._onKeyDownHorizontalMenu;
        } else {
            /* les sous menus sont ensuite verticaux */
            attributesUl["onKeyDown"] = this._onKeyDownVerticalMenu;
        }
        attributesUl["role"] = (level == 0) ? "menubar" : "menu";
        attributesUl["aria-labelledby"] = (this.props.idParent) ? this.props.idParent : null;

        return (
            <ul {...attributesUl}>
                {items}
                {infoComplementaires}
            </ul>
        );
    },

    /**
     * @param id identifiant de l'élément de menu
     * @return {number} l"index de l'élément parent au niveau de menu zéro (0 pour le premier élément)
     * @private
     */
    _getRootParentIndex: function (id) {
        var beginIndex = MenuConstants.MENU_ROOT.length;
        var endIndex = id.indexOf(MenuConstants.LVL_SEPARATOR, beginIndex);
        if(endIndex < 0) {
            endIndex = id.length;
        }
        return parseInt(id.substr(beginIndex, endIndex));
    },

    /**
     * Fonction appelée lors d'un appui de touche sur un élément de menu horizontal.
     * @param event évenèment déclencheur
     * @private
     */
    _onKeyDownHorizontalMenu: function (e) {
        var key = e.keyCode;
        var id = e.target.id;
        if(id) {
            var lastSeparatorIndex = id.lastIndexOf(MenuConstants.LVL_SEPARATOR);
            var itemHierarchy = id.substr(0, lastSeparatorIndex + 1);
            var itemIndex = parseInt(id.substr(lastSeparatorIndex + 1, id.length));
            var items = this.props.items;

            var idToFocus = id;
            var preventDefault = true;
            switch (key) {
                case keyEvent.DOM_VK_RIGHT:
                    // on n'est pas sur le dernier item du niveau : vers item suivant de même niveau
                    /* Attention il y a éventuellement des MenuInfosComplementaires à la suite de items */
                    if(this._isElementExists(itemHierarchy + (itemIndex + 1))) {
                        idToFocus = itemHierarchy + (itemIndex + 1);
                    } // sinon retour au premier item de même niveau
                    else {
                        idToFocus = items[0].id;
                    }
                    break;
                case keyEvent.DOM_VK_LEFT :
                    // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                    if(itemIndex > 0) {
                        idToFocus = items[itemIndex - 1].id;
                    } // sinon retour au dernier item de même niveau
                    else {
                        //indiceToFocus = items[items.length - 1].index;
                        var indexToFocus = items.length - 1;
                        /* On ne se base pas sur items.length car il y a éventuellement des MenuInfosComplementaires à la suite */
                        var last = false;
                        while(!last) {
                            //if (this._isElementExists(indiceToFocus + 1)) {
                            if(this._isElementExists(itemHierarchy + (indexToFocus + 1))) {
                                //indiceToFocus++;
                                indexToFocus++;
                            } else {
                                last = true;
                            }
                        }
                        idToFocus = itemHierarchy + indexToFocus;
                    }
                    break;
                case keyEvent.DOM_VK_DOWN :
                    /* Element de menu courant : peut être null lorsqu'on est sur un élément MenuInfosComplementaires */
                    var item = items[itemIndex];
                    /*  sous-menu existant : on va au premier élément du sou-menu */
                    if(item && item.submenu && item.submenu[0]) {
                        //indiceToFocus = item.submenu[0].index;
                        idToFocus = item.submenu[0].id;
                    }

                    break;
                case keyEvent.DOM_VK_UP :
                    // on ne fait un changement qu'à partir du niveau 2
                    break;
                case keyEvent.DOM_VK_ESCAPE :
                    this.setFocus("imgLogo");
                    break;
                default :
                    preventDefault = false;
            }
            if(idToFocus != id) {
                this.setFocus(idToFocus);
            }
            /* On supprime le comportement par défaut pour les touches utilisées pour la navigation : pour éviter par exemple de faire défiler les ascenceurs */
            if (preventDefault) {
                e.preventDefault();
            }
        }
    },

    /**
     * Fonction appelée lors d'un appui de touche sur un élément de menu vertical
     * @param event
     * @private
     */
    _onKeyDownVerticalMenu: function (e) {
        var key = e.keyCode;
        var id = e.target.id;
        if(id) {
            var lastSeparatorIndex = id.lastIndexOf(MenuConstants.LVL_SEPARATOR);
            var itemHierarchy = id.substr(0, lastSeparatorIndex + 1);
            var itemIndex = parseInt(id.substr(lastSeparatorIndex + 1, id.length));
            var items = this.props.items;

            var idToFocus = id;
            var preventDefault = true;

            switch (key) {
                case keyEvent.DOM_VK_RIGHT:
                    /* Element de menu courant : peut être null lorsqu'on est sur un élément MenuInfosComplementaires */
                    var item = items[itemIndex];
                    /*  sous-menu existant : on va au premier élément du sous-menu */
                    if(item && item.submenu && item.submenu[0]) {
                        idToFocus = item.submenu[0].id;
                    } else {
                        /* On va à l"élément de niveau 0 suivant */
                        var rootParentIndex = this._getRootParentIndex(id);
                        /* On ne se base pas sur items.length car il y a éventuellement des MenuInfosComplementaires à la suite */
                        if (this._isElementExists(MenuConstants.MENU_ROOT + (rootParentIndex + 1))) {
                            idToFocus = MenuConstants.MENU_ROOT + (rootParentIndex + 1);
                        } // sinon retour au premier item de niveau 0
                        else {
                            idToFocus = MenuConstants.MENU_ROOT + "0";
                        }
                    }
                    break;
                case keyEvent.DOM_VK_ESCAPE :
                    /* On va à l"élément parent */
                    idToFocus = this.props.idParent;
                    break;
                case keyEvent.DOM_VK_LEFT :
                    /* premier niveau de sous-menu : on va à l'élément de niveau 0 précédent*/
                    if(this.props.level == 1) {
                        var rootParentIndex = this._getRootParentIndex(id);
                        // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                        if (rootParentIndex > 0) {
                            idToFocus = MenuConstants.MENU_ROOT + (rootParentIndex - 1);
                        }// sinon retour au dernier item de même niveau
                        else {
                            var indexToFocus = rootParentIndex;
                            var last = false;
                            while(!last) {
                                if(this._isElementExists(MenuConstants.MENU_ROOT + (indexToFocus + 1))) {
                                    indexToFocus++;
                                } else {
                                    last = true;
                                }
                            }
                            idToFocus = MenuConstants.MENU_ROOT + (indexToFocus + 1);
                        }
                    } else {
                        /* On va à l'élément parent */
                        idToFocus = this.props.idParent;
                    }
                    break;
                case keyEvent.DOM_VK_DOWN :
                    // si on n'est pas sur le dernier item du niveau : vers item suivant de même niveau
                    if (itemIndex < (items.length - 1)) {
                        idToFocus = itemHierarchy + (itemIndex + 1);
                    } // sinon retour au premier item de même niveau
                    else {
                        idToFocus = items[0].id;
                    }

                    break;
                case keyEvent.DOM_VK_UP :
                    // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                    if(itemIndex > 0) {
                        idToFocus = itemHierarchy + (itemIndex - 1);
                    }// sinon retour au dernier item de même niveau
                    else {
                        idToFocus = items[items.length - 1].id;
                    }
                    break;
                default :
                    preventDefault = false;
            }
            if (idToFocus != id) {
                this.setFocus(idToFocus);
            }
            /* On stoppe si nécessaire la propagation pour éviter de redéclencher ce handler sur les éléments de menu parents */
            e.stopPropagation();
            /* On supprime le comportement par défaut pour les touches utilisées pour la navigation : pour éviter par exemple de faire défiler les ascenceurs */
            if (preventDefault) {
                e.preventDefault();
            }
        }
    },


    /**
     * Test si un element existe
     * @param id identifiant de l'élément à vérifier
     * @returns boolean
     * @private
     */
    _isElementExists: function (id) {
        return (document.getElementById(id) && document.getElementById(id).focus);
    },

    /**
     * Positionne le focus sur un élément selon son ID
     * @param id identifiant HTML de l'élément
     */
    setFocus: function (id) {
        var element = document.getElementById(id);
        if (element && element.focus) {
            element.focus();
        }
    }
});

module.exports = MenuNavigation;