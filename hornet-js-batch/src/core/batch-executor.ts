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
import { Promise } from "hornet-js-utils/src/promise-api";
import { Logger } from "hornet-js-utils/src/logger";
import { BatchProcess, BatchProcessParent } from "src/core/batch-process";
import { BatchUnit } from "src/core/batch-unit";
import { STATUS } from "src/core/batch-status";
import * as _ from "lodash";
const logger: Logger = Utils.getLogger("hornet-js-batch.batch-executor");

/***
 * @classdesc Classe Batch
 * elle classe permet de chainer les differents traitement du BatchUnit see{@link BatchUnit}
 * @class
 */
export class Batch {
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
    public createDate: Date;
    /***
     * indique startDate du batch
     * @instance
     */
    public startDate: Date;
    /***
     * indique endDate du batch
     * @instance
     */
    public endDate: Date;

    /***
     * indique la dernière error du batch
     * @instance
     */
    public error: Error;

    public constructor(public unit: BatchUnit, public roadmap: any[] = []) {
        this._id = "_" + unit.id;
        this.createDate = new Date();
    }

    /**
     * renvoie le statut du batch
     */
    public get status(): STATUS {
        return this._status;
    }

    /***
     * modifie le statut du batch
     */
    public set status(status: STATUS) {
        this._status = status
    }

    public updateStatus(): {} {
        let summary = [];
        let res = this.roadmap.reduce((result, process: BatchProcess) => {
            let res = false;
            let status = process.status;
            summary.push({ process_name: process.name, process_status: STATUS[ process.status ] });
            if (status == STATUS.FAILED) {
                this.endDate = new Date();
                this.status = STATUS.FAILED
            }
            if (status == STATUS.SUCCEEDED) {
                res = true;
            }
            return result && res;
        }, true);

        if (res) {
            this.endDate = new Date();
            this.status = STATUS.SUCCEEDED
        }
        logger.trace("\nBatch :", this.id, "\n", summary);
        return summary

    }

    /**
     * renvoie l'id du batch
     */
    public get id(): string {
        return this._id;
    }

    currentStep = 0;

    /***
     * cette methode permet le traitement par step.
     */
    execPool(): void {
        if (this.roadmap && this.currentStep < this.roadmap.length) {
            setImmediate((_batch) => {
                let process: BatchProcess = _batch.roadmap[ _batch.currentStep ];
                try {
                    process.execute.apply(process).then((result) => {
                        _batch.currentStep++;
                        if (_batch.roadmap[ _batch.currentStep ]) {
                            _batch.roadmap[ _batch.currentStep ].options.args = result;
                        }
                        _batch.execPool();
                    }).catch((error) => {
                        logger.fatal(process.name, error);
                        this.status = STATUS.FAILED;
                        this.error = error;
                        BatchExecutor.Instance.removeBatch(this);
                    });
                } catch (error) {
                    logger.fatal(process.name, error);
                    this.status = STATUS.FAILED;
                    this.error = error;
                    BatchExecutor.Instance.removeBatch(this);
                }
            }, this);
        }
    }



    /***
     * cette methode ordonnance puis lance les différents traitements du batch puis .
     * @return une promise du resultat des différents traitements.
     */
    public run(): Promise<any> {
        logger.trace("run batch " + this._id);
        if (!this.startDate) {
            this.startDate = new Date();
        }
        //normalize roadmap
        this.roadmap.forEach((values, index) => {
            let res = values;
            if (values instanceof Array) {
                res = ((values.length > 1) ? new BatchProcessParent(values) : values[ 0 ]);
            }
            res.batch = this;
            this.roadmap[ index ] = res;
        });

        this.execPool();

        return Promise.resolve(this.unit);

    }
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
    private static processing = {};

    /***
     * Contient la liste des batchs dans la file d'attente
     * @instance 
     */
    private static queue = {};


    /***
     * Contient l'historique la liste des batchs qui ont été executés la durée de vie est la même que l'instance du serveur [aucune persistance]
     * @instance
     */
    public static summary = {};


    private static _instance: BatchExecutor;

    private constructor() {
    }

    static get Instance() {
        return this._instance || (this._instance = new this());
    }


    /**
     *
     * @param {Batch} batch
     */
    addToSummary(batch: Batch) {
        if (!BatchExecutor.summary[ batch.unit.route ]) {
            BatchExecutor.summary[ batch.unit.route ] = [];
        }

        BatchExecutor.summary[ batch.unit.route ].unshift({
            id: batch.id,
            status: STATUS[ batch.status ],
            startDate: batch.startDate,
            endDate: batch.endDate,
            createDate: batch.createDate,
            errorBatch: batch.error ? "[" + batch.error.name + "] " + batch.error.message : ""
        })
    }
    /***
     * Renvoie le batch associé au BatchUnit qu'il soit en cours de traitement ou dans la file d'attente.
     * S'il ne le trouve pas il en crée un qu'il place dans la file d'attente.
     * @param unit {Boolean} triggerFetch déclenche un évènement "fetch" après l'opération si true.
     * @return un batch trouvé ou un nouveau.
     */
    getBatch(unit: BatchUnit): Batch {
        let criteria = { "_id": "_" + unit.id };
        let batch = _.find(BatchExecutor.processing[ unit.route ], criteria) || _.find(BatchExecutor.queue[ unit.route ], criteria) || function () {
            let newBatch = new Batch(unit);
            newBatch.status = STATUS.QUEUED;
            BatchExecutor.queue[ unit.route ] = [ newBatch ];
            return newBatch;
        } ();
        return batch as Batch;
    }



    /***
     * @param route une route.
     * @returns {boolean} true si une action de type batch est en cours d'execution
     */
    isBatchActionExist(route: string): any {
        let test = BatchExecutor.processing[ route ] || BatchExecutor.queue[ route ];
        let found = false;
        let history = BatchExecutor.summary[ route ];
        if (test) {
            let batch = test[ 0 ];
            let roadmap = batch.roadmap;
            for (let i = 0; i < batch.roadmap.length; i++) {
                let item = roadmap[ i ];
                if (item instanceof BatchProcessParent) {
                    item.updateStatus();
                }
                if (item.status == STATUS.RUNNING || item.status == STATUS.INIT || item.status == STATUS.QUEUED) {
                    logger.trace("=> batch exist", true);
                    return {
                        isBusy: true,
                        history: history
                    };
                }
                if (item.status == STATUS.FAILED) {
                    found = true;
                }
            }
            if (found) {
                logger.trace("=> caution previous batch has failed");
                batch.status = STATUS.FAILED;
                BatchExecutor.Instance.removeBatch(batch);
                test = undefined;
            } else {
                batch.status = STATUS.SUCCEEDED;
                BatchExecutor.Instance.removeBatch(batch);
                test = undefined;
            }
            history = BatchExecutor.summary[ route ]
        }

        return {
            isBusy: (test && test.length > 0),
            history: history
        }
    }

    /***
     * supprime un batch de la liste des batch en cours d'execution.
     * @param {Batch} batch une route donnée.
     */
    removeBatch(batch: Batch): void {
        let unit = batch.unit;
        let criteria = { "_id": "_" + unit.id };
        //let batch = _.find(BatchExecutor.processing[ unit.route ], criteria);
        if (batch) {
            BatchExecutor.Instance.addToSummary(batch);
            _.remove(BatchExecutor.processing[ unit.route ], batch);
            if (BatchExecutor.processing[ unit.route ].length == 0) {
                delete BatchExecutor.processing[ unit.route ];
            }
        }

    }

    /***
     * Lance un Batch
     * @param unit un BatchUnit see{@link BatchUnit}
     * @return renvoie une promesse du BatchUnit traité
     */
    runBatch(unit: BatchUnit): Promise<any> {
        let criteria = { "_id": "_" + unit.id };
        let batch: Batch = _.find(BatchExecutor.processing[ unit.route ], criteria) as Batch;
        if (!batch) {
            batch = _.find(BatchExecutor.queue[ unit.route ], criteria) as Batch;
            batch.status = STATUS.RUNNING;
            if (!(BatchExecutor.processing[ unit.route ] instanceof Array)) {
                BatchExecutor.processing[ unit.route ] = [];
            }
            BatchExecutor.processing[ unit.route ].push(batch);
            _.remove(BatchExecutor.queue[ unit.route ], batch);
            if (BatchExecutor.queue[ unit.route ].length == 0) {
                delete BatchExecutor.queue[ unit.route ];
            }
            return batch.run();
        } else {
            return Promise.resolve(unit);
        }
    }
}


