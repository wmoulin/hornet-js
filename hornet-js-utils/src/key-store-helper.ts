"use strict";

var fs = require("fs");
var https = require("https");
var _ = require("lodash");

/**
 * Interface décrivant une clé privée SSL
 */
export interface KeyOptions {
    file: string;
    passphrase?: string;
}

/**
 * Interface décrivant un conteneur de clés au format PKCS12
 */
export interface PKCS12Options {
    file: string;
    passphrase: string;
}

/**
 * Interface décrivant les options permettants de configurer le keystore
 */
export interface KeyStoreOptions {
    CAs?: Array<string>;
    CERTs?: Array<string>;
    KEYs?: Array<KeyOptions>;
    PKCS12?: PKCS12Options;
}

/**
 * Interface décrivant les options nodejs sur l'agent Https
 */
export interface AgentOptions {
    keepAlive?: boolean;
    keepAliveMsecs?: number;
    maxSockets?: number;
    maxFreeSockets?: number;
}

/**
 * Classe d'aide à la configuration de keystore pour des requêtes clients nodejs
 */
export class KeyStoreBuilder {

    /**
     * Construit un Agent https natif nodejs
     * @param agentOptions
     * @param keyStoreOptions
     * @returns {https.Agent}
     */
    public static buildHttpsAgent(agentOptions:AgentOptions = {}, keyStoreOptions:KeyStoreOptions = {}) {
        var CAs = KeyStoreBuilder.buildCAs(keyStoreOptions.CAs);
        var CERTs = KeyStoreBuilder.buildCERTs(keyStoreOptions.CERTs);
        var KEYs = KeyStoreBuilder.buildKEYs(keyStoreOptions.KEYs);
        var PKCS12 = KeyStoreBuilder.buildPKCS12(keyStoreOptions.PKCS12);

        var options = _.assign({}, agentOptions, {
            ca: CAs,
            cert: CERTs,
            key: KEYs
        }, PKCS12);

        return new https.Agent(options);
    }

    /**
     * Construit un Agent https natif nodejs et le défini comme agent par défaut
     * @param agentOptions
     * @param keyStoreOptions
     */
    public static setHttpsGlobalAgent(agentOptions?:AgentOptions, keyStoreOptions?:KeyStoreOptions) {
        https.globalAgent = KeyStoreBuilder.buildHttpsAgent(agentOptions, keyStoreOptions);
    }

    /**
     * Construit l'objet de configuration des autorités de certification
     * @param CAs
     * @returns {Array}
     */
    private static buildCAs(CAs:Array<string> = []) {
        var build = [];
        CAs.forEach((ca) => {
            try {
                build.push(fs.readFileSync(ca));
            } catch (e) {
                throw new Error("CA file '" + ca + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des certificats dans le cas d'authentification SSL
     * @param CERTs
     * @returns {Array}
     */
    private static buildCERTs(CERTs:Array<string> = []) {
        var build = [];
        CERTs.forEach((cert) => {
            try {
                build.push(fs.readFileSync(cert));
            } catch (e) {
                throw new Error("CERT file '" + cert + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des clés privées dans le cas d'authentification SSL
     * @param KEYs
     * @returns {Array}
     */
    private static buildKEYs(KEYs:Array<KeyOptions> = []) {
        var build = [];
        KEYs.forEach((key) => {
            try {
                var keyFile = fs.readFileSync(key.file);
                if (key.passphrase) {
                    build.push({
                        pem: keyFile,
                        passphrase: key.passphrase
                    });
                } else {
                    build.push(keyFile);
                }
            } catch (e) {
                throw new Error("KEY file '" + key.file + "' cannot be read : " + e);
            }
        });
        return build;
    }

    /**
     * Construit l'objet de configuration des certificats/clés privées dans le cas d'authentification SSL
     * @param PKCS12
     * @returns {Object}
     */
    private static buildPKCS12(PKCS12:PKCS12Options = {file:null, passphrase:null}) {
        var build = null;
        if (PKCS12.file != null) {
            try {
                var p12File = fs.readFileSync(PKCS12.file);
                build = {
                    pfx: p12File,
                    passphrase: PKCS12.passphrase
                };
            } catch (e) {
                throw new Error("PKCS12 file '" + PKCS12.file + "' cannot be read : " + e);
            }
        }
        return build;
    }
}

