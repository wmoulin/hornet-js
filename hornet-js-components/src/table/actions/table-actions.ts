///<reference path="../../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");

var logger = utils.getLogger("hornet-js-components.table.actions.table-actions");

export class SaveState extends Action<ActionsChainData> {
    execute(resolve, reject) {
        try {
            logger.trace("ACTION SaveState", this.payload);
            if (this.payload) {
                this.actionContext.dispatch("RECEIVE_UPDATE_DATA", this.payload);
            }
            resolve();
        } catch (err) {
            logger.error("Table-Actions SaveState ActionExtendedPromise error : ", err);
        }
    }
}

export class ResetTableStore extends Action<ActionsChainData> {
    execute(resolve, reject) {
        try {
            logger.trace("ACTION ResetTableStore", this.payload);
            if (this.payload) {
                this.actionContext.dispatch("RESET_TABLE_DATA", {
                    key: this.payload.key,
                    emit: this.payload.emit
                });
            }
            resolve();
        } catch (err) {
            logger.error("Table-Actions ResetTableStore ActionExtendedPromise error : ", err);
        }
    }
}

export class SavePagination extends Action<ActionsChainData> {
    execute(resolve, reject) {
        try {
            logger.trace("ACTION SavePagination", this.payload);
            if (this.payload) {
                this.actionContext.dispatch("RECEIVE_PAGINATION_DATA", this.payload);
            }
            resolve();
        } catch (err) {
            logger.error("Table-Actions savePagination ActionExtendedPromise error : ", err);
        }
    }
}

export class SaveSelectedItems extends Action<ActionsChainData> {
    execute(resolve, reject) {
        try {
            logger.trace("ACTION SaveSelectedItems", this.payload);
            var data = {
                key: this.payload.key,
                selectedItems: this.payload.selectedItems,
                emit: this.payload.emit,
            };
            logger.trace("table data to save :", data);
            if (this.payload) {
                this.actionContext.dispatch("RECEIVE_SELECTED_ITEMS", data);
            }
            resolve();
        } catch (err) {
            logger.error("Table-Actions SaveSelectedItems ActionExtendedPromise error : ", err);
        }
    }
}

export class SaveTableFilters extends Action<ActionsChainData> {

    execute(resolve, reject) {
        logger.trace("ACTION SaveTableFilters, filters=", this.payload);
        if (this.payload) {
            var data = {
                key: this.payload.key,
                filters: this.payload.filters,
                emit: false
            };
            logger.trace("table data to save :", data);
            this.actionContext.dispatch("RECEIVE_FILTER_DATA", data);
            resolve();
        } else {
            resolve();

        }
    }
}

export class SortData extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.trace("ACTION SortData", this.payload.dispatchSortingEvent, ': ', this.payload);
        try {
            if (this.payload) {
                logger.trace("Mode clientSideSorting");
                if (this.payload.items && this.payload.sort) {
                    var sortData = this.payload.sort;
                    logger.trace("Activation du filtrage");
                    this.payload.items = _.sortBy(this.payload.items, function (objet) {
                        if (sortData.type === "date") {
                            return utils.dateUtils.parse(objet[sortData.key], this.actionContext.i18n("calendar")).getTime();
                        } else {
                            return objet[sortData.key];
                        }
                    }, this);
                    if (sortData.dir === "DESC") {
                        this.payload.items.reverse();
                    }
                }

                this.actionContext.dispatch("RECEIVE_UPDATE_DATA", {
                    key: this.payload.key,
                    sort: sortData
                });

                this.actionContext.dispatch(this.payload.dispatchSortingEvent, this.payload.items);
            }
            resolve();
        } catch (err) {
            logger.error("Table-Actions SortData ActionExtendedPromise error : ", err);
        }
    }
}