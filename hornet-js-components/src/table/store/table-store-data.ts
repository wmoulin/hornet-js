export class TableStoreData implements TableStoreBase {

    pagination:TableStoreBasePagination;
    sort:TableStoreBaseSort;
    defaultSort:TableStoreBaseSort;
    filters:TableStoreBaseFilter;
    selectedItems:Array<any>;

    constructor() {
        this.pagination = null;
        this.sort = null;
        this.filters = null;
        this.selectedItems = null;
    }
}

export class TableStoreDataPagination implements TableStoreBasePagination {

    itemsPerPage:number;
    pageIndex:number;
    totalItems:number;

    constructor() {
        this.itemsPerPage = 10;
        this.pageIndex = 1;
        this.totalItems = 0;
    }
}

export class TableStoreDataSort implements TableStoreBaseSort {

    key:string;
    dir:string;
    type:string;

    constructor() {
        this.key = null;
        this.dir = null;
        this.type = null;
    }
}

export interface TableStoreBase {
    pagination:TableStoreBasePagination;
    sort:TableStoreBaseSort;
    defaultSort:TableStoreBaseSort;
    filters:TableStoreBaseFilter;
}

export interface TableStoreBasePagination {
    itemsPerPage: number;
    pageIndex: number;
    totalItems: number;
}

export interface TableStoreBaseSort {
    key: string;
    dir: string;
    type: string;
}

export interface TableStoreBaseFilter {
    key: string;
    value: string;
    type: string;
}