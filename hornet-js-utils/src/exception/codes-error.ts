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

export class CodesError {
    static DEFAULT_ERROR_MSG: string = "Erreur inattendue.";
    /**
     * codes error SEQUELIZE 10000 - 10099
     */
    static SEQUELIZE_CONNECTION_REFUSED: number = 10001;
    static SEQUELIZE_HOST_NOT_FOUND: number = 10002;
    static SEQUELIZE_HOST_NOT_REACHABLE: number = 10003;
    static SEQUELIZE_INVALID_CONNECTION: number = 10004;
    static SEQUELIZE_CONNECTION: number = 10005;
    static SEQUELIZE_INSTANCE_ERROR: number = 10006;
    static SEQUELIZE_CONNECTION_TIMEOUT: number = 10007;
    static SEQUELIZE_TIMEOUT_ERROR: number = 10008;
    static SEQUELIZE_ACCESSDENIED: number = 10009;
    static SEQUELIZE_CONNECTION_ERROR: number = 10010;
    static SEQUELIZE_EXCLUSION_ERROR: number = 10011;
    static SEQUELIZE_FOREIGN_KEY_ERROR: number = 10012;
    static SEQUELIZE_VALIDATION_ERROR: number = 10013;
    static SEQUELIZE_UNIQUE_ERROR: number = 10014;
    static SEQUELIZE_DATABASE_ERROR: number = 10015;

    /**
     * codes error BINDING 10100 - 10199
     */
    static BINDING_ERROR: number = 10101;

    /**
     * codes error BINDING 10200 - 10299
     */
    static ROUTE_ERROR: number = 10201;

    /**
     * codes error DATASOURCE 10300 - 10399
     */
    static DATASOURCE_FETCH_ERROR: number = 10301;
    static DATASOURCE_SORT_ERROR: number = 10302;
    static DATASOURCE_FILTER_ERROR: number = 10303;
    static DATASOURCE_ADD_ERROR: number = 10304;
    static DATASOURCE_DELETE_ERROR: number = 10305;
    static DATASOURCE_RESPONSE_ERROR: number = 10306;

    /**
     * codes error INJECT 10400 - 10499
     */
    static INJECT_ERROR: number = 10400;
    static INJECT_ALREADY_DEFINED_ERROR: number = 10401;
    static INJECT_NOT_DEFINED_ERROR: number = 10402;

    /**
     * codes error NODEMAILER 10500 - 10599
     */
    static NODEMAILER_AUTH_ERROR: number = 10500;
    static NODEMAILER_SERVER_NOTFOUND: number = 10501;
    static NODEMAILER_SERVER_TIMEOUT: number = 10502;
    static NODEMAILER_UNKNOWN: number = 10599;

    /**
     * codes error CLAMAV 10600 - 10699
     */
    static CLAMAV_SCAN_INFECTED: number = 10600;
    static CLAMAV_SCAN_REMOVE: number = 10601;
    static CLAMAV_SCAN_TIMEOUT: number = 10602;
    static CLAMAV_SCAN_RESPONSE_MALFORMED: number = 10603;
    static CLAMAV_SCAN_UNKNOWN: number = 10604;

    /**
     * code error BATCH 10700 - 10799
     */
    static BATCH_OPTIONS_UNDEFINED: number = 10700;

}

