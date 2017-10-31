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
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */
import { AbstractTest } from "hornet-js-test/src/abstract-test";
import { Utils } from "hornet-js-utils";
/**
 * hornet-js-test - Ensemble des composants pour les tests hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */
////////////////////////////////////////////////////////////////////////////////////////////////////
// Bootstrap de lancement de l'application
// permet la résolution de modules dans des répertoires autres que "node_modules"
var Module = require("module").Module;
import * as fs from "fs";
import * as path from "path";

var appDirectory = process.cwd();
var moduleDirectoriesContainer = [];
var moduleDirectories = [];
// On conserve la méthode originale pour rétablir le fonctionnement normal en cas d'un requireGlobal
Module._oldNodeModulePaths = Module._nodeModulePaths;

var NODE_MODULES_APP = path.join("node_modules", "test");


// on surcharge la méthode de résolution interne nodejs pour gérer d'autres répertoires
Module._newNodeModulePaths = function (from) {
    var paths = [];
    var matched = matchModuleDirectory(from);

    moduleDirectoriesContainer.forEach((path) => {
        paths.push(path);
    });
    paths.push(path.join(appDirectory, NODE_MODULES_APP));
    paths.push(path.join(matched || appDirectory));

    return paths;
};
Module._nodeModulePaths = Module._newNodeModulePaths;

function matchModuleDirectory(from) {
    var match = null, len = 0;
    for (var i = 0; i < moduleDirectories.length; i++) {
        var mod = moduleDirectories[ i ];
        if (from.indexOf(mod + path.sep) === 0 && mod.length > len) {
            match = mod;
            len = mod.length;
        }
    }
    return match;
}

function addModuleDirectory(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectories.indexOf(path2add) === -1) {
        moduleDirectories.push(path2add);
    }
}

function addModuleDirectoryContainer(path2add) {
    path2add = path.normalize(path2add);
    if (moduleDirectoriesContainer.indexOf(path2add) === -1) {
        moduleDirectoriesContainer.push(path2add);
    }
}

function isNodeModule(directory) {
    // si un fichier 'package.json' existe, c'est un module nodejs
    var isModule = false;
    try {
        fs.statSync(path.normalize(path.join(directory, "package.json")));
        isModule = true;
    } catch (e) {
        isModule = false;
    }
    return isModule;
}

// Lecture et ajout dans le resolver des répertoires externes déclarés par le package courant
try {
    var builder = require(path.join(process.cwd(), "builder.js"));
    var os = require("os");
    let parentBuilderFile = path.join(process.cwd(), "../", "builder.js")
    if (!builder.externalModules || !builder.externalModules.directories){
        builder.externalModules = {directories : [], enabled : true};
    }
    if (fs.existsSync(parentBuilderFile)) {
        let parentBuilderJs = require(parentBuilderFile);
        if (parentBuilderJs.type === "parent") {
                addModuleDirectoryContainer(path.normalize(path.join(process.cwd(), "..")));
                builder.externalModules.directories.push(path.join(process.cwd(), ".."));
        }
    }

    if (builder.externalModules && builder.externalModules.enabled && builder.externalModules.directories && builder.externalModules.directories.length > 0) {

        builder.externalModules.directories.forEach(function (directory) {
            try {
                directory = directory.replace("~", os.homedir());
                var stat = fs.statSync(directory);
                if (stat.isDirectory()) {

                    if (isNodeModule(directory)) {
                        addModuleDirectory(directory);
                        addModuleDirectoryContainer(path.normalize(path.join(directory, "..")));
                        console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme module nodejs");
                        console.log("MODULE RESOLVER > le répertoire '" + (path.normalize(path.join(directory, ".."))) + "' est déclaré comme container de module nodejs");
                    }
                    // on vérifie si des répertoires du 1er niveau sont des modules nodejs pour les ajouter eux aussi
                    var files = fs.readdirSync(directory);
                    var moduleFound = false;
                    files.forEach(function (file) {
                        let modPath = path.normalize(path.join(directory, file));
                        if (fs.statSync(modPath).isDirectory()) {
                            if (file.indexOf(".") === 0) return;

                            if (isNodeModule(modPath)) {
                                addModuleDirectory(modPath);
                                let projetModules = path.join(modPath, "node_modules", "app");
                                console.log("MODULE RESOLVER > le répertoire '" + projetModules + "' est déclaré comme container de module nodejs");
                                addModuleDirectoryContainer(projetModules);
                                moduleFound = true;
                                console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est déclaré comme module nodejs");
                            } else {
                                console.log("MODULE RESOLVER > le répertoire '" + modPath + "' est ignoré car ce n'est pas un module nodejs")
                            }
                        }
                    });
                    if (moduleFound) {
                        console.log("MODULE RESOLVER > le répertoire '" + directory + "' est déclaré comme container de module nodejs");
                        addModuleDirectoryContainer(directory);
                    }
                }
            } catch (e) {
                console.log("MODULE RESOLVER > erreur lors de la déclaration du répertoire externe '" + directory + "' :", e);
                process.exit(1);
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestion du cas particulier du main (car nodejs le considère différent des autres modules ...)  //
    require.main.paths = [];
    moduleDirectoriesContainer.forEach((path) => {
        require.main.paths.push(path);
    });
    require.main.paths.push(path.join(process.cwd()));
    require.main.paths.push(path.join(process.cwd(), NODE_MODULES_APP));

} catch (e) {
    // pas de fichier 'builder.js' >> mode production
    // on ignore en silence
    console.log(e)
}


/**
 * classe abstraite de Test
 */
export class BaseMochaTest extends AbstractTest{
}

