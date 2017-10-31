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

import * as https from "https";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { AbstractRoutes, LazyRoutesClassResolver } from "src/routes/abstract-routes";
import { IHornetPage } from "hornet-js-components/src/component/ihornet-page";
import { IMenuItem } from 'hornet-js-components/src/component/imenu-item';


export interface ServerConfiguration {

    /**
     * Composant store pour la session. utilisé pour enregistrer la session.
     */
    sessionStore: any;

    /**
     * Répertoire courant du script, utilisé pour reconstruire les liens relatifs
     */
    serverDir: string;

    /**
     * Répertoire relatif (par rapport à la variable 'serverDir') vers les ressources statiques
     */
    staticPath: string;

    /**
     * Classe de création des routes. Voir la partie dédiée au routeur pour plus de détails
     */
    defaultRoutesClass: AbstractRoutes;

    /**
     * Composant principal à utiliser pour rendre les pages.
     * Ce composant est instancié par le routeur côté serveur et par le composant 'client' côté client.
     * Côté serveur, la page courante à rendre lui est fournie par le routeur grâce à la propriété 'composantPage'
     */
    appComponent: Class<IHornetPage<any, any>>;

    /**
     * Composant de layout à utiliser pour rendre le composant principal.
     * Ce composant est instancié par le routeur côté serveur.
     * Côté serveur, l'app à rendre lui est fournie par le routeur grâce à la propriété 'composantApp'
     */
    layoutComponent: Class<IHornetPage<any, any>>;

    /**
     * Composant page invoqué en lieu et place de la page courante à rendre en cas d'erreur non gérée par le routeur.
     */
    errorComponent: Class<IHornetPage<any, any>>;

    /**
     * Fonction de chargement des routes en mode lazy.
     * Elle prend en argument le nom du composant et retourne le composant chargé.
     * Coté serveur cette fonction effectue juste un 'require' du composant passé en paramètre.
     * @param routesFileName Le nom de la route à charger
     */
    routesLoaderfn?: LazyRoutesClassResolver;

    /**
     * Liste des répertoire contenant des routes à charger en Lazy
     */
    routesLoaderPaths: Array<string>;

    /**
     * Contexte des routes coté serveur par défaut "/services"
     */
    routesDataContext?: string;

    /**
     * Internationalisation peut être de type String (JSON) ou bien de type IntlLoader (cas plus complexe)
     */
    internationalization: any;

    /**
     * La configuration du menu
     */
    menuConfig?: IMenuItem[];

    /**
     * le path vers la page de login
     */
    loginUrl: string;

    /**
     * le path vers l'action de logout
     */
    logoutUrl: string;

    /**
     * le path vers la page d'accueil
     */
    welcomePageUrl: string;

    /**
     * Les prefixes de chemin considérés comme publiques (sans authentification)
     */
    publicZones?: String[];

    /**
     * Déclaration des options pour exécuter un serveur en mode https
     */
    httpsOptions?: https.ServerOptions;


}
