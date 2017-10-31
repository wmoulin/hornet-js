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

import { TestUtils } from "hornet-js-test/src/test-utils";
//import { calendarLocale } from "test/locale/fr-fr";
const calendarLocale = {
    title: "Calendrier",
    choiceDate: "Choisir une date",
    today: "Aujourd'hui",
    clear: "Effacer",
    hourPanelTitle: "Choisir une heure",
    minutePanelTitle: "Choisir une minute",
    secondPanelTitle: "Choisir une seconde",
    monthSelect: "Choisir un mois",
    yearSelect: "Choisir une année",
    decadeSelect: "Choisir une décade",
    yearFormat: "YYYY",
    dateFormat: "DD/MM/YYYY",
    monthYearFormat: "MMMM YYYY",
    timezoneOffset: 60,
    firstDayOfWeek: 1,
    minimalDaysInFirstWeek: 1
};
import * as _ from "lodash";

/* Format court : jour/mois */
const shortFormatLocale = _.cloneDeep(calendarLocale);
shortFormatLocale.dateFormat = "DD/MM";

import chai = require("chai");
import { DateUtils } from "src/date-utils";
import Moment = moment.Moment;
import * as moment from "moment";

const expect = chai.expect;

describe("DateUtils", () => {
    it("should parse date", () => {
        let result = DateUtils.parse("01/03/2017", calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.year()).to.be.equal(2017);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should have en locale", () => {
        let result = DateUtils.parse("01/03/2017", calendarLocale, 'en');
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.locale()).to.be.equal('en');
    });

    it("should parse date with short format", () => {
        let result = DateUtils.parse("01/03", calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should not parse malformed date", () => {
        let result = DateUtils.parse("/03/2017", calendarLocale);
        expect(result).to.be.undefined;
    });

    it("should not parse undefined date", () => {
        let result = DateUtils.parse(undefined, calendarLocale);
        expect(result).to.be.undefined;
    });

    it("should parse date matching the only format", () => {
        let result = DateUtils.parseMultipleFmt("01/03/2017", ["DD/MM/YYYY"],calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.year()).to.be.equal(2017);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should parse date matching the second format", () => {
        let result = DateUtils.parseMultipleFmt("01/03/2017", ["YYYY-MM-DD", "DD/MM/YYYY"], calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.year()).to.be.equal(2017);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should parse date matching the only short format", () => {
        let result = DateUtils.parseMultipleFmt("01/03", ["DD/MM"],calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should parse date with locale format when formats array is undefiend", () => {
        let result = DateUtils.parseMultipleFmt("01/03/2017", undefined,calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.year()).to.be.equal(2017);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should parse date with locale format when formats array is empty", () => {
        let result = DateUtils.parseMultipleFmt("01/03/2017", [],calendarLocale);
        expect(moment.isMoment(result)).to.be.equal(true);
        expect(result.year()).to.be.equal(2017);
        expect(result.month()).to.be.equal(2);
        expect(result.date()).to.be.equal(1);
    });

    it("should not parse date matching no format", () => {
        let result = DateUtils.parseMultipleFmt("/03/2017", ["YYYY-MM-DD", "YYYY/MM/DD"],calendarLocale);
        expect(result).to.be.undefined;
    });

    it("should not parse undefined date with multiple formats", () => {
        let result = DateUtils.parseMultipleFmt(undefined, ["YYYY-MM-DD", "YYYY/MM/DD"],calendarLocale);
        expect(result).to.be.undefined;
    });

    it("should format date", () => {
        // var dateToFormat:Date = new Date(2014, 3, 16);
        // la date est instanciée avec le fuseau local (UTC+2).
        // L'heure étant 00h00, la date UTC (renvoyee par getTime) correspond au jour precedent à 22h (15/04/2014)

        // pour corriger le probleme :
        // preciser une heure (12h00 par exemple)
        // var dateToFormat:Date = new Date(2014, 3, 16,12,0,0,0);

        // ou bien instancier la date sur le fuseau UTC.
        let dateToFormat: Date = new Date(Date.UTC(2014, 3, 16));

        let result = DateUtils.format(dateToFormat.getTime(), calendarLocale);

        expect(result).to.be.equal("16/04/2014");
    });

    it("should format date with short format", () => {
        let dateToFormat: Date = new Date(Date.UTC(2014, 3, 16));

        let result = DateUtils.format(dateToFormat.getTime(), shortFormatLocale);

        expect(result).to.be.equal("16/04");
    });

    it("should parse string to date with DD/MM/YYYY format and timezone", () => {
        let stringToFormat: string = "12/12/1998";
        let format: string = "DD/MM/YYYY";
        let timeZone: string = DateUtils.TZ_EUROPE_PARIS;

        let result: Date = DateUtils.parseInTZ(stringToFormat, format, timeZone);

        // expect(result).to.be.equal(new Date(Date.UTC(1998, 11, 12)));
        expect(result.getFullYear()).to.be.equal(1998);
        expect(result.getMonth()).to.be.equal(11);
        expect(result.getDate()).to.be.equal(12);
    });

    it("should parse string to date with MM/DD/YYYY format and timezone", () => {
        let stringToFormat: string = "12/12/1998";
        let format: string = "MM/DD/YYYY";
        let timeZone: string = DateUtils.TZ_EUROPE_PARIS;

        let result = DateUtils.parseInTZ(stringToFormat, format, timeZone);

        // expect(result).to.be.equal(new Date(Date.UTC(1998, 11, 12)));
        expect(result.getFullYear()).to.be.equal(1998);
        expect(result.getMonth()).to.be.equal(11);
        expect(result.getDate()).to.be.equal(12);
    });
});
