"use strict";

var utils = require("hornet-js-utils");
var React = require("react");

var Alert = require('hornet-js-components/src/dialog/alert');

var TableTitle = require("src/table/table-title");
var TableFilters = require("src/table/table-filters");
var TableContent = require("src/table/table-content");
var TableToolsTop = require("src/table/table-tools-top");
var TableToolsBottom = require("src/table/table-tools-bottom");

var TableActions = require("src/table/actions/table-actions");

var TableStore = require("src/table/store/table-store");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table");
var _ = utils._;

var Table = React.createClass({
    mixins: [HornetComponentMixin],
    statics: {
        storeListeners: {onChange: [TableStore]}
    },

    propTypes: {
        config: React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            columns: React.PropTypes.shape({
                title: React.PropTypes.string,
                sort: React.PropTypes.string,
                filter: React.PropTypes.string,
                render: React.PropTypes.func,
                icon: React.PropTypes.bool,
                hide: React.PropTypes.bool
            }).isRequired,
            messages: React.PropTypes.shape({
                tableTitle: React.PropTypes.string,
                emptyResult: React.PropTypes.string,
                deleteAllTitle: React.PropTypes.string,
                deleteAllConfirmation: React.PropTypes.string,
                deleteAllActionTitle: React.PropTypes.string,
                captionText: React.PropTypes.string,
                addTitle: React.PropTypes.string,
                filterValid: React.PropTypes.string,
                filterValidTitle: React.PropTypes.string,
                filterCancel: React.PropTypes.string,
                filterCancelTitle: React.PropTypes.string,
                hideFiltering: React.PropTypes.string,
                hideFilteringTitle: React.PropTypes.string,
                hideFilter: React.PropTypes.string,
                hideFilterTitle: React.PropTypes.string,
                showFilter: React.PropTypes.string,
                showFiltering: React.PropTypes.string,
                selectedAllTitle: React.PropTypes.string,
                deselectedAllTitle: React.PropTypes.string,
                exportTitle: React.PropTypes.string,
                exportExcelTitle: React.PropTypes.string,
                exportPdfTitle: React.PropTypes.string,
                exportCsvTitle: React.PropTypes.string,
                firstPage: React.PropTypes.string,
                prevPage: React.PropTypes.string,
                nextPage: React.PropTypes.string,
                lastPage: React.PropTypes.string,
                displayAll: React.PropTypes.string
            }),
            dispatchEvent: React.PropTypes.shape({
                sortingEvent: React.PropTypes.string
            }),
            store: React.PropTypes.func.isRequired,
            options: React.PropTypes.shape({
                itemsPerPage: React.PropTypes.number,
                hasFilter: React.PropTypes.bool,
                clientSideSorting: React.PropTypes.bool,
                hasExportButtons: React.PropTypes.bool,
                hasAddButton: React.PropTypes.bool,
                hasDelAllButton: React.PropTypes.bool,
                selectedKey: React.PropTypes.string,
                defaultSort: React.PropTypes.shape({
                    key: React.PropTypes.string,
                    dir: React.PropTypes.string,
                    type: React.PropTypes.string
                })
            }),
            actions: React.PropTypes.object,
            routes: React.PropTypes.object

        }).isRequired,
        isVisible: React.PropTypes.bool,

        /* fonctions surchargeables */
        toggleFilters: React.PropTypes.func,
        activateFilters: React.PropTypes.func,
        openDeleteAlert: React.PropTypes.func,
        onChangePaginationData: React.PropTypes.func,
        onChangeSortData: React.PropTypes.func,
        onChangeSelectedItems: React.PropTypes.func
    },

    getDefaultProps: function () {
        logger.trace("Table getDefaultProps");
        return {
            config:{
                options: {
                    itemsPerPage: 10,
                    hasFilter: false,
                    clientSideSorting: false,
                    hasExportButtons: false,
                    hasAddButton: false,
                    hasDelAllButton: false,
                    selectedKey: "id"
                }
            },
            isVisible: true

        }
    },

    getInitialState: function () {
        logger.trace("Table getInitialState");
        var data = this.getData();
        var tableStore = this.context.getStore(TableStore);

        var pagination = this._getDefaultPagination(data);
        var sort = this._getDefaultSort();

        //réinitialisation du store
        this.executeAction(new TableActions.SaveState().action(), {
                key: this.props.config.name,
                pagination: pagination,
                defaultSort: sort,
                sort: sort
            }
        );

        var isFiltersVisible = this.props.config.options.isFiltersVisible || false;
        var isFiltersActive = false;
        if(isFiltersVisible) {
            var filter = tableStore.getFilterData(this.props.config.name);
            if (filter && !_.isEmpty(filter)) {
                isFiltersActive = true;
            } else {
                isFiltersActive = false;
            }
        }

        return {
            i18n: this.i18n("table"),
            items: data.items || [],
            isFiltersVisible: isFiltersVisible,
            isFiltersActive: isFiltersActive,
            pagination: pagination,
            sort: sort,
            actionMassChecked: false,
            actionMassEnabled: this._isActionMassEnabled(),
            actionAddEnabled: this._isActionAddEnabled(),
            actionExportEnabled: this._isActionExportEnabled(),
            actionFilterEnabled: this._isActionFilterEnabled(),
            actionPaginationEnabled: this._isActionPaginationEnabled(),
            tableTitleEnabled: this._isTableTitleEnabled(),
            isOpenAlertDelete: false,
            selectedItems: []
        };
    },

    _getDefaultSort: function () {
        logger.trace("Table _getDefaultSort");
        var tableStore = this.context.getStore(TableStore);
        var sortStore = tableStore.getSortData(this.props.config.name);

        var sort = sortStore;
        if ((!sort || _.isEmpty(sort)) && this.props.config.options && this.props.config.options.defaultSort) {
            sort = this.props.config.options.defaultSort;
        }

        return sort;
    },

    _getDefaultPagination: function (data) {
        logger.trace("Table _getDefaultPagination");
        var tableStore = this.context.getStore(TableStore);
        var paginationStore = tableStore.getPaginationData(this.props.config.name);

        var itemsPerPage;
        var pageIndex;
        var totalItems = data.nbTotal || 0;
        if (paginationStore  && !_.isEmpty(paginationStore)) {
            itemsPerPage = paginationStore.itemsPerPage;
            pageIndex = paginationStore.pageIndex;
        } else {
            var paginationNewStore = tableStore.getPaginationNewData(this.props.config.name);
            itemsPerPage = paginationNewStore.itemsPerPage;
            pageIndex = paginationNewStore.pageIndex;
            if (this.props.config.options && this.props.config.options.itemsPerPage) {
                itemsPerPage = this.props.config.options.itemsPerPage;
            }
        }

        var pagination = {
            itemsPerPage: itemsPerPage,
            pageIndex: pageIndex,
            totalItems: totalItems
        };

        return pagination;
    },

    componentDidMount: function () {
        logger.trace("Table componentDidMount");
        this.throttledSetRouteInternal = this.throttle(window.routeur.setRouteInternal.bind(window.routeur));
        this.getStore(this.props.config.store).addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        logger.trace("Table componentWillUnmount");
        this.getStore(this.props.config.store).removeChangeListener(this.onChange);
    },

    /**
     * Permet de trier le tableau côté client
     * @returns {{items: Array, nbTotal: number}|*|{}|any}
     */
    getData: function () {
        logger.trace("Table getData");
        var store = this.getStore(this.props.config.store);
        return store.getAllResults() || {};
    },

    /**
     * Action déclenchée lors d'une modification d'un élément de formulaire
     */
    onChange: function () {
        logger.trace("Table onChange");
        var data = this.getData();

        var tableStore = this.context.getStore(TableStore);
        var pagination = this._getDefaultPagination(data);
        var sort = this._getDefaultSort();

        //réinitialisation du store
        this.executeAction(new TableActions.SaveState().action(), {
                key: this.props.config.name,
                pagination: pagination,
                sort: sort
            }
        );
        var selectedItems = tableStore.getSelectedItems(this.props.config.name);
        var isActionMassChecked = selectedItems && (data.items) ? selectedItems.length === data.items.length && data.items.length !== 0
            : false;

        var changeState = {
            items: data.items,
            pagination: {
                totalItems: data.nbTotal,
                pageIndex: pagination.pageIndex,
                itemsPerPage: pagination.itemsPerPage
            },
            sort: sort,
            actionMassChecked: isActionMassChecked,
            selectedItems: selectedItems
        };

        var filter = tableStore.getFilterData(this.props.config.name);
        if (filter && !_.isEmpty(filter)) {
            changeState.isFiltersActive = true;
        } else {
            changeState.isFiltersActive = false;
        }
        this.setState(changeState);
    },

    render: function () {
        try {
            logger.trace("Table render");

            return (
                (this.props.isVisible) ?
                    <div className="hornet-datatable">
                        <TableTitle title={this._getTableTitle()} enabled={this.state.tableTitleEnabled}/>
                        <TableToolsTop
                            tableName={this.props.config.name}
                            options={this.props.config.options}
                            routes={this.props.config.routes}
                            actions={this.props.config.actions}
                            toggleFilters={this._toggleFilters}
                            filtersVisible={this.state.isFiltersVisible}
                            filtersActive={this.state.isFiltersActive}
                            openDeleteAlert={this._openDeleteAlert}
                            criterias={this.getStore(this.props.config.store).getCriterias()}
                            sort={this.state.sort}
                            messages={this.props.config.messages}

                            actionMassEnabled={this.state.actionMassEnabled}
                            actionAddEnabled={this.state.actionAddEnabled}
                            actionExportEnabled={this.state.actionExportEnabled}
                            actionFilterEnabled={this.state.actionFilterEnabled}
                        />
                        <TableFilters
                            tableName={this.props.config.name}
                            columns={this.props.config.columns}
                            routes={this.props.config.routes}
                            store={this.props.config.store}
                            messages={this.props.config.messages}
                            toggle={this._toggleFilters}
                            activate={this._activateFilters}
                            visible={this.state.isFiltersVisible}
                            enabled={this.state.actionFilterEnabled}
                            active={this.state.isFiltersActive}
                        />
                        <TableContent
                            tableName={this.props.config.name}
                            items={this.state.items}
                            columns={this.props.config.columns}
                            options={this.props.config.options}
                            routes={this.props.config.routes}
                            store={this.props.config.store}
                            onChangeSortData={this._onChangeSortData}
                            sort={this.state.sort}
                            onChangeSelectedItems={this._onChangeSelectedItems}
                            selectedItems={this.state.selectedItems}
                            captionText={this.props.config.messages.captionText}
                            messages={this.props.config.messages}
                            actionMassEnabled={this.state.actionMassEnabled}
                            actionMassChecked={this.state.actionMassChecked}
                        />
                        <TableToolsBottom
                            tableName={this.props.config.name}
                            pagination={this.state.pagination}
                            onchangePaginationData={this._onchangePaginationData}
                            options={this.props.config.options}
                            actions={this.props.config.actions}
                            routes={this.props.config.routes}
                            openDeleteAlert={this._openDeleteAlert}
                            messages={this.props.config.messages}

                            actionMassEnabled={this.state.actionMassEnabled}
                            actionAddEnabled={this.state.actionAddEnabled}
                            actionPaginationEnabled={this.state.actionPaginationEnabled}
                        />
                        <Alert message={this._getDeleteAllConfirmation()}
                               isVisible={this.state.isOpenAlertDelete}
                               onClickOk={this._delete}
                               onClickCancel={this._closeDeleteAlert}
                               onClickClose={this._closeDeleteAlert}
                               title={this._getDeleteAllTitle()}
                        />
                    </div> : null

            );
        } catch (e) {
            logger.error("Render table exception", e);
            throw e;
        }
    },

    _isActionMassEnabled: function () {
        return Boolean(
            this.props.config.options
            && this.props.config.options.hasDelAllButton
            && this.props.config.routes
            && this.props.config.routes.deleteAll);
    },

    _isActionAddEnabled: function () {
        return Boolean(
            this.props.config.options
            && this.props.config.options.hasAddButton
            && ((this.props.config.actions && this.props.config.actions.add)
            || (this.props.config.routes && this.props.config.routes.add)));
    },

    _isActionExportEnabled: function () {
        return Boolean(
            this.props.config.options
            && this.props.config.options.hasExportButtons
            && this.props.config.routes
            && this.props.config.routes.export);
    },

    _isActionFilterEnabled: function () {
        return Boolean(
            this.props.config.options
            && this.props.config.options.hasFilter);
    },

    _isActionPaginationEnabled: function () {
        return Boolean(
            this.props.config.options
            && this.props.config.options.itemsPerPage);
    },

    _isTableTitleEnabled(){
        return Boolean(this.props.config.messages && this.props.config.messages.tableTitle);
    },

    _getTableTitle(){
        return this.props.config.messages && this.props.config.messages.tableTitle;
    },

    /**
     * Action permettant de masquer/afficher les filtres
     */
    // _toggleFilters: function (e, data) {
    _toggleFilters: function () {
        logger.trace("_toggleFilters");

        this.executeAction(new TableActions.SaveState().action(), {
            key: this.props.config.name,
            selectedItems: [],
            emit: false
        });

        this.setState({
            isFiltersVisible: !this.state.isFiltersVisible,
            selectedItems: [],
            actionMassChecked: false
        });

    },

    /**
     * Action permettant de colorier le bouton togglefiltre
     * @param data
     */
    _activateFilters: function (activate) {
        logger.trace("_activateFilters");
        if (this.state.isFiltersActive != activate) {
            this.setState({
                isFiltersActive: activate
            });
        }
    },


    /**
     * Méthode permettant de détecter une mise à jour de la pagination
     * @param pagination
     * @private
     */
    _onchangePaginationData: function (pagination) {
        logger.trace("Table _onchangePaginationData");

        var tableStore = this.context.getStore(TableStore);
        var data = {
            key: this.props.config.name,
            criterias: this.getStore(this.props.config.store).getCriterias(),
            pagination: pagination,
            sort: this.state.sort,
            filters: tableStore.getFilterData(this.props.config.name),
            selectedItems: [],
            emit: false
        };

        this.executeAction(new TableActions.SaveState().action(), data);

        if (this.props.config.routes.search) {
            this.throttledSetRouteInternal(this.props.config.routes.search, data);
        } else {
            logger.warn("_onchangePaginationData : Routes Search undefined");
        }
    },

    /**
     * Méthode permettant de détecter une mise à jour du tri
     * @param sort
     * @private
     */
    _onChangeSortData: function (sort) {
        logger.trace("Table _onChangeSortData");

        // Tri Côté Client
        if (this.props.config.options.clientSideSorting) {
            var data = {
                key: this.props.config.name,
                tableName: this.props.config.name,
                sort: sort,
                items: this.state.items,
                dispatchSortingEvent: this.props.config.dispatchEvent.sortingEvent,
                selectedItems: []
            };

            this.executeAction(new TableActions.SortData().action(), data);
        } else {

            var tableStore = this.context.getStore(TableStore);
            var data = {
                key: this.props.config.name,
                criterias: this.getStore(this.props.config.store).getCriterias(),
                pagination: tableStore.getPaginationData(this.props.config.name),
                sort: sort,
                filters: tableStore.getFilterData(this.props.config.name),
                selectedItems: []
            };

            this.executeAction(new TableActions.SaveState().action(), data);

            if (this.props.config.routes.search) {
                this.throttledSetRouteInternal(this.props.config.routes.search, data);
            } else {
                logger.warn("_onChangeSortData : Routes Search undefined");
            }
        }
    },

    /**
     * Action liée au clic sur les cases à cocher d'action de masse
     * @param checked
     * @returns {Function}
     * @private
     */
    _onChangeSelectedItems: function (selectedItems) {
        logger.trace("Table _onChangeSelectedItems : ", selectedItems);
        this.executeAction(new TableActions.SaveState().action(), {
            key: this.props.config.name,
            selectedItems: selectedItems,
            emit: true
        });
    },

    _openDeleteAlert: function () {
        logger.trace("Table _openDeleteAlert");

        var selectedItems = this.getStore(TableStore).getSelectedItems(this.props.config.name);
        if (selectedItems && selectedItems.length) {
            this.setState({
                isOpenAlertDelete: true
            });
        }
    },

    _closeDeleteAlert: function () {
        logger.trace("Table _closeDeleteAlert");
        this.setState({
            isOpenAlertDelete: false
        });
    },

    _delete: function () {
        logger.trace("Table _delete");

        var tableStore = this.context.getStore(TableStore);
        var data = {
            key: this.props.config.name,
            selectedItems: tableStore.getSelectedItems(this.props.config.name),
            criterias: this.getStore(this.props.config.store).getCriterias(),
            sort: this.state.sort,
            pagination: tableStore.getPaginationData(this.props.config.name),
            filters: tableStore.getFilterData(this.props.config.name)
        };

        this._onChangeSelectedItems([]);

        if (this.props.config.routes.deleteAll) {
            this.throttledSetRouteInternal(this.props.config.routes.deleteAll, data);
        } else {
            logger.warn("_delete : Routes deleteAll undefined");
        }
        this._closeDeleteAlert();
    },

    _getDeleteAllConfirmation: function () {
        return this.props.config.messages.deleteAllConfirmation || this.state.i18n.deleteAllConfirmation;
    },

    _getDeleteAllTitle: function () {
        return this.props.config.messages.deleteAllTitle || this.state.i18n.deleteAllTitle;
    }
});

module.exports = Table;