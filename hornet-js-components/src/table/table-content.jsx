"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var TableHeader = require("src/table/table-header");
var TableRows = require("src/table/table-rows");
var TableCaption = require("src/table/table-caption");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-content");

var TableContent = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        columns: React.PropTypes.shape({
            title: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            filter: React.PropTypes.object,
            render: React.PropTypes.func,
            icon: React.PropTypes.bool
        }).isRequired,
        items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ])).isRequired,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        selectedItems: React.PropTypes.array,
        onChangeSelectedItems: React.PropTypes.func,
        captionText: React.PropTypes.string,
        store: React.PropTypes.func.isRequired,
        messages: React.PropTypes.object,
        defaultSort: React.PropTypes.object,
        actionMassEnabled: React.PropTypes.bool,
        actionMassChecked: React.PropTypes.bool,
        imgFilePath: React.PropTypes.string,
        onChangeSortData: React.PropTypes.func,
        sort: React.PropTypes.object
    },

    render: function () {
        logger.trace("render");
        try {
            return (
                <div className="hornet-datatable-content">
                    <table role="presentation">
                        <TableCaption captionText={this.props.captionText}/>
                        <TableHeader {...this.props}/>
                        <TableRows {...this.props}/>
                    </table>
                </div>
            );
        } catch (e) {
            logger.error("Render table-content exception", e);
            throw e;
        }
    }
});

module.exports = TableContent;