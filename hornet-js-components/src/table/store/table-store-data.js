var TableStoreData = (function () {
    function TableStoreData() {
        this.pagination = null;
        this.sort = null;
        this.filters = null;
        this.selectedItems = null;
    }
    return TableStoreData;
})();
exports.TableStoreData = TableStoreData;
var TableStoreDataPagination = (function () {
    function TableStoreDataPagination() {
        this.itemsPerPage = 10;
        this.pageIndex = 1;
        this.totalItems = 0;
    }
    return TableStoreDataPagination;
})();
exports.TableStoreDataPagination = TableStoreDataPagination;
var TableStoreDataSort = (function () {
    function TableStoreDataSort() {
        this.key = null;
        this.dir = null;
        this.type = null;
    }
    return TableStoreDataSort;
})();
exports.TableStoreDataSort = TableStoreDataSort;
//# sourceMappingURL=table-store-data.js.map