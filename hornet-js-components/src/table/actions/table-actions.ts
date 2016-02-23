"use strict";
import utils = require("hornet-js-utils");
import Action = require("hornet-js-core/src/actions/action");
import ActionsChainData = require("hornet-js-core/src/routes/actions-chain-data");
import TableStore = require("../store/table-store");

var logger = utils.getLogger("hornet-js-components.table.actions.table-actions");

export class SaveState extends Action<ActionsChainData> {
    execute(resolve, reject) {
        try {
            logger.trace("ACTION SaveState", this.payload);
            if (this.payload) {
                this.actionContext.dispatch(TableStore.RECEIVE_UPDATE_DATA, this.payload);
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
                this.actionContext.dispatch(TableStore.RESET_TABLE_DATA, {
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

export class SortData extends Action<ActionsChainData> {
    execute(resolve, reject) {
        logger.trace("ACTION SortData", this.payload.dispatchSortingEvent, ": ", this.payload);
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

                this.actionContext.dispatch(TableStore.RECEIVE_UPDATE_DATA, {
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