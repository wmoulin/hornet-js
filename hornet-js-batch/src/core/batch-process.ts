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
import { Promise } from "hornet-js-utils/src/promise-api";
import { BatchOptions } from "src/core/batch-options";
import { STATUS } from "src/core/batch-status";
import { Batch } from "src/core/batch-executor";
const uuid = require("uuid");

const logger: Logger = Utils.getLogger("hornet-js-batch.batch-process");

export interface Process {
    execute(...args)
    result()
    options()
}


export abstract class BatchProcess implements Process {
    protected _result: any;
    protected _options: BatchOptions = {};
    protected _idBatch: string;
    protected _status: STATUS = STATUS.INIT;
    protected _batch: Batch;
    protected _name: Batch;
    protected _total: number;
    protected _list: Array<any>;

    constructor(config: any) {
        this._options.config = config;
    };

    set result(result: any) {
        this._result = result;
    };

    get result(): any {
        return this._result;
    };

    set total(total: number) {
        this._total = total;
    };

    get total(): number {
        return this._total;
    };


    set list(list: Array<any>) {
        this._list = list;
    };

    get list(): Array<any> {
        return this._list;
    };

    set name(name: any) {
        this._name = name;
    };

    get name(): any {
        return this._name || this.constructor[ "name" ];
    };

    set idBatch(id: any) {
        this._idBatch = id;
    };

    get idBatch(): any {
        return this._idBatch;
    };

    set batch(batch: Batch) {
        this._batch = batch;
    };

    get batch(): Batch {
        return this._batch;
    };
    set options(options: any) {
        this._options = options;
    };

    get options(): any {
        return this._options;
    };

    set status(status: STATUS) {
        this._status = status;
        this._batch.updateStatus();
        if (status == STATUS.FAILED || status == STATUS.SUCCEEDED) {
            if (this.timer) {
                clearInterval(this.timer)
            }
        }
    };

    get status(): STATUS {
        return this._status;
    };

    protected print() {
        if (this.list && this._total) {
            let calc = 100 - ((100.0 * this.list.length) / this._total);
            logger.trace(this.name + " " + calc.toFixed(2))
        }
    }

    protected abstract treatment(): Promise<any>;
    timer;

    public execute(): Promise<any> {
        let timer = Utils.config.getOrDefault("batch.printTimer", 500);
        this.status = STATUS.RUNNING;
        this.timer = setInterval(this.print.bind(this), timer);
        return this.treatment();
    }
}



export class BatchProcessParent extends BatchProcess implements Process {

    constructor(readonly child: BatchProcess[]) {
        super(null);
    }

    set idBatch(id: any) {
        this.child.forEach((value) => {
            value.idBatch = id;
        });
        this._idBatch = "ProcessParent"
    };

    set batch(batch: Batch) {
        this.child.forEach((value) => {
            value.batch = batch;
        });
        this._batch = batch
    };


    updateStatus() {
        let res = this.child.reduce((result, process: BatchProcess) => {
            let res = false;
            let status = process.status;
            if (status == STATUS.SUCCEEDED) {
                res = true;
            } else {
                this.status = status
            }
            return result && res;
        }, true);
        if (res) {
            this.status = STATUS.SUCCEEDED
        }
    }

    protected treatment(): Promise<any> {
        let promises = [];
        //
        this.child.forEach((value) => {
            value.options.arg = this.options.args;
            promises.push(value.execute());
        });
        return Promise.all(promises).then((result) => {
            let res: Array<any> = [];
            result.forEach((value, index) => {
                res = res.concat(value);
            });
            this.status = STATUS.SUCCEEDED
            this.result = res;
            return this.result;
        })
    }
}