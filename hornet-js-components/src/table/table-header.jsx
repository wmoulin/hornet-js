"use strict";
var utils = require("hornet-js-utils");
var React = require("react");

var TableHeaderMass = require("src/table/table-header-mass");
var TableHeaderColumn = require("src/table/table-header-column");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-header");

var _ = utils._;

var TableHeader = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: ({
        tableName: React.PropTypes.string,
        columns: React.PropTypes.shape({
            title: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            filter: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            render: React.PropTypes.func,
            icon: React.PropTypes.bool
        }).isRequired,
        items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])).isRequired,
        onChangeSelectedItems: React.PropTypes.func,
        onChangeSortData: React.PropTypes.func,
        sort: React.PropTypes.object,
        routes: React.PropTypes.object,
        store: React.PropTypes.func.isRequired,
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

        actionMassEnabled: React.PropTypes.bool,
        actionMassChecked: React.PropTypes.bool,
        imgFilePath: React.PropTypes.string,
        options: React.PropTypes.object,
        selectedItems: React.PropTypes.array,
        captionText: React.PropTypes.string
    }),


    render: function () {
        logger.trace("Rendu Header Tableau");

        try {
            var tableHeaderColumns = [];
            _.forOwn(this.props.columns, (column, columnName) => {
                tableHeaderColumns.push(
                    <TableHeaderColumn
                        {...this.props}
                        key={this.props.tableName + "-TableHeaderColumn-" + columnName}
                        columnName={columnName}
                        column={column}/>
                );
            }, this);

            return (
                <thead className="hornet-datatable-columns">
                    <tr>
                        <TableHeaderMass {...this.props}
                            key={this.props.tableName + "-TableHeaderColumn-Mass"}
                            enabled={this.props.actionMassEnabled}
                            checked={this.props.actionMassChecked}/>
                        {tableHeaderColumns}
                    </tr>
                </thead>
            );
        } catch (e) {
            logger.error("Render table-header exception", e);
            throw e;
        }
    }
});

module.exports = TableHeader;
