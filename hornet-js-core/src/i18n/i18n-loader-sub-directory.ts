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

import * as fs from "fs";
import * as path from "path";
import { JSONLoader } from "hornet-js-utils/src/json-loader";
import * as _ from "lodash";

import { I18nLoader, II18n } from "src/i18n/i18n-loader";

/**
 * Classe utilisée uniquement côté serveur.
 */
export class I18nLoaderSubDirectory extends I18nLoader {

    messagesLang = {};
    allLocales: Array<{langShort: string, locale: string, langLabel:string}>;

    constructor(public pathsLang?: Array<string>) {
        super(null, false);
        if (!pathsLang) {
            this.pathsLang = [path.join(path.parse(require.main.filename).dir, "src", "resources")];
        }
        this.loadSubDirectoryMessages();
    }

    /** Méthode qui retourne la langue selectionné
     * @returns {string[]}
     */
    loadSubDirectoryMessages(locales?: Array<II18n>): any {
        /**
         *  Extraits les messages de fichiers, de base de données....
         *  Doit retourner un flux JSON conforme au module react-intl.
         */
        // par défaut on charge le fichier hornet-messages
        this.messagesLang["default"] = {locale: undefined, lang: "", messages: require("./hornet-messages-components.json")};

        /** chargement des fichiers 'message.json' */
        this.pathsLang.forEach((pathLAng)=>{
            this.getFilesRecursive(pathLAng, "messages.json", this.messagesLang["default"].messages);
        })


        /** verifier sur localeI18n dans defaut.json existe */
        if (locales && locales.length > 0) {
            locales.forEach((locale) => {
                this.pathsLang.forEach((pathLAng)=>{
                    this.messagesLang[locale.locale] = {locale: locale.locale, lang: locale.lang, messages: _.merge({}, this.messagesLang["default"].messages)};
                    this.getFilesRecursive(pathLAng, "messages-" + locale.locale + ".json", this.messagesLang[locale.locale].messages);
                });
            });  
        }
    }

    /** Méthode qui retourne la langue selectionné
     * @returns {string[]}
     */
    getMessages(locales?: II18n): any {

        /**
         *  Extraits les messages de fichiers, de base de données....
         *  Do        if(!locales) {
            return this.messagesLang["default"];
        }it retourner un flux JSON conforme au module react-intl.
         */

        if(this.messagesLang[locales.locale]) {
            return this.messagesLang[locales.locale];
        }

        if(!locales) {
            return this.messagesLang["default"];
        }

        let localMessage = {};
        _.merge(localMessage, this.messagesLang["default"]);

        /** verifier sur localeI18n dans defaut.json existe */
        if (locales && locales.locale) {
            this.pathsLang.forEach((pathLAng)=>{
                this.getFilesRecursive(pathLAng, "messages-" + locales.locale + ".json", localMessage);
            })
        }
        this.messagesLang[locales.locale] = {locale: locales.locale, lang: locales.lang, messages: localMessage};
        return this.messagesLang[locales.locale];
    }

    /** Méthode qui liste les langues disponibles dans le dossier resources
     * @returns {string[]}
     */
    getLocales(): Array<{langShort: string, locale: string, langLabel: string}> {
        
        if(!this.allLocales) {

            let locales = {};
            this.allLocales = [];

            this.pathsLang.forEach((folder)=>{
                this.getLocalesRecusive(folder, locales as [string, {langShort: string, locale: string, langLabel:string}]);
            });

            for(let locale in locales) {
                this.allLocales.push(locales[locale]);
            }
        }

        return this.allLocales;
    }

    /** Méthode qui liste les langues disponibles dans le dossier resources
     * @returns {string[]}
     */
    protected getLocalesRecusive(folder: string, locales: [string, {langShort: string, locale: string, langLabel:string}]): void {
            
        let regx = /^messages-([a-zA-Z\-]+)\.json$/;
        
        if(fs.existsSync(folder)) {
            let childDirs = [];
            var fileContents = fs.readdirSync(folder),
                stats;
        
            fileContents.forEach((fileName) => {
                stats = fs.lstatSync(folder + '/' + fileName);
        
                if (stats.isDirectory()) {
                    this.getLocalesRecusive(path.join(folder, fileName), locales)
                } else {
                    let match = fileName.match(regx);
                    if(match) {
                        let jsonMessage = JSONLoader.load(path.join(folder, fileName), "UTF-8");
                        let listShort = match[1].split("-");
                        if(!locales[match[1]]) {
                            locales[match[1]] = {};
                        }
                        _.merge(locales[match[1]], {
                            langShort: listShort[1],
                            locale: match[1],
                            langLabel: jsonMessage.labelLanguage || listShort[1]
                        });
                    }
                }

            });
        }

    }

    getFilesRecursive(folder: string, searchFileName: string, messages: {}) {
        if(fs.existsSync(folder)) {
            let childDirs = [];
            var fileContents = fs.readdirSync(folder),
                stats;
        
            fileContents.forEach((fileName) => {
                stats = fs.lstatSync(folder + '/' + fileName);
        
                if (stats.isDirectory()) {
                    childDirs.push( path.join(folder, fileName));
                } else {
                    if(fileName == searchFileName) {
                        _.merge(messages, require(path.join(folder, fileName)));
                    }
                }

                childDirs.forEach((childDir)=> {this.getFilesRecursive(childDir, searchFileName, messages)});
            });
        }
    };
}

