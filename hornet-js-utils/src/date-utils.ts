"use strict";
import register = require("src/common-register");

// var plutot que import car il n'existe pas de typage TypeScript pour ces librairies
var DateTimeFormat = require("gregorian-calendar-format");
var GregorianCalendar = require("gregorian-calendar");
var moment = require("moment-timezone");

var logger = register.getLogger("hornet-js-utils.date-utils");

class DateUtils {

    static TZ_EUROPE_PARIS = "Europe/Paris";

    /**
     *  On s'assure que le fuseau horaire utilisé par GregorianCalendar est le même que dans l'interpréteur javascript
     *  @param calendarLocale objet de configuration des calendriers et dates : doit etre non nul
     */
    static initTimeZone(calendarLocale:any):void {
        /*(le signe est inversé car Date().getTimezoneOffset() renvoie (temps UTC - temps local) ce qui donne par exemple -60 en hiver en zone UTC+1*/
        if (calendarLocale) {
            calendarLocale.timezoneOffset = -new Date().getTimezoneOffset();
        }
    }

    /**
     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant le format spécifié et la locale indiquée
     * @param dateStr chaîne de caractères représentant une date. Doit être non nulle.
     * @param dateFormat format de date à utiliser. Doit être non nul.
     * @param calendarLocale configuration locale des dates
     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
     */
    private static parseWithFormat(dateStr:string, dateFormat:string, calendarLocale:any):any {
        var calendar:any;
        var formatter = new DateTimeFormat(dateFormat, calendarLocale);
        calendar = formatter.parse(dateStr);

        /* Lorsque l'année n'est pas présente dans le format, le champ YEAR n'est pas initialisé par
         GregorianCalendarFormat. On initialise donc ce champ avec l'année en cours sinon une erreur sera
         déclenchée lors de la récupération des autres champs */
        if(calendar && !calendar.fields[GregorianCalendar.YEAR]) {
            calendar.fields[GregorianCalendar.YEAR] = new Date().getFullYear();
        }
        return calendar;
    }

    /**
     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant le format spécifié dans la locale indiquée : calendarLocale.dateFormat
     * @param dateStr chaîne de caractères représentant une date
     * @param calendarLocale configuration locale des dates
     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
     */
    static parse(dateStr:string, calendarLocale:any):any {
        logger.trace("Date à parser : ", dateStr);

        DateUtils.initTimeZone(calendarLocale);

        var calendar:any;

        if (dateStr && calendarLocale) {
            try {
                calendar = DateUtils.parseWithFormat(dateStr, calendarLocale.dateFormat, calendarLocale);
            } catch (err) {
                logger.warn("Erreur pour parser au format local la date suivante : ", dateStr);
            }
        }
        return calendar;
    }

    /**
     * Crée un objet GregorianCalendar à partir de la chaîne de caractère dateStr et en utilisant les format de date spécifiés et la locale indiquée.
     * Lorsque dateFormats n'est pas défini ou est vide, on utilise calendarLocale.dateFormat.
     * @param dateStr chaîne de caractères représentant une date
     * @param dateFormats formats de date compatibles GregorianCalendar
     * @param calendarLocale configuration locale des dates
     * @returns {GregorianCalendar} un objet GregorianCalendar correspondant à dateStr ou undefined en cas d'erreur
     */
    static parseMultipleFmt(dateStr:string, dateFormats:Array<String>, calendarLocale:any):any {
        logger.trace("Date à parser : ", dateStr);
        var calendar:any;

        if (dateStr && calendarLocale) {
            if (!dateFormats || dateFormats.length < 1) {
                calendar = DateUtils.parse(dateStr, calendarLocale);
            } else {
                DateUtils.initTimeZone(calendarLocale);
                var index:string;
                for (index in dateFormats) {
                    try {
                        calendar = DateUtils.parseWithFormat(dateStr, dateFormats[index], calendarLocale);
                    } catch (err) {
                        logger.debug("Erreur pour parser la date avec le format : ", dateFormats[index]);
                    }
                    if (calendar) {
                        break;
                    }
                }
                if (!calendar) {
                    logger.warn("La date n'a pu être parsée avec aucun des formats indiqués");
                }
            }
        }
        return calendar;
    }

    /**
     * Crée un objet Date à partir de la chaîne de caractères indiquée en utilisant la fonction Date.parse(str)
     * @param dateStr chaîne de caractères représentant une date générée par Date.toString(), Date.toUTCString(), Date.toISOString() ou Date.toLocaleString()
     * @returns {Date} un objet Date ou undefined en cas d'erreur
     */
    static stdParse(dateStr:string):Date {
        var date:Date;
        if (dateStr) {
            try {
                date = new Date(Date.parse(dateStr));
            } catch (err) {
                logger.warn("Erreur pour parser la date suivante : ", dateStr);
            }
        }
        return date;
    }

    /**
     * Formatte la date correspondant à time en utilisant le format spécifié dans la locale
     * @param time temps en millisecondes UTC depuis 'epoch'
     * @param calendarLocale configuration locale des dates
     * @returns {string} la chaîne de caractères formatée suivant calendarLocale.dateFormat ou une chaîne vide en cas d'erreur
     */
    static format(time, calendarLocale:any):string {
        logger.trace("format(time, calendarLocale):string", time);

        DateUtils.initTimeZone(calendarLocale);

        var strValue = "";
        try {
            var formatter = new DateTimeFormat(calendarLocale.dateFormat, calendarLocale);
            var gregorianCalendar = new GregorianCalendar(calendarLocale);
            gregorianCalendar.setTime(time);
            strValue = formatter.format(gregorianCalendar);
        } catch (err) {
            logger.warn("Erreur pour formater la date suivante : ", err);
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
    static formatInTZ(date, format:string, timezone?:string, locale:string = "fr_FR"):string {
        logger.trace("format(date, format, timezone, locale):string", date, format, timezone, locale);

        var strValue = "";
        try {
            var mdate = moment(date).locale(locale);
            var tzDate = timezone ? mdate.tz(timezone) : mdate;
            strValue = tzDate.format(DateUtils.gregorianCalToMomentFormat(format));
        } catch (err) {
            logger.warn("Erreur pour formater la date suivante : ", err);
        }
        logger.trace("Date formatée : ", strValue + "  -- à partir de la date", date, ", de la timezone", timezone, "et de la locale", locale);
        return strValue;
    }

    /**
     * Convertit un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
     * en un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
     * @param format format de date compatible newforms
     * @returns {string} format de date compatible GregorianCalendarFormat
     */
    static newformsToGregorianCalFormat(format:string):string {
        var result:string = format;
        if (format) {
            /* Nom de mois local abrégé */
            result = format.replace("%b", "MMM");
            /* Nom de mois local complet */
            result = result.replace("%B", "MMMM");
            /* Jour dans le mois (01-31) */
            result = result.replace("%d", "dd");
            /* Heure (00-23)*/
            result = result.replace("%H", "HH");
            /* Heure (00-12) */
            result = result.replace("%I", "KK");
            /* Numéro du mois (01-12) */
            result = result.replace("%m", "MM");
            /* Minutes (00-59) */
            result = result.replace("%M", "mm");
            /* Marqueur local AM/PM */
            result = result.replace("%p", "a");
            /* Secondes (00-59) */
            result = result.replace("%S", "ss");
            /* Année sans le siècle */
            result = result.replace("%y", "yy");
            /* Année avec le siècle */
            result = result.replace("%Y", "yyyy");
            /* Symbole % */
            result = result.replace("%%", "%");
        }
        return result;
    }

    /**
     * Convertit un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
     * en un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
     * @param format format de date compatible GregorianCalendarFormat
     * @returns {string} format de date compatible newforms
     */
    static gregorianCalToNewformsFormat(format:string):string {
        var result:string = format;
        if (format) {
            /* Nom de mois local complet */
            result = result.replace("MMMM", "%B");
            /* Nom de mois local abrégé : attention ce replace est bien à faire après le précedent */
            result = format.replace("MMM","%b");
            /* Jour dans le mois (01-31) */
            result = result.replace("dd", "%d");
            /* Heure (00-23)*/
            result = result.replace("HH", "%H");
            /* Heure (00-12) */
            result = result.replace("KK", "%I");
            /* Numéro du mois (01-12) */
            result = result.replace("MM", "%m");
            /* Minutes (00-59) */
            result = result.replace("mm", "%M");
            /* Marqueur local AM/PM */
            result = result.replace("a", "%p");
            /* Secondes (00-59) */
            result = result.replace("ss", "%S");
            /* Année avec le siècle */
            result = result.replace("yyyy", "%Y");
            /* Année sans le siècle : attention ce replace est bien à faire après le précedent */
            result = result.replace("yy", "%y");
        }
        return result;
    }

    /**
     * Convertit un format de date GregorianCalendarFormat (https://github.com/yiminghe/gregorian-calendar-format)
     * en un format de date newforms (https://github.com/insin/isomorph#formatting-directives)
     * @param format format de date compatible GregorianCalendarFormat
     * @returns {string} format de date compatible newforms
     */
    static gregorianCalToMomentFormat(format:string):string {
        var result:string = format;
        if (format) {
            /* Jour dans le mois (01-31) */
            result = result.replace("dd", "DD");
            /* Heure (00-12) */
            result = result.replace("KK", "hh");
            /* Année avec le siècle */
            result = result.replace("yyyy", "YYYY");
            /* Année sans le siècle : attention ce replace est bien à faire après le précedent */
            result = result.replace("yy", "YY");
        }
        return result;
    }
}

export = DateUtils;
