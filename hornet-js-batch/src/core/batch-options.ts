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
 * hornet-js-batch - Ensemble des composants de gestion de base hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { RouteActionBatch, RouteActionBatchMulti } from "src/routes/abstract-batch-routes";
import { IService } from "hornet-js-core/src/services/service-api";


export interface BatchOptions {
    /**
     *  encoding à utiliser
     */
    encoding?: string;

    /**
     * ensemble des arguments à passer pour lancer le {@link BatchProcess BatchProcess}.
     */
    args?: any;

    /**
     * ensemble de la config à utiliser dans le  {@link BatchProcess BatchProcess}.
     */
    config?: any;

    /**
     * fonction à executer dans le  {@link BatchProcess BatchProcess}.
     */
    service?: Function;

    /**
     * données à utiliser
     */
    data?: any;

    /**
     * contexte à utiliser pour lancer la fonction
     */
    scope?: RouteActionBatch<any, IService> | RouteActionBatchMulti<any, IService>;

}

export interface BatchFileOptions extends BatchOptions {
    /**
     * path du fichier
     */
    filename?: string;
    /**
     * taille du fichier
     */
    size?: number;
}

/**
 * @see CSV Parser Project http://csv.adaltas.com/parse/
 * auto_parse (boolean) If true, the parser will attempt to convert input string to native types.
 * auto_parse_date (boolean) If true, the parser will attempt to convert input string to dates. It requires the "auto_parse" option. Be careful, it relies on Date.parse.
 * columns (array|boolean|function)List of fields as an array, a user defined callback accepting the first line and returning the column names, or true if autodiscovered in the first CSV line. Defaults to null. Affects the result data set in the sense that records will be objects instead of arrays. A value "false" skips the all column.
 * comment (char) Treat all the characters after this one as a comment. Defaults to '' (disabled).
 * delimiter (char) Set the field delimiter. One character only. Defaults to "," (comma).
 * escape (char) Set the escape character. One character only. Defaults to double quote.
 * from, (number) Start returning records from a particular line.
 * ltrim (boolean) If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields). Defaults to false. Does not remove whitespace in a quoted field.
 * max_limit_on_data_read (int) Maximum numer of characters to be contained in the field and line buffers before an exception is raised. Used to guard against a wrong delimiter or rowDelimiter. Default to 128,000 characters.
 * objname (string) Name of header-record title to name objects by.
 * quote (char) Optional character surrounding a field. One character only. Defaults to double quote.
 * relax (boolean) Preserve quotes inside unquoted field.
 * relax_column_count (boolean) Discard inconsistent columns count. Default to false.
 * rowDelimiter (chars|constant) String used to delimit record rows or a special constant; special constants are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
 * rtrim (boolean) If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields). Defaults to false. Does not remove whitespace in a quoted field.
 * skip_empty_lines (boolean) Don't generate records for empty lines (line matching /\s* /, defaults to false.
 *   skip_lines_with_empty_values (boolean) Don't generate records for lines containing empty column values (column matching /\s* /), defaults to false.
 * to, (number) Stop returning records after a particular line.
 * trim If true, ignore whitespace immediately around the delimiter. Defaults to false. Does not remove whitespace in a quoted field. 
 * noHeader : is the csv file contains a header
 * path : file path
 * 
 */
export interface BatchCSVOptions extends BatchFileOptions {
    path: string;
    noHeader?: boolean;
    delimiter?: string;
    columns?: Array<string> | Boolean | Function;
    auto_parse?: boolean;
    auto_parse_date?: boolean;
    comment?: string;
    escape?: string;
    from?: number;
    ltrim?: boolean;
    max_limit_on_data_read?: number;
    objname?: string;
    quote?: string;
    relax?: boolean;
    relax_column_count?: boolean;
    rowDelimiter?: string;
    rtrim?: boolean;
    skip_empty_lines?: boolean;
    skip_lines_with_empty_values?: boolean;
    to?: number;
    trim?: boolean;
}