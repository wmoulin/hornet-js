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
 * hornet-js-test - Ensemble des composants pour les tests hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as path from "path";
import * as Log4jsNode from "log4js";
import * as _ from "lodash";
import * as cheerio from "cheerio";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as fs from "fs";

chai.use(sinonChai);

export class TestUtils {
    static chai = chai;
    static sinon = sinon;

    static randomString(strLength: number = 5, charSet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
        var result: string[] = [];

        while (strLength--) {
            result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
        }
        return result.join("");
    }

    /**
     * Permet de démarrer une application Express sur le port premier port disponible à partir du port donné.
     * Si l'application a bien démarrée, la fonction done est appellée avec l'instance de serveur et le port utilisé.
     * Sinon, la fonction done est appellée
     *
     * @param app l'application Express
     * @param port Le port initialement souhaité
     * @param done la fonction à appeller lorsque l'application est démarré
     */
    static startExpressApp(app: any, port: number, done: (server: any, port: number, err: string) => void): void {
        //  const logger: Logger = TestUtils.getLoggerFunction("TestUtil");
        var _port: number = port;
        var max: number = 10;

        function doStart() {
            var server = app && app.listen(_port, function() {
                console.log("Serveur démarré sur le port", _port);
                done(server, _port, undefined);
            })
                .on("error", function errStart(err) {
                    if (err.code === "EADDRINUSE") {
                        if (max-- > 0) {
                            _port++;
                            console.log("Adresse déjà utilisée, nouvelle tentative avec le port", _port);
                            setTimeout(doStart, 250);
                        } else {
                            done(undefined, undefined, "Aucune adresse disponible dans la plage " + port + "-" + _port);
                        }
                    }
                });
        }

        doStart();
    }

    static startTest(test: string | number): void {
        console.log("******************************************");
        console.log("test", test);
        console.log("******************************************");
    }
}


