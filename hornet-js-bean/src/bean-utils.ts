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

import {TechnicalError} from "hornet-js-utils/src/exception/technical-error";
import * as _ from "lodash";
import { Register } from "hornet-js-utils/src/common-register";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";
"use strict";

enum Methods {
    serialize,
    map,
    clone
}

var logger = Register.getLogger("hornet-js-utils.bean-utils");
export class BeanUtils {

    protected static _call(options) {
        let object : Object = options.object;
        let method : Methods = options.method;
        let clazz = options.clazz;
        let result;

        //dans le cas du clone, il n'y a pas de mapping vers une autre classe
        let target = (method == Methods.clone) ? object : new clazz();

        //appel aux fonctions de mapping
        //et (petite) gestion des erreurs
        if (object instanceof Object){
            let fn = target[Methods[method]];
            if (typeof fn === 'function') {
                result = fn.apply(target, [options]);
            } else {
                if (typeof target.pull != 'function'){
                    let msg: string = _.join(['Cannot find @Bean for object :', clazz ? clazz.name : '', '.So, we cannot transform it to an object'], ' ');
                    logger.error(msg);
                    throw new TechnicalError('ERR_TECH_' + CodesError.BINDING_ERROR, {errorMessage: CodesError.DEFAULT_ERROR_MSG});
                }else {
                    result = target.pull(options);
                }
            }
        } else {
            let msg: string = _.join(['Cannot find @Bean for object :', object, '.So, we cannot transform it to an object', clazz ? clazz.name : ''], ' ');
            logger.error(msg);
            throw new TechnicalError('ERR_TECH_' + CodesError.BINDING_ERROR, {errorMessage: CodesError.DEFAULT_ERROR_MSG});
        }
        return result;
    }

    protected static _beforeCall(options){
        //création d'une promesse
        return new Promise((resolve, reject)=> {

            let method: Methods = options.method;
            let clazz = options.clazz;
            let object: Object = options.object;
            let config: Object = options.config;

            try {

                let result;
                //Cas particuliers qui doivent retourner undefined
                if (!clazz && method!=Methods.clone || !object || typeof  object == 'function') {
                    resolve();
                    return;
                }


                if (object instanceof Array) {
                    //Mapping pour un Array
                    result = [];
                    object.forEach(res => {
                        result.push(BeanUtils._call({method :method, clazz : clazz, object : res, config : config}));
                    })
                } else {
                    //Mapping pour un object
                    result = BeanUtils._call({method :method, clazz : clazz, object : object, config : config});
                }
                 resolve(result);
            }catch (e) {
                let error = e;
                if (!(e instanceof TechnicalError)){
                    let msg: string = _.join(['Cannot bind', object, 'to an object', clazz.name], ' ');
                    error = new TechnicalError('ERR_TECH_BINDING', {message: msg}, e);
                }
                logger.error(e);
                reject(error)
            }
        })
    }

    /**
     * Méthode statique qui permet de mapper un objet <source> vers un objet de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static mapObject(targetClass, source, options?) : Promise<any>{
        return BeanUtils.map(targetClass, source, options)
        
    }

    /**
     * Méthode statique qui permet de mapper un tableau <source> vers un tableau de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static mapArray(targetClass, source, options?) : Promise<any>{
        return BeanUtils.mapObject(targetClass, source, options)
    }

    /**
     * Méthode statique qui permet de mapper une instance vers un objet de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static map(targetClass, source, options?) : Promise<any>{
        return BeanUtils._beforeCall({method :Methods.map, clazz : targetClass, object : source, config : options});
    }

    /**
     * Méthode statique qui permet de sérialiser un objet <source> vers un objet de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static serializeObject(targetClass, source, options?) : Promise<any>{
        return BeanUtils.serialize(targetClass, source, options)
    }

    /**
     * Méthode statique qui permet de sérialiser un tableau <source> vers un tableau de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static serializeArray(targetClass, source, options?) : Promise<any>{
        return BeanUtils.serializeObject(targetClass, source, options)
    }

    /**
     * Méthode statique qui permet de sérialiser une instance vers un objet de type <targetClass>
     * @param targetClass : la classe cible
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static serialize(targetClass, source, options?) : Promise<any>{
        return BeanUtils._beforeCall({method :Methods.serialize, clazz : targetClass, object : source, config : options});
    }

    /**
     * Méthode statique qui permet de cloner un objet <source> vers un nouvel objet de même type
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static cloneObject(source, options?) : Promise<any>{
        return BeanUtils.clone(source, options)

    }

    /**
     * Méthode statique qui permet de cloner un tableau <source> vers un nouveau tableau de même type
     * @param source : instance à copier
     * @param options : options
     * vers un tableau de type <targetClass>@returns Promise
     */
    static cloneArray(array, options?) : Promise<any>{
        return BeanUtils.cloneObject(array, options)
    }

    /**
     * Méthode statique qui permet de cloner une instance vers un nouvel objet de même type
     * @param source : instance à copier
     * @param options : options
     * @returns Promise
     */
    static clone(source, options?) : Promise<any>{
        return BeanUtils._beforeCall({method :Methods.clone, object : source, config : options});
    }

}