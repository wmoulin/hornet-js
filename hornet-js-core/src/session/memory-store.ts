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

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
const logger: Logger = Utils.getLogger("hornet-js-core.session.memory-store");

import { Session } from "src/session/session";
import { Store } from "src/session/store";

/* istanbul ignore next */
var defer = typeof setImmediate === "function" ? setImmediate : function (fn, a?, b?) {
    process.nextTick(fn.bind.apply(fn, arguments));
};


export class MemoryStore extends Store {
    private sessions:any;
    private expiredCheckInterval:number;
    private lastExpiredCheck:number = 0;

    /**
     * Constructor
     * @param expiredCheckInterval the interval in ms to check / delete expired sessions (default: 60000ms)
     */
    constructor(expiredCheckInterval = 60000) {
        super();
        this.expiredCheckInterval = expiredCheckInterval;
        this.sessions = Object.create(null);
    }


    /**
     * Describe if the 'touch' method is implemented or not by this kind of store
     *
     * @returns {boolean}
     */
    isTouchImplemented():boolean {
        return true;
    }

    /**
     * Clear all sessions.
     *
     * @param {function} fn
     * @public
     */
    clear(fn:Function) {
        this.sessions = Object.create(null);
        fn && defer(fn);
    }

    /**
     * Destroy the session associated with the given session ID.
     *
     * @param {Session} session
     * @param {function} fn
     * @public
     */
    destroy(session:Session, fn:Function) {
        logger.trace("destroying session :", session.getId());
        delete this.sessions[session.getId()];
        fn && defer(fn);
    }

    /**
     * Fetch session by the given session ID.
     *
     * @param {string} sid
     * @param {function} fn
     * @public
     */
    get(sid:string, fn:Function) {
        this.checkExpired();
        defer(fn, null, this.sessions[sid]);
    }

    /**
     * Get number of active sessions.
     *
     * @param {function} fn
     * @public
     */
    length(fn) {
        fn && defer(fn, null, Object.keys(this.sessions).length);
    }

    set(session:Session, fn:Function) {
        logger.trace("saving session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    }

    touch(session:Session, fn:Function) {
        logger.trace("touching session", session);
        this.sessions[session.getId()] = session;
        fn && defer(fn);
    }

    private checkExpired() {
        var now = Date.now();
        if (now - this.lastExpiredCheck > this.expiredCheckInterval) {
            this.lastExpiredCheck = now;
            logger.trace("checking expired sessions");
            Object.keys(this.sessions).forEach((sid) => {
                var session:Session = this.sessions[sid];
                if (now - session.getLastAccessTime().getTime() > session.getMaxInactiveInterval()) {
                    logger.trace("session #" + session.getId() + " expired => removed from the MemoryStore");
                    session.invalidate(()=> {});
                }
            });
        }
    }
}
