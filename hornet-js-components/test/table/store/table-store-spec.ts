///<reference path='../../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

import utils = require('hornet-js-utils');
import chai = require('chai');

var expect = chai.expect;

// initialisation du logger
import TableStore = require('src/table/store/table-store');

import TestUtils = require('hornet-js-utils/src/test-utils');

var logger = TestUtils.getLogger("hornet-js-components.test.table.store.table-store-spec");

describe('TableStoreSpec', () => {
    var target:TableStore;

    beforeEach(() => {
        target = new TableStore(null);
    });

    it('should dehydrate paginationData', () => {
        //Arrange
        var paginationData = [];

        var changeformDataFn = (TableStore.handlers.RECEIVE_PAGINATION_DATA).bind(target);
        changeformDataFn(paginationData);

        //Act
        var dehydratation = target.dehydrate();

        //Assert
        //expect(dehydratation).to.exist.to.have.keys('formData','currentUser');
        expect(dehydratation.paginationData.length).to.be.equals(paginationData.length);
    });

    it('should rehydrate paginationData', () => {
        //Arrange
        var paginationData = { itemsPerPage: null, pageIndex: null };

        target.rehydrate({
            paginationData: paginationData
        });

        //Act
        var storePaginationData = target.getPaginationData("");

        //Assert
        expect(storePaginationData.itemsPerPage).to.be.equals(paginationData.itemsPerPage);
    });

    it('should store current filters', () => {
        //Arrange
        var currenFilters = [];

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changeFilterlFn = (TableStore.handlers.RECEIVE_FILTER_DATA).bind(target);
        changeFilterlFn(currenFilters);
        var firstEmitDone = emitDone;
        emitDone = false;
        changeFilterlFn(currenFilters);
        var secondEmitDone = emitDone;

        //Act
        var storeFilter = target.getFilterData("");

        //Assert
        expect(storeFilter).to.be.equal(currenFilters);
    });

    it('should store current sort', () => {
        //Arrange
        var currenSort = {
            key: null,
            dir: null,
            type: null
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers.RECEIVE_SORT_DATA).bind(target);
        changesortFn(currenSort);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(currenSort);
        var secondEmitDone = emitDone;

        //Act
        var storeSort = target.getSortData("");

        //Assert
        expect(storeSort.key).to.be.equal(currenSort.key);
    });

    it('should store current pagination', () => {
        //Arrange
        var current = {
            itemsPerPage : null,
            pageIndex : null
        };

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers.RECEIVE_PAGINATION_DATA).bind(target);
        changesortFn(current);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(current);
        var secondEmitDone = emitDone;

        //Act
        var store = target.getPaginationData("");

        //Assert
        expect(store.itemsPerPage).to.be.equal(current.itemsPerPage);
    });

    it('should store current selected items', () => {
        //Arrange
        var current = [];

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers.RECEIVE_SELECTED_ITEMS).bind(target);
        changesortFn(current);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(current);
        var secondEmitDone = emitDone;

        //Act
        var store = target.getSelectedItems("");

        //Assert
        expect(store.length).to.be.equal(current.length);
    });

    it('should store current selected item', () => {
        //Arrange
        var current = [];

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var changesortFn = (TableStore.handlers.RECEIVE_SELECTED_ITEM).bind(target);
        changesortFn(current);
        var firstEmitDone = emitDone;
        emitDone = false;
        changesortFn(current);
        var secondEmitDone = emitDone;

        //Act
        var store = target.getSelectedItems("");

        //Assert
        expect(store.length).to.be.equal(current.length);
    });
})
