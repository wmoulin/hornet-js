"use strict";

var React = require("react");
var utils = require("hornet-js-utils");

var TableToolsActionAdd = require("src/table/table-tools-action-add");
var TableToolsActionMass = require("src/table/table-tools-action-mass");
var TableToolsActionExport = require("src/table/table-tools-action-export");
var TableToolsActionFilter = require("src/table/table-tools-action-filter");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-top-tools");

var TableToolsTop = React.createClass({

    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,

        openDeleteAlert: React.PropTypes.func,

        toggleFilters: React.PropTypes.func,
        filtersVisible: React.PropTypes.bool,
        filtersActive: React.PropTypes.bool,

        criterias: React.PropTypes.object,
        sort: React.PropTypes.object,

        actionMassEnabled: React.PropTypes.bool,
        actionAddEnabled: React.PropTypes.bool,
        actionExcelExportEnabled: React.PropTypes.bool,
        actionPdfExportEnabled: React.PropTypes.bool,
        actionCsvExportEnabled: React.PropTypes.bool,
        actionFilterEnabled: React.PropTypes.bool,
        imgFilePath: React.PropTypes.string,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getDefaultProps: function () {
        return {
            actionMassEnabled: false,
            actionAddEnabled: false,
            actionFilterEnabled: false
        };
    },

    render: function () {
        logger.trace("render");
        try {
            return (
                <div className="hornet-datatable-top pure-g">

                    <TableToolsActionMass {...this.props} enabled={this.props.actionMassEnabled}
                                                          classAction="pure-u-2-24"/>
                    <TableToolsActionAdd {...this.props} enabled={this.props.actionAddEnabled}
                                                         classAction="pure-u-14-24"/>
                    <TableToolsActionExport {...this.props} excelEnabled={this.props.actionExcelExportEnabled} pdfEnabled={this.props.actionPdfExportEnabled} csvEnabled={this.props.actionCsvExportEnabled}
                                                            classAction="pure-u-4-24" classExport="pure-u-6-24"/>

                    {this.props.children}

                    <TableToolsActionFilter {...this.props} enabled={this.props.actionFilterEnabled}
                                                            classAction="pure-u-1-24"/>
                </div>
            );
        } catch (e) {
            logger.error("Render table-top-tools exception", e);
            throw e;
        }
    }
});
module.exports = TableToolsTop;