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
 * hornet-js-bean - Ensemble des décorateurs pour les beans hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as _ from "lodash";
import { ObjectUtils } from "hornet-js-utils/src/object-utils";

export default function(target) {

    if (!target.prototype.__pull__){
        target.prototype.__pull__ = function(options){

            //liste des champs à mapper
            let destMap = JSON.parse(this.__proto__.__mapFields__?this.__proto__.__mapFields__:null);

            //instance à mapper
            let object = options.object;

            //option permettant de serialiser les objects
            //et ainsi supprimer les attributs non désirables dans la réponse
            if (options.serialize){
                for(let key in this){
                    if (this[key] != "function") {
                        delete this[key];
                    }
                }
            }


            if (destMap) {
                for(let idxField = 0; idxField < destMap.length; idxField++) {
                    let result;
                    //nom de la propriété courante
                    let fieldName = destMap[idxField];
                    //valeur de la propriété
                    let prop = object[fieldName];

                    //Y a t'il un alias sur la propriété
                    let mapAlias = JSON.parse(this.__proto__.__alias__?this.__proto__.__alias__:null);
                    if (mapAlias && mapAlias[fieldName]){
                        let alias = mapAlias[fieldName];
                        _.each(alias, (value) => {
                            let val;
                            try{
                                //val = eval('object.'+value);
                                val = ObjectUtils.getSubObject(object, value)
                            }catch(e){
                                //nothing
                            }
                            if (val){
                                prop = val;
                                return false;
                            }
                        })
                    }

                    //Phase de copie
                    //si on a un Array ou un Object on instancie la classe cible
                    //sinon on fait une copie brute.
                    if ((prop instanceof Object && this.__proto__.__mapClass__[fieldName]) || prop instanceof Array){

                        let Clazz =  this.__proto__.__mapClass__[fieldName];
                        if (prop instanceof Array) {
                            result = [];
                            prop.forEach(res => {
                                if (Clazz) {
                                    result.push(new Clazz().__pull__(_.extend(options, {object: res})));
                                }else{
                                    result.push(res);
                                }
                            })
                        }else{
                            result=new Clazz().__pull__(_.extend(options, {object : prop}));
                        }
                        this[fieldName] = result;
                    }else{
                        this[fieldName] = prop;
                    }
                }
            }
            return this;
        }
    }

    if (!target.prototype.clone) {
        target.prototype.clone = function (options) {
            let res;
            if (options.deep){

                res = _.cloneDeep(this);
            }else{
                res = _.clone(this);
            }
            return res;
        }
    }
    if (!target.prototype.map) {
        target.prototype.map = function (options) {
            return this.__pull__(_.extend(options, {serialize : false}));
        }
    }

    if (!target.prototype.serialize) {
        target.prototype.serialize = function (options) {
            return this.__pull__(_.extend(options, {serialize : true}));
        }
    }
};