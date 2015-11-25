"use strict";
var utils = require("hornet-js-utils");
var React = require("react");

var TableStore = require("src/table/store/table-store");

var TableActions = require("src/table/actions/table-actions");

var DatePickerField = require("src/calendar/date-picker-field");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

// Composants de formulaire
var newforms = require("newforms");
var Form = require("src/form/form");
var GridForm = require("src/form/grid-form");
var Row = GridForm.Row;
var Field = GridForm.Field;

var logger = utils.getLogger("hornet-js-components.table.table-filters");
var _ = utils._;

var TableFilters = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: ({
        tableName: React.PropTypes.string,
        columns: React.PropTypes.shape({
            title: React.PropTypes.string,
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            filter: React.PropTypes.object,
            render: React.PropTypes.func,
            icon: React.PropTypes.bool
        }).isRequired,
        routes: React.PropTypes.object,
        store: React.PropTypes.func.isRequired,
        messages: React.PropTypes.object,

        toggle: React.PropTypes.func,
        activate: React.PropTypes.func,
        visible: React.PropTypes.bool,
        enabled: React.PropTypes.bool,
        active: React.PropTypes.bool
    }),

    getDefaultProps: function () {
        logger.trace("getDefaultProps");
        return {
            enabled: false,
            visible: false
        }
    },

    getInitialState: function () {
        logger.trace("getInitialState");

        var configForm = _.assign(this._constructFieldsForm());
        var FilterNewForm = newforms.Form.extend(configForm);
        var filterData = this.context.getStore(TableStore).getFilterData(this.props.tableName);

        logger.trace("configForm : ", configForm);
        logger.trace("FilterForm : ", FilterNewForm);
        logger.trace("filterData : ", filterData);

        var localForm = new FilterNewForm({
            data: filterData,
            onChange: this.forceUpdate.bind(this)
        });

        return {
            i18n: this.i18n("table"),
            filterForm: localForm
        };
    },

    componentDidMount: function () {
        logger.trace("componentDidMount");
        this.throttledSetRouteInternal = this.throttle(window.routeur.setRouteInternal.bind(window.routeur));
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.enabled !== nextProps.enabled
            || this.props.visible !== nextProps.visible
            || this.props.active !== nextProps.active;
    },

    render: function () {
        logger.trace("render");

        if (this.props.enabled && this.props.visible) {
            var localFormConf = {
                autoId: this.props.tableName + "-FilterForms",
                data: this.state.filterForm,
                controlled: true
            };
            return (
                <div className="hornet-datatable-filter">
                    <Form
                        formConf={localFormConf}
                        form={this.state.filterForm}
                        formClassName="pure-form"
                        buttons={this._renderButtonsForm()}
                        onSubmit={this._onSubmitFilter}
                        name={this.props.tableName + "-filterForm"}
                        isMandatoryFieldsHidden={true}
                    >
                        {this._renderContentForm()}
                    </Form>
                </div>
            );
        } else {
            return null;
        }
    },

    /**
     * Méthode permettant de construire dynamiquement les champs du formulaire
     * @returns {{}}
     */
    _constructFieldsForm: function () {
        logger.trace("_constructFieldsForm");

        var columnNames = Object.keys(this.props.columns);
        var self = this;
        var fields = {};
        columnNames.map(function (c) {
            var column = self.props.columns[c];

            if (column.abbr && !column.lang) {
                logger.warn("Column ", columnName, " Must have lang with abbr configuration");
            }

            if (column.filter) {
                switch (column.filter.type) {
                    case "text":
                        fields[c] = newforms.CharField({
                            label: column.title,
                            required: false
                        });
                        break;
                    case "checkbox":
                        fields[c] = newforms.BooleanField({
                            label: column.title,
                            required: false
                        });
                        break;
                    case "date":
                        fields[c] = DatePickerField({
                            label: column.title,
                            required: false,
                            /* Le format de saisie de date par défaut est défini avec la clé calendar.dateFormat dans messages.json
                             ou dans hornet-messages-components.json */
                            errorMessages: {
                                "invalid": "Le format du champ « " + column.title + " » est incorrect."  // TODO I18N
                            }
                        });
                        break;
                }
            }
        });
        return (fields);
    },

    /**
     * Génère le code HTML du formulaire de filtres
     * @returns {{}}
     */
    _renderContentForm: function () {
        logger.trace("_renderContentForm");

        var form = this.state.filterForm;
        var keys = Object.keys(form.boundFieldsObj());
        var fields = [];
        keys.map((columnName) => {
            var abbr = this.props.columns[columnName].abbr;
            var lang = this.props.columns[columnName].lang;
            if(abbr && !lang){
                logger.warn("Field ", columnName, " Must have lang with abbr configuration");
            }
            fields.push(<Field key={this.props.tableName + "-" + columnName} name={columnName} abbr={abbr} lang={lang}/>);
        });
        var rows = [];
        for (var i = 0; i < fields.length; i += 2) {
            rows.push(<Row>{fields.slice(i, i + 2)}</Row>);
        }
        return rows;
    },

    /**
     * Génère les boutons du bloc "Filtres"
     * @returns {XML}
     */
    _renderButtonsForm: function () {
        logger.trace("_renderButtonsForm");

        return [
            {
                type: "submit",
                id: this.props.tableName + "-filterButton",
                name: "btnFiltrer",
                value: "Filtrer",
                className: "hornet-button",
                label: this._getFilterValid(),
                title: this._getFilterValidTitle()
            },
            {
                type: "reset",
                id: this.props.tableName + "-cancelFilterButton",
                name: "btnAnnuler",
                value: "Annuler",
                className: "hornet-button",
                label: this._getFilterCancel(),
                title: this._getFilterCancelTitle(),
                onClick: this._onCancelFilterButton
            },
            {
                type: "button",
                id: this.props.tableName + "-toggleFilterButton",
                name: "btnHideFilters",
                value: "HideFilters",
                className: "hornet-button",
                label: (this.props.active) ? this._getHideFiltering() : this._getHideFilter(),
                title: (this.props.active) ? this._getHideFilteringTitle() : this._getHideFilterTitle(),
                onClick: this._onToggleFilterButton
            }
        ];
    },

    /**
     * Action d'annulation de filtres
     */
    _onCancelFilterButton: function (e) {
        logger.trace("_onCancelFilterButton");

        this.state.filterForm.reset();
        this.props.toggle();

        var data = this._getData();
        data.filters = {};
        data.pagination = {};
        data.emit = true;

        this.executeAction(new TableActions.SaveState().action(), data);

        this.throttledSetRouteInternal(this.props.routes.search, data);
        this.props.activate(false);
    },

    _onToggleFilterButton: function (e) {
        logger.trace("_onToggleFilterButton");

        this.state.filterForm.validate();
        this.props.toggle();
    },

    /**
     * Génère l'action liée au Submit du formulaire de Filtres
     * @param e
     */
    _onSubmitFilter: function (form) {
        logger.trace("_onSubmitFilter");
        var store = this.getStore(this.props.store);

        if (form.validate()) {
            logger.trace("Formulaire valide");

            // Applique les modifications de tri sur l'état précédent
            var data = this._getData();
            data.filters = form.cleanedData;
            data.pagination = {};
            data.emit = true;

            this.executeAction(new TableActions.SaveState().action(), data);

            this.throttledSetRouteInternal(this.props.routes.search, data);
            this.props.activate(true);
        } else {
            logger.trace("Formulaire invalide");
        }
    },

    _getData: function(){
        var tableStore = this.context.getStore(TableStore);
        return {
            key: this.props.tableName,
            criterias: this.getStore(this.props.store).getCriterias(),
            sort: tableStore.getSortData(this.props.tableName),
            selectedItems: []
        };
    },

    _getFilterValid: function () {
        return this.props.messages.filterValid || this.state.i18n.filterValid;
    },

    _getFilterValidTitle: function () {
        return this.props.messages.filterValidTitle || this.state.i18n.filterValidTitle;
    },

    _getFilterCancel: function () {
        return this.props.messages.filterCancel || this.state.i18n.filterCancel;
    },

    _getFilterCancelTitle: function () {
        return this.props.messages.filterCancelTitle || this.state.i18n.filterCancelTitle;
    },

    _getHideFiltering: function () {
        return this.props.messages.hideFiltering || this.state.i18n.hideFiltering;
    },

    _getHideFilteringTitle: function () {
        return this.props.messages.hideFilteringTitle || this.state.i18n.hideFilteringTitle;
    },

    _getHideFilter: function () {
        return this.props.messages.hideFilter || this.state.i18n.hideFilter;
    },

    _getHideFilterTitle: function () {
        return this.props.messages.hideFilterTitle || this.state.i18n.hideFilterTitle;
    }
});

module.exports = TableFilters;