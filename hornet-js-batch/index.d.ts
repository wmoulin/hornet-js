declare module "hornet-js-batch/src/middleware/middlewares" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { AbstractHornetMiddleware } from "hornet-js-core/src/middleware/middlewares";
	import { Class } from "hornet-js-utils/src/typescript-utils";
	export class BatchRenderingMiddleware extends AbstractHornetMiddleware {
	    private static logger;
	    constructor();
	}
	export const DEFAULT_HORNET_BATCH_MIDDLEWARES: Array<Class<AbstractHornetMiddleware>>;
	
}

declare module "hornet-js-batch/src/core/batch-executor" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchUnit }  from "hornet-js-batch/src/core/batch-unit";
	import { STATUS }  from "hornet-js-batch/src/core/batch-status";
	/***
	 * @classdesc Classe Batch
	 * elle classe permet de chainer les differents traitement du BatchUnit see{@link BatchUnit}
	 * @class
	 */
	export class Batch {
	    unit: BatchUnit;
	    roadmap: any[];
	    /***
	     * Id du batch
	     * @instance
	     */
	    protected _id: string;
	    /***
	     * indique l'état du batch
	     * @instance
	     */
	    protected _status: STATUS;
	    /***
	     * indique createDate du batch
	     * @instance
	     */
	    createDate: Date;
	    /***
	     * indique startDate du batch
	     * @instance
	     */
	    startDate: Date;
	    /***
	     * indique endDate du batch
	     * @instance
	     */
	    endDate: Date;
	    /***
	     * indique la dernière error du batch
	     * @instance
	     */
	    error: Error;
	    constructor(unit: BatchUnit, roadmap?: any[]);
	    /**
	     * renvoie le statut du batch
	     */
	    /***
	     * modifie le statut du batch
	     */
	    status: STATUS;
	    updateStatus(): {};
	    /**
	     * renvoie l'id du batch
	     */
	    readonly id: string;
	    currentStep: number;
	    /***
	     * cette methode permet le traitement par step.
	     */
	    execPool(): void;
	    /***
	     * cette methode ordonnance puis lance les différents traitements du batch puis .
	     * @return une promise du resultat des différents traitements.
	     */
	    run(): Promise<any>;
	}
	/***
	 * @classdesc BatchExecutor
	 * Classe d'orchectration des Batch
	 * @class
	 */
	export class BatchExecutor {
	    /***
	     * Contient la liste des batchs en cours de traitement
	     * @instance
	     */
	    private static processing;
	    /***
	     * Contient la liste des batchs dans la file d'attente
	     * @instance
	     */
	    private static queue;
	    /***
	     * Contient l'historique la liste des batchs qui ont été executés la durée de vie est la même que l'instance du serveur [aucune persistance]
	     * @instance
	     */
	    static summary: {};
	    private static _instance;
	    private constructor();
	    static readonly Instance: BatchExecutor;
	    addToSummary(batch: Batch): void;
	    /***
	     * Renvoie le batch associé au BatchUnit qu'il soit en cours de traitement ou dans la file d'attente.
	     * S'il ne le trouve pas il en crée un qu'il place dans la file d'attente.
	     * @param {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
	     * @return un batch trouvé ou un nouveau.
	     */
	    getBatch(unit: BatchUnit): Batch;
	    /***
	     * @param une route.
	     * @returns {boolean} true si une action de type batch est en cours d'execution
	     */
	    isBatchActionExist(route: string): any;
	    /***
	     * supprime un batch de la liste des batch en cours d'execution.
	     * @param {Batch} batch une route donnée.
	     */
	    removeBatch(batch: Batch): void;
	    /***
	     * Lance un Batch
	     * @param un BatchUnit see{@link BatchUnit}
	     * @return renvoie une promesse du BatchUnit traité
	     */
	    runBatch(unit: BatchUnit): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/batch-options" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { RouteActionBatch, RouteActionBatchMulti }  from "hornet-js-batch/src/routes/abstract-batch-routes";
	import { IService } from "hornet-js-core/src/services/service-api";
	export interface BatchOptions {
	    /**
	     *  encoding à utiliser
	     */
	    encoding?: string;
	    /**
	     * ensemble des arguments à passer pour lancer le {@link BatchProcess BatchProcess}.
	     */
	    args?: any;
	    /**
	     * ensemble de la config à utiliser dans le  {@link BatchProcess BatchProcess}.
	     */
	    config?: any;
	    /**
	     * fonction à executer dans le  {@link BatchProcess BatchProcess}.
	     */
	    service?: Function;
	    /**
	     * données à utiliser
	     */
	    data?: any;
	    /**
	     * contexte à utiliser pour lancer la fonction
	     */
	    scope?: RouteActionBatch<any, IService> | RouteActionBatchMulti<any, IService>;
	}
	export interface BatchFileOptions extends BatchOptions {
	    /**
	     * path du fichier
	     */
	    filename?: string;
	    /**
	     * taille du fichier
	     */
	    size?: number;
	}
	/**
	 * @see CSV Parser Project http://csv.adaltas.com/parse/
	 * auto_parse (boolean) If true, the parser will attempt to convert input string to native types.
	 * auto_parse_date (boolean) If true, the parser will attempt to convert input string to dates. It requires the "auto_parse" option. Be careful, it relies on Date.parse.
	 * columns (array|boolean|function)List of fields as an array, a user defined callback accepting the first line and returning the column names, or true if autodiscovered in the first CSV line. Defaults to null. Affects the result data set in the sense that records will be objects instead of arrays. A value "false" skips the all column.
	 * comment (char) Treat all the characters after this one as a comment. Defaults to '' (disabled).
	 * delimiter (char) Set the field delimiter. One character only. Defaults to "," (comma).
	 * escape (char) Set the escape character. One character only. Defaults to double quote.
	 * from, (number) Start returning records from a particular line.
	 * ltrim (boolean) If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields). Defaults to false. Does not remove whitespace in a quoted field.
	 * max_limit_on_data_read (int) Maximum numer of characters to be contained in the field and line buffers before an exception is raised. Used to guard against a wrong delimiter or rowDelimiter. Default to 128,000 characters.
	 * objname (string) Name of header-record title to name objects by.
	 * quote (char) Optional character surrounding a field. One character only. Defaults to double quote.
	 * relax (boolean) Preserve quotes inside unquoted field.
	 * relax_column_count (boolean) Discard inconsistent columns count. Default to false.
	 * rowDelimiter (chars|constant) String used to delimit record rows or a special constant; special constants are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
	 * rtrim (boolean) If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields). Defaults to false. Does not remove whitespace in a quoted field.
	 * skip_empty_lines (boolean) Don't generate records for empty lines (line matching /\s* /, defaults to false.
	 *   skip_lines_with_empty_values (boolean) Don't generate records for lines containing empty column values (column matching /\s* /), defaults to false.
	 * to, (number) Stop returning records after a particular line.
	 * trim If true, ignore whitespace immediately around the delimiter. Defaults to false. Does not remove whitespace in a quoted field.
	 * noHeader : is the csv file contains a header
	 * path : file path
	 *
	 */
	export interface BatchCSVOptions extends BatchFileOptions {
	    path: string;
	    noHeader?: boolean;
	    delimiter?: string;
	    columns?: Array<string> | Boolean | Function;
	    auto_parse?: boolean;
	    auto_parse_date?: boolean;
	    comment?: string;
	    escape?: string;
	    from?: number;
	    ltrim?: boolean;
	    max_limit_on_data_read?: number;
	    objname?: string;
	    quote?: string;
	    relax?: boolean;
	    relax_column_count?: boolean;
	    rowDelimiter?: string;
	    rtrim?: boolean;
	    skip_empty_lines?: boolean;
	    skip_lines_with_empty_values?: boolean;
	    to?: number;
	    trim?: boolean;
	}
	
}

declare module "hornet-js-batch/src/core/batch-process" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchOptions }  from "hornet-js-batch/src/core/batch-options";
	import { STATUS }  from "hornet-js-batch/src/core/batch-status";
	import { Batch }  from "hornet-js-batch/src/core/batch-executor";
	export interface Process {
	    execute(...args: any[]): any;
	    result(): any;
	    options(): any;
	}
	export abstract class BatchProcess implements Process {
	    protected _result: any;
	    protected _options: BatchOptions;
	    protected _idBatch: string;
	    protected _status: STATUS;
	    protected _batch: Batch;
	    protected _name: Batch;
	    protected _total: number;
	    protected _list: Array<any>;
	    constructor(config: any);
	    result: any;
	    total: number;
	    list: Array<any>;
	    name: any;
	    idBatch: any;
	    batch: Batch;
	    options: any;
	    status: STATUS;
	    protected print(): void;
	    protected abstract treatment(): Promise<any>;
	    timer: any;
	    execute(): Promise<any>;
	}
	export class BatchProcessParent extends BatchProcess implements Process {
	    readonly child: BatchProcess[];
	    constructor(child: BatchProcess[]);
	    idBatch: any;
	    batch: Batch;
	    updateStatus(): void;
	    protected treatment(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/batch-status" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/***
	 * Enum des etats du status.
	 * @readonly
	 * @enum
	 */
	export enum STATUS {
	    INIT = 0,
	    RUNNING = 1,
	    QUEUED = 2,
	    FAILED = 3,
	    SUCCEEDED = 4,
	}
	
}

declare module "hornet-js-batch/src/core/batch-unit" {
	import { BatchReader }  from "hornet-js-batch/src/core/reader/batch-reader";
	import { BatchWriter }  from "hornet-js-batch/src/core/writer/batch-writer";
	import { BatchMapper }  from "hornet-js-batch/src/core/mapper/batch-mapper";
	import { STATUS }  from "hornet-js-batch/src/core/batch-status";
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { RouteActionBatch, RouteActionBatchMulti }  from "hornet-js-batch/src/routes/abstract-batch-routes";
	import { IService } from "hornet-js-core/src/services/service-api";
	/***
	 * @classdesc Classe BatchUnit
	 * C'est un helper qui permet de simplifier l'écriture des batchs pour l'utilisateur
	 * @class
	 */
	export class BatchUnit implements BatchUnit {
	    readonly model: Class<any>;
	    readonly route: string;
	    /***
	     * id du batchUnit
	     * @instance
	     */
	    protected _id: string;
	    /***
	     * nom du batchUnit
	     * @instance
	     */
	    protected _name: string;
	    /***
	     * statut du batchUnit
	     * @instance
	     */
	    protected _status: STATUS;
	    constructor(name: string, model: Class<any>, route: string);
	    /***
	     * renvoie l'id du batchUnit
	     */
	    readonly id: string;
	    /***
	     * renvoie le nom du batchUnit
	     * @returns {string}
	     */
	    readonly name: string;
	    /***
	     * renvoie le status du batchUnit
	     */
	    /***
	     * modifie le status batchUnit
	     */
	    status: STATUS;
	    /**
	     * Methode qui ajoute un ou plusieurs reader au traitement
	     *  Les `readers` sont des classes de type BatchReader qui vont récupérer des données.
	     * @param  {BatchReader} readers la liste des readers à lancer
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    reader(...readers: BatchReader[]): BatchUnit;
	    /**
	     * Methode qui ajoute un ou plusieurs writer au traitement.
	     * Les `writers` sont des classes de type BatchWriter qui vont renvoyer les données.
	     * @param  {BatchReader} readers la liste des writers à lancer
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    writer(...writers: BatchWriter[]): BatchUnit;
	    /**
	     * Methode qui ajoute un filter au traitement.
	     * Les `filters` sont des classes de type BatchFilter qui vont filtrer les données.
	     * @param  {Function} filter la function filter à lancer
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    filter(filter: Function): BatchUnit;
	    /**
	     * Methode qui ajoute un transformer au traitement.
	     * Les `transformers` sont des classes de type BatchTransform qui vont manipuler les données.
	     * @param {Function} transformer la fonction qui manipule les données
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    transform(transformer: Function): BatchUnit;
	    /**
	     * Methode qui ajoute un mapper au traitement.
	     * Les `mappers` sont des classes de type BatchMapper qui vont binder les données.
	     * @param {BatchMapper} mapper le mapper à lancer
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    mapper(mapper: BatchMapper): BatchUnit;
	    /**
	     * Methode qui ajoute un appel de service au traitement.
	     * Les `call` sont des classes de type BatchService qui vont executer l'appel de service.
	     * @param {Function} service le service
	     * @param {RouteActionBatch|RouteActionBatchMulti} scope l'action de type batch
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    call(service: Function, scope: RouteActionBatch<any, IService> | RouteActionBatchMulti<any, IService>): BatchUnit;
	    /**
	     * Méthode qui ajoute un appel de service au traitement.
	     * Les `foreach` sont des classes de type BatchService qui vont executer l'appel de service en bouclant sur la liste des paramètres qu'ils ont en entrée.
	     * @param {Function} service le serie d'appel au service (boucle sur les arguments)
	     * @param {RouteActionBatch|RouteActionBatchMulti} scope l'action de type batch
	     * @returns l'instance batchUnit {BatchUnit} en cours
	     */
	    foreach(service: Function, scope?: any): BatchUnit;
	    /**
	    * Lance le traitement du batch unit
	    * @returns une promesse de type {@see BatchUnit} traité.
	    */
	    run(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/result/result-batch" {
	import { HornetResult } from "hornet-js-core/src/result/hornet-result";
	import { OptionsFiles } from "hornet-js-core/src/result/hornet-result-interface";
	export interface OptionsBatch extends OptionsFiles {
	    isExist?: boolean;
	    history?: any;
	}
	/**
	 * @class
	 * @classdesc HornetResult définit un result de type Batch.
	 */
	export class ResultBatch extends HornetResult {
	    constructor(options: OptionsBatch);
	}
	
}

declare module "hornet-js-batch/src/routes/abstract-batch-routes" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Class } from "hornet-js-utils/src/typescript-utils";
	import { BatchUnit }  from "hornet-js-batch/src/core/batch-unit";
	import { RouteActionService, RouteAttributes } from "hornet-js-core/src/routes/abstract-routes";
	import { IService } from "hornet-js-core/src/services/service-api";
	export abstract class RouteActionBatch<A extends RouteAttributes, B extends IService> extends RouteActionService<A, B> {
	    getNewBatchUnit(name: string, model?: Class<any>): BatchUnit;
	}
	export abstract class RouteActionBatchMulti<A extends RouteAttributes, B extends IService> extends RouteActionService<A, B> {
	    getNewBatchUnit(name: string, model?: Class<any>): BatchUnit;
	}
	
}

declare module "hornet-js-batch/src/core/filter/batch-filter" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	* Interface pour les classes qui filtrent pour les batchs
	* @interface
	*/
	export interface BatchFilter {
	    filter(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/filter/filter" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchFilter }  from "hornet-js-batch/src/core/filter/batch-filter";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	/**
	* @classdesc Classe de filter pour les batchs basé sur {@link https://lodash.com/docs/#filter}
	* @class
	*/
	export class Filter extends BatchProcess implements BatchFilter {
	    constructor();
	    protected treatment(): Promise<any>;
	    filter(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/mapper/batch-mapper" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	* Interface pour les classes qui mapper pour les batchs
	* @interface
	*/
	export interface BatchMapper {
	    mapper(): any;
	}
	
}

declare module "hornet-js-batch/src/core/parameters/parameters" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	import { BatchOptions }  from "hornet-js-batch/src/core/batch-options";
	export class Parameters extends BatchProcess {
	    constructor(options: BatchOptions);
	    protected treatment(...args: any[]): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/reader/batch-reader" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	* Interface pour les classes qui lisent pour les batchs
	* @interface
	*/
	export interface BatchReader {
	    reader(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/reader/csv-reader" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchReader }  from "hornet-js-batch/src/core/reader/batch-reader";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	import { BatchCSVOptions }  from "hornet-js-batch/src/core/batch-options";
	/**
	* @classdesc Classe de lecteur de CSV pour les batchs basé sur {@link https://www.npmjs.com/package/csv-parse}
	* @class
	*/
	export class CSVReader extends BatchProcess implements BatchReader {
	    constructor(config: BatchCSVOptions);
	    protected treatment(): Promise<any>;
	    reader(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/reader/data-reader" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchReader }  from "hornet-js-batch/src/core/reader/batch-reader";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	/**
	* @classdesc Classe de type Batch Reader qui récupère des données dans un objet {@see IService}
	* @class
	*/
	export class DataReader<T> extends BatchProcess implements BatchReader {
	    constructor(data: T, scope?: any, args?: any);
	    protected treatment(): Promise<T>;
	    /**
	     * Renvoie le resultat de type
	     */
	    reader(): Promise<T>;
	}
	
}

declare module "hornet-js-batch/src/core/reader/service-reader" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchReader }  from "hornet-js-batch/src/core/reader/batch-reader";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	/**
	* @classdesc Classe de type Batch Reader qui appelle un service de type {@see IService}
	* @class
	*/
	export class ServiceReader extends BatchProcess implements BatchReader {
	    constructor(service: Function, scope?: any, args?: any);
	    protected treatment(): Promise<any>;
	    /**
	     * Renvoie le resultat de type
	     */
	    reader(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/service/batch-service" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	* Interface pour les classes qui lancent un service pour les batchs
	* @interface
	*/
	export interface BatchService {
	    apply(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/service/call" {
	import { BatchService }  from "hornet-js-batch/src/core/service/batch-service";
	import { ForEach }  from "hornet-js-batch/src/core/service/foreach";
	/**
	* @classdesc Classe de type BatchService qui appelle un service de type {@see IService}
	* @class
	*/
	export class Call extends ForEach implements BatchService {
	    protected execSpecificPool(_process: any): void;
	}
	
}

declare module "hornet-js-batch/src/core/service/foreach" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchService }  from "hornet-js-batch/src/core/service/batch-service";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	/**
	* @classdesc Classe de type BatchService qui appelle en serie un service de type {@see IService}
	* @class
	*/
	export class ForEach extends BatchProcess implements BatchService {
	    constructor();
	    protected treatment(): Promise<any>;
	    execPool(): void;
	    protected execSpecificPool(_process: any): void;
	    apply(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/transform/batch-transform" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	* Interface pour les classes qui manipulent les datas pour les batchs
	* @interface
	*/
	export interface BatchTransform {
	    transform(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/transform/transformer" {
	import { Promise } from "hornet-js-utils/src/promise-api";
	import { BatchTransform }  from "hornet-js-batch/src/core/transform/batch-transform";
	import { BatchProcess }  from "hornet-js-batch/src/core/batch-process";
	/**
	* @classdesc Classe de type BatchTransform qui appelle une fonction
	* @class
	*/
	export class Transformer extends BatchProcess implements BatchTransform {
	    constructor();
	    protected treatment(): Promise<any>;
	    transform(): Promise<any>;
	}
	
}

declare module "hornet-js-batch/src/core/writer/batch-writer" {
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
	 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export interface BatchWriter {
	    writer(): any;
	}
	
}
