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

import { Register } from "src/common-register";
import * as moment from "moment-timezone";
import Moment = moment.Moment;

let logger = Register.getLogger("hornet-js-utils.date-utils");

export class DateUtils {

    static TZ_EUROPE_PARIS = "Europe/Paris";

    static default_locale = "fr-FR";
    /**
     * Formats de date en année, mois, jour
     */
        // TODO tetaudf améliorer en enum
    static YMD_Formats: Array<string> = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD", "YYYY-MM-DD"];

    /**
     *  On s'assure que le fuseau horaire utilisé est le même que dans l'interpréteur javascript
     *  @param calendarLocale objet de configuration des calendriers et dates : doit etre non nul
     */
    static initTimeZone(calendarLocale: any): void {
        /* (le signe est inversé car Date().getTimezoneOffset() renvoie (temps UTC - temps local) ce qui donne par exemple -60 en hiver en zone UTC+1*/
        if (calendarLocale) {
            calendarLocale.timezoneOffset = -new Date().getTimezoneOffset();
        }
    }

    /**
     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant le format spécifié et la locale indiquée
     * @param dateStr chaîne de caractères représentant une date. Doit être non nulle.
     * @param dateFormat format de date à utiliser. Doit être non nul.
     * @param locale locale
     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
     */

    private static parseWithFormat(dateStr: string, dateFormat: string, locale?: any, exact?: boolean): any {
        let calendar: any;
        if (dateStr && dateFormat) {
            calendar = moment(dateStr, dateFormat, exact);
            if (!calendar.isValid()) {
                calendar = undefined;
            } else {
                let newLocale = locale ? locale : DateUtils.default_locale;
                calendar.locale(newLocale);
            }
        }
        return calendar;
    }


    /**
     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant le format spécifié dans la locale indiquée : calendarLocale.dateFormat
     * @param dateStr chaîne de caractères représentant une date
     * @param calendarLocale configuration locale des dates
     * @param locale locale
     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
     */
    static parse(dateStr: string, calendarLocale: any, locale?: any): any {
        logger.trace("Date à parser : ", dateStr);

        let calendar: any;

        if (dateStr && calendarLocale) {
            try {
                calendar = DateUtils.parseWithFormat(dateStr, calendarLocale.dateFormat, locale, false);
            } catch (err) {
                logger.trace("Erreur pour parser au format local la date suivante : ", dateStr);
            }
        }

        return calendar;
    }

    /**
     * Crée un objet Moment à partir de la chaîne de caractère dateStr et en utilisant les formats de date spécifiés et la locale indiquée.
     * Lorsque dateFormats n'est pas défini ou est vide, on utilise calendarLocale.dateFormat.
     * @param dateStr chaîne de caractères représentant une date
     * @param dateFormats formats de date compatibles Moment
     * @param calendarLocale  configuration locale des dates
     * @param locale locale
     * @returns {Moment} un objet Moment correspondant à dateStr ou undefined en cas d'erreur
     */
    static parseMultipleFmt(dateStr: string, dateFormats: Array<string>, calendarLocale: any, locale?: any): any {
        logger.trace("Date à parser : ", dateStr);
        let calendar: any;

        if (dateStr && calendarLocale) {
            if (!dateFormats || dateFormats.length < 1) {
                calendar = DateUtils.parse(dateStr, calendarLocale, locale);
            } else {

                let index: string;
                for (index in dateFormats) {
                    try {
                        calendar = DateUtils.parseWithFormat(dateStr, dateFormats[index], locale, true);
                    } catch (err) {
                        logger.debug("Erreur pour parser la date avec le format : ", dateFormats[index]);
                    }
                    if (calendar) {
                        break;
                    }
                }
                if (!calendar) {
                    logger.trace("La date n'a pu être parsée avec aucun des formats indiqués");
                }
            }
        }
        return calendar;
    }

    /**
     * Anlyse la chaîne de caractères indiquée et essaie de créer l'objet Date correspondant.
     * @param dateStr chaîne de caractères représentant une date
     * @param format le format de la date au format Moment
     * @param timezone le fuseau horaire sur lequel formatter la date (Europe/Paris, America/Los_Angeles,
     * Australia/Sydney, ...). Par défaut : le fuseau horaire du navigateur/serveur node est utilisé
     * @param locale codes langue et pays (fr_FR, en_US, ...). Par défaut : fr_FR
     * @returns {Date} une instance de Date ou undefined en cas d'erreur
     */
    static parseInTZ(dateStr: string, format: string, timezone?: string, locale: string = "fr_FR"): Date {
        logger.trace("parseInTZ(dateStr, format, timezone, locale):string", dateStr, format, timezone, locale);

        let parsed: Date;
        try {
            let mdate: Moment = moment.tz(dateStr, format, true, timezone).locale(locale);
            if (mdate.isValid()) {
                parsed = mdate.toDate();
                if (DateUtils.YMD_Formats.indexOf(format) >= 0 && timezone == DateUtils.TZ_EUROPE_PARIS) {
                    // la date est instanciée avec le fuseau local (UTC+2).
                    // L'heure étant 00h00, la date UTC (renvoyee par getTime) correspond au jour precedent à 22h (15/04/2014)
                    // afin d'éviter le problème on instancie la date sur le fuseau UTC
                    parsed = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
                }
            }
        } catch (err) {
            logger.trace("Erreur pour formater la date suivante : ", err);
        }
        logger.trace("Date parsée : ", parsed + "  -- à partir de la chaîne ", dateStr, ", du fuseau horaire ",
            timezone, " et de la locale", locale);
        return parsed;
    }

    /**
     * Crée un objet Date à partir de la chaîne de caractères indiquée en utilisant la fonction Date.parse(str)
     * @param dateStr chaîne de caractères représentant une date générée par Date.toString(), Date.toUTCString(), Date.toISOString() ou Date.toLocaleString()
     * @returns {Date} un objet Date ou undefined en cas d'erreur
     */
    static stdParse(dateStr: string): Date {
        let date: Date;
        if (dateStr) {
            try {
                date = new Date(Date.parse(dateStr));
            } catch (err) {
                logger.trace("Erreur pour parser la date suivante : ", dateStr);
            }
        }
        return date;
    }

    /**
     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
     * @param time temps en millisecondes UTC depuis 'epoch'
     * @param calendarLocale locale
     * @returns {string} la chaîne de caractères formatée suivant calendarLocale.dateFormat ou une chaîne vide en cas d'erreur
     */
    static format(time, calendarLocale: any): string {
        logger.trace("format(time, calendarLocale):string", time);

        let strValue = "";
        try {
            let calendar = moment(time);
            strValue = calendar.format(calendarLocale.dateFormat);
        } catch (err) {
            logger.trace("Erreur pour formater la date suivante : ", err);
        }
        logger.trace("Date formatée : ", strValue + " -- à partir de la valeur", time);
        return strValue;
    }

    /**
     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
     * @param date un objet Date
     * @param format le format de la date
     * @param timezone la timezone sur laquelle formater la date (Europe/Paris, America/Los_Angeles, Australia/Sydney, ...) defaut : Timezone du navigateur/serveur node
     * @param locale la locale (fr_FR, en_US, ...) defaut : fr_FR
     * @returns {string} la chaîne de caractères formatée suivant {format} ou une chaîne vide en cas d'erreur
     */
    static formatInTZ(date: Date, format: string, timezone?: string, locale: string = "fr_FR"): string {
        logger.trace("format(date, format, timezone, locale):string", date, format, timezone, locale);

        let strValue: string = "";
        try {
            let mdate: Moment = moment(date).locale(locale);
            let tzDate: Moment = timezone ? mdate.tz(timezone) : mdate;
            strValue = tzDate.format(format);
        } catch (err) {
            logger.trace("Erreur pour formater la date suivante : ", err);
        }
        logger.trace("Date formatée : ", strValue + "  -- à partir de la date", date, ", " +
            "de la timezone", timezone, "et de la locale", locale);
        return strValue;
    }


    /**
     * Calcule la différence entre deux dates
     * @param {Date} date un objet Date
     * @param {Date} dateBis un objet Date
     * @param {DateDiffUnit=ALL} unité calculée
     * @returns {DateDiff} Objet contenant les résultat des calculs suivant unité.
     */
    static diff(date: Date, dateBis: Date, unit: DateDiffUnit = DateDiffUnit.All): DateDiff {
        let t1 = date.getTime();
        let t2 = dateBis.getTime();

        // inverse suivant la plus grande
        if (t1 > t2) {
            t1 = t2;
            t2 = date.getTime();
        }

        let d1Y = date.getFullYear();
        let d2Y = dateBis.getFullYear();
        let d1M = date.getMonth();
        let d2M = dateBis.getMonth();

        let result: DateDiff = {};

        switch (unit) {
            case DateDiffUnit.DAYS || DateDiffUnit.All:
                result.days = (t2 - t1) / (24 * 3600 * 1000);
                if (unit !== DateDiffUnit.All) break;
            case DateDiffUnit.WEEKS || DateDiffUnit.All:
                result.weeks = (t2 - t1) / (24 * 3600 * 1000 * 7);
                if (unit !== DateDiffUnit.All) break;
            case DateDiffUnit.MONTHS || DateDiffUnit.All:
                result.months = (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
                if (unit !== DateDiffUnit.All) break;
            case DateDiffUnit.YEARS || DateDiffUnit.All:
                result.years = dateBis.getFullYear() - date.getFullYear();
                break;
        }

        return result;
    }

}

export interface DateDiff {
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
}

export enum DateDiffUnit {
    DAYS = 1,
    WEEKS,
    MONTHS,
    YEARS,
    All
}
