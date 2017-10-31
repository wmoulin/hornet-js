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

import * as cookie from "cookie";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { IncomingMessage, ServerResponse } from "http";

var signature = require("cookie-signature");

const logger: Logger = Utils.getLogger("hornet-js-core.session.cookie-manager");

export interface CookieManagerOption {
    secret?: string;
    route?: string;
    maxAge?: number;
    path?: string;
}

/**
 * classe de gestion des cookies
 */
export class CookieManager {

    /**
     * Recupère un cookie de la requête
     * @param {IncomingMessage} req - requete http
     * @param {string} name - nom du cookie
     * @param {CookieManagerOption} [options] - options de récupération du cookie
     */
    static getCookie(req:IncomingMessage, name, options?: CookieManagerOption):any {
        
        var header = req.headers.cookie;
        var raw;
        var val;
        var cookieOpt = options || {}
        , secret = cookieOpt.secret || ""
        , route = cookieOpt.route || null

        var cookieRoute = route ? "." + route : null;

        // read from cookie header
        if (header) {
            var cookies = cookie.parse(header);

            raw = cookies[name];
            // sticky session management
            if (cookieRoute && raw && raw.indexOf(cookieRoute, raw.length - cookieRoute.length) > -1) {
                raw = raw.substr(0, raw.length - cookieRoute.length);
            }

            if (raw) {
                if (secret.length > 0 && raw.substr(0, 2) === "s:") {
                    val = CookieManager.unsignCookie(raw.slice(2), secret);

                    if (val === false) {
                        logger.debug("cookie signature invalid");
                        val = undefined;
                    }
                } else {
                    val = raw;
                }
            }
        }

        return val;
    }

    /**
     * ajoute un cookie à la réponse response.
     * @param {ServerResponse} res - reponse http
     * @param {string} name - nom du cookie
     * @param {object} value - valeur du cookie
     * @param {CookieManagerOption} [options] - options de récupération du cookie
     */
    static setCookie(res:ServerResponse, name:string, value:any, options?:CookieManagerOption):void {
        
        let cookieOpt = options || {};
        
        if (!cookieOpt.maxAge) {
            cookieOpt.maxAge = Utils.config.getOrDefault("cookie.defaultDuration", 3600);
        }
        if (!cookieOpt.path) {
            cookieOpt.path = Utils.getContextPath();
        }

        let cookieValue = cookieOpt.secret && cookieOpt.secret.length > 0 ? "s:" + signature.sign(value, cookieOpt.secret) : value;
        
        var data = cookie.serialize(name, cookieValue, cookieOpt);

        logger.trace("set-cookie", data);

        var prev = res.getHeader("set-cookie") || [];
        var header = Array.isArray(prev) ? prev.concat(data)
            : Array.isArray(data) ? [prev].concat(data)
            : [prev, data];

        res.setHeader("set-cookie", header)
    }


    /**
     * Verification et decode la valeur suivant une code.
     *
     * @param {String} val - valeur
     * @param {String} secret - code
     * @returns {String|Boolean}
     */
    static unsignCookie(val:string, secret:string):String|Boolean {
        var result = signature.unsign(val, secret);

        if (result !== false) {
            return result;
        }

        return false;
    }

    /**
     * supprime un cookie .
     * @param {ServerResponse} res - reponse http
     * @param {string} name - nom du cookie
     */
    static removeCookie(res, name) {
        CookieManager.setCookie(res, name, "", {maxAge: 0});
    }

}