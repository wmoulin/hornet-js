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

import { Promise } from "hornet-js-utils/src/promise-api";
import { Logger } from "hornet-js-utils/src/logger";
import { TechnicalError } from "hornet-js-utils/src/exception/technical-error";
import { Utils } from "hornet-js-utils";
import { CodesError } from "hornet-js-utils/src/exception/codes-error";
import * as _ from "lodash";
import { I18nUtils } from "hornet-js-utils/src/i18n-utils";

const nodemailer = require("nodemailer");

const logger: Logger = Utils.getLogger("hornet-js.hornet-js-core.src.mail.mailer");

export interface NodeMailerMessage {
    /** The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted ’“Sender Name” sender@server.com‘, see Address object for details */
    from: string;
    /** Comma separated list or an array of recipients email addresses that will appear on the To: field */
    to: string | any[];
    /** Comma separated list or an array of recipients email addresses that will appear on the Cc: field */
    cc?: string | any[];
    /** Comma separated list or an array of recipients email addresses that will appear on the Bcc: field */
    bcc?: string | any[];
  	/** An e-mail address that will appear on the Reply-To: field */
	replyTo?: string;
	/** The message-id this message is replying */
    inReplyTo?: string;
	/** Message-id list (an array or space separated string) */
    references?: string|string[];
    /** The subject of the email */
  	subject: string;
    /** The plaintext version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘/var/data/…’}) */
    text: any;
    /** The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘http://…‘}) */
    html?: any;
    /** An array of attachment objects. Attachments can be used for embedding images as well. */
    attachments?: any[];
   	/** optional Message-Id value, random value will be generated if not set */
	messageId?: string;
	/** optional Date value, current UTC string will be used if not set */
    date?: Date;
    /** optional transfer encoding for the textual parts (defaults to 'quoted-printable') */
	encoding?: string;
}

export class Mailer {

    static defaultOptions = {
        host: Utils.config.getOrDefault("mail.config.host", undefined),
        port: Utils.config.getOrDefault("mail.config.port", 25),
        secure: Utils.config.getOrDefault("mail.config.secure", false),
        connectionTimeout: Utils.config.getOrDefault("mail.config.connectionTimeout", 350000),
        auth: Utils.config.getOrDefault("mail.config.auth", undefined),
        logger: logger
    };

    private static _instance: Mailer;

    private constructor() {
    }

    static get Instance() {
        return this._instance || (this._instance = new this());
    };

    protected transport;

    getSmtp(options?) {
        if (!this.transport) {
            let conf = Mailer.defaultOptions;
            if (options) {
                _.assignIn(conf, options);
                logger.trace("NodeMailerTransport :", JSON.stringify(conf));
            }
            this.transport = nodemailer.createTransport(conf);
        }
        return this.transport;
    }

    static sendMail(data: NodeMailerMessage, options?): Promise<any> {
        logger.trace("Sending Mail...");
        return new Promise<any>((resolve, reject) => {
            return Mailer.Instance.getSmtp(options).sendMail(data).then((info) => {
                Mailer.Instance.getSmtp().close();
                resolve(info.response);
            }).catch((error) => {
                let errorNumber: number;
                if (error.code == "EAUTH") {
                    errorNumber = CodesError.NODEMAILER_AUTH_ERROR;
                } else if (error.code == "ECONNECTION") {
                    errorNumber = CodesError.NODEMAILER_SERVER_NOTFOUND;
                } else if (error.code == "ETIMEDOUT") {
                    errorNumber = CodesError.NODEMAILER_SERVER_TIMEOUT;
                } else {
                    errorNumber = CodesError.NODEMAILER_UNKNOWN;
                }
                error = new TechnicalError("ERR_TECH_" + errorNumber, null, error);
                error.message = I18nUtils.getI18n("error.message.ERR_TECH_UNKNOWN", {
                    errorMessage: error.err_cause.message,
                    reportId: error.reportId
                });
                logger.error("Erreurs lors de l'envoi de mail :", JSON.stringify(error));
                reject(error);
            });
        });
    }
}
