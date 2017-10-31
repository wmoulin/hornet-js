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
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

'use strict';
import { runTest } from "hornet-js-test/src/test-run";
import "hornet-js-test/src/test-run";

var chai = require('chai');
const expect = chai.expect;
import * as _ from "lodash";
import * as React from "react";

import { HornetReactTest } from "hornet-js-test/src/hornet-react-test";
import { Decorators } from "hornet-js-test/src/decorators";
import * as assert from "assert";
import { Utils } from "hornet-js-utils";

import * as moment from "moment";
import { CalendarField } from "src/widget/form/calendar-field";

let formElement: JSX.Element;
let form;


@Decorators.describe('Test Karma calendar-field')
class CalendarFieldTest extends HornetReactTest {

    @Decorators.beforeEach
    beforeEach() {

        Utils.setCls("hornet.internationalization",
            {
                messages: {
                    "calendar": {
                        "agendaTitle": "Agenda",
                        "choiceDate": "Choisir une date",
                        "today": "Aujourd'hui",
                        "now": "Maintenant",
                        "ok": "Ok",
                        "clear": "Effacer",
                        "month": "Mois",
                        "year": "Année",
                        "hourPanelTitle": "Choisir une heure",
                        "minutePanelTitle": "Choisir une minute",
                        "secondPanelTitle": "Choisir une seconde",
                        "monthSelect": "Choisir un mois",
                        "yearSelect": "Choisir une année",
                        "decadeSelect": "Choisir une décade",
                        "yearFormat": "YYYY",
                        "dateFormat": "DD\u002FMM\u002FYYYY",
                        "monthYearFormat": "MMMM YYYY",
                        "monthFormat": "MMMM",
                        "monthBeforeYear": true,
                        "timezoneOffset": 60,
                        "firstDayOfWeek": 1,
                        "minimalDaysInFirstWeek": 1,
                        "placeHolder": "JJ\u002FMM\u002FAAAA"
                    },
                }
            });

        formElement = (
            <CalendarField name={"test"}
                label={"Test date"} />
        );
    };

    @Decorators.it('Test OK')
    testOk() {
        assert.equal(1, 1);
        this.end();
    };

    @Decorators.it('Affichage du champs calendar')
    ShowElement() {
        form = this.renderIntoDocument(formElement, "main1");
        expect(document.querySelector("#main1 .calendar-input")).to.exist;
        expect(document.querySelector("#main1 .agenda")).to.exist;

        this.end();
    };


    @Decorators.it('Test saisie de caractère non autorisé')
    controlInputElement() {

        let SpecialCar = [
            { key: "²" }, { key: "<" }, { key: "&" }, { key: "é" }, { key: "~" }, { key: "#" },
            { key: "\"" }, { key: "{" }, { key: "\'" }, { key: "[" }, { key: "(" }, { key: "|" },
            { key: "`" }, { key: "è" }, { key: "_" }, { key: "\\" }, { key: "^" }, { key: "ç" },
            { key: "à" }, { key: "@" }, { key: ")" }, { key: "]" }, { key: "°" }, { key: "+" },
            { key: "=" }, { key: "}" }, { key: "£" }, { key: "$" }, { key: "¤" }, { key: "*" },
            { key: "µ" }, { key: "%" }, { key: "ù" }, { key: "!" }, { key: "§" }, { key: ":" },
            { key: "." }, { key: ";" }, { key: "?" }, { key: "," }, { key: "<" }, { key: ">" },
            { key: "æ" }, { key: "«" }, { key: "ð" }, { key: "¹" }, { key: "”" }, { key: "ß" }
        ];

        form = this.renderIntoDocument(formElement, "main2");
        let dateInput = (document.querySelector("#main2 .calendar-input"));

        setTimeout(() => {
        
            SpecialCar.forEach((char, index) => {
                this.triggerKeyPressEvent(dateInput, char.key, char.key.charCodeAt(0), false);
                expect(this.isPreventDefault, "Impossible de saisir le caractère : " + char.key).be.true;
            });

            this.end();
        }, 2500);
    };


    @Decorators.it("Test saisie date valide")
    controlInvalidDateElement() {
        form = this.renderIntoDocument(<CalendarField valideOnForm={false} label={"Test date"}
            name="dateTest" />, "main3");

        let dateInput = (document.querySelector("#main3 .calendar-input"));

        setTimeout(() => {
            this.triggerKeyPressEvent(dateInput, "24/10/2012", 0, true);
            //this.triggerFocusOnElement(dateInput);
            this.triggerFocusOnElement(document.querySelector("#main3 .agenda"));

            expect(document.querySelector("#main3 .fielderror-content")).to.not.exist;
            this.end();
        }, 2500);
    }

    @Decorators.it("Test selection d'une date dans la boite de dialogue")
    opentAndSelectedDate() {
        
        let onSelectCount = 0;
        let onChangeCount = 0;
        let onValueChangeCount = 0;

        form = this.renderIntoDocument(<CalendarField valideOnForm={false} label={"Test date"}
            name="dateTest" onSelect={(value) => { onSelectCount++; }}  onChange={(value) => { onChangeCount++; }}  onValueChange={(value) => { onValueChangeCount++; }} />, "main5");

        setTimeout(() => {

            this.triggerMouseEvent(document.querySelector("#main5 .agenda"), "click");

            expect(document.querySelector(".widget-dialogue-header")).to.exist;

            this.triggerMouseEvent(document.querySelector(".rc-calendar-selected-day"), "click");

            expect((document.querySelector("#main5 #dateTest") as any).value).to.be.equal(moment().locale('fr').format("DD/MM/YYYY"));

            this.triggerMouseEvent(document.querySelector("#main5 #dateTestResetButton a"), "click");

            expect(onSelectCount, "selectCount").to.be.equal(2);
            expect(onChangeCount, "changeCount").to.be.equal(1);
            expect(onValueChangeCount, "valueChangeCount").to.be.equal(2);


            this.end();
        }, 3000);
    }

    /*
    LE TEST NE FOCTIONNE PAS SI LE NAVIGATEUR N'EST PAS ACTIF EN PRIMIER PLAN
    @Decorators.it("Test saisie date invalide")
    controlValideDateElement() {

        form = this.renderIntoDocument(<CalendarField valideOnForm={false} label={"Test date"}
            name="dateTest" />, "main4");

        var agendaButton = document.querySelector("#main4 .agenda") as any;
        var dateInput = document.getElementById("dateTest") as any;
        dateInput.focus();
        this.triggerKeyPressEvent(dateInput, "24-10-2012", 0, true);
        agendaButton.focus();
        expect(document.querySelector("#main4 #dateTest-error")).to.exist;
        setTimeout(() => {
            this.end();
        }, 2000);

    }

*/

}

//lancement des Tests
runTest(new CalendarFieldTest());