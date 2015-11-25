"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var TableRow = require("src/table/table-row");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-rows");

var TableRows = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        columns: React.PropTypes.shape({
            title: React.PropTypes.string,
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            hide: React.PropTypes.bool
        }).isRequired,
        items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])).isRequired,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        sort: React.PropTypes.object,
        selectedItems: React.PropTypes.array,
        onChangeSelectedItems: React.PropTypes.func,
        messages: React.PropTypes.object,
        actionMassEnabled: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            i18n: this.i18n("table")
        }
    },

    render: function () {
        logger.trace("render : ", (this.props.items) ? this.props.items.length : "");
        try {
            var render = [];
            if (this.props.items && this.props.items.length > 0) {

                this.props.items.forEach((item, idx) => {

                    var classRow = "";
                    var selected = false;
                    if (this.props.selectedItems && this.props.selectedItems.length > 0) {
                        this.props.selectedItems.forEach((itemSelected)=> {
                            if (itemSelected[this.props.options.selectedKey] === item[this.props.options.selectedKey]) {
                                classRow += "hornet-datatable-selectedItems "
                                selected = true;
                                return;
                            }
                        });
                    }

                    classRow += (idx % 2) ? "hornet-datatable-odd" : "hornet-datatable-even";

                    render.push(
                        <TableRow
                            {...this.props}
                            key={this.props.tableName + "-row-" + idx}
                            item={item}
                            classRow={classRow}
                            selected={selected}
                        />
                    );
                });
            } else {
                render.push(
                    <tr>
                        <td colSpan="100%"
                            className="hornet-datatable-message-content">{this._emptyResult()}</td>
                    </tr>
                );
            }
            return (
                <tbody className="hornet-datatable-data">
                {render}
                </tbody>
            );
        } catch (e) {
            logger.error("Render table-rows exception", e);
            throw e;
        }
    },

    _emptyResult: function () {
        return this.props.messages.emptyResult || this.state.i18n.emptyResult
    }
});

module.exports = TableRows;