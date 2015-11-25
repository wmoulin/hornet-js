"use strict";
var utils = require("hornet-js-utils");
var React = require("react");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-header-mass");

var TableHeaderMass = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: ({
        tableName: React.PropTypes.string,
        items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])).isRequired,
        onChangeSelectedItems: React.PropTypes.func,
        messages: React.PropTypes.shape({
            tableTitle: React.PropTypes.string,
            emptyResult: React.PropTypes.string,
            deleteAllConfirmation: React.PropTypes.string,
            captionText: React.PropTypes.string,
            addTitle: React.PropTypes.string,
            filterValid: React.PropTypes.string,
            filterValidTitle: React.PropTypes.string,
            filterCancel: React.PropTypes.string,
            filterCancelTitle: React.PropTypes.string,
            hideFiltering: React.PropTypes.string,
            hideFilteringTitle: React.PropTypes.string,
            selectedAllTitle: React.PropTypes.string,
            deselectedAllTitle: React.PropTypes.string
        }),
        enabled: React.PropTypes.bool,
        checked: React.PropTypes.bool
    }),

    getDefaultProps: function () {
        return {
            enabled: false,
            checked: false
        };
    },

    getInitialState: function () {
        logger.trace("getInitialState");
        return {
            i18n: this.i18n("table")
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.checked !== nextProps.checked
            || this.props.enabled !== nextProps.enabled;
    },

    render: function () {
        logger.trace("Rendu Header mass Tableau");
        try {
            return (
                (this.props.enabled) ? this._getBoutonsActionsMasse() : null
            );
        } catch (e) {
            logger.error("Render table-header-mass exception", e);
            throw e;
        }
    },

    /**
     * Méthode permettant de générer le code HTML des cases à cocher de sélection/désélection de masse
     * @returns {XML}
     * @private
     */
    _getBoutonsActionsMasse: function () {
        logger.trace("_getBoutonsActionsMasse");
        return (
            <th className="hornet-datatable-header" scope="col">
                <div className="hornet-datatable-header-select">
                    <input type="checkbox"
                           key={this.props.tableName + "_input_table_mass"}
                           title={(this.props.checked)?this._getDeselectedAllTitle():this._getSelectedAllTitle()}
                           checked={this.props.checked}
                           onChange={this._onClickCheckBox}/>
                </div>
            </th>
        );
    },

    _getSelectedAllTitle: function () {
        return this.props.messages.selectedAllTitle || this.state.i18n.selectedAllTitle;
    },

    _getDeselectedAllTitle: function () {
        return this.props.messages.deselectedAllTitle || this.state.i18n.deselectedAllTitle;
    },

    /**
     * Action liée au clic sur les cases à cocher d'action de masse
     * @param checked
     * @returns {Function}
     * @private
     */
    _onClickCheckBox: function () {
        logger.trace("_onClickCheckBox");
        var selectedItems = (!this.props.checked) ? this.props.items : [];
        this.props.onChangeSelectedItems(selectedItems);
    }

});

module.exports = TableHeaderMass;