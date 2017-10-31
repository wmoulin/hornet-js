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

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
const logger: Logger = Utils.getLogger("hornet-js-core.monitoring.monitor");
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
        //Utils.getLogger("hornet-js-utils").error("La variable d'environnement 'HORNET_GLOBAL_MODULE_DIR' n'est pas définie. Impossible de charger un module global !!");
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

export class Monitor {
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
        if (Utils.config.has("server.portMonitor")) {
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
            this.monitorServer.listen(Utils.config.get("server.portMonitor"), "0.0.0.0")
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
        Utils.getContinuationStorage().bindEmitter(req);
        Utils.getContinuationStorage().bindEmitter(res);
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
        Utils.getContinuationStorage().bindEmitter(socket);
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
        this.connexion.max = this.server.maxConnections;
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
