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
 * hornet-js-utils - Partie commune et utilitaire à tous les composants hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as fs from "fs";
import * as https from "https";
import * as _ from "lodash";

/**
 * Interface décrivant une clé privée SSL
 */
export interface KeyOptions {
    file: string;
    passphrase?: string;
}

/**
 * Interface décrivant un conteneur de clés au format PKCS12
 */
export interface PKCS12Options {
    file: string;
    passphrase: string;
}

/**
 * Interface décrivant les options permettants de configurer le keystore
 */
export interface KeyStoreOptions {
    CAs?: Array<string>;
    CERTs?: Array<string>;
    KEYs?: Array<KeyOptions>;
    PKCS12?: PKCS12Options;
}

/**
 * Interface décrivant les options nodejs sur l'agent Https
 */
export interface AgentOptions {
    keepAlive?: boolean;
    keepAliveMsecs?: number;
    maxSockets?: number;
    maxFreeSockets?: number;
}

/**
 * Classe d'aide à la configuration de keystore pour des requêtes clients nodejs
 */
export class KeyStoreBuilder {

    /**
     * Construit un Agent https natif nodejs
     * @param agentOptions
     * @param keyStoreOptions
     * @returns {https.Agent}
     */
    public static buildHttpsAgent(agentOptions: AgentOptions = {}, keyStoreOptions: KeyStoreOptions = {}) {
        let CAs = KeyStoreBuilder.buildCAs(keyStoreOptions.CAs);
        let CERTs = KeyStoreBuilder.buildCERTs(keyStoreOptions.CERTs);
        let KEYs = KeyStoreBuilder.buildKEYs(keyStoreOptions.KEYs);
        let PKCS12 = KeyStoreBuilder.buildPKCS12(keyStoreOptions.PKCS12);

        let options = _.assign({}, agentOptions, {
            ca: CAs,
            cert: CERTs,
            key: KEYs
        }, PKCS12);

        return new https.Agent(options);
    }

    /**
     * Construit un Agent https natif nodejs et le défini comme agent par défaut
     * @param agentOptions
     * @param keyStoreOptions
     */
    public static setHttpsGlobalAgent(agentOptions?: AgentOptions, keyStoreOptions?: KeyStoreOptions) {
        (<any> https).globalAgent = KeyStoreBuilder.buildHttpsAgent(agentOptions, keyStoreOptions);
    }

    /**
     * Construit l'objet de configuration des autorités de certification
     * @param CAs
     * @returns {Array}
     */
    private static buildCAs(CAs: Array<string> = []) {
        let build = [];
        CAs.forEach((ca) => {
            try {
                build.push(fs.readFileSync(ca));
            } catch (e) {
                throw new Error("CA file '" + ca + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des certificats dans le cas d'authentification SSL
     * @param CERTs
     * @returns {Array}
     */
    private static buildCERTs(CERTs: Array<string> = []) {
        let build = [];
        CERTs.forEach((cert) => {
            try {
                build.push(fs.readFileSync(cert));
            } catch (e) {
                throw new Error("CERT file '" + cert + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des clés privées dans le cas d'authentification SSL
     * @param KEYs
     * @returns {Array}
     */
    private static buildKEYs(KEYs: Array<KeyOptions> = []) {
        let build = [];
        KEYs.forEach((key) => {
            try {
                let keyFile = fs.readFileSync(key.file);
                if (key.passphrase) {
                    build.push({
                        pem: keyFile,
                        passphrase: key.passphrase
                    });
                } else {
                    build.push(keyFile);
                }
            } catch (e) {
                throw new Error("KEY file '" + key.file + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des certificats/clés privées dans le cas d'authentification SSL
     * @param PKCS12
     * @returns {Object}
     */
    private static buildPKCS12(PKCS12: PKCS12Options = {file: null, passphrase: null}) {
        let build = null;
        if (PKCS12.file != null) {
            try {
                var p12File = fs.readFileSync(PKCS12.file);
                build = {
                    pfx: p12File,
                    passphrase: PKCS12.passphrase
                };
            } catch (e) {
                throw new Error("PKCS12 file '" + PKCS12.file + "' cannot be read : " + e);
            }
        }
        return build;
    }
}

