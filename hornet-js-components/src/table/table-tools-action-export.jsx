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

        excelEnabled: React.PropTypes.bool,
        csvEnabled: React.PropTypes.bool,
        pdfEnabled: React.PropTypes.bool,
        classExport: React.PropTypes.string,
        imgFilePath: React.PropTypes.string,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),

        toggleFilters: React.PropTypes.func,
        filtersVisible: React.PropTypes.bool,
        filtersActive: React.PropTypes.bool,
        openDeleteAlert: React.PropTypes.func,
        criterias: React.PropTypes.object,
        sort: React.PropTypes.object,
        actionMassEnabled: React.PropTypes.bool,
        actionAddEnabled: React.PropTypes.bool,
        actionExportEnabled: React.PropTypes.bool,
        actionFilterEnabled: React.PropTypes.bool,
        classAction: React.PropTypes.string,

        actionExcelExportEnabled:React.PropTypes.bool,
        actionPdfExportEnabled:React.PropTypes.bool,
        actionCsvExportEnabled:React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            excelEnabled: false,
            csvEnabled: false,
            pdfEnabled: false,
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
        return this.props.excelEnabled !== nextProps.excelEnabled ||
            this.props.pdfEnabled !== nextProps.pdfEnabled ||
            this.props.csvEnabled !== nextProps.csvEnabled;
    },

    render: function () {
        logger.trace("render");
        try {
            var classExport = "hornet-datatable-export " + this.props.classExport;
            return (
                (this.props.excelEnabled || this.props.pdfEnabled || this.props.csvEnabled) ?
                    <div className={classExport}>
                        <div className="pure-g">
                            {this.props.excelEnabled ? <TableToolsActionExportButton {...this.props} enabled={true}
                                mediaType="xls" mediaTypeTitle={this._getExportExcelTitle()}/> : null}
                            {this.props.pdfEnabled ? <TableToolsActionExportButton {...this.props} enabled={true}
                                mediaType="pdf" mediaTypeTitle={this._getExportPdfTitle()}/> : null}
                            {this.props.csvEnabled ? <TableToolsActionExportButton {...this.props} enabled={true}
                                mediaType="csv" mediaTypeTitle={this._getExportCsvTitle()}/> : null}

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