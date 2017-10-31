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
const expect: any = TestUtils.chai.expect;
const sinon = TestUtils.sinon;
import { Utils } from "src/index";

describe("Index", () => {
    let bean1 = {
        name: "myBean1"
    }, bean2 = {
        name: "myBean2"
    };

    it("should registerGlobal", () => {
        expect(Utils.registerGlobal("some", bean1)).to.be.equal(bean1);
    });
    it("should not re-registerGlobal", () => {
        expect(Utils.registerGlobal("some", bean2))
            .to.exist
            .to.be.equal(bean1);
    });
    it("should registerConfig", () => {

        expect(Utils.config.get("server.port")).to.be.equal(11111);
    });

    describe("getContextPath", () => {

        it("should not modify well formed url", () => {
            // Arrange
            let contextPath = "/" + TestUtils.randomString() + "noslash";
            Utils.setConfigObj({
                contextPath: contextPath
            });

            // Act
            let expected = Utils.getContextPath();

            // Assert
            expect(expected).to.equals(contextPath);
        });

        it("should modify bad formated url", () => {
            // Arrange
            let contextPath = TestUtils.randomString();
            Utils.setConfigObj({
                contextPath: contextPath + "/"
            });

            // Act
            let expected = Utils.getContextPath();

            // Assert
            expect(expected).to.equals("/" + contextPath);
        });

        it("should register contextPath for reusability", () => {
            // Arrange
            Utils.setConfigObj({
                contextPath: TestUtils.randomString() + "/"
            });

            // Act
            let expected = Utils.getContextPath();
            Utils.getContextPath();

            // Assert
            expect((<any>Utils)._contextPath).to.equals(expected);
        });
    });

    describe("buildContextPath", () => {

        let defaultContextPath = undefined;
        beforeEach(() => {
            defaultContextPath = "/" + TestUtils.randomString() + "noslash";
            sinon.stub(Utils, "getContextPath").returns(defaultContextPath);
        });

        afterEach(() => {
            (<any>Utils.getContextPath).restore();
        });

        it("should not add contextPath if not starting with /", () => {
            // Arrange
            let url = "noslash" + TestUtils.randomString();

            // Act
            let expected = Utils.buildContextPath(url);

            // Assert
            expect(expected).to.equals(url);
        });

        it("should not modify absolute url", () => {
            // Arrange
            let url = "http://" + TestUtils.randomString();

            // Act
            let expected = Utils.buildContextPath(url);

            // Assert
            expect(expected).to.equals(url);
        });

        it("should add contextPath if starting with /", () => {
            // Arrange
            let url = "/" + TestUtils.randomString();

            // Act
            let expected = Utils.buildContextPath(url);

            // Assert
            expect(expected).to.equals(defaultContextPath + url);
        });

        it("should not add contextPath multiple time", () => {
            // Arrange
            let url = defaultContextPath + TestUtils.randomString();

            // Act
            let expected = Utils.buildContextPath(url);

            // Assert
            expect(expected).to.equals(url);
        });

        it("should remove trailing slash", () => {
            // Arrange
            let url = "/" + TestUtils.randomString();

            // Act
            let expected = Utils.buildContextPath(url + "/");

            // Assert
            expect(expected).to.equals(defaultContextPath + url);
        });

        it("should do nothing without url", () => {
            // Arrange

            // Act
            let expected = Utils.buildContextPath();

            // Assert
            expect(expected).to.equals(defaultContextPath);
        });

    });
});
