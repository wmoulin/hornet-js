declare module "hornet-js-test/src/abstract-test" {
	/**
	 * classe abstraite de Test
	 */
	export class AbstractTest {
	    /**
	     * Fonction de cloture du test
	     **/
	    protected endft: Function;
	    /**
	     * Fonction à appeler pour cloturer un test
	     * @param {Error} err : err s'il en existe une
	     **/
	    end(err?: Error): void;
	    /**
	     * Fonction à appeler pour insérer un element dans le dom
	     * @param {JSX.Element} element le composant react à insérer
	     * @param {string} id l'identifiant du conteneur html dans lequel sera placé cet element
	     **/
	    renderIntoDocument(element: JSX.Element, id: string): void | Element | __React.Component<any, __React.ComponentState>;
	    /**
	     * Fonction qui permet de catcher une exception pour un traitement asynchrone.
	     * @param {any} done fonction de fin de test.
	     **/
	    catchAsyncThrow(done: (any)): void;
	    /**
	     * Fonction qui permet de lancer des évènements du dom
	     * @param {domElement} node sur lequel on souhaite agir
	     * @param {string} eventType le type d'évènement qu'on souhaite lancer
	     **/
	    triggerMouseEvent(node: any, eventType: string): void;
	}
	
}

declare module "hornet-js-test/src/base-mocha-test" {
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
	 * hornet-js-test - Ensemble des composants pour les tests hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { AbstractTest } from "hornet-js-test/src/abstract-test";
	/**
	 * classe abstraite de Test
	 */
	export class BaseMochaTest extends AbstractTest {
	}
	
}

declare module "hornet-js-test/src/base-test" {
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
	 * hornet-js-test - Ensemble des composants pour les tests hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { AbstractTest } from "hornet-js-test/src/abstract-test";
	import events = require("events");
	/**
	 * classe abstraite de Test
	 */
	export class BaseTest extends AbstractTest {
	    /** Gestionnaire de déclenchements d'évenements */
	    private _eventEmitter;
	    catchAsyncThrow(done: (any)): void;
	    readonly eventEmitter: events.EventEmitter;
	}
	
}

declare module "hornet-js-test/src/decorators" {
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
	 * hornet-js-test - Ensemble des composants pour les tests hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * interface des annatations
	 */
	export interface Annotes {
	    before?: string;
	    beforeEach?: string;
	    after?: string;
	    it?: string;
	    xit?: string;
	    describe?: string;
	}
	/**
	 * annotation values
	 * @type {{before: string; beforeEach: string; after: string; it: string; describe: string}}
	 */
	export let Annotations: Annotes;
	/**
	 *
	 * @type {{before: any; beforeEach: any; after: any; it: ((testName)=>any); describe: ((suiteName)=>(suite)=>any)}}
	 */
	export let Decorators: {
	    before: any;
	    beforeEach: any;
	    after: any;
	    it(testName: any, fnt?: any): any;
	    xit(testXit: any): any;
	    describe(suiteName: any): (suite: any) => void;
	};
	
}

declare module "hornet-js-test/src/hornet-react-test" {
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
	 * hornet-js-test - Ensemble des composants pour les tests hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { BaseTest } from "hornet-js-test/src/base-test";
	/**
	 * classe abstraite de Test pour les composants React
	 */
	export class HornetReactTest extends BaseTest {
	    isPreventDefault: boolean;
	    isStopPropagation: boolean;
	    /**
	     * Fonction qui permet de lancer des évènements du dom
	     * @param {domElement} node sur lequel on souhaite agir
	     * @param {string} eventType le type d'évènement qu'on souhaite lancer
	     **/
	    triggerMouseEvent(node: any, eventType: string): void;
	    private handleChangeValueOnElement(changeValue, element, valueKey);
	    /**
	     * Fonction déclenchant un keydown event sur un élement du DOM
	     * @param element element du DOM
	     * @param valueKey valeur "print" de la touche
	     * @param keyCode
	     * @param changeValue
	     */
	    protected triggerKeydownEvent(element: any, valueKey: string, keyCode: number, changeValue?: boolean): void;
	    /**
	     * Fonction déclenchant un keypress event sur un élement du DOM
	     * @param element element du DOM
	     * @param valueKey valeur "print" de la touche
	     * @param keyCode
	     * @param changeValue
	     */
	    protected triggerKeyPressEvent(element: any, valueKey: string, keyCode?: number, changeValue?: boolean): void;
	    /**
	     * Fonction pour la prise de focus sur un élement du DOM
	     * @param element élément du DOM
	     */
	    protected triggerFocusOnElement(element: any): void;
	}
	
}

declare module "hornet-js-test/src/react-test-utils" {
	/**
	 * Utilitaire de rendu React pour tests unitaires
	 */
	export class ReactTestUtils {
	    /**
	     * Enrichi l'objet $ fourni afin de réaliser l'intégration chai-jquery / cheerio
	     * @param $
	     * @returns {*|jQuery|HTMLElement}
	     */
	    private static prepare($);
	    private static renderInternal(elementToRender);
	    /**
	     * Fonction de rendu React de test
	     * @param renderToTest fonction de rendu à tester
	     * @param context contexte React
	     * @returns {CheerioStatic} le rendu sous forme d'un objet Cheerio
	     */
	    static render(renderToTest: () => JSX.Element): CheerioStatic;
	}
	
}

declare module "hornet-js-test/src/test-logger" {
	export class TestLogger {
	    static noTid: string;
	    static noUser: string;
	    /**
	     * Liste des tokens qui sont mis à disposition par Hornet dans le pattern des appender log4js
	     */
	    static appenderLayoutTokens: {
	        "fn": () => string;
	    };
	    /**
	     * Fonction d'ajout de token pour utilisation dans un pattern log4js
	     * Si besoin spécifique d'une application, cette fonction permet
	     * d'ajouter de nouveaux tokens en plus de ceux fournis par défaut
	     * @param tokenWithFunc : objet de la forme {"token":function(){return "valeur"}}
	     */
	    static addLayoutTokens(tokenWithFunc: any): void;
	    /**
	     * Retourne une fonction destinée à initialiser les loggers de l'application côté serveur
	     * @param logConfig Le configuration log
	     * @returns {function(any): undefined}
	     */
	    static getLoggerBuilder(logConfig: any): (category: any) => void;
	    /**
	     * Récupère le nom de la fonction appelante,
	     * [mantis 0055464] en évitant de ramener l'appel du logger, qui ne nous intéresse pas :
	     * on remonte la pile d'appels en cherchant le code applicatif à l'origine de la log.
	     *
	     * Si la "vraie" fonction appelante n'est pas trouvée dans la pile,
	     * alors par défaut on utilise le paramètre d'entrée callStackSize
	     * qui indique le nombre arbitraire de niveaux à remonter dans la pile
	     * pour avoir la fonction appelante
	     *
	     */
	    static getFunctionName(callStackSize: number): string;
	}
	
}

declare module "hornet-js-test/src/test-run" {
	/**
	 * lanceur des tests
	 * @param suite
	 */
	export function runTest(suite: any): void;
	
}

declare module "hornet-js-test/src/test-utils" {
	export class TestUtils {
	    static chai: Chai.ChaiStatic;
	    static sinon: Sinon.SinonStatic;
	    static randomString(strLength?: number, charSet?: string): string;
	    /**
	     * Permet de démarrer une application Express sur le port premier port disponible à partir du port donné.
	     * Si l'application a bien démarrée, la fonction done est appellée avec l'instance de serveur et le port utilisé.
	     * Sinon, la fonction done est appellée
	     *
	     * @param app l'application Express
	     * @param port Le port initialement souhaité
	     * @param done la fonction à appeller lorsque l'application est démarré
	     */
	    static startExpressApp(app: any, port: number, done: (server: any, port: number, err: string) => void): void;
	    static startTest(test: string | number): void;
	}
	
}

declare module "hornet-js-test/src/test-wrapper" {
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
	 * hornet-js-test - Ensemble des composants pour les tests hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0-rc.4
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import * as React from "react";
	/**
	 * Propriétés du wrapper de test
	 */
	export interface TestWrapperProps {
	    /** Fonction de rendu à tester */
	    elements: () => JSX.Element;
	}
	/**
	 * Wrapper React de test
	 */
	export class TestWrapper extends React.Component<TestWrapperProps, any> {
	    /**
	     * @inheritDoc
	     */
	    render(): JSX.Element;
	}
	
}
