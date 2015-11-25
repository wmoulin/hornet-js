"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-component.navigation.bread-crumb-item");

var BreadCrumbItem = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        data: React.PropTypes.object
    },

    /**
     * Méthode de génaration d'un lien
     * @param item
     * @param indice
     * @returns {React.ReactElement<{href: *}>}
     * @private
     */
    _makeLink: function (item, indice) {
        var props = {href: this.genUrl(item.url)};
        (indice == 1) ? props.id = "root" : null;
        return React.createElement("a", props, this._makeSpan(this.i18n(item.text)));
    },

    /**
     * Méthode de génération d'une balise de type span
     * @param labelElement
     * @returns {React.ReactElement<null>}
     * @private
     */
    _makeSpan: function (labelElement) {
        return React.createElement("span", null, labelElement)
    },

    /**
     * Méthode de génération d'un chevron
     * @returns {XML}
     * @private
     */
    _makeChevron: function () {
        return <span className="fil-ariane-chevron" aria-hidden="true"/>;
    },

    /**
     * Permet de mettre en gras du texte
     * @param text
     * @returns {React.ReactElement<null>}
     * @private
     */
    _makeStrong: function (text) {
        return React.createElement("strong", null, text);
    },

    render: function () {

        var {maxIndice, item, currentIndice} = this.props.data;

        var liClass = (currentIndice == 1) ? "fil-ariane-racine" : (currentIndice == maxIndice) ? "fil-ariane-courant" : "fil-ariane-parent";
        var labelElement = ( (item.url) && (currentIndice != maxIndice) ) ? this._makeLink(item, currentIndice) : (currentIndice == maxIndice) ? this._makeSpan(this._makeStrong(this.i18n(item.text))) : this.i18n(item.text);

        var isChevron = (currentIndice > 1) || (currentIndice == maxIndice);

        return (
            <li className={liClass}>
                {(isChevron) ? this._makeChevron() : null}
                {labelElement}
            </li>
        )
    }
});

module.exports = BreadCrumbItem;