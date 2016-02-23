"use strict";

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.monitoring.monitor");
var onHeaders = require("on-headers");
var eventLoopMonitor = require("event-loop-monitor");
var v8 = require("v8");
import http = require("http");
import https = require("https");
import path = require("path");
var Module = require("module").Module;

function requireGlobal(moduleName) {
    var globalDir = process.env["HORNET_GLOBAL_MODULE_DIR"];
    if (!globalDir) {
        throw new Error("La variable d'environnement 'HORNET_GLOBAL_MODULE_DIR' n'est pas définie. Impossible de charger un module global !!");
    }
    // On rétabli temporairement le fonctionnement normal de résolution des modules
    Module._nodeModulePaths = Module._oldNodeModulePaths;
    try {
        var mod = require(path.join(globalDir, moduleName));
    } finally {
        // On réactive la résolution Hornet des modules
        Module._nodeModulePaths = Module._newNodeModulePaths;
    }

    return mod;
}

var GC_STATISTICS_OBJECT_KEY = "hornetGCStatistics";
try {
    var hornetGcMonitor = requireGlobal("hornet-js-gc-monitor");

    // Démarrage du module, les statistiques seront disponibles dans "process[GC_STATISTICS_OBJECT_KEY]"
    hornetGcMonitor.start(GC_STATISTICS_OBJECT_KEY);
} catch (e) {
    if (process.env.NODE_ENV !== "production") {
        logger.warn("Erreur lors du chargement du module 'hornet-js-gc-monitor', les statistiques du garbage collector seront indisponibles !!");
    } else {
        logger.error("Erreur lors du chargement du module 'hornet-js-gc-monitor', les statistiques du garbage collector seront indisponibles !!\n", e);
    }
}

class Monitor {
    private server;
    private monitorServer;
    private connexion = {
        max: 0,
        available: 0,
        opened: 0,
        active: 0,
        idle: 0,
        error: 0
    };
    private request = {
        received: 0,
        sendingReply: 0,
        completed: 0,
        error: 0
    };
    private eventLoopStats = {
        samples: [],
        sampleTimeInterval: 4000,
        sample1MinCount: 0,
        sample5MinCount: 0,
        sample15MinCount: 0,
        samplesToKeep: 0,
        stats: {
            average1min: {p50: 0, p90: 0, p95: 0, p99: 0, p100: 0},
            average5min: {p50: 0, p90: 0, p95: 0, p99: 0, p100: 0},
            average15min: {p50: 0, p90: 0, p95: 0, p99: 0, p100: 0}
        }
    };
    private api = {
        requestSended: 0,
        requestCompleted: 0,
        responseError: 0,
        requestError: 0,
        totalError: 0
    };

    constructor(server) {
        if (utils.config.has("server.portMonitor")) {
            this.monitorApiRequests();

            this.server = server;
            this.server.on("request", this.onRequest.bind(this));
            this.server.on("connection", this.onConnection.bind(this));
            this.connexion.max = this.connexion.available = this.server.maxConnections;

            // Préparation du nombre de sample à conserver par type
            this.eventLoopStats.sample1MinCount = 1 * 60 * 1000 / this.eventLoopStats.sampleTimeInterval;
            this.eventLoopStats.sample5MinCount = 5 * 60 * 1000 / this.eventLoopStats.sampleTimeInterval;
            this.eventLoopStats.sample15MinCount = 15 * 60 * 1000 / this.eventLoopStats.sampleTimeInterval;
            this.eventLoopStats.samplesToKeep = this.eventLoopStats.sample15MinCount;

            // Démarrage de event-loop-monitor avec son callback
            eventLoopMonitor.on("data", this.onEventLoopMonitorData.bind(this));
            eventLoopMonitor.resume();

            // Démarrage d'un server http dédié au monitoring

            this.monitorServer = http.createServer(this.monitorServerPage.bind(this));
            this.monitorServer.maxConnections = 50;
            this.monitorServer.timeout = 300000;
            this.monitorServer.listen(utils.config.get("server.portMonitor"), "0.0.0.0")
                .on("error", (err) => {
                    logger.error("Impossible de démarrer le serveur de monitoring... : ", err);
                    process.exit(1);
                });

        } else {
            logger.warn("La clé de configuration 'server.portMonitor' est introuvable. Le monitoring est désactivé !!")
        }
    }

    monitorApiRequests() {
        var _self = this;
        var _old_http_request = http.request;
        var _old_https_request = https.request;

        var _monitorRequest = (req) => {
            _self.api.requestSended++;
            req.once("error", () => {
                _self.api.requestError++;
                _self.api.totalError++;
            });
            req.once("response", (res) => {
                res.once("end", () => {
                    _self.api.requestCompleted++
                });
                res.once("error", () => {
                    _self.api.responseError++;
                    _self.api.totalError++;
                });
            });
            return req;
        };

        http.request = function () {
            return _monitorRequest(_old_http_request.apply(http, arguments));
        };

        https.request = function () {
            return _monitorRequest(_old_https_request.apply(https, arguments));
        };
    }

    /**
     * Callback qui réceptionne les données du module 'event-loop-monitor'
     * Les moyennes sont mises à jour avec les dernières données
     *
     * @param data
     */
    onEventLoopMonitorData(data) {
        this.eventLoopStats.samples.unshift(data);
        this.eventLoopStats.samples.length = Math.min(this.eventLoopStats.samples.length, this.eventLoopStats.samplesToKeep);

        this.eventLoopStats.stats.average1min = this.computeAverage(this.eventLoopStats.sample1MinCount);
        this.eventLoopStats.stats.average5min = this.computeAverage(this.eventLoopStats.sample5MinCount);
        this.eventLoopStats.stats.average15min = this.computeAverage(this.eventLoopStats.sample15MinCount);

        logger.trace("received 'event-loop-monitor' data : ", data);
    }

    /**
     * Calcule la moyenne des 'count' derniers éléments des données
     *
     * @param count
     * @returns {{p50: number, p90: number, p95: number, p99: number, p100: number}}
     */
    computeAverage(count) {
        var med50p = 0, med90p = 0, med95p = 0, med99p = 0, med100p = 0;
        var realCount = Math.min(count, this.eventLoopStats.samples.length);
        var sample;
        for (var i = 0; i < realCount; i++) {
            sample = this.eventLoopStats.samples[i];
            med50p += sample.p50;
            med90p += sample.p90;
            med95p += sample.p95;
            med99p += sample.p99;
            med100p += sample.p100;
        }

        return {
            p50: Math.round(med50p / realCount),
            p90: Math.round(med90p / realCount),
            p95: Math.round(med95p / realCount),
            p99: Math.round(med99p / realCount),
            p100: Math.round(med100p / realCount)
        };
    }

    /**
     * Callback sur la réception d'une requête par le serveur
     * @param req
     * @param res
     */
    onRequest(req, res) {
        utils.getContinuationStorage().bindEmitter(req);
        utils.getContinuationStorage().bindEmitter(res);
        this.request.received++;
        this.connexion.idle = this.connexion.opened - ++this.connexion.active;
        onHeaders(res, () => {
            this.request.sendingReply++;
            logger.trace("Les headers HTTP vont être envoyés au client !!");
        });
        req.once("abort", () => {
            this.request.sendingReply = Math.max(0, this.request.sendingReply - 1);
            logger.trace("La requête HTTP a été abortée !!");
        });
        res.once("end", () => {
            this.request.sendingReply = Math.max(0, this.request.sendingReply - 1);
            logger.trace("La réponse HTTP a été abortée !!");
        });
        res.once("abort", () => {
            this.request.sendingReply = Math.max(0, this.request.sendingReply - 1);
            logger.trace("La réponse HTTP a été abortée !!");
        });
        res.once("close", () => {
            this.request.sendingReply = Math.max(0, this.request.sendingReply - 1);
            this.connexion.active = Math.max(0, this.connexion.active - 1);
            this.request.error++;
            this.connexion.idle = this.connexion.opened - this.connexion.active;
            logger.trace("La réponse HTTP s'est fermée en erreur !!");
        });
        res.once("finish", () => {
            this.request.sendingReply = Math.max(0, this.request.sendingReply - 1);
            this.connexion.active = Math.max(0, this.connexion.active - 1);
            this.request.completed++;
            this.connexion.idle = this.connexion.opened - this.connexion.active;
            logger.trace("La réponse HTTP a été correctement envoyée au client !!");
        });
    }

    /**
     * Callback sur l'établissement d'une nouvelle connexion TCP par le serveur
     * @param req
     * @param res
     */
    onConnection(socket) {
        utils.getContinuationStorage().bindEmitter(socket);
        this.connexion.idle = ++this.connexion.opened - this.connexion.active;
        this.connexion.available = this.connexion.max - this.connexion.opened;

        socket.once("close", () => {
            this.connexion.opened = Math.max(0, this.connexion.opened - 1);
            this.connexion.idle = this.connexion.opened - this.connexion.active;
            this.connexion.available = this.connexion.max - this.connexion.opened;
            logger.trace("La connexion TCP a été fermée !!");
        });
        socket.once("error", () => {
            this.connexion.error++;
            logger.trace("Erreur sur la connexion TCP !!");
        });

        logger.trace("Une nouvelle connexion TCP s'est établie entre un client et le serveur !!");
    }

    monitorServerPage(req, res) {
        var memUsage = process.memoryUsage();
        var data = {
            process: {
                uptime: Math.ceil(process.uptime()),
                pid: process.pid,
                title: process.title,
                versions: process.versions
            },
            memory: {
                rss: memUsage.rss,
                heapTotal: memUsage.heapTotal,
                heapUsed: memUsage.heapUsed
            },
            heap: v8.getHeapStatistics(),
            gc: process[GC_STATISTICS_OBJECT_KEY] || "Statistiques du garbage collector indisponibles",
            server: {
                connection: this.connexion,
                request: this.request
            },
            api: this.api,
            eventLoop: this.eventLoopStats.stats
        };

        var dataStr = JSON.stringify(data);
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Connection": "close",
            "Content-length": dataStr.length,
            "Cache-Control": "private",
            "Pragma": "no-cache"
        });
        res.end(dataStr);
    }
}

export = Monitor;
