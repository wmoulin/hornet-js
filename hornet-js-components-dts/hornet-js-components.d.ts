declare module "hornet-js-components/src/component/iclient-initializer" {
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
	 * hornet-js-components - Interfaces des composants web de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { IHornetPage }  from "hornet-js-components/src/component/ihornet-page";
	/**
	 * Gère les étapes d'initialisation du client spécifiques au moteur de rendu
	 */
	export interface IClientInitializer<E> {
	    /**
	     * Initialise la page d'erreur technique par défaut
	     * @param errorPage page à afficher par défaut en cas d'erreur technique
	     */
	    initErrorComponent(errorPage: {
	        new (...args): IHornetPage<any, any>;
	    }): any;
	    /**
	     * Effectue les initialisations spécifiques au moteur de rendu utilisé
	     * @param event évènement indiquant que le premier composant à afficher est prêt à être chargé
	     */
	    initClientRendering(event: E): void;
	}
	
}

declare module "hornet-js-components/src/component/ihornet-component" {
	/**
	 * Propriétés d'un composant graphique Hornet
	 */
	export interface HornetComponentProps {
	    /** Référence vers le composant monté dans le DOM HTML */
	    var?: (component: IHornetComponent<HornetComponentProps, any>) => {};
	    children?: __React.ReactNode;
	}
	/**
	 * Propriétés d'un composant graphique Hornet
	 */
	export interface HornetComponentState {
	}
	/**
	 * Propriétés asynchrone d'un composant graphique Hornet
	 */
	export interface IHornetComponentAsync {
	    spinner?: boolean;
	    /**
	     * Méthode qui permet d'afficher le spinner du composant plutot que celui de la page.
	     */
	    showSpinnerComponent(): void;
	    /**
	     * Méthode qui permet de cacher le spinner du composant plutot que celui de la page.
	     */
	    hideSpinnerComponent(): void;
	}
	export interface IHornetComponentDatasource {
	    setDataSource(value: any): void;
	}
	export interface HornetComponentChoicesProps {
	    valueKey?: string;
	    labelKey?: string;
	}
	/**
	 * Composant graphique Hornet générant un rendu HTML.
	 */
	export interface IHornetComponent<P extends HornetComponentProps, S extends HornetComponentProps> {
	    /**
	     * Méhtode appelée par le moteur de rendu lorsque le composant va être monté dans le DOM HTML pour la première fois.
	     */
	    componentWillMount(): void;
	    /**
	     * Méthode appelée par le moteur de rendu lorsque le composant vient d'être monté dans le DOM HTML pour la première fois.
	     */
	    componentDidMount(): void;
	    /**
	     * Méthode appelée par le moteur de rendu lorsque l'état interne du composant va êtr mis à jour avec les propriétés
	     * et le contexte indiqués.
	     * @param nextProps nouvelles propriétés
	     * @param nextContext nouveau contexte
	     */
	    componentWillReceiveProps(nextProps: P, nextContext: any): void;
	    /**
	     * Méthode appelée par le moteur de rendu lorsque le rendu HTML du composant va être mis à jour suite à un changement
	     * de propriétés, d'état interne ou de contexte
	     * @param nextProps nouvelles propriétés
	     * @param nextState nouvel état du composant
	     * @param nextContext nouveau contexte
	     */
	    componentWillUpdate(nextProps: P, nextState: S, nextContext: any): void;
	    /**
	     * Méthode appelée par le moteur de rendu lorsque le rendu HTML du composant vient d'être être mis à jour suite à un changement
	     * de propriétés, d'état interne ou de contexte
	     * @param nextProps nouvelles propriétés
	     * @param nextState nouvel état du composant
	     * @param nextContext nouveau contexte
	     */
	    componentDidUpdate(prevProps: P, prevState: S, prevContext: any): void;
	    /**
	     * Méthode appelée par le moteur de rendu lorsque le composant va être démonté du DOM HTML.
	     */
	    componentWillUnmount(): void;
	    /**
	     * Renvoie le ou les messages internationalisés correspondant à la clé indiquée, après avoir remplacé les valeurs paramétrables
	     * avec celles indiquées.
	     * @param keysString clé de message internationalisé
	     * @param values valeurs de remplacement éventuelles
	     * @returns {any} une chaîne de caractères ou un objet contenant des messages
	     */
	    i18n(keysString: string, values?: any): any;
	}
	
}

declare module "hornet-js-components/src/component/ihornet-page" {
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
	 * hornet-js-components - Interfaces des composants web de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	import { HornetComponentProps, IHornetComponent }  from "hornet-js-components/src/component/ihornet-component";
	/**
	 * Composant de haut-niveau : correspond à une page.
	 */
	export interface IHornetPage<P extends HornetComponentProps, S> extends IHornetComponent<P, S> {
	    /**
	     * Permet d'effectuer les appels d'API et initialisations éventuellement nécessaires une fois le composant page
	     * monté côté client.
	     */
	    prepareClient(): void;
	    /**
	     * renvoie le service de la page
	     */
	    getService(): any;
	    /**
	 * Permet d'effectuer les appels d'API et initialisations éventuellement nécessaires une fois le composant page
	 * monté côté client et après le componentDidUpdate.
	 */
	    updateClient(): void;
	}
	
}

declare module "hornet-js-components/src/component/imenu-item" {
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
	 * hornet-js-components - Interfaces des composants web de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Propriétés d'un élément de menu
	 */
	export interface IMenuItem {
	    /** Identifiant unique au sein du menu */
	    id?: string;
	    /** URL éventuelle à atteindre lors d'un clic sur l'élément */
	    url?: string;
	    /** Clé du libellé dans les messages internationalisés */
	    text: string;
	    /** Clé de message internationalisé du texte dinfobulle affiché pour l'élément dans le plan de l'application */
	    title?: string;
	    /** Niveau de l'élément : 0 pour un élément à la racine d'un menu; 1 pour un élément d'un premier niveau de sous-menu; etc... */
	    level?: number;
	    /** Eléments de sous-menu de cet élément */
	    submenu?: Array<IMenuItem>;
	    /** Indique si l'élément doit être visible dans le menu */
	    visibleDansMenu: boolean;
	    /** Indique si l'élément doit être visible dans le plan */
	    visibleDansPlan?: boolean;
	    /** Nom de rôle ou liste de noms de rôles autorisé(s) à accéder à ce menu */
	    rolesAutorises?: string | string[];
	}
	
}

declare module "hornet-js-components/src/event/key-codes" {
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
	 * hornet-js-components - Interfaces des composants web de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	/**
	 * Enumération de valeurs pour DOM KeyboardEvent.keyCode.
	 * Cette attribut est obsolète
	 * (cf. https://www.w3.org/TR/DOM-Level-3-Events/#legacy-key-attributes)
	 * mais est mieux supporté que event.code ou event.key par les différents navigateurs
	 * et semble avoir des valeurs plus cohérentes entre navigateurs.
	 * Différences de valeurs pour event.code : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#Code_values)
	 * Safari ne prend pas en charge event.code et event.key : https://bugs.webkit.org/show_bug.cgi?id=149584,
	 * https://bugs.webkit.org/show_bug.cgi?id=69029
	 * IE ne prend pas en charge event.code */
	export enum KeyCodes {
	    BREAK = 3,
	    BACKSPACE = 8,
	    TAB = 9,
	    CLEAR = 12,
	    ENTER = 13,
	    SHIFT = 16,
	    CTRL = 17,
	    ALT = 18,
	    PAUSE = 19,
	    CAPS_LOCK = 20,
	    ESCAPE = 27,
	    SPACEBAR = 32,
	    PAGE_UP = 33,
	    PAGE_DOWN = 34,
	    END = 35,
	    HOME = 36,
	    LEFT_ARROW = 37,
	    UP_ARROW = 38,
	    RIGHT_ARROW = 39,
	    DOWN_ARROW = 40,
	    SELECT = 41,
	    PRINT = 42,
	    EXECUTE = 43,
	    PRINT_SCREEN = 44,
	    INSERT = 45,
	    DELETE = 46,
	    KEY_0 = 48,
	    KEY_6 = 54,
	    KEY_9 = 57,
	    FF_SLASH = 58,
	    KEY_A = 65,
	    KEY_C = 67,
	    KEY_V = 86,
	    KEY_X = 88,
	    WINDOWS_KEY = 91,
	    WINDOWS_KEY_RIGHT = 92,
	    WINDOWS_MENU = 93,
	    NUMPAD_0 = 96,
	    NUMPAD_1 = 97,
	    NUMPAD_2 = 98,
	    NUMPAD_3 = 99,
	    NUMPAD_4 = 100,
	    NUMPAD_5 = 101,
	    NUMPAD_6 = 102,
	    NUMPAD_7 = 103,
	    NUMPAD_8 = 104,
	    NUMPAD_9 = 105,
	    NUMPAD_MULTIPLY = 106,
	    NUMPAD_ADD = 107,
	    NUMPAD_SUBSTRACT = 109,
	    NUMPAD_DECIMAL_POINT = 110,
	    NUMPAD_DIVIDE = 111,
	    F1 = 112,
	    F2 = 113,
	    F3 = 114,
	    F4 = 115,
	    F5 = 116,
	    F6 = 117,
	    F7 = 118,
	    F8 = 119,
	    F9 = 120,
	    F10 = 121,
	    F11 = 122,
	    F12 = 123,
	    F13 = 124,
	    F14 = 125,
	    F15 = 126,
	    F16 = 127,
	    F17 = 128,
	    F18 = 129,
	    F19 = 130,
	    F20 = 131,
	    F21 = 132,
	    F22 = 133,
	    F23 = 134,
	    F24 = 135,
	    NUM_LOCK = 144,
	    SCROLL_LOCK = 145,
	    POINT = 190,
	    SLASH = 191,
	}
	export const KEYNAMES: {
	    ArrowUp: string;
	    ArrowDown: string;
	    Home: string;
	    Enter: string;
	};
	
}

declare module "hornet-js-components/src/utils/menu-constantes" {
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
	 * hornet-js-components - Interfaces des composants web de hornet-js
	 *
	 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
	 * @version v5.1.0
	 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
	 * @license CECILL-2.1
	 */
	export const MENU_ROOT: string;
	export const LVL_SEPARATOR: string;
	export const MASKED_CLASSNAME = "masked";
	export const HAVING_SUBMENU_CLASSNAME = "having-sub-nav";
	export const IMG_PATH = "/img/menu/";
	export const DOWN_ARROW_IMG = "picto_fleche.png";
	export const DOWN_ARROW_IMG_HOVER = "picto_fleche-hover.png";
	export const RIGHT_ARROW_IMG = "vertical-menu-submenu-indicator.png";
	export const RIGHT_ARROW_IMG_HOVER = "vertical-menu-submenu-indicator-hover.png";
	
}

declare module "hornet-js-components/src/utils/navigation-utils" {
	import { UserInformations } from "hornet-js-utils/src/authentication-utils";
	import { IMenuItem }  from "hornet-js-components/src/component/imenu-item";
	export interface NavigationItem {
	    submenu: Array<NavigationItem>;
	    text: string;
	    url: string;
	    visibleDansMenu: boolean;
	    visibleDansPlan: boolean;
	}
	/**
	 * Apporte des méthodes utilitaires pour gérer les aspects navigation (titre de pages, etc..)
	 */
	export class NavigationUtils {
	    /**
	     * Retourne toute la configuration Menu
	     * @returns {any}
	     */
	    static getConfigMenu(): any;
	    /**
	     *  Construit le tableau de menu en supprimant les liens auquel l'utilisateur n'a pas accès et en ajoutant les
	     * attributs id et level sur chaque item
	     * @param items
	     * @param user
	     * @param isForPlan
	     * @param itemParent
	     * @param level
	     * @returns {IMenuItem[]}
	     */
	    static getFilteredConfigNavigation(items: IMenuItem[], user: UserInformations, isForPlan?: boolean, itemParent?: IMenuItem, level?: number): IMenuItem[];
	    /**
	     * Retourne la clé de la configuration du menu associée à l'url courante
	     * @param navigationData
	     * @param currentUrl
	     * @return {NavigationItem|string}
	     */
	    static retrievePageTextKey(navigationData: Array<NavigationItem>, currentUrl: string): string;
	    static getCurrentItem(navigationData: Array<NavigationItem>, currentUrl: string): NavigationItem;
	    /**
	     * Retrouve l'item de la configuration du menu associé à l'url courante
	     * @param navigationData
	     * @param currentUrl
	     * @return {NavigationItem}
	     */
	    private static retrievePageTextItem(navigationData, currentUrl);
	    /**
	     * Retourne l'item ayant l'url la plus longue
	     * @param left
	     * @param right
	     * @return {NavigationItem}
	     */
	    private static getItemWithLongerUrl(left, right);
	    /**
	     * Change le titre de la page côté client
	     * @param titlePage
	     */
	    static applyTitlePageOnClient(titlePage: string): void;
	    /**
	     * Permet d'afficher un élément en lui ajoutant la classe MASKED_CLASSNAME (par défaut "masked")
	     * @param element
	     */
	    static hideElement(element: any): void;
	    /**
	     * teste si un element est visible dans la navigation
	     * @param element
	     * @returns {boolean}
	     */
	    static isVisible(element: any): boolean;
	    /**
	     * Permet de masquer un élément en lui ôtant la classe MASKED_CLASSNAME (par défaut "masked")
	     * @param element
	     */
	    static showElement(element: any): void;
	    /**
	     * Teste si un sous-menu existe
	     * @param element
	     * @returns {boolean}
	     */
	    static haveSubMenu(element: any): boolean;
	    /**
	     * Parcourt tout l'arbre d'un lien depuis son parent de plus haut niveau et affiche/masque ses parents
	     * @param element
	     * @param hideElement
	     * @param hideOthersNodesElements
	     */
	    static rideDownElementAndToggle(element: HTMLElement, hideElement?: boolean, hideOthersNodesElements?: boolean): void;
	    /**
	     * @param item
	     * @returns {boolean} true lorsqu'au moins un sous-menu est visible
	     */
	    static hasVisibleSubMenu(item: any): boolean;
	    /**
	     * Positionne le focus sur un élément selon son ID
	     * @param id identifiant HTML de l'élément
	     */
	    static setFocus(id: string): void;
	}
	
}
