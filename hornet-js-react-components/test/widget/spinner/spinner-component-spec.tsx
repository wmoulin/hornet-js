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

import { TestLogger } from "hornet-js-test/src/test-logger";
import {Logger} from "hornet-js-utils/src/logger";
Logger.prototype.buildLogger = TestLogger.getLoggerBuilder({
    "levels": {
        "[all]": "INFO"
    },
    "appenders": [
        {
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%[%d{ISO8601}|%p|%c|%m%]"
            }
        }
    ]
});
import { TestUtils } from "hornet-js-test/src/test-utils";
import { ReactTestUtils } from "hornet-js-test/src/react-test-utils";
import * as React from "react";
import { SpinnerComponent } from "src/widget/spinner/spinner-component";
import { ASYNCHRONOUS_REQUEST_EVENT_COMPONENT} from "hornet-js-core/src/event/hornet-event";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { ServiceEvent } from "hornet-js-core/src/event/hornet-event";
import { Utils } from "hornet-js-utils";

const expect = TestUtils.chai.expect;
const render = ReactTestUtils.render;

import * as _ from "lodash";
import * as isUndefined from "lodash/isUndefined";

let defaultSpinnerText = 'spinner.loadingText';
let defaultSpinnerImg = 'img/spinner.gif';
let defaultclassName = 'component-spinner';



describe.skip("SpinnerComponentReactComponent", () => {

    it("doit générer les éléments dom attendu du spinner component", () => {

        /* Setter pour le contextPath pour debug Webstorm */
        Utils.config.setConfigObj({
            isServer: false
        });

        // Act
        let $ = render(() =>
                <SpinnerComponent isVisible={true} />);

        //broadcast levent qui permet le declenchement du spinner
        // var evt = window.document.createEvent("CustomEvent");
        // evt.initCustomEvent( "spinner", true, true, true );
        // window.dispatchEvent(evt);

        // console.error(">>>>>>>>>>>>> $", $.html());
        let $rootElt = $("div[class='"+defaultclassName+"']");

        // Assert
        // expect($rootElt).to.exist;
        // expect($("div[class='component-spinner'] div"), "la div.component-spinner doit avoir contenir une div").to.exist;
        // expect($("div[class='component-spinner'] img"), "la div.component-spinner doit avoir contenir une image").to.exist;
        // expect($rootElt.find('div').html(), 'le contenu de la div doit être spinner.loadingText par défault').to.be.equals(defaultSpinnerText);
        // expect(_.endsWith($rootElt.find("img").attr('src'), defaultSpinnerImg), "l'image doit utiliser l'image de l'api spinner " + defaultSpinnerImg).to.be.true;
    });

    // it("doit gérer l'affichage avec la propriete isVisible true", () => {
    //     // Act
    //     let $ = render(() =>
    //         <SpinnerComponent isVisible={true} />);
    //
    //     let $rootEltVisible = $("div[class='"+defaultclassName+"']");
    //     expect($rootEltVisible).to.exist;
    // });
    //
    // it("doit gérer l'affichage avec la propriete isVisible false", () => {
    //     // Act
    //     let $ = render(() =>
    //         <SpinnerComponent isVisible={false} />);
    //     let $rootEltHidden = $("div[class='"+defaultclassName+"']");
    //     expect(_.isEmpty($rootEltHidden)).to.be.true;
    // });
});
