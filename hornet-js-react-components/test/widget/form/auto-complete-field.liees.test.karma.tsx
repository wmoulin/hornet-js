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

import { runTest } from "hornet-js-test/src/test-run";
import { Decorators } from "hornet-js-test/src/decorators";
import * as React from "react";
import * as assert from "assert";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { AutoCompleteField, AutoCompleteFieldProps } from "src/widget/form/auto-complete-field";
import { DataSourceMaster } from "hornet-js-core/src/component/datasource/datasource-master";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { HornetReactTest } from "hornet-js-test/src/hornet-react-test";

var chai = require("chai");
const expect = chai.expect;
import forEach = require("lodash/forEach");

let elements: JSX.Element;
let autoCompleteLieesElements;

const logger: Logger = Utils.getLogger("auto-complete-field.liees.test.karma");


@Decorators.describe("Test Karma auto-complete-field liees")
class AutoCompleteFieldLieesTest extends HornetReactTest {

    private paysDataSources: DataSourceMaster<any>[] = [];
    private villeDataSources: DataSource<any>[] = [];
    private villeAutoCompletes: AutoCompleteField<AutoCompleteFieldProps>[] = [];
    private currentTest: number = -1;

    @Decorators.beforeEach
    beforeEach() {
        this.villeAutoCompletes.push(null);
        this.currentTest++;
        let paysData = [];
        paysData.push({ id: "1", libelle: "Espagne" });
        paysData.push({ id: "2", libelle: "France" });
        paysData.push({ id: "3", libelle: "Mauritanie" });
        this.paysDataSources.push(new DataSourceMaster<any>(paysData, { value: "id", text: "libelle" }));

        let villeData = [];
        villeData.push({ id: "1", libelle: "Barcelona", idPays: 1 });
        villeData.push({ id: "2", libelle: "Madrid", idPays: 1 });
        villeData.push({ id: "3", libelle: "Palma de Mallorca", idPays: 1 });
        villeData.push({ id: "4", libelle: "Amiens", idPays: 2 });
        villeData.push({ id: "5", libelle: "Nantes", idPays: 2 });
        villeData.push({ id: "6", libelle: "Paris", idPays: 2 });
        villeData.push({ id: "7", libelle: "Nouakchott", idPays: 3 });
        villeData.push({ id: "8", libelle: "Nouâdhibou", idPays: 3 });
        villeData.push({ id: "9", libelle: "Rosso", idPays: 3 });
        this.villeDataSources.push(new DataSource<any>(villeData, { value: "id", text: "libelle", idPays: "idPays" }));

        let testId = this.getTestId();
        this.paysDataSources[ this.currentTest ].addSlave(this.villeDataSources[ this.currentTest ]);
        this.paysDataSources[ this.currentTest ].on("select", function (myTest: string, instance: AutoCompleteFieldLieesTest) {
            return (value) => {
                instance.villeAutoCompletes[ instance.currentTest ].resetField().setFocus();
                instance.villeDataSources[ instance.currentTest ].filter((ville) => {
                    return (ville.value == null || ville.idPays == value)
                });
                instance.eventEmitter.emit(myTest + "paysDataSourceOnSelect", value);
            }
        } (testId, this));
        this.villeDataSources[ this.currentTest ].on("fetch", this.emiteEventforArrayResults(testId, "villeDataSourceOnFetch"));
        this.villeDataSources[ this.currentTest ].on("select", function (myTest: string, instance: AutoCompleteFieldLieesTest) {
            return (value: any | any[]) => {
                if (value && value.length != 0) {
                    instance.eventEmitter.emit(testId + "villeDataSourceOnSelect", value);
                }
            }
        } (testId, this));
        this.villeDataSources[ this.currentTest ].on("filter", (result) => {
            this.eventEmitter.emit(testId + "villeDataSourceOnFilter", result);
        });
        // Dans l'AutoCompleteField des villes, le ref est ajouté pour palier
        // le disfonctionnement de var qui ne fonctionne pas avec les tests karma
        elements = (
            <div>
                <div id={this.getTestId() + "paysDiv"}>
                    <AutoCompleteField dataSource={this.paysDataSources[ this.currentTest ]}
                        maxHeight={200}
                        name={this.getTestId() + "pays"}
                        label="pays"
                        required={true}
                        labelKey="libelle"
                        valueKey="id"
                        />
                </div>
                <div id={this.getTestId() + "villeDiv"}>
                    <AutoCompleteField dataSource={this.villeDataSources[ this.currentTest ]}
                        maxHeight={200}
                        name={this.getTestId() + "ville"}
                        label="ville"
                        required={true}
                        labelKey="libelle"
                        valueKey="id"
                        ref={(reactInstance) => {
                            this.villeAutoCompletes[ this.currentTest ] = reactInstance;
                        } }
                        />
                </div>
            </div>
        );
    };

    /** Tests */

    @Decorators.it("Test OK")
    testOk() {
        assert.equal(1, 1);
        this.end();
    };

    @Decorators.it("selectionner un element dans l'autocomplete pays")
    testSelect() {
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.selectItemOnClick("paysDiv", "pays", 1);
        this.checkPaysDataSourceSelectedValue();
        this.paysDataSources[ this.currentTest ].removeAllListeners();
        this.villeAutoCompletes[ this.currentTest ].componentWillUnmount();
        this.end();
    };

    @Decorators.it("selectionner l'élement suivant grâce à la flêche vers le bas")
    testSelectArrowDown() {
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.eventEmitter.on(this.getTestId() + "paysDataSourceOnSelect", (value: any) => {
            expect(_.isEqual(value, "1"), ("la valeur passée par l'event select de paysDataSource " + value + " doit être identique à la valeur suivante : " + 1)).to.be.true;
            expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "1"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 1)).to.be.true;
            this.end();
        });
        this.triggerFocusOnElement(this.getDOMElement("pays"));
        this.triggerKeydownEvent(this.getDOMElement("pays"), "arrow_down", 40);
        setTimeout(() => {
            this.triggerKeydownEvent(this.getDOMElement("pays"), "enter", 13);
        }, 250);
    }

    @Decorators.it("selectionner l'élement suivant grâce à la flêche vers le haut")
    testSelectArrowUp() {
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.eventEmitter.on(this.getTestId() + "paysDataSourceOnSelect", (value: any) => {
            expect(_.isEqual(value, "3"), ("la valeur passée par l'event select de paysDataSource " + value + " doit être identique à la valeur suivante : " + 3)).to.be.true;
            expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "3"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 3)).to.be.true;
            this.end();
        });
        this.triggerFocusOnElement(this.getDOMElement("pays"));
        this.triggerKeydownEvent(this.getDOMElement("pays"), "arrow_up", 38);
        setTimeout(() => {
            this.triggerKeydownEvent(this.getDOMElement("pays"), "enter", 13);
        }, 250);
    }

    @Decorators.it("selectionner l'élement suivant grâce à la touche home")
    testSelectHome() {
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.eventEmitter.on(this.getTestId() + "paysDataSourceOnSelect", (value: any) => {
            expect(_.isEqual(value, "1"), ("la valeur passée par l'event select de paysDataSource " + value + " doit être identique à la valeur suivante : " + 1)).to.be.true;
            expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "1"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 1)).to.be.true;
            this.end();
        });
        this.triggerFocusOnElement(this.getDOMElement("pays"));
        this.triggerKeydownEvent(this.getDOMElement("pays"), "home", 36);
        setTimeout(() => {
            this.triggerKeydownEvent(this.getDOMElement("pays"), "enter", 13);
        }, 250);
    }

    @Decorators.it("selectionner l'élement suivant grâce à la touche end")
    testSelectEnd() {
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.eventEmitter.on(this.getTestId() + "paysDataSourceOnSelect", (value: any) => {
            expect(_.isEqual(value, "3"), ("la valeur passée par l'event select de paysDataSource " + value + " doit être identique à la valeur suivante : " + 3)).to.be.true;
            expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "3"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 3)).to.be.true;
            this.end();
        });
        this.triggerFocusOnElement(this.getDOMElement("pays"));
        this.triggerKeydownEvent(this.getDOMElement("pays"), "end", 35);
        setTimeout(() => {
            this.triggerKeydownEvent(this.getDOMElement("pays"), "enter", 13);
        }, 250);
    }

    @Decorators.it("selectionner un element dans l'autocomplete master et mise à jour de l'autocomplete slave pour sélection d'un élément non connu")
    testSelectUnknownInSlave() {
        this.paysDataSourceOnSelectListener();
        let _id = this.getTestId();
        this.eventEmitter.on(_id + "villeDataSourceOnFilter", (results: any[]) => {
            if (results.length != 0) {
                expect(_.isEqual(results.length, 3), ("testSelectUnknownInSlave-L'autocomplete ville est mis à jour pour contenir les résultats liés à la sélection de l'autocomplete pays")).to.be.true;
                setTimeout(() => {
                    let elts = document.querySelectorAll("#" + this.getTestId() + "villeDiv" + " .autocomplete-item");
                    expect(_.isEqual(elts.length, 3), ("testSelectUnknownInSlave-L'autocomplete ville est mis à jour et dans le DOM on trouve bien les " + elts.length + " villes filtrées pour le pays sélectioné :" + 3)).to.be.true;
                    this.triggerFocusOnElement(this.getDOMElement("ville"));
                    this.triggerKeydownEvent(this.getDOMElement("ville"), "m", 77, true);
                    setTimeout(() => {
                        this.triggerKeydownEvent(this.getDOMElement("ville"), "a", 65, true);
                        setTimeout(() => {
                            this.triggerKeydownEvent(this.getDOMElement("ville"), "d", 68, true);
                            setTimeout(() => {
                                this.triggerKeydownEvent(this.getDOMElement("ville"), "i", 73, true);
                                setTimeout(() => {
                                    this.triggerKeydownEvent(this.getDOMElement("ville"), "d", 68, true);
                                    setTimeout(() => {
                                        this.triggerKeydownEvent(this.getDOMElement("ville"), "enter", 13);
                                        setTimeout(() => {
                                            expect(_.isEqual(this.villeDataSources[ this.currentTest ].selected, null), ("testSelectUnknownInSlave-L'élément sélectionné dans le villeDataSource " + this.villeDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + null)).to.be.true;
                                            this.end();
                                        }, 250);
                                    }, 250);
                                }, 250);
                            }, 250);
                        }, 250);
                    }, 250);
                }, 250);
            }
        });
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.selectItemOnClick("paysDiv", "pays", 1);
    }

    @Decorators.it("selectionner un element dans l'autocomplete master et mise à jour de l'autocomplete slave pour sélection d'un élément non disponible")
    testSelecNotAllowedInSlave() {
        this.paysDataSourceOnSelectListener();
        this.eventEmitter.on(this.getTestId() + "villeDataSourceOnFilter", (results: any[]) => {
            if (results.length != 0) {
                expect(_.isEqual(results.length, 3), ("testSelecNotAllowedInSlave-L'autocomplete ville est mis à jour pour contenir les résultats liés à la sélection de l'autocomplete pays")).to.be.true;
                setTimeout(() => {
                    let elts = document.querySelectorAll("#" + this.getTestId() + "villeDiv" + " .autocomplete-item");
                    expect(_.isEqual(elts.length, 3), ("testSelecNotAllowedInSlave-L'autocomplete ville est mis à jour et dans le DOM on trouve bien les " + elts.length + " villes filtrées pour le pays sélectioné :" + 3)).to.be.true;
                    this.triggerFocusOnElement(this.getDOMElement("ville"));
                    this.triggerKeydownEvent(this.getDOMElement("ville"), "m", 77, true);
                    setTimeout(() => {
                        this.triggerKeydownEvent(this.getDOMElement("ville"), "a", 65, true);
                        setTimeout(() => {
                            this.triggerKeydownEvent(this.getDOMElement("ville"), "d", 68, true);
                            setTimeout(() => {
                                this.triggerKeydownEvent(this.getDOMElement("ville"), "r", 82, true);
                                setTimeout(() => {
                                    this.triggerKeydownEvent(this.getDOMElement("ville"), "i", 73, true);
                                    setTimeout(() => {
                                        this.triggerKeydownEvent(this.getDOMElement("ville"), "d", 68, true);
                                        setTimeout(() => {
                                            this.triggerKeydownEvent(this.getDOMElement("ville"), "enter", 13);
                                            setTimeout(() => {
                                                expect(_.isEqual(this.villeDataSources[ this.currentTest ].selected, null), ("testSelecNotAllowedInSlave-L'élément sélectionné dans le villeDataSource " + this.villeDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + null)).to.be.true;
                                                this.end();
                                            }, 250);
                                        }, 250);
                                    }, 250);
                                }, 250);
                            }, 250);
                        }, 250);
                    }, 250);
                }, 250);
            }
        });
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.selectItemOnClick("paysDiv", "pays", 1);
    }

    @Decorators.it("selectionner un element dans l'autocomplete master et mise à jour de l'autocomplete slave pour sélection de l'élement 5")
    testSelectWithSlave() {
        this.paysDataSourceOnSelectListener();
        this.eventEmitter.on(this.getTestId() + "villeDataSourceOnFilter", (results: any[]) => {
            if (results.length != 0) {
                expect(_.isEqual(results.length, 3), ("testSelectWithSlave-L'autocomplete ville est mis à jour pour contenir les résultats liés à la sélection de l'autocomplete pays")).to.be.true;
                setTimeout(() => {
                    let elts = document.querySelectorAll("#" + this.getTestId() + "villeDiv" + " .autocomplete-item");
                    expect(_.isEqual(elts.length, 3), ("testSelectWithSlave-L'autocomplete ville est mis à jour et dans le DOM on trouve bien les " + elts.length + " villes filtrées pour le pays sélectioné :" + 3)).to.be.true;
                    this.triggerFocusOnElement(this.getDOMElement("ville"));
                    this.triggerKeydownEvent(this.getDOMElement("ville"), "n", 78, true);
                    setTimeout(() => {
                        this.triggerKeydownEvent(this.getDOMElement("ville"), "a", 65, true);
                        setTimeout(() => {
                            this.triggerKeydownEvent(this.getDOMElement("ville"), "n", 78, true);
                            setTimeout(() => {
                                this.triggerKeydownEvent(this.getDOMElement("ville"), "t", 84, true);
                                setTimeout(() => {
                                    this.triggerKeydownEvent(this.getDOMElement("ville"), "e", 69, true);
                                    setTimeout(() => {
                                        this.triggerKeydownEvent(this.getDOMElement("ville"), "s", 83, true);
                                        setTimeout(() => {
                                            this.triggerKeydownEvent(this.getDOMElement("ville"), "enter", 13);
                                            setTimeout(() => {
                                                expect(_.isEqual(this.villeDataSources[ this.currentTest ].selected, "5"), ("testSelectWithSlave-L'élément sélectionné dans le villeDataSource " + this.villeDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 5)).to.be.true;
                                                this.end();
                                            }, 500);
                                        }, 250);
                                    }, 250);
                                }, 250);
                            }, 250);
                        }, 250);
                    }, 250);
                }, 250);
            }
        });
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.selectItemOnClick("paysDiv", "pays", 1);
    }

    @Decorators.it("selectionner via un element autoselectionné dans l'autocomplete master et mise à jour de l'autocomplete slave pour sélection de l'élement 5")
    testAutoSelectWithSlave() {
        this.paysDataSourceOnSelectListener();
        this.eventEmitter.on(this.getTestId() + "villeDataSourceOnFilter", (results: any[]) => {

            if (results.length != 0) {
                expect(_.isEqual(results.length, 3), ("testAutoSelectWithSlave-L'autocomplete ville est mis à jour pour contenir les résultats liés à la sélection de l'autocomplete pays")).to.be.true;
                setTimeout(() => {
                    let elts = document.querySelectorAll("#" + this.getTestId() + "villeDiv" + " .autocomplete-item");
                    expect(_.isEqual(elts.length, 3), ("testAutoSelectWithSlave-L'autocomplete ville est mis à jour et dans le DOM on trouve bien les " + elts.length + " villes filtrées pour le pays sélectioné :" + 3)).to.be.true;
                    this.triggerFocusOnElement(this.getDOMElement("ville"));
                    this.triggerKeydownEvent(this.getDOMElement("ville"), "n", 78, true);
                    setTimeout(() => {
                        this.triggerKeydownEvent(this.getDOMElement("ville"), "a", 65, true);
                        setTimeout(() => {
                            this.triggerKeydownEvent(this.getDOMElement("ville"), "n", 78, true);
                            setTimeout(() => {
                                this.triggerKeydownEvent(this.getDOMElement("ville"), "t", 84, true);
                                setTimeout(() => {
                                    this.triggerKeydownEvent(this.getDOMElement("ville"), "e", 69, true);
                                    setTimeout(() => {
                                        this.triggerKeydownEvent(this.getDOMElement("ville"), "s", 83, true);
                                        setTimeout(() => {
                                            expect(_.isEqual(this.villeDataSources[ this.currentTest ].selected, "5"), ("testAutoSelectWithSlave-L'élément sélectionné dans le villeDataSource " + this.villeDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 5)).to.be.true;
                                            this.end();
                                        }, 1000);
                                    }, 250);
                                }, 250);
                            }, 250);
                        }, 250);
                    }, 250);
                }, 250);
            }
        });
        autoCompleteLieesElements = this.renderIntoDocument(elements, this.getTestId());
        this.triggerFocusOnElement(this.getDOMElement("pays"));
        this.triggerKeydownEvent(this.getDOMElement("pays"), "f", 70, true);
        setTimeout(() => {
            this.triggerKeydownEvent(this.getDOMElement("pays"), "r", 82, true);
            setTimeout(() => {
                this.triggerKeydownEvent(this.getDOMElement("pays"), "a", 65, true);
                setTimeout(() => {
                    this.triggerKeydownEvent(this.getDOMElement("pays"), "n", 78, true);
                    setTimeout(() => {
                        this.triggerKeydownEvent(this.getDOMElement("pays"), "c", 67, true);
                        setTimeout(() => {
                            this.triggerKeydownEvent(this.getDOMElement("pays"), "e", 69, true);
                        }, 250);
                    }, 250);
                }, 250);
            }, 250);
        }, 250);
    }


    /** Méthodes */

    private checkPaysDataSourceSelectedValue() {
        expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "1"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " ne doit pas être identique à l'élément suivant : " + 1)).to.be.false;
        expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "2"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " doit être identique à l'element suivant : " + 2)).to.be.true;
        expect(_.isEqual(this.paysDataSources[ this.currentTest ].selected, "3"), ("L'élément sélectionné dans le paysDataSource " + this.paysDataSources[ this.currentTest ].selected + " ne doit pas être identique à l'élément suivant : " + 3)).to.be.false;
    }

    private paysDataSourceOnSelectListener() {
        this.eventEmitter.on(this.getTestId() + "paysDataSourceOnSelect", (value: any) => {
            expect(_.isEqual(value, "2"), ("la valeur passée par l'event select de paysDataSource " + value + " doit être identique à la valeur suivante : " + 2)).to.be.true;
            this.checkPaysDataSourceSelectedValue();
        });
    }

    private getTestId(): string {
        return "test" + this.currentTest;
    }

    private selectItemOnClick(id: string, element: string, itemIndex: number) {
        this.mainElementClick(element);
        this.simulateMouseDownEvent(id, itemIndex);
    }

    private simulateMouseDownEvent(id: string, itemIndex: number) {
        let elts = document.querySelectorAll("#" + this.getTestId() + id + " .autocomplete-item");
        this.triggerMouseEvent(elts[ itemIndex ], "mousedown");
    }

    private mainElementClick(element: string) {
        let mainElement = this.getDOMElement(element);
        mainElement.click();
    }

    private getDOMElement(element: string) {
        let mainElement: any = (document.querySelector("#" + this.getTestId() + element) as any);
        return mainElement;
    }

    private emiteEventforArrayResults(idTest: string, eventName: string) {
        return (results: any[]) => {
            this.eventEmitter.emit(idTest + eventName, results);
        }
    }

    private emiteEventForAnyValue(idTest: string, eventName: string) {
        return (result: any) => {
            this.eventEmitter.emit(idTest + eventName, result);
        }
    }
}

//lancement des Tests
runTest(new AutoCompleteFieldLieesTest());