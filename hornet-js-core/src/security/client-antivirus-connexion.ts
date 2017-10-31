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

/****
 * https://github.com/yongtang/clamav.js/blob/master/README.md
 * Fork
 */

import { SecurityError } from "hornet-js-utils/src/exception/security-error";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { Utils } from "hornet-js-utils";
import { ClientInputChannel } from "src/security/client-input-channel";
//fixme changer l'import var net...
var net = require("net");

export interface ClientAntivirusConnexionProps {

    /**
     *port du serveur clamav
    */
    port: number;
    /**
     * ip du serveur clamav
     */
    host: string;
    /**
     * port du serveur clamav
     */
    timeout: number;

    /**
     * fonctionné à appeler à la fin du traitement.
     */
    complete: Function;
}

/**
 * Classe de connexion entre le client et le serveur
 */
export class ClientAntivirusConnexion {
    /**
     * port du serveur clamav
     */
    port: number;
    /**
     * ip du serveur clamav
     */
    host: string;
    /**
     * port du serveur clamav
     */
    timeout: number;

    /**
     * fonctionné à appeler à la fin du traitement.
     */
    complete: Function;

    constructor(options?: ClientAntivirusConnexionProps) {
        this.port = options ? options.port : undefined || Utils.config.getOrDefault("antivirus.port", 3310);
        this.host = options ? options.host : undefined || Utils.config.getOrDefault("antivirus.host", "localhost");
        this.timeout = options ? options.timeout : undefined || Utils.config.getOrDefault("antivirus.timeout", 60000);
        this.complete = options ? options.complete : undefined || function (stream) { }
    }

    /**
     *
     * @param stream le flux du fichier
     * @returns {Promise<Buffer>|Promise}
     */
    public scan(stream) {
        return new Promise((resolve, reject) => {
            let socket = new net.Socket();
            socket.setTimeout(this.timeout);
            let status = "";
            let buffers = [];
            let res;
            socket.connect(this.port, this.host, () => {
                var channel = new ClientInputChannel();
                stream.on("data", (buffer) => {
                    buffers.push(buffer);
                });
                stream.on("end", () => {
                    res = Buffer.concat(buffers)
                });
                stream.pipe(channel).pipe(socket).on("end", () => {
                    this.complete(stream);
                }).on("error", (err) => {
                    reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_UNKNOWN, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError(err)));
                    this.complete(stream);
                });
            }).on("data", (data) => {
                status += data;
                if (data.toString().indexOf("\n") !== -1) {
                    socket.destroy();
                    status = status.substring(0, status.indexOf("\n"));
                    var result = status.match(/^stream: (.+) FOUND$/);
                    if (result !== null) {
                        reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_INFECTED, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError(result[ 1 ])));
                    }
                    else if (status === "stream: OK") {
                        resolve(res);
                    }
                    else {
                        result = status.match(/^(.+) ERROR/);
                        if (result != null) {
                            reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_UNKNOWN, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError("CLAMAV-SCAN-ERROR", [ { msg: result[ 1 ] }])));
                        }
                        else {
                            reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_RESPONSE_MALFORMED, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError("CLAMAV-SCAN-ERROR")));
                        }
                    }
                }
            }).on("error", (err) => {
                socket.destroy();
                reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_RESPONSE_MALFORMED, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError(err)));
            }).on("timeout", () => {
                socket.destroy();
                reject(new TechnicalError("ERR_TECH_" + CodesError.CLAMAV_SCAN_TIMEOUT, { errorMessage: CodesError.DEFAULT_ERROR_MSG }, new SecurityError("CLAMAV-SCAN-ERROR")));
            }).on("close", () => { });
        })
    }
}

