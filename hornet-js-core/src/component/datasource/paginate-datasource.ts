/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import events = require('events');
import * as _ from "lodash";
import { Promise } from "hornet-js-utils/src/promise-api";
import { DataSource } from "src/component/datasource/datasource";
import { DataSourceMap } from "src/component/datasource/config/datasource-map";
import { DataSourceConfig } from "src/component/datasource/config/service/datasource-config";
import { DataSourceConfigPage } from "src/component/datasource/config/service/datasource-config-page";
import { SortData, SortDirection } from "src/component/sort-data";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";

import { Utils } from "hornet-js-utils";
import { ArrayUtils } from "hornet-js-utils/src/array-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { DataSourceOption } from "src/component/datasource/options/datasource-option";

const logger: Logger = Utils.getLogger("hornet-js-core.component.datasource.paginate-datasource");

export const ITEMS_PER_PAGE_ALL: number = 2147483647;

/**
 * @enum enumeration pour la navigation dans le paginateur
 */
export enum Direction {
    PREVIOUS = -1,
    NEXT = -2,
    FIRST = -3,
    LAST = -4
}

/***
 * @description Interface de representation d'une pagination
 * @interface
  */
export interface Pagination {
    /** index de la page actuelle */
    pageIndex?: number;
    /** nombre d'items pas page */
    itemsPerPage: number;
    /** nombre d'items total */
    totalItems?: number;
    /** nombre de pages */
    nbPages?: number;
}

/***
 * @description Interface de representation d'une pagination
 * @interface
  */
export interface ServiceResult<T> {
    pagination: Pagination;
    list: Array<T>
}

/***
 * @classdesc Classe de representation d'une pagination
 * @class
  */
export class Paginator<T> {

    private _pagination: Pagination;
    private items: Array<Array<T>>;
    private _sort;

    /**
     * @constructs
     * @param {Pagination} pagination configuration de la pagination
     */
    constructor(pagination: Pagination) {
        this._pagination = pagination;
        this.items = [];
    }

    get pagination() {
        return this._pagination;
    }

    set sort(sort) {
        this._sort = sort;
    }

    get sort() {
        return this._sort;
    }

    private calculateNbPages(itemsTot?: number): number {
        let nbTot = itemsTot || this._pagination.totalItems;
        return _.round(nbTot / this._pagination.itemsPerPage) + ((nbTot % this._pagination.itemsPerPage) > 0 ? 1 : 0);
    }


    /**
     * Methode de gestion de la pagination
     * @param {(number|Direction)} page numero de la page ou la direction, première page à index 1.
     */
    public paginate(page: number | Direction): Array<T> {

        if (page > 0) {
            this._pagination.pageIndex = page;
        } else if (page >= Direction.LAST && page < 0) {
            switch (page) {
                case Direction.FIRST:
                    this._pagination.pageIndex = 1;
                    break;
                case Direction.LAST:
                    this._pagination.pageIndex = this.items.length;
                    break;
                case Direction.PREVIOUS:
                    this._pagination.pageIndex = this._pagination.pageIndex - 1;
                    break;
                case Direction.NEXT:
                    this._pagination.pageIndex = this._pagination.pageIndex + 1;
                    break;
            }
        } else if (page < Direction.LAST) {
            //TODO throw
        }

        return this.extractPage(null, false);
    }

    /**
     * Extraction des données de la page de pagination
     * @param {Array<T>} itemsTot liste pour vant servir pour l'extraction
     * @param {boolean} forceUpdate force la mise a jour et va lire de itemsTot sinon prend dans la variable d'instance
     */
    public extractPage(itemsTot: Array<T>, forceUpdate: boolean = false): Array<T> {
        let page = [];

        if (!forceUpdate && this.items.length >= this._pagination.pageIndex) {
            page = this.items[ this._pagination.pageIndex ];
        } else if (itemsTot && this._pagination.itemsPerPage) {
            page = itemsTot;

            if (this._pagination.pageIndex) {
                page = page.slice((this._pagination.pageIndex - 1) * this._pagination.itemsPerPage);
                page = page.slice(0, this._pagination.itemsPerPage);
            }

            this.items[ this._pagination.pageIndex ] = page;
        }

        return page;
    }

    /**FIRST
     * Change le nombre d'items par page
     * @param {number} itemsPerPage nombre d'items par page
     */
    public setItemsPerPage(itemsPerPage: number) {
        this._pagination.itemsPerPage = itemsPerPage;
        this._pagination.pageIndex = 1;
        this.items = [];
    }

    public reset(){
        this._pagination.pageIndex = 1;
        this.items = [];
        this._pagination.totalItems=0;
        this._pagination.nbPages = 0;
    }

    /**
     * initialise les differentes pages suivant l'objet de pagination
     * @param {Array<T>} itemsTot liste des items à decouper en page
     * @param {number} totalItems nombre total d'items (pagination serveur)
     */
    public preparePagination(itemsTot: Array<T>, totalItems?: number): void {
        this.paginate(Direction.FIRST);

        while (this.extractPage(itemsTot, true).length == this._pagination.itemsPerPage) {
            this.paginate(Direction.NEXT);
        }

        this.paginate(Direction.FIRST);
        this._pagination.totalItems = totalItems || itemsTot.length;
        //this._pagination.nbPages = this.items.length / this._pagination.itemsPerPage;
        this._pagination.nbPages = this.calculateNbPages();
    }

    /**
     * initialise les differentes pages suivant l'objet de pagination
     * @param {Array<T>} itemsTot liste des items à decouper en page
     * @param {number} totalItems nombre total d'items (pagination serveur)
     */
    public setCurrentPage(items: Array<T>, totalItems?: number): void {

        this.extractPage(items, true)

        this._pagination.totalItems = totalItems || items.length;
        this._pagination.nbPages = this.calculateNbPages();
    }
}

/***
 * @classdesc Classe de base des datasources
 * elle contient une methode pour récupérer des datas, varie selon le type de datasource;
 * elle implémente une methode qui transforme les données récupérées selon une classe de mapping  {@link DataSourceMap} afin de l'exploiter directement par l'IHM.
 * @class
 * @extends EventEmitter
 */
export class PaginateDataSource<T> extends DataSource<T>{

    /***
     * composant de pagination
     * @instance 
     */
    private _paginator: Paginator<T>;



    /***
     * @param {(DataSourceConfig|DataSourceConfigPage|Array<T>)} config accepte soit une liste de l'éléments Array<T>, soit un service DataSourceConfig | DataSourceConfigPage
     * @param {Pagination} pagination pagination à appliquer.
     * @param {DataSourceMap} keysMap  utilisée pour la transformation des resultats du fetch.
     * @param {Object} options liste de paramètres supplémentaires à transmettre au fetch
     */
    constructor(protected config: DataSourceConfig | DataSourceConfigPage | Array<T>, pagination: Pagination, public keysMap: DataSourceMap, public options?: DataSourceOption[]) {
        super(config, keysMap, options);
        this._paginator = new Paginator<T>(pagination);
        this.initPaginateDataSource();
        this.initSort();
        _.map([ "sort", "pagination", "select", "add", "filter", "delete" ], (event) => {
            this.on(event, this.saveSelected);
        });
    }

    private initPaginateDataSource() {
        if (this.isDataSourceArray) {
            (this.initAsync && this.initAsync.isAsync) ? this.initData() : this.initDataSync() && this.updatePaginator(this._results)
        }
    }
    /***
     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * Déchenche un event init
     */
    public init(args?: any): void {
        //pour le paginate-datasource on fera plutot un initPaginateDataSource
    }

    get pagination(): Pagination {
        return this._paginator.pagination;
    }

    set pagination(pagination) {
        this._paginator = new Paginator<T>(pagination);
    }
    private updatePaginator(items: Array<T>, totalItems?: number) {
        if (this.isDataSourceArray) {
            this._paginator.preparePagination(items, totalItems);
        } else {
            this._paginator.setCurrentPage(items, totalItems);
        }
    }

    /***
     * Réinitialise la pagination et envoie un event de pagination
     */
    protected initPaginator() {
        this.emit("pagination", {
            list: this.results, pagination: {
                pageIndex: 0,
                itemsPerPage: this._paginator.pagination.itemsPerPage,
                totalItems: 0
            }
        });
    }

    /***
     * Réinitialise le sort
     */
    protected initSort() {
        this._paginator.sort = this.defaultSort ? this.defaultSort.sort : null;
    }

    /***
     * @inheritdoc
     */
    public deleteAll() {
        super.deleteAll();
        this.initSort();
        this.initPaginator();
    }

    /***
     * @inheritdoc
     * @param {boolean} reloadPage indicateur pour recharger la page en cours, sinon ce sera la première page. 
     */
    public reload(reloadPage: boolean = false, forceUpdate: boolean = false) {
        this.initSort();
        this.updatePaginator(this.results, this._paginator.pagination.totalItems);
        reloadPage ? this.reloadPage(forceUpdate) : this.goToPage(Direction.FIRST);
    }

    /***
     * @inheritdoc
     */
    public fetch(triggerFetch: Boolean, args?: any, noSave?: boolean): void {
        if (!noSave) {
            this.fetchArgsSaved = args;
            args = this.getFetchArgs("pagination", this.pagination);
        }
        return super.fetch(triggerFetch, args, true);
    }

    /***
     * @inheritdoc
     */
    protected fetchData(triggerFetch: Boolean, args?: any): Promise<Array<T>> {
        return super.fetchData(triggerFetch, this._paginator.sort ? _.extend(this.getFetchArgs("sort", this._paginator.sort), args) : args)
            .then((results: Array<T>) => {
                this.pagination.pageIndex = this.pagination.pageIndex || 1;
                this.updatePaginator(this._results, this._paginator.pagination.totalItems);
                //this.emit('pagination', {list: results, pagination: this._paginator.pagination});
                return results;
            });
    }

    /***
     * méthode qui appelle (juste après un fetch) la fonction de {@link Datasource#transformData} et déclenche un evènement "fetch" lorsque les données sont disponibles
     * @param result les données brutes.
     * @return renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
     */
    protected transformData(result: any): Promise<Array<any>> {
        let data = result[ 0 ];
        if (data[ "errors" ]) {
            let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_RESPONSE_ERROR, data[ "errors" ]);
            this.emit("error", error);
            throw error;
        }
        if (!this.isDataSourceArray) {
            if (!data) {
                this._paginator.pagination.totalItems = 0;
                this._paginator.pagination.pageIndex = 1;
                return super.transformData([]);
            } else {
                this._paginator.pagination.totalItems = data[ "nbTotal" ];
                this._paginator.pagination.pageIndex = data[ "pagination" ].pageIndex;
                return super.transformData(data[ "liste" ]);
            }
        } else {
            return super.transformData(data);
        }

    }

    /***
     * @inheritdoc
     */
    sort(sort: SortData[], compare?: (a: any, b: any) => number): void {
        this.emit("loadingData", true);
        this._paginator.sort = sort;
        Promise.resolve().then(() => {
            try {
                if (this.isDataSourceArray) {
                    super.sortData(sort, compare || this.defaultSort);
                    this.updatePaginator(this._results);
                    let firstPage = this._paginator.paginate(1);
                    this.emit("sort", firstPage, sort);
                    return firstPage;
                } else {
                    return this.fetchData(false, this.getFetchArgs("pagination", this.pagination))
                        .then((results: Array<T>) => {
                            this.emit("sort", results, sort);
                            return results;
                        });
                }
            } catch (e) {
                let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_SORT_ERROR, null, e);
                this.emit("error", error);
                throw error;
            }

        }).finally(() => {
            this.emitEvent("loadingData", false);
        });
    }

    /***
     * Renvoie un sous-ensemble des resultats filtrés
     * @param config correspond soit aux critères de filtrage soit à une fonction (appelée à chaque itération) {@link https://lodash.com/docs/#filter}
     * @param cancelFilterHistory false si on souhaite garder un historique des filtres true sinon. false par défaut
     * @example
     * dataSource.on("filter", (filteredResult)=>{
     *       //staff
     *   })
     * dataSource.filter(config, cancelFilterHistory);
     * @void
     */
    public filter(config, cancelFilterHistory = false): void {
        this.emit("loadingData", true);
        if (this.isDataSourceArray) {
            if (cancelFilterHistory) {
                if (!this._filtering_flag) {
                    //backup
                    this._results_backup = this._results;
                    this._filtering_flag = true;
                } else {
                    //restore
                    this._results = this._results_backup;
                }
            }
        }
        Promise.resolve().then(() => {
            try {
                if (this.isDataSourceArray) {
                    this._results = _.filter(this.results, config);
                    this.updatePaginator(this._results);
                    this.goToPage(Direction.FIRST);
                } else {
                    this.fetchData(false, this.getFetchArgs("filter", config)).then(() => {
                        this.emitEvent("filter", this.results);
                    })
                }
            } catch (e) {
                let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_FILTER_ERROR, null, e);
                this.emit("error", error);
                throw error;
            }
        }).finally(() => {
            this.emitEvent("loadingData", false);
        });
    }


    /***
     * Ajout un élément ou des éléments au result du datasource
     * cette action déclenche l'évènement pagination.
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @example
     * dataSource.on("add", (IncreasedResult)=>{
     *       //staff
     *   })
     * dataSource.add();
     * @void
     */
    public add(triggerFetch: Boolean, ...items: (T | T[])[]): void {
        this.addData(false, ...items);
    }

    /***
     * @inheritdoc
     */
    protected addData(triggerFetch: boolean = false, ...items: (T | T[])[]): Promise<Array<any>> {
        return super.addData(false, ...items).then((result: Array<any>) => {
            if (result.length != 0) {
                this.updatePaginator(this._results);
                this.goToPage(Direction.FIRST);
            }
            return result;
        });
    }

    /***
     * @inheritdoc
     */
    protected deleteData(triggerFetch: boolean = false, ...items: (T | T[])[]): Promise<Array<any>> {
        return super.deleteData(false, ...items).then((result: Array<any>) => {
            this.updatePaginator(this._results);
            this.goToPage(Direction.FIRST);
            return result;
        });
    }

    /***
     * enlève un élément ou des éléments au result du datasource
     * cette action déclenche l'évènement pagination
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @void
     */
    public delete(triggerFetch: Boolean, ...items: (T | T[])[]): void {
        this.deleteData(false, ...items);
    }

    /**
     * navigue vers une page
     * @param {(number|Direction)} page la page a extraire 
     */
    public goToPage(page: number | Direction): void {
        if (this.isDataSourceArray) {
            this.emit("loadingData", true);
            this.emit("pagination", { list: this._paginator.paginate(page), pagination: this._paginator.pagination });
            this.emit("loadingData", false);
        } else { // pagination serveur
            this._paginator.paginate(page);
            this.fetchData(false, this.getFetchArgs("pagination", this.pagination)).then((results: Array<T>) => {
                this.emit("pagination", { list: results, pagination: this._paginator.pagination });
            });
        }
    }

    /**
     * retourne les items d'une page en particulier
     * @param {(number|Direction)} page la page a extraire
     */
    public getItemsByPage(page: number | Direction): any {
        return this._paginator.paginate(page);
    }

    /**
     * redéclanche la navigation de la page en cours, si la page en cours n'est pas initialisé ou va sur la première
     * @param {boolean} forceUpdate indicateur pour redéclancher le requêtage
     */
    public reloadPage(forceUpdate: boolean = false): void {
        if (forceUpdate) {
            this.goToPage(this.pagination.pageIndex || Direction.FIRST);
        } else {
            this.emit("pagination", { list: this._results, pagination: this._paginator.pagination });
        }
    }

    /**
     * change le nombre d'items par page
     * @param {number} itemsPerPage items par page
     */
    public updatePerPage(itemsPerPage: number): void {
        if (this.isDataSourceArray) {
            this.pagination.itemsPerPage = itemsPerPage;
            this.updatePaginator(this._results);
            this.emit("pagination", { list: this._paginator.paginate(Direction.FIRST), pagination: this._paginator.pagination });
        } else { // pagination serveur
            this.pagination.itemsPerPage = itemsPerPage;
            this._paginator.paginate(Direction.FIRST);
            this.fetchData(true, { criteres: this.fetchArgsSaved, pagination: this.pagination }).then((results: Array<T>) => {
                this.emit("pagination", { list: results, pagination: this._paginator.pagination });
            });
        }
    }


    /***
     * @inheritdoc
     */
    protected getFetchArgs(attrName: string, value: any, param?: any) {

        let fetchArgs = param || {};
        if (!param && this.fetchArgsSaved) {
            fetchArgs[ this.fetchAttrName ] = this.fetchArgsSaved;
        }

        if (value) {
            fetchArgs[ attrName ] = value;
        }

        return fetchArgs;
    }

    /***
     * Supprime toute sélection dans le datasource.
     * @void
     */
    public selectClean(flag: boolean) {
        super.selectClean(flag);
        this._paginator.reset();

    }

    /**
     * Sélectionne des items dans le datasource.
     * Dans le cadre d'un datasource paginate, les items devront obligatoirement avoir un attribut id pour être pris en compte.
     * @param {any[]} items les éléments à sélectionnés dans le datasource.
     */
    protected _currentItemSelected;

    /**
     * Sélectionne des items dans le datasource.
     * Dans le cadre d'un datasource paginate, les items devront obligatoirement avoir un attribut id pour être pris en compte.
     * @param {any[]} items les éléments à sélectionnés dans le datasource.
     * @param index de la ligne selectionnée
     */
    public select(items: any[]) {
        let temp = [];
        if (items) _.forEach(items, (item) => {
            if (item.id) {
                temp.push(item);
            }
        })
        this._currentItemSelected = temp;
        this.emit('select', this._currentItemSelected);
    }

    /**
     * Enregistre la sélection courante dans le datasource.
     */
    protected saveSelected() {
        this._selected = this.getAllSelected();
        this._currentItemSelected = null;
    }


    /**
     * Récupère la sélection courante + la selection existante
     * @returns {any}
     */
    protected getAllSelected() {
        let result;
        if (this._selected && this._selected instanceof Array) {
            result = ArrayUtils.unionWith(this._selected, this._currentItemSelected);
        } else {
            result = this._currentItemSelected;
        }
        return result;
    }

    /**
     * renvoie les valeurs sélectionnées du datasource.
     */
    get selected() {
        return this.getAllSelected();
    }
}