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

import events = require("events");
import * as _ from "lodash";
import { Promise } from "hornet-js-utils/src/promise-api";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";
import { SortData } from "src/component/sort-data";
import { ObjectUtils } from "hornet-js-utils/src/object-utils";
import { ArrayUtils } from "hornet-js-utils/src/array-utils";
import { DataSourceOption, DefaultSort, InitAsync } from "src/component/datasource/options/datasource-option";
import { DataSourceMap } from "src/component/datasource/config/datasource-map";
import { DataSourceConfig } from "src/component/datasource/config/service/datasource-config";
import { DataSourceConfigPage } from "src/component/datasource/config/service/datasource-config-page";
import { Class } from "hornet-js-utils/src/typescript-utils";

export enum DataSourceStatus {
    Dummy,
    Initialized
}


/***
 * @classdesc Classe de base des datasources
 * elle contient une methode pour récupérer des datas, varie selon le type de datasource;
 * elle implémente une methode qui transforme les données récupérées selon une classe de mapping  {@link DataSourceMap} afin de l'exploiter directement par l'IHM.
 * liste des events déclenchés par le datasource lorsque les opérations sont effectuées:
 * -init
 * -fetch
 * -add
 * -delete
 * -select
 * -sort
 * -filter
 * -error see{@link CodesError.DATASOURCE*}
 * @class
 * @extends EventEmitter
 */
export class DataSource<T> extends events.EventEmitter {

    /***
     * tableau d'item selectionné du datasource
     * @instance
     */
    protected _selected: Array<any> = [];

    /***
     * scope utilisé pour réaliser un fetch de type méthode de service.
     * @instance
     */
    protected scope: any;

    /***
     * Fonction appelée pour réaliser un fetch de type méthode de service.
     * @instance
     */
    protected method: Function;

    /***
     * tableau de résultats du datasource
     * @instance
     */
    protected _results: Array<any> = [];

    /***
     * backup des résultats du datasource
     * @instance
     */
    protected _results_backup: Array<any> = [];

    /***
     * mode filtre
     * @instance
     */
    protected _filtering_flag: boolean = false;

    /**
     * Indique si le datasource courant est de type DataSourceArray.
     */
    protected isDataSourceArray: Boolean = false;

    /**
     * Sauvegarde des argument du fetch pour rejouer lors du tri
     */
    protected fetchArgsSaved: any = null;

    /**
     * nom des argument du fetch pour rejouer lors du tri en lui ajoutant le sortData
     */
    protected fetchAttrName: string = "criteres";

    /**
     * tri par defaut
     */
    protected defaultSort: DefaultSort;

    /**
     * mode d'initialisation du datasource
     */
    protected initAsync: InitAsync;

    /**
     * statut datasource
     */
    protected _status;

    /***
     * @param {DataSourceConfig|DataSourceConfigPage|Array<T>} config : accepte soit une liste de l'éléments Array<T>, soit un service DataSourceConfig | DataSourceConfigPage
     * @param {DataSourceMap} keysMap  : utilisée pour la transformation des resultats du fetch.
     * @param {DataSourceOption[]} options : liste de paramètres supplémentaires à transmettre au fetch
     * Pour un config de type
     */
    constructor(protected config: DataSourceConfig | DataSourceConfigPage | Array<T>, public keysMap: DataSourceMap = {}, public options?: DataSourceOption[]) {
        super();
        this._status = DataSourceStatus.Dummy;
        this.config = config;
        if (!this.config) {
            this.config = [];
        }
        if (this.config instanceof DataSourceConfig) {
            this.scope = this.config.scope;
            this.method = this.config.scope[ this.config.methodName ];
            this.fetchAttrName = this.config.fetchAttrName || "criteres";
        }
        if (this.config instanceof DataSourceConfigPage) {
            this.scope = this.config.page.getService();
            this.method = this.config.method;
            this.fetchAttrName = this.config.fetchAttrName || "criteres";
        }
        if (this.config instanceof Array) {
            this.isDataSourceArray = true;
            this.init();
        }
        let init = _.find(options, (option: DataSourceOption) => {
            return option instanceof InitAsync
        });
        let sort = _.find(options, (option: DataSourceOption) => {
            return option instanceof DefaultSort
        });

        this.defaultSort = sort ? sort as DefaultSort : null;
        this.initAsync = init ? init as InitAsync : null;
    }

    /***
     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * Déchenche un event init
     */
    public init(args?: any): void {
        (this.initAsync && this.initAsync.isAsync) ? this.initData(args) : this.initDataSync(args);
    }

    /***
     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * Déchenche un event init
     */
    protected initDataSync(args?: any) {
        if (this.isDataSourceArray) {
            this.addDataSync(false, this.config as Array<T>);
            //nettoyage
            this.config = [];
            this.emit("init", this.results);
            this._status = DataSourceStatus.Initialized;
            return this.results;
        } else {
            this.fetchData(false, args).then(() => {
                this.emit("init", this.results);
                this._status = DataSourceStatus.Initialized;
                return this.results;
            })
        }
    }

    /***
     * Méthode qui déclenche un fetch appelé pour initialiser un datasource.
     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * Déchenche un event init
     */
    protected initData(args?: any): Promise<any[]> {
        return this.isDataSourceArray ? this.addData(false, this.config as Array<T>).then(() => {
            //nettoyage
            this.config = [];
            this.emit("init", this.results);
            this._status = DataSourceStatus.Initialized;
            return this.results;
        }).catch((error) => {
            throw error
        }) : this.fetchData(false, args).then(() => {
            this.emit("init", this.results);
            this._status = DataSourceStatus.Initialized;
            return this.results;
        })
    }

    /**
     * On considère que les données sont dèjà présentes dans le datasource, on envoie juste l'event fetch au composant
     * pour forcer le rendu avec ses anciennes données.
     */
    public reload() {
        Promise.resolve().then(() => {
            this.emit("fetch", this.results);
        })

    }

    /**
     * renvoie la valeur selectionnée courante.
     */
    get selected() {
        return this._selected;
    }

    set selected(value : any) {
        this._selected = value;
    }

    /**
     * supprime l'item du dataSource
     * @param item
     */
    public removeUnSelectedItem(item: any) {
        let indexOf = ArrayUtils.getIndexById(this._selected, item);
        if (indexOf !== -1) {
            this._selected.splice(indexOf, 1);
        }
    }

    /**
     * renvoie le tableau des résultats.
     */
    get results() {
        return this._results;
    }

    get status() {
        return this._status;
    }

    /**
     * renvoie le tri par defaut
     */
    getDefaultSort() {
        return this.defaultSort;
    }

    /**
     * enregistre les résultats dans le datasource
     * @param {any[]} results les données du data source (post-transformation {@link DataSource#transformData}).
     */
    set results(results: Array<any>) {
        this._results = results;
    }

    /***
     * Méthode qui implémente la méthode de récupération des datas (une par type de datasource)
     * Déchenche un event fetch
     * @param {Boolean} triggerFetch  déclenche un évènement "fetch" après l'opération si true.
     * @param {any} args  paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * @param {boolean} noSave indicateur pour sauvegarder ou non les paramètres du fetch pour les rejouer sur un sort service
     * @example
     * dataSource.on("fetch", (MappedResult)=>{
     *       //staff
     *   })
     * dataSource.fetch();
     * @void
     */
    public fetch(triggerFetch: Boolean, args?: any, noSave?: boolean): void {
        //suppression de l'historique de selection
        // le mae n'est pas prêt...
        this.selectClean(!noSave);
        if (!noSave) {
            this.fetchArgsSaved = args;
        }
        this.fetchData(triggerFetch, args)
    }

    /***
     * Méthode qui déclenche les events
     **/
    protected emitEvent(name, ...arg) {
        if (this._status === DataSourceStatus.Dummy) {
            this._status = DataSourceStatus.Initialized;
        }
        setTimeout(() => {
            this.emit(name, ...arg)
        }, 0);
    }

    /***
     * Méthode qui implémente la méthode de récupération des datas (une par type de datasource)
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {any[]} ...args paramètres à renseigner pour l'appel de la méthode de récupération des données.
     * @return {T} une promesse de type result de T.
     * @example
     * dataSource.on("fetch", (MappedResult)=>{
     *       //staff
     *   })
     * dataSource.fetch();
     * @void
     */
    protected fetchData(triggerFetch: Boolean, args?: any): Promise<Array<T>> {
        this.emit("loadingData", true);
        let fetchOptions = _.filter(this.options, (option: DataSourceOption) => {
            return option.sendToFetch()
        });
        let fetchArgs = (typeof args !== "undefined") ? [ args ].concat(fetchOptions) : fetchOptions;
        let p = this.isDataSourceArray ?
            //déclenchement de l'event fetch (si demandé) avec le result du data source en datasourceArray
            Promise.resolve().then(() => {
                if (triggerFetch) {
                    this.emit("fetch", this.results);
                    if (this.defaultSort && !(args && args[ "sort" ])) {
                        this.sortData(this.defaultSort.sort, this.defaultSort);
                    }
                } else {
                    return false;
                }
            }) :
            //déclenchement de l'event fetch (si demandé) avec datasourceService
            //après la requete de service, une transformation sera appliquée sur les données récoltées
            this.method.apply(this.scope, fetchArgs)
                .then((result: T[]) => {
                    return this.transformData([ result ]).then((res) => {
                        //affectation des data dans le result du datasource
                        this.results = res;
                        let args = fetchArgs[ 0 ];
                        if (this.defaultSort && !(args && args[ "sort" ])) {
                            this.sortData(this.defaultSort.sort, this.defaultSort);
                        }
                        triggerFetch ? this.emit("fetch", this.results) : null;
                        return this.results;
                    }).catch((e) => {
                        let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_FETCH_ERROR, null, e);
                        this.emit("error", error);
                        throw error;
                    });
                });
        return p.finally(() => {
            this.emitEvent("loadingData", false);
        });
    }

    /***
     * Ajout un élément ou des éléments au result du datasource
     * cette action déclenche l'évènement add.
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
        this.addData(triggerFetch, ...items).then((result) => {
            this.emit("add", result);
            return this.results;
        })
    }

    /***
     * Ajout un élément ou des éléments au result du datasource
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @return une promise du result modifié
     */
    protected addData(triggerFetch: Boolean, ...items: (T | T[])[]): Promise<Array<any>> {
        this.emit("loadingData", true);
        return Promise.resolve().then(() => {
            return this.transformData(items).then((result) => {
                try {
                    this._results = this._results.concat(result);
                    if (this.defaultSort) {
                        this.sortData(this.defaultSort.sort, this.defaultSort);
                    }
                    if (triggerFetch) this.emit("fetch", this.results);
                    return this._results;
                } catch (e) {
                    let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_ADD_ERROR, null, e);
                    this.emit("error", error);
                    throw error;
                }
            })
        }).finally(() => {
            this.emitEvent("loadingData", false);
        });
    }

    /***
     * Ajout un élément ou des éléments au result du datasource
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @return {any[]} result modifié
     */
    protected addDataSync(triggerFetch: Boolean, ...items: (T | T[])[]): Array<any> {
        this.emit("loadingData", true);
        let res = null;
        try {
            let result = this.transformDataSync(items);
            this._results = this._results.concat(result);
            if (this.defaultSort) {
                this.sortData(this.defaultSort.sort, this.defaultSort);
            }
            if (triggerFetch) this.emit("fetch", this.results);
            res = this._results;
        } catch (e) {
            let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_ADD_ERROR, null, e);
            this.emit("error", error);
            throw error;
        }
        this.emit("loadingData", false);
        return res;
    }

    /***
     * enlève un élément ou des éléments au result du datasource
     * cette action déclenche l'évènement delete
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @void
     */
    public delete(triggerFetch: Boolean, ...items: (T | T[])[]): void {
        this.deleteData(triggerFetch, ...items).then((result) => {
            this.emit("delete", result);
            return this.results;
        })
    }

    /**
     * supprime toutes les données du datasource.
     */
    public deleteAll() {
        this.selectClean(true);
        this.results = [];
        this.emit("delete", this.results);
    }

    /***
     * enlève un élément ou des éléments au result du datasource
     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @param {(T|T[])[]} items correspond aux données à ajouter, un appel à la méthode {@link DataSource#transformData} sera effectué
     * @return {Promise<Array<<any>>} une promise du result modifié
     */
    protected deleteData(triggerFetch: Boolean = false, ...items: (T | T[])[]): Promise<Array<any>> {
        this.emit("loadingData", true);
        return Promise.resolve().then(() => {
            return this.transformData(items).then((result: Array<T>) => {
                _.map(result, (item) => {
                    _.remove(this._results, item);
                });
                if (triggerFetch) this.emit("fetch", this.results);
                return this.results;
            }).catch((e) => {
                let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_DELETE_ERROR, null, e);
                this.emit("error", error);
                throw error;
            });
        }).finally(() => {
            this.emitEvent("loadingData", false);
        });
    }


    /**
     * permet de normaliser les elements du spread
     * @param {(T|T[])[]} data : les paramètres à normaliser
     */
    protected getSpreadValues(data: (T | T[])[]): any {
        let _data: any = data;
        if (_data.length == 0) return [];
        //for spread operator
        if (_data[ 0 ] instanceof Array) {
            _data = _data[ 0 ];
        }
        return _data;
    }


    /***
     * méthode qui convertie les données brutes en données exploitable par l'IHM.
     * @param {(T|T[])[]} data les données brutes.
     * @return {Promise<Array<<any>>} renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
     */
    protected transformData(data: (T | T[])[]): Promise<Array<any>> {
        return Promise.resolve().then(() => {
            return this.transformDataSync(data);
        });
    }

    /***
     * méthode qui convertie les données brutes en données exploitable par l'IHM.
     * @param {(T|T[])[]} data les données brutes.
     * @return {Array<any>} renvoie les données transformées à partir des données brutes et la classe de mapping  {@link DataSourceMap}
     */
    protected transformDataSync(data: (T | T[])[]): Array<any> {
        if (data[ "errors" ]) {
            let error = new TechnicalError("ERR_TECH_" + CodesError.DATASOURCE_RESPONSE_ERROR, data[ "errors" ]);
            this.emit("error", error);
            throw error;
        }
        let _data: any = this.getSpreadValues(data);
        if (!this.keysMap || (Object as any).keys(this.keysMap) == 0) {
            return _data;
        }
        return _data.map((item) => {
            if (item) {
                let resultKeys = {};
                Object.keys(this.keysMap).map((key) => {
                    resultKeys[ key ] = ObjectUtils.getSubObject(item, this.keysMap[ key ]);
                });
                return resultKeys;
            }
        });
    }


    /**
     * Fonction de tri
     * @param {SortData[]} sort  données de tri
     * @param {(a: any, b: any) => number} Fonction de comparaison.
     */
    protected sortData(sort: SortData[], compare?: any) {
        if (compare) {
            (compare as any).sortDatas = sort;
            this.results.sort((compare as any).compare);
        } else {
            let keys = [];
            let directions = [];
            for (let i = 0; i < sort.length; i++) {
                keys.push(sort[ i ].key);
                directions.push(sort[ i ].dir ? "desc" : "asc");
            }
            this.results = _.orderBy(this.results, keys, directions);
        }

        /*this.results = _.sortBy(this.results, sort.key instanceof Array ? sort.key : [ sort.key ]); // seulement ascendant
         if (sort.dir == SortDirection.DESC) {
         this.results = this.results.reverse();
         }*/
    }

    /***
     * Fonction de tri
     * @param {SortData[]} sortData.
     * @param {(a: any, b: any) => number} Fonction de comparaison.
     * @example
     * dataSource.on("sort", (SortedResult)=>{
     *       //staff
     *   })
     * dataSource.sort(sortData);
     * @void
     */
    public sort(sortDatas: SortData[], compare?: (a: any, b: any) => number): void {
        this.emit("loadingData", true);
        Promise.resolve().then(() => {
            try {
                if (this.isDataSourceArray) {
                    if (this.defaultSort) this.defaultSort.sort = sortDatas;

                    this.sortData(sortDatas, compare || this.defaultSort);
                    this.emitEvent("sort", this.results, sortDatas);
                    return this.results;
                } else {
                    return this.fetchData(false, this.getFetchArgs("sort", sortDatas))
                        .then((results: Array<T>) => {
                            this.emitEvent("sort", this.results, sortDatas);
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
                    this.emitEvent("filter", this.results);
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
     * Annule tous les filtres et restaure les valeurs d'origine.
     * dataSource.cancelFilter();
     * @void
     */
    public cancelFilter(): void {
        if (this._filtering_flag) {
            this._results = this._results_backup;
        }
    }


    /***
     * Permet de selectionner un element ou des elements du datasource
     * déclenche un evènement "select".
     * @param args correspond aux éléments sélectionnées
     * @param index dans le cas de la selection d'une ligne
     * @example
     * dataSource.on("select", (selectedItems)=>{
     *       //staff
     *   })
     * dataSource.select(items);
     * @void
     */
    public select(args: any): void {
        this._selected = args;
        this.emit("select", this.selected);
    }

    /***
     * Supprime toute sélection dans le datasource.
     * @void
     */
    public selectClean(flag: boolean) {
        if (flag) {
            this.select([]);
        }
        this._selected = [];
    }

    /**
     * reconstitue un objet parametre du fetch
     * @param {string} attrName nom de l'attribut ajouter
     * @param {objet} value valeur de l'attribut ajouter
     * @param {objet=} param
     */
    protected getFetchArgs(attrName: string, value: any, param?: any) {
        let fetchArgs = value;

        if (param || this.fetchArgsSaved) {
            if (value) {
                fetchArgs = param || {};
                if (!param) {
                    fetchArgs[ this.fetchAttrName ] = this.fetchArgsSaved;
                }
                fetchArgs[ attrName ] = value;
            } else {
                fetchArgs = param || this.fetchArgsSaved;
            }
        }

        return fetchArgs;
    }
}