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

import * as _ from "lodash";
import {OptionsPDF } from "src/result/hornet-result-interface";
import {MediaTypes} from "src/protocol/media-type";
import {Utils} from "hornet-js-utils";
import {ResultFile} from "src/result/result-file";
import {Response} from "express";

// ------------------------------------------------------------------------------------------------------------------- //
//                                      ResultPDF
// ------------------------------------------------------------------------------------------------------------------- //





/**
 * @class
 * @classdesc HornetResult définit un result de type PDF. see https://github.com/bpampuch/pdfmake
 */
export class ResultPDF extends ResultFile {

    constructor(options : OptionsPDF){
        super(options, MediaTypes.PDF)
    }

    protected compute() : Promise<any> {
        return new Promise((resolve, reject)=>{
            try{
                let projectRoot = process.cwd() + '/static/'+ Utils.config.get("themeName");
                if (this.options.data && this.options.data instanceof Array){
                    let listValue : Array<any> = _.map(this.options.data, (item)=>{
                        if (item) {
                            let arr = [];
                            for (let field of this.options.fields) {
                                arr.push(item[field]?item[field].toString():'')
                            }
                            return arr;
                        }
                    });
                    let header = _.map(this.options.fieldNames, (item)=>{
                        return {text: item, style: 'tableHeader'}
                    });
                    this.options.definition.content.forEach(element => {
                        if (element.table){
                            element.table = _.extend(
                                element.table, {
                                    body: [header].concat(listValue),
                                    width: _.fill(new Array(this.options.fields.length), '*')
                                })
                        }
                    });
                }
                let pdfMake = require('pdfmake/src/printer');
                let printer = new pdfMake(this.options.fonts ? this.options.fonts : {
                    Roboto: {
                        normal : projectRoot + '/fonts/Roboto-Regular.ttf',
                        bold : projectRoot + '/fonts/Roboto-Medium.ttf',
                        italics : projectRoot + '/fonts/Roboto-Italic.ttf',
                        bolditalics : projectRoot + '/fonts/Roboto-Italic.ttf'
                    }
                });
                this.options.data = printer.createPdfKitDocument(this.options.definition);
                resolve(true)
            }catch(e){
                reject(e)
            }
        })
    }

    /**
     * méthode qui permet de parametrer les entêtes et le corps de la réponse HTTP en fonction du type de résult
     * @vreturns {boolean} true pour envoyer la reponse [response.end]
     */
    protected configure(res : Response) : boolean {
        res.contentType(this.mediaType.MIME);
        //res.attachment(this.options.filename);
        res.writeHead(200); //send headers
        this.options.data.pipe(res);
        this.options.data.end();
        return false;
    }
}