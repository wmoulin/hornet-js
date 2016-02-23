"use strict";

import utils = require("hornet-js-utils");
import chai = require("chai");

var expect = chai.expect;

// initialisation du logger
import TableStore = require("src/table/store/table-store");

import TestUtils = require("hornet-js-utils/src/test-utils");

var logger = TestUtils.getLogger("hornet-js-components.test.table.store.table-store-spec");

describe("TableStoreSpec", () => {
    var target:TableStore;

    beforeEach(() => {
        target = new TableStore(null);
    });

    it("should dehydrate pagination", () => {
        //Arrange
        var pagination = {
            pageIndex: 0,
            itemsPerPage: 10,
            totalItems: 5
        };

        var changeformDataFn = (TableStore.handlers[TableStore.RECEIVE_UPDATE_DATA]).bind(target);
        changeformDataFn({key: "TableStoreSpec", pagination: pagination});

        //Act
        var dehydratation = target.dehydrate();

        //Assert
        expect(dehydratation.paginationData.TableStoreSpec).not.to.be.null;
        expect(dehydratation.paginationData.TableStoreSpec.pagination).to.be.equals(pagination);
    });

    it("should rehydrate paginationData", () => {
        //Arrange
        var tableStoreData = {
            table : {
                pagination: {
                    itemsPerPage: 10,
                    pageIndex: null
                }
            }
        };

        target.rehydrate({
            tableStoreData: tableStoreData
        });

        //Act
        var storePaginationData = target.getPaginationData("table");

        //Assert
        expect(storePaginationData.itemsPerPage).to.be.equals(tableStoreData["table"].pagination.itemsPerPage);
    });

    it("should store current filters", () => {
        //Arrange
        var currentFilters = {
            key: "table",
            filters:[]
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changeFilterlFn = (TableStore.handlers[TableStore.RECEIVE_UPDATE_DATA]).bind(target);
        changeFilterlFn(currentFilters);
        var firstEmitDone = emitDone;
        emitDone = false;
        changeFilterlFn(currentFilters);
        var secondEmitDone = emitDone;

        //Act
        var storeFilter = target.getFilterData("table");

        //Assert
        expect(storeFilter).to.be.equal(currentFilters.filters);
    });

    it("should store current sort", () => {
        //Arrange
        var currentSort = {
            key: "table",
            sort: {
                key: "colonneTri",
                dir: null,
                type: null
            }
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers[TableStore.RECEIVE_UPDATE_DATA]).bind(target);
        changesortFn(currentSort);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(currentSort);
        var secondEmitDone = emitDone;

        //Act
        var storeSort = target.getSortData("table");

        //Assert
        expect(storeSort.key).to.be.equal(currentSort.sort.key);
    });

    it("should store current pagination", () => {
        //Arrange
        var current = {
            key: "table",
            pagination : {
                itemsPerPage : 10
            },
            pageIndex : null
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers[TableStore.RECEIVE_UPDATE_DATA]).bind(target);
        changesortFn(current);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(current);
        var secondEmitDone = emitDone;

        //Act
        var store = target.getPaginationData("table");

        //Assert
        expect(store.itemsPerPage).to.be.equal(current.pagination.itemsPerPage);
    });

    it("should store current selected item", () => {
        //Arrange
        var current = {
            key: "table",
            selectedItems: [{id:"1"}],
            emit: true
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers[TableStore.RECEIVE_UPDATE_DATA]).bind(target);
        changesortFn(current);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(current);
        var secondEmitDone = emitDone;

        //Act
        var store = target.getSelectedItems("table");

        //Assert
        expect(store.length).to.be.equal(current.selectedItems.length);
    });
})
