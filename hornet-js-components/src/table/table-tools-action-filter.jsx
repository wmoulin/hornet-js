"use strict";

var React = require("react")
var utils = require("hornet-js-utils");
var Icon = require("src/icon/icon");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-tools-action-filter");

var TableToolsActionFilter = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,
        classAction: React.PropTypes.string,

        toggleFilters: React.PropTypes.func.isRequired,

        filtersVisible: React.PropTypes.bool,
        filtersActive: React.PropTypes.bool,

        enabled: React.PropTypes.bool,

        tableName: React.PropTypes.string.isRequired,
        openDeleteAlert: React.PropTypes.func,
        criterias: React.PropTypes.object,
        sort: React.PropTypes.object,
        imgFilePath: React.PropTypes.string,
        actionMassEnabled: React.PropTypes.bool,
        actionAddEnabled: React.PropTypes.bool,
        actionExportEnabled: React.PropTypes.bool,
        actionFilterEnabled: React.PropTypes.bool,
        actionExcelExportEnabled:React.PropTypes.bool,
        actionPdfExportEnabled:React.PropTypes.bool,
        actionCsvExportEnabled:React.PropTypes.bool
    },

    getDefaultProps: function () {
        logger.trace("getDefaultProps");
        return {
            enabled: false,
            filtersVisible: false,
            filtersActive: false
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
        return this.props.enabled !== nextProps.enabled
            || this.props.filtersVisible !== nextProps.filtersVisible
            || this.props.filtersActive !== nextProps.filtersActive;
    },

    render: function () {
        logger.trace("render");
        try {
            return (
                (this.props.enabled) ? this._renderBoutonFiltre() : null
            );
        } catch (e) {
            logger.error("Render table-tools-action-filter exception", e);
            throw e;
        }
    },

    /**
     * Rendu HTML du bouton de filtre
     * @returns {XML}
     * @private
     */
    _renderBoutonFiltre: function () {
        logger.trace("_renderBoutonFiltre");

        var classMassButton = "hornet-datatable-action " + this.props.classAction;

        var titleFilter;
        var altFilter;

        var classFilterButton = "hornet-datatable-filter-button ";
        if (this.props.filtersVisible) {
            classFilterButton += "hornet-datatable-filter-button-show-visible ";
            if (this.props.filtersActive) {
                titleFilter = this._getHideFiltering();
            }else{
                titleFilter = this._getHideFilter();
            }
        } else {
            classFilterButton += "hornet-datatable-filter-button-show-hidden ";
            if (this.props.filtersActive) {
                titleFilter = this._getShowFiltering();
            }else{
                titleFilter = this._getShowFilter();
            }
        }
        if (this.props.filtersActive) {
            // classe indiquant que les filtres sont appliqués
            classFilterButton += " hornet-datatable-filter-button-show-active";
        }

        var urlTheme = this.props.imgFilePath || this.genUrlTheme();
        return (
            <div className={classMassButton}>
                <Icon
                    url=""
                    src={urlTheme + "/img/tableau/ico_filtrer.png"}
                    alt={titleFilter}
                    title={titleFilter}
                    classLink={classFilterButton}
                    onClick={this.props.toggleFilters}
                />
            </div>
        );
    },

    _getShowFilter: function () {
        return this.props.messages.showFilter || this.state.i18n.showFilter;
    },

    _getShowFiltering: function () {
        return this.props.messages.showFiltering || this.state.i18n.showFiltering;
    },

    _getHideFiltering: function () {
        return this.props.messages.hideFiltering || this.state.i18n.hideFiltering;
    },

    _getHideFilter: function () {
        return this.props.messages.hideFilter || this.state.i18n.hideFilter;
    }

});

module.exports = TableToolsActionFilter;