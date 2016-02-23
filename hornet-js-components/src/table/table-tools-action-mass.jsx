"use strict";

var React = require("react")
var utils = require("hornet-js-utils");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-tools-action-mass");

var TableToolsActionMass = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string.isRequired,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,
        classAction: React.PropTypes.string,
        openDeleteAlert: React.PropTypes.func,
        enabled: React.PropTypes.bool,
        pagination: React.PropTypes.object,
        onchangePaginationData: React.PropTypes.func,
        /** Choix de taille de page proposés */
        pageSizeSelect: React.PropTypes.arrayOf(React.PropTypes.shape({
            /** Taille de page */
            value: React.PropTypes.number.isRequired,
            /** Clé du libellé à rechercher dans messages ou dans le bloc de messages du composant "table" */
            textKey: React.PropTypes.string.isRequired
        })),
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        actionMassEnabled: React.PropTypes.bool,
        actionAddEnabled: React.PropTypes.bool,
        actionPaginationEnabled: React.PropTypes.bool,
        toggleFilters: React.PropTypes.func,
        filtersVisible: React.PropTypes.bool,
        filtersActive: React.PropTypes.bool,
        criterias: React.PropTypes.object,
        sort: React.PropTypes.object,
        actionExportEnabled:React.PropTypes.bool,
        actionFilterEnabled: React.PropTypes.bool,

        actionExcelExportEnabled:React.PropTypes.bool,
        actionPdfExportEnabled:React.PropTypes.bool,
        actionCsvExportEnabled:React.PropTypes.bool,
        excelEnabled:React.PropTypes.bool,
        pdfEnabled:React.PropTypes.bool,
        csvEnabled:React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            enabled: false
        };
    },

    getInitialState: function () {
        logger.trace("getInitialState");
        return ({
            i18n: this.i18n("table")
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.enabled !== nextProps.enabled;
    },

    render: function () {
        logger.trace("render");
        try {

            return (
                (this.props.enabled) ? this._renderActionMassButton() : null
            );

        } catch (e) {
            logger.error("Render table-tools-action-mass exception", e);
            throw e;
        }
    },

    _renderActionMassButton: function () {

        var massTitle = this._getMassTitle(),
            classMassButton = "hornet-datatable-action " + this.props.classAction,
            urlTheme = this.props.imgFilePath || this.genUrlTheme();

        return ( (this.props.enabled) ?
                <div className={classMassButton}>
                    <input type="image"
                           title={massTitle}
                           value="Submit"
                           name={this.props.tableName + "-selectedAllItems"}
                           src={urlTheme + "/img/tableau/ico_supprimer.png"}
                           alt={massTitle}
                           onClick={this.props.openDeleteAlert}
                    />
                </div> : null
        );
    },

    _getMassTitle: function () {
        return this.props.messages.deleteAllActionTitle || this.state.i18n.deleteAllActionTitle;
    }
});

module.exports = TableToolsActionMass;