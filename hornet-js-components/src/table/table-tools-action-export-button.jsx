"use strict";

var React = require("react")
var utils = require("hornet-js-utils");
var Icon = require("src/icon/icon");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-tools-action-export-button");

var TableToolsActionExportButton = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,
        classExportButton: React.PropTypes.string,

        enabled: React.PropTypes.bool,
        icoExport: React.PropTypes.string,

        mediaType: React.PropTypes.string,
        mediaTypeTitle: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            enabled: false,
            icoExport: "/img/tableau/ico_export_",
            classExportButton: "pure-u-1-3"
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
            return (
                (this.props.enabled) ?
                    this._getExportButton()
                    : null
            );
        } catch (e) {
            logger.error("Render table-tools-action-export-button exception", e);
            throw e;
        }
    },

    /**
     * Méthode permettant de générer le bouton d'export
     * @param mediaType
     * @param mediaTypeLibelle
     * @returns {XML}
     * @private
     */
    _getExportButton: function () {
        logger.trace("_getBoutonExport");

        var exportTitle = this._getExportTitle();
        var exportRoute = this.props.routes && this.props.routes.export;
        var exportAction = this.props.actions && this.props.actions.export;

        if (exportRoute || exportAction) {
            var classExportButton = "hornet-datatable-action "+this.props.classAction;
            return (
                <div className={classExportButton}>
                    <Icon
                        title={exportTitle}
                        alt={exportTitle}
                        onClick={exportAction}
                        url={(exportRoute)? exportRoute + "?mediaType=" + this.props.mediaType : "#"}
                        name={this.props.tableName+"-export-"+ this.props.mediaType}
                        src={this.genUrlTheme(this.props.icoExport + this.props.mediaType + ".png")}
                    />
                </div>
            );
        } else {
            logger.warn("Action EXPORT problem configuration, exportRoute :", exportRoute, ",exportAction", exportAction);
        }
    },

    _getExportTitle: function () {
        var exportTitle = this.props.messages.exportTitle || this.state.i18n.exportTitle;
        return this.formatMessage(exportTitle, {
            "format": this.props.mediaTypeTitle
        });
    }
});

module.exports = TableToolsActionExportButton;