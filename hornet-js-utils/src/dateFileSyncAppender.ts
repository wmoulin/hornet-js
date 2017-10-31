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

let debug = require("log4js/lib/debug")("dateFileSync");
let layouts = require("log4js/lib/layouts");
let path = require("path");
let fs = require("fs");
let os = require("os");
let eol = os.EOL || "\n";
let format = require("log4js/lib/date_format");

class DateRollingFileSync {
    private currentSize: number;
    private baseFilename: string;
    private filename: string;
    private pattern: string;
    private options: any;
    private now: Function;
    private previousTime: Date;
    private lastTimeWeWroteSomething: Date;
    private alwaysIncludePattern: boolean;

    /**
     * Constructeur
     * @param filename
     * @param pattern
     * @param options
     * @param now
     */
    constructor(filename: string, pattern: any, options: any, now?: Function) {
        debug("In DateRollingFileSync");

        this.filename = filename;
        this.options = options || {encoding: "utf8", mode: parseInt("0644", 8), flags: "a"};

        debug("Now is " + now);
        if (pattern && typeof(pattern) === "object") {
            now = options;
            options = pattern;
            pattern = null;
        }
        this.pattern = pattern || ".yyyy-MM-dd";
        this.now = now || Date.now;

        if (fs.existsSync(filename)) {
            let stat = fs.statSync(filename);
            this.lastTimeWeWroteSomething = format.asString(this.pattern, stat.mtime);
        } else {
            this.lastTimeWeWroteSomething = format.asString(this.pattern, new Date(this.now()));
        }

        this.baseFilename = filename;
        this.alwaysIncludePattern = false;

        if (options) {
            if (options.alwaysIncludePattern) {
                this.alwaysIncludePattern = true;
                filename = this.baseFilename + this.lastTimeWeWroteSomething;
            }
            delete options.alwaysIncludePattern;
            if (Object.keys(options).length === 0) {
                options = null;
            }
        }
        debug("this.now is " + this.now + ", now is " + now);


        this.throwErrorIfArgumentsAreNotValid();

    }

    /**
     * Checks arguments
     */
    private throwErrorIfArgumentsAreNotValid() {
        if (!this.filename) {
            throw new Error("You must specify a filename");
        }
    }

    /**
     * Checks if the current file should be rolled based on the pattern
     * @returns {boolean}
     */
    public shouldRoll(): boolean {
        let lastTime = this.lastTimeWeWroteSomething,
            thisTime = format.asString(this.pattern, new Date(this.now()));

        debug("DateRollingFileStream.shouldRoll with now = " +
            this.now() + ", thisTime = " + thisTime + ", lastTime = " + lastTime);

        this.lastTimeWeWroteSomething = thisTime;
        this.previousTime = lastTime;

        return thisTime !== lastTime;
    }

    /**
     * Rolls the current file
     * @param filename
     */
    public roll(filename: string): void {
        debug("Starting roll");

        if (this.alwaysIncludePattern) {
            this.filename = this.baseFilename + this.lastTimeWeWroteSomething;
        } else {
            let newFilename = this.baseFilename + this.previousTime;
            try {
                fs.unlinkSync(newFilename);
            } catch (e) {
                //ignore err: if we could not delete, it's most likely that it doesn't exist
            }
            fs.renameSync(filename, newFilename);
        }
    }

    /**
     * Logs the chunk, rolls the current file if necessary
     * @param chunk
     * @param encoding
     */
    public write(chunk, encoding): void {
        let that = this;

        function writeTheChunk() {
            debug("writing the chunk to the file");
            that.currentSize += chunk.length;
            fs.appendFileSync(that.filename, chunk, encoding);
        }

        debug("in write");

        if (this.shouldRoll()) {
            this.currentSize = 0;
            this.roll(this.filename);
        }

        writeTheChunk();
    }
}

/**
 * File appender that rolls files according to a date pattern.
 * @filename base filename.
 * @pattern the format that will be added to the end of filename when rolling,
 *          also used to check when to roll files - defaults to ".yyyy-MM-dd"
 * @layout layout function for log messages - defaults to basicLayout
 * @timezoneOffset optional timezone offset in minutes - defaults to system local
 */
export function appender(filename: string, pattern: any, alwaysIncludePattern: boolean, layout: Function, timezoneOffset: number) {
    layout = layout || layouts.basicLayout;

    let logFile = new DateRollingFileSync(
        filename,
        pattern,
        {alwaysIncludePattern: alwaysIncludePattern}
    );

    return function(logEvent) {
        logFile.write(layout(logEvent, timezoneOffset) + eol, "utf8");
    };

}

/**
 * Configures the appender
 * @param config
 * @param options
 * @returns {function(any): undefined}
 */
export function configure(config: any, options?: any) {
    let layout;

    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }

    if (!config.alwaysIncludePattern) {
        config.alwaysIncludePattern = false;
    }

    if (options && options.cwd && !config.absolute) {
        config.filename = path.join(options.cwd, config.filename);
    }

    return appender(config.filename, config.pattern, config.alwaysIncludePattern, layout, config.timezoneOffset);
}
