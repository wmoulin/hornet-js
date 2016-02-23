"use strict";

import utils = require("hornet-js-utils");
import BaseStore = require("fluxible/addons/BaseStore");

import I = require("src/table/store/table-store-data");

var _ = utils._;

var logger = utils.getLogger("hornet-js-components.table.store.table-store");

class TableStore extends BaseStore {

    static storeName:string = "TableStore";

    private tableStoreData:{ [key:string]:I.TableStoreData; };

    static RECEIVE_UPDATE_DATA:string = "RECEIVE_UPDATE_DATA";
    static RESET_TABLE_DATA:string = "RESET_TABLE_DATA";

    /**
     * @returns {Object} les fonctions 'handler' indexées par nom d'évènement
     */
    static initHandlers():any {
        var handlers:any = {};
        handlers[TableStore.RECEIVE_UPDATE_DATA] = function (data) {
            logger.trace(TableStore.RECEIVE_UPDATE_DATA + ", key :", data.key, ", emit :", data.emit);
            this.updateData(data.key, data);
            if (data.emit) {
                this.emitChange();
            }
        };
        handlers[TableStore.RESET_TABLE_DATA] = function (data) {
            logger.trace(TableStore.RESET_TABLE_DATA + ", key :", data.key, ", emit :", data.emit);
            this.tableStoreData[data.key] = new I.TableStoreData();
            if (data.emit) {
                this.emitChange();
            }
        };
        return handlers;
    }

    static handlers:any = TableStore.initHandlers();

    constructor(dispatcher) {
        super(dispatcher);
        this.tableStoreData = {};
    }

    updateData(key:string, value:any) {

        logger.trace("updateData - key :", key, ", value :", value);
        var data:I.TableStoreData = this.tableStoreData[key];
        if (!data) {
            this.tableStoreData[key] = new I.TableStoreData();
            data = this.tableStoreData[key];
        }
        logger.trace("paginationData", key, data);

        if (value.pagination) {
            var stateChange = !_.isEqual(data.pagination, value.pagination);
            if (stateChange) {
                logger.trace("updateData -> Changement pagination ");
                data.pagination = value.pagination;
            }
        }

        if (value.defaultSort) {
            var stateChange = !_.isEqual(data.defaultSort, value.defaultSort);
            if (stateChange) {
                logger.trace("updateData -> Changement default sort");
                data.defaultSort = value.defaultSort;
            }
        }

        if (value.sort) {
            var stateChange = !_.isEqual(data.sort, value.sort);
            if (stateChange) {
                logger.trace("updateData -> Changement sort");
                data.sort = value.sort;
            }
        }

        if (value.filters) {
            var stateChange = !_.isEqual(data.filters, value.filters);
            if (stateChange) {
                logger.trace("updateData -> Changement filter");
                data.filters = value.filters;
            }
        }

        if (value.selectedItems) {
            var stateChange = !_.isEqual(data.selectedItems, value.selectedItems);
            if (stateChange) {
                logger.trace("updateData -> Changement selected items");
                data.selectedItems = _.clone(value.selectedItems);
            }
        }

        this.tableStoreData[key] = data;
        logger.trace("paginationData", key, data);
    }

    getPaginationData(key:string):I.TableStoreBasePagination {
        var value = this._getTableStoreData(key).pagination;
        logger.trace("getPaginationData[", key, "]", value);
        return value;
    }

    getPaginationPageIndexReseted(key:string):I.TableStoreBasePagination {
        var value = this._getTableStoreData(key).pagination;
        value.pageIndex = 1;
        logger.trace("getPaginationPageIndexReseted[", key, "]", value);
        return value;
    }

    getSortData(key:string):I.TableStoreBaseSort {
        var value = this._getTableStoreData(key).sort;
        logger.trace("getSortData[", key, "]", value);
        return value;
    }

    getFilterData(key:string):I.TableStoreBaseFilter {
        var value = this._getTableStoreData(key).filters;
        logger.trace("getFilterData[", key, "]", value);
        return value;
    }

    getSelectedItems(key:string):any {
        var value = this._getTableStoreData(key).selectedItems;
        logger.trace("getSelectedItems[", key, "]", value);
        return value;
    }

    _getTableStoreData(key:string):I.TableStoreData {
        if(!key){
            logger.warn("NO KEY DEFINING FOR TABLE");
        }
        if (!this.tableStoreData[key]) {
            this.tableStoreData[key] = new I.TableStoreData();
            logger.trace("TABLESTORE NOT DEFINED FOR KEY :",key);
        }
        return this.tableStoreData[key];
    }

    rehydrate(state:any) {
        this.tableStoreData = state.tableStoreData;
    }

    dehydrate():any {
        return {
            paginationData: this.tableStoreData
        };
    }
}

export = TableStore;

