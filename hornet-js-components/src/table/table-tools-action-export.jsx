"use strict";

var React = require("react")
var utils = require("hornet-js-utils");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var TableToolsActionExportButton = require("src/table/table-tools-action-export-button");

var logger = utils.getLogger("hornet-js-components.table.table-tools-action-export");

var TableToolsActionExport = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,

        enabled: React.PropTypes.bool,
        classExport: React.PropTypes.string,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])

    },

    getDefaultProps: function () {
        return {
            enabled: false,
            classExport: "pure-u-1-3"
        };
    },

    getInitialState: function () {
        logger.trace("getInitialState");
        return ({
            i18n: this.i18n("table")
        });
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.enabled !== nextProps.enabled;
    },

    render: function () {
        logger.trace("render");
        try {
            var classExport = "hornet-datatable-export " + this.props.classExport;
            return (
                (this.props.enabled) ?
                    <div className={classExport}>
                        <div className="pure-g">
                            <TableToolsActionExportButton {...this.props}
                                mediaType="xls" mediaTypeTitle={this._getExportExcelTitle()}/>
                            <TableToolsActionExportButton {...this.props}
                                mediaType="pdf" mediaTypeTitle={this._getExportPdfTitle()}/>
                            <TableToolsActionExportButton {...this.props}
                                mediaType="csv" mediaTypeTitle={this._getExportCsvTitle()}/>

                            {this.props.children}
                        </div>
                    </div>
                    : null
            );
        } catch (e) {
            logger.error("Render table-tools-action-export exception", e);
            throw e;
        }
    },

    _getExportExcelTitle: function () {
        return this.props.messages.exportExcelTitle || this.state.i18n.exportExcelTitle;
    },

    _getExportPdfTitle: function () {
        return this.props.messages.exportPdfTitle || this.state.i18n.exportPdfTitle;
    },

    _getExportCsvTitle: function () {
        return this.props.messages.exportCsvTitle || this.state.i18n.exportCsvTitle;
    },
});

module.exports = TableToolsActionExport;