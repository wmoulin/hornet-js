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
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { BatchReader } from "src/core/reader/batch-reader";
import { BatchWriter } from "src/core/writer/batch-writer";
import { Transformer } from "src/core/transform/transformer";
import { BatchMapper } from "src/core/mapper/batch-mapper";
import { BatchExecutor } from "src/core/batch-executor";
import { BatchProcess } from "src/core/batch-process";
import { Filter } from "src/core/filter/filter";
import { ForEach } from "src/core/service/foreach";
import { STATUS } from "src/core/batch-status";
import { Call } from "src/core/service/call";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { Promise } from "hornet-js-utils/src/promise-api";
import { RouteActionBatch, RouteActionBatchMulti } from "src/routes/abstract-batch-routes";
import { IService } from "hornet-js-core/src/services/service-api";

const uuid = require("uuid");

const logger: Logger = Utils.getLogger("hornet-js-batch.batch-unit");

/***
 * @classdesc Classe BatchUnit
 * C'est un helper qui permet de simplifier l'écriture des batchs pour l'utilisateur
 * @class
 */
export class BatchUnit implements BatchUnit {

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

    constructor(name: string, readonly model: Class<any>, readonly route: string) {
        this._id = uuid.v4();
        this._name = name;
        this.status = STATUS.INIT;
    }

    /***
     * renvoie l'id du batchUnit
     */
    public get id(): string {
        return this._id;
    }

    /***
     * renvoie le nom du batchUnit
     * @returns {string}
     */
    public get name(): string {
        return this._name;
    }

    /***
     * renvoie le status du batchUnit
     */
    public get status(): STATUS {
        return this._status;
    }

    /***
     * modifie le status batchUnit
     */
    public set status(status: STATUS) {
        this._status = status;
    }

    /**
     * Methode qui ajoute un ou plusieurs reader au traitement
     *  Les `readers` sont des classes de type BatchReader qui vont récupérer des données.
     * @param  {BatchReader} readers la liste des readers à lancer
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public reader(...readers: BatchReader[]): BatchUnit {
        BatchExecutor.Instance.getBatch(this).roadmap.push(readers);
        return this;
    }

    /**
     * Methode qui ajoute un ou plusieurs writer au traitement.
     * Les `writers` sont des classes de type BatchWriter qui vont renvoyer les données.
     * @param  {BatchReader} readers la liste des writers à lancer
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public writer(...writers: BatchWriter[]): BatchUnit {
        BatchExecutor.Instance.getBatch(this).roadmap.push(writers);
        return this;
    }

    /**
     * Methode qui ajoute un filter au traitement.
     * Les `filters` sont des classes de type BatchFilter qui vont filtrer les données.
     * @param  {Function} filter la function filter à lancer
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public filter(filter: Function): BatchUnit {
        let newFilter: BatchProcess = new Filter();
        newFilter.name = this._name + ".filter";
        let batch = BatchExecutor.Instance.getBatch(this)
        newFilter.options.service = filter;
        BatchExecutor.Instance.getBatch(this).roadmap.push(newFilter);
        return this;
    }

    /**
     * Methode qui ajoute un transformer au traitement. 
     * Les `transformers` sont des classes de type BatchTransform qui vont manipuler les données.
     * @param {Function} transformer la fonction qui manipule les données
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public transform(transformer: Function): BatchUnit {
        let newTransformer: BatchProcess = new Transformer();
        newTransformer.name = this._name + ".transform";
        newTransformer.options.service = transformer;
        BatchExecutor.Instance.getBatch(this).roadmap.push(newTransformer);
        return this;
    }

    /**
     * Methode qui ajoute un mapper au traitement. 
     * Les `mappers` sont des classes de type BatchMapper qui vont binder les données.
     * @param {BatchMapper} mapper le mapper à lancer
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public mapper(mapper: BatchMapper): BatchUnit {
        BatchExecutor.Instance.getBatch(this).roadmap.push(mapper);
        return this;
    }

    /**
     * Methode qui ajoute un appel de service au traitement.
     * Les `call` sont des classes de type BatchService qui vont executer l'appel de service.
     * @param {Function} service le service
     * @param {RouteActionBatch|RouteActionBatchMulti} scope l'action de type batch
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public call(service: Function, scope: RouteActionBatch<any, IService> | RouteActionBatchMulti<any, IService>): BatchUnit {
        let newCall: BatchProcess = new Call();
        newCall.name=this._name + ".call";
        newCall.options.service = service;
        newCall.options.scope = scope;
        BatchExecutor.Instance.getBatch(this).roadmap.push(newCall);
        return this;
    }

    /**
     * Méthode qui ajoute un appel de service au traitement.
     * Les `foreach` sont des classes de type BatchService qui vont executer l'appel de service en bouclant sur la liste des paramètres qu'ils ont en entrée.
     * @param {Function} service le serie d'appel au service (boucle sur les arguments)
     * @param {RouteActionBatch|RouteActionBatchMulti} scope l'action de type batch
     * @returns l'instance batchUnit {BatchUnit} en cours
     */
    public foreach(service: Function, scope?: any): BatchUnit {
        let newForEach: BatchProcess = new ForEach();
        newForEach.name=this._name + ".foreach";
        newForEach.options.service = service;
        newForEach.options.scope = scope;
        BatchExecutor.Instance.getBatch(this).roadmap.push(newForEach);
        return this;
    }

    /**
    * Lance le traitement du batch unit
    * @returns une promesse de type {@see BatchUnit} traité.
    */
    public run(): Promise<any> {
        return BatchExecutor.Instance.runBatch(this)
    }
}
