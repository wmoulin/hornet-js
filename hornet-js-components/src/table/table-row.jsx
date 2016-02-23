"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var classNames = require("classnames");

var logger = utils.getLogger("hornet-js-components.table.table-row");

var TableRow = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        item: React.PropTypes.object,
        columns: React.PropTypes.shape({
            title: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            hide: React.PropTypes.bool
        }).isRequired,
        options: React.PropTypes.object,
        sort: React.PropTypes.object,
        selectedItems: React.PropTypes.array,
        onChangeSelectedItems: React.PropTypes.func,
        classRow: React.PropTypes.string,
        selected: React.PropTypes.bool,
        actionMassEnabled: React.PropTypes.bool
    },

    getDefaultProps: function () {
        logger.trace("getDefaultProps");
        return {
            selected: false
        }
    },

    getInitialState: function () {
        return {
            i18n: this.i18n("table")
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.selected !== nextProps.selected
            || this.props.item !== nextProps.item
            || this.props.actionMassEnabled !== nextProps.actionMassEnabled
            || this.props.classRow !== nextProps.classRow
            || this.props.sort !== nextProps.sort;
    },

    _getIndexOfItem: function (collection, property, value) {
        logger.trace("_getIndexOfItem");

        return collection.map(function (el) {
            return el[property]
        }).indexOf(value);
    },

    /**
     * Méthode permettant de mettre à jour les tableau des éléments sélectionnés pour les actions massives
     * @param id
     * @private
     */
    _toggleSelection: function () {
        logger.trace("_toggleSelection");

        var selectKey = this.props.options && this.props.options.selectedKey || "id";

        var selectedItems = this.props.selectedItems || [];
        var index = this._getIndexOfItem(selectedItems, [selectKey], this.props.item[selectKey]);
        if (index !== -1) {
            //Suppression de l'item
            selectedItems.splice(index, 1);
        } else {
            //ajout de l'item
            selectedItems.push(this.props.item);
        }

        this.props.onChangeSelectedItems(selectedItems);
    },

    /**
     * Génère le code HTML lié aux cases à cocher de sélection/déselection
     * @param item
     * @param selectedItems
     * @returns {XML}
     * @private
     */
    _getColonneCheckbox: function () {
        logger.trace("_getColonneCheckbox");
        var selectKey = this.props.options && this.props.options.selectedKey || "id";
        return (
            <td className="hornet-datatable-cell hornet-datatable-cell-select">
                <input
                    type="checkbox"
                    title={this._getSelectedTitle()}
                    value={this.props.item[selectKey]}
                    name={this.props.tableName + "-selectedItems-" + this.props.item[selectKey]}
                    checked={this.props.selected ? "checked" : ""}
                    data-id={this.props.item[selectKey]}
                    onChange={this._toggleSelection}
                />
            </td>
        );
    },

    _getSelectedTitle: function () {
        return this.props.messages.selectedTitle || this.state.i18n.selectedTitle;
    },

    _renderCell: function (item) {
        logger.trace("_renderCell");

        var columnNames = Object.keys(this.props.columns);
        var columns = this.props.columns;
        var sort = this.props.sort;
        return columnNames.map((prop) => {

            var classes = {};
            classes["hornet-datatable-cell"] = true;

            var columnKey = prop;
            if (columns[prop].sort && columns[prop].sort.by) {
                columnKey = columns[prop].sort.by;
            }

            if (sort && sort.key == columnKey && columns[prop].sort) {
                classes["hornet-datatable-sorted"] = (sort.key === columnKey);
            }

            classes["hornet-datatable-cell-custom"] = columns[prop].custom;
            classes["hornet-datatable-cell-custom-" + columnKey] = columns[prop].custom;

            var className = classNames(classes);

            var cell = (
                <td
                    key={this.props.tableName + "-" + prop}
                    className={className}
                    data-title={columns[prop].title}
                >
                    {columns[prop].render ?
                        columns[prop].render(this.props.item[prop], this.props.item) :
                        this.props.item[prop]}
                </td>
            );

            return (
                (!columns[prop].hide) ? cell : null
            );
        });
    },

    render: function () {
        logger.trace("render");

        try {
            return (
                <tr className={this.props.classRow}>
                    {(this.props.actionMassEnabled) ? this._getColonneCheckbox() : null}
                    { this._renderCell() }
                </tr>
            )
        } catch (e) {
            logger.error("Render table-row exception", e);
            throw e;
        }
    }
});

module.exports = TableRow;