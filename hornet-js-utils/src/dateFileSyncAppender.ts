"use strict";
var debug = require("log4js/lib/debug")("dateFileSync"),
    layouts = require("log4js/lib/layouts"),
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    eol = os.EOL || "\n",
    format = require("log4js/lib/date_format");

class DateRollingFileSync {
    private currentSize:number;
    private baseFilename:string;
    private filename:string;
    private pattern:string;
    private options:any;
    private now:Function;
    private previousTime:Date;
    private lastTimeWeWroteSomething:Date;
    private alwaysIncludePattern:boolean;

    /**
     * Constructeur
     * @param filename
     * @param pattern
     * @param options
     * @param now
     */
    constructor(filename:string, pattern:any, options:any, now?:Function) {
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
            var stat = fs.statSync(filename);
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
    public shouldRoll():boolean {
        var lastTime = this.lastTimeWeWroteSomething,
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
    public roll(filename:string):void {
        debug("Starting roll");

        if (this.alwaysIncludePattern) {
            this.filename = this.baseFilename + this.lastTimeWeWroteSomething;
        } else {
            var newFilename = this.baseFilename + this.previousTime;
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
    public write(chunk, encoding):void {
        var that = this;

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
export function appender(filename:string, pattern:any, alwaysIncludePattern:boolean, layout:Function, timezoneOffset:number) {
    layout = layout || layouts.basicLayout;

    var logFile = new DateRollingFileSync(
        filename,
        pattern,
        {alwaysIncludePattern: alwaysIncludePattern}
    );

    return function (logEvent) {
        logFile.write(layout(logEvent, timezoneOffset) + eol, "utf8");
    };

}

/**
 * Configures the appender
 * @param config
 * @param options
 * @returns {function(any): undefined}
 */
export function configure(config:any, options?:any) {
    var layout;

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
