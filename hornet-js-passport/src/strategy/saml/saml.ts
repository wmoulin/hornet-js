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
 * hornet-js-passport - Gestion d'authentification
 *
 * @author 
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license 
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { IdentityProviderProps } from "hornet-js-passport/src/strategy/saml/saml-configuration";


export type Callback<T> = (res: T)=>void;

const logger: Logger = Utils.getLogger("horneg-js-passport.strategy.saml.saml");

import * as zlib from "zlib";
import * as querystring from "querystring";
import * as url from "url";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { Promise } from "hornet-js-utils/src/promise-api";
import { Request, Response } from "express";
import * as xml2js from "xml2js";
import * as crypto from "crypto";
import * as xmldom from "xmldom";
import * as xmlbuilder from "xmlbuilder";

const xmlCrypto = require('xml-crypto');

const xmlenc = require('xml-encryption');
const xpath = xmlCrypto.xpath;


export class Saml {

    public options: any;

    constructor(options) {
        this.options = Saml.initialize(options);
    }

    /**
     * Initialisation Objet
     * @param options
     * @returns {any}
     */
    protected static initialize(options) {
        if (!options) {
            options = {};
        }

        if (!options.path) {
            options.path = '/saml/consume';
        }

        if (!options.host) {
            options.host = 'localhost';
        }

        if (!options.issuer) {
            options.issuer = 'onelogin_saml';
        }

        if (options.identifierFormat === undefined) {
            options.identifierFormat = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
        }

        if (options.authnContext === undefined) {
            options.authnContext = "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport";
        }

        if (!options.acceptedClockSkewMs) {
            // default to no skew
            options.acceptedClockSkewMs = 0;
        }

        if (!options.validateInResponseTo) {
            options.validateInResponseTo = false;
        }

        if (!options.requestIdExpirationPeriodMs) {
            options.requestIdExpirationPeriodMs = 28800000;  // 8 hours
        }

        if (!options.logoutUrl) {
            // Default to Entry Point
            options.logoutUrl = options.entryPoint || '';
        }

        if (!options.appLogoutPath) {
            options.appLogoutPath = options.issuer + options.appLogoutPath || "";
        }

        // sha1 or sha256
        if (!options.signatureAlgorithm) {
            options.signatureAlgorithm = 'sha1';
        }

        if (!options.idp) {
            options.idp = {};
        }

        return options;
    }

    public static generateUniqueID() {
        let chars = "abcdef0123456789";
        let uniqueID = "";
        for (let i = 0; i < 20; i++) {
            uniqueID += chars.substr(Math.floor((Math.random() * 15)), 1);
        }
        return uniqueID;
    }

    public static generateInstant() {
        return new Date().toISOString();
    }

    protected signRequest(samlMessage: any) {
        let signer;
        let samlMessageToSign: any = {};
        switch (this.options.signatureAlgorithm) {
            case 'sha256':
                samlMessage.SigAlg = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
                signer = crypto.createSign('RSA-SHA256');
                break;
            case 'sha512':
                samlMessage.SigAlg = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha512';
                signer = crypto.createSign('RSA-SHA512');
                break;
            default:
                samlMessage.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
                signer = crypto.createSign('RSA-SHA1');
                break;
        }
        if (samlMessage.SAMLRequest) {
            samlMessageToSign.SAMLRequest = samlMessage.SAMLRequest;
        }
        if (samlMessage.SAMLResponse) {
            samlMessageToSign.SAMLResponse = samlMessage.SAMLResponse;
        }
        if (samlMessage.RelayState) {
            samlMessageToSign.RelayState = samlMessage.RelayState;
        }
        if (samlMessage.SigAlg) {
            samlMessageToSign.SigAlg = samlMessage.SigAlg;
        }
        signer.update(querystring.stringify(samlMessageToSign));
        samlMessage.Signature = signer.sign(this.options.privateCert, 'base64');
    }

    /**
     * Génération de la requête SAML
     * @param isPassive
     * @param callback
     */
    protected generateAuthorizeRequest(isPassive: boolean, callback) {
        logger.debug("Génération de la requête SAML");

        let id = "_" + Saml.generateUniqueID();
        let instant = Saml.generateInstant();
        let forceAuthn = this.options.forceAuthn || false;

        return new Promise((resolve) => {
            let request = {
                'samlp:AuthnRequest': {
                    '@xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
                    '@ID': id,
                    '@Version': '2.0',
                    '@IssueInstant': instant,
                    '@ProtocolBinding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
                    '@AssertionConsumerServiceURL': this.options.issuer + this.options.appLoginPath,
                    '@Destination': this.options.entryPoint,
                    'saml:Issuer': {
                        '@xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
                        '#text': this.options.issuer
                    }
                }
            };

            if (isPassive)
                request['samlp:AuthnRequest']['@IsPassive'] = true;

            if (forceAuthn) {
                request['samlp:AuthnRequest']['@ForceAuthn'] = true;
            }

            if (this.options.identifierFormat) {
                request['samlp:AuthnRequest']['samlp:NameIDPolicy'] = {
                    '@xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
                    '@Format': this.options.identifierFormat,
                    '@AllowCreate': 'true'
                };
            }

            if (!this.options.disableRequestedAuthnContext) {
                request['samlp:AuthnRequest']['samlp:RequestedAuthnContext'] = {
                    '@xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
                    '@Comparison': 'exact',
                    'saml:AuthnContextClassRef': {
                        '@xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
                        '#text': this.options.authnContext
                    }
                };
            }

            if (this.options.attributeConsumingServiceIndex) {
                request['samlp:AuthnRequest']['@AttributeConsumingServiceIndex'] = this.options.attributeConsumingServiceIndex;
            }

            callback(null, xmlbuilder.create(request).end());
            resolve();
        }).catch((e) => callback(e));
    }


    /**
     *
     * @param req
     * @returns {any}
     */
    protected generateLogoutRequest(req: Request) {
        let id = "_" + Saml.generateUniqueID();
        let instant = Saml.generateInstant();

        let user = req.user || {};

        let request = {
            'samlp:LogoutRequest': {
                '@xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
                '@xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
                '@ID': id,
                '@Version': '2.0',
                '@IssueInstant': instant,
                '@Destination': this.options.logoutUrl,
                'saml:Issuer': {
                    '@xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
                    '#text': this.options.issuer
                },
                'saml:NameID': {
                    '@Format': user.nameIDFormat || "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
                    '#text': user.nameID
                }
            }
        };

        if (typeof(user.nameQualifier) !== 'undefined') {
            request['samlp:LogoutRequest']['saml:NameID']['@NameQualifier'] = user.nameQualifier;
        }

        if (typeof(user.spNameQualifier) !== 'undefined') {
            request['samlp:LogoutRequest']['saml:NameID']['@SPNameQualifier'] = user.spNameQualifier;
        }

        if (user.sessionIndex) {
            request['samlp:LogoutRequest']['saml2p:SessionIndex'] = {
                '@xmlns:saml2p': 'urn:oasis:names:tc:SAML:2.0:protocol',
                '#text': user.sessionIndex
            };
        }

        return xmlbuilder.create(request).end();
    }

    /**
     *
     * @param logoutRequest
     * @returns {any}
     */
    protected generateLogoutResponse(logoutRequest: any):any {
        let id = "_" + Saml.generateUniqueID();
        let instant = Saml.generateInstant();

        let request = {
            'samlp:LogoutResponse': {
                '@xmlns:samlp': 'urn:oasis:names:tc:SAML:2.0:protocol',
                '@xmlns:saml': 'urn:oasis:names:tc:SAML:2.0:assertion',
                '@ID': id,
                '@Version': '2.0',
                '@IssueInstant': instant,
                '@Destination': this.options.logoutUrl,
                '@InResponseTo': logoutRequest.ID,
                'saml:Issuer': {
                    '#text': this.options.issuer
                },
                'samlp:Status': {
                    'samlp:StatusCode': {
                        '@Value': 'urn:oasis:names:tc:SAML:2.0:status:Success'
                    }
                }
            }
        };

        return xmlbuilder.create(request).end();
    }

    /**
     *
     * @param request
     * @param response
     * @param operation
     * @param additionalParameters
     * @param callback
     */
    protected requestToUrl(request: any, response: Response, operation: string, additionalParameters: any, callback): void {
        logger.debug("");
        let self = this;
        if (self.options.skipRequestCompression)
            requestToUrlHelper(null, new Buffer((<any>request) || response, 'utf8'));
        else
            zlib.deflateRaw((<any>request) || response, requestToUrlHelper);

        function requestToUrlHelper(err, buffer) {
            if (err) {
                return callback(err);
            }

            let base64 = buffer.toString('base64');
            let target = url.parse(self.options.entryPoint, true);

            if (operation === 'logout') {
                if (self.options.logoutUrl) {
                    target = url.parse(self.options.logoutUrl, true);
                }
            } else if (operation !== 'authorize') {
                return callback(new Error("Unknown operation: " + operation));
            }

            let samlMessage = request ? {
                SAMLRequest: base64
            } : {
                SAMLResponse: base64
            };
            Object.keys(additionalParameters).forEach((k) => {
                samlMessage[k] = additionalParameters[k];
            });

            if (self.options.privateCert) {
                // sets .SigAlg and .Signature
                self.signRequest(samlMessage);
            }
            Object.keys(samlMessage).forEach((k) => {
                target.query[k] = samlMessage[k];
            });

            // Delete 'search' to for pulling query string from 'query'
            // https://nodejs.org/api/url.html#url_url_format_urlobj
            delete target.search;

            callback(null, url.format(target));
        }
    }

    /**
     *
     * @param req
     * @param operation
     * @returns {any}
     */
    protected getAdditionalParams(req: Request, operation: string) {
        logger.debug("Ajout de paramètres SAML");
        let additionalParams: any = {};

        let RelayState = req.query && req.query.RelayState || req.body && req.body.RelayState;
        if (RelayState) {
            additionalParams.RelayState = RelayState;
        }

        let optionsAdditionalParams = this.options.additionalParams || {};
        Object.keys(optionsAdditionalParams).forEach((k) => {
            additionalParams[k] = optionsAdditionalParams[k];
        });

        let optionsAdditionalParamsForThisOperation = {};
        if (operation == "authorize") {
            optionsAdditionalParamsForThisOperation = this.options.additionalAuthorizeParams || {};
        }
        if (operation == "logout") {
            optionsAdditionalParamsForThisOperation = this.options.additionalLogoutParams || {};
        }

        Object.keys(optionsAdditionalParamsForThisOperation).forEach((k) => {
            additionalParams[k] = optionsAdditionalParamsForThisOperation[k];
        });

        return additionalParams;
    }

    /**
     *
     * @param req
     * @param callback
     */
    protected getAuthorizeUrl(req: Request, callback: Callback<any>): void {

        this.generateAuthorizeRequest(this.options.passive, (err, request) => {
            if (err)
                return callback(err);
            let operation = 'authorize';
            this.requestToUrl(request, null, operation, this.getAdditionalParams(req, operation), callback);
        });
    }

    /**
     *
     * @param req
     * @param callback
     */
    public getLogoutUrl(req: Request, callback): void {
        let request = this.generateLogoutRequest(req);
        let operation = 'logout';
        this.requestToUrl(request, null, operation, this.getAdditionalParams(req, operation), callback);
    }

    /**
     *
     * @param req
     * @param callback
     */
    public getLogoutResponseUrl(req: Request, callback: Callback<any>): void {
        let response = this.generateLogoutResponse((<any>req).samlLogoutRequest);
        let operation = 'logout';
        this.requestToUrl(null, response, operation, this.getAdditionalParams(req, operation), callback);
    }

    /**
     *
     * @param cert
     * @returns {any}
     */
    public static certToPEM(cert: string): string {
        cert = cert.match(/.{1,64}/g).join('\n');

        if (cert.indexOf('-BEGIN CERTIFICATE-') === -1)
            cert = "-----BEGIN CERTIFICATE-----\n" + cert;
        if (cert.indexOf('-END CERTIFICATE-') === -1)
            cert = cert + "\n-----END CERTIFICATE-----\n";

        return cert;
    }

    /**
     * This function checks that the |currentNode| in the |fullXml| document contains exactly 1 valid
     * signature of the |currentNode|.
     * See https://github.com/bergie/passport-saml/issues/19 for references to some of the attack
     * vectors against SAML signature verification.
     * @param fullXml
     * @param currentNode
     * @param cert
     * @returns {any}
     */
    protected validateSignature(fullXml: any, currentNode: any, cert: string): boolean {

        let xpathSigQuery = ".//*[local-name(.)='Signature' and " +
            "namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']";
        let signatures = xpath(currentNode, xpathSigQuery);
        // This function is expecting to validate exactly one signature, so if we find more or fewer
        //   than that, reject.
        if (signatures.length != 1)
            return false;
        let signature = signatures[0];
        let sig = new xmlCrypto.SignedXml();
        sig.keyInfoProvider = {
            getKeyInfo: () => {
                return "<X509Data></X509Data>";
            },
            getKey: () => {
                return Saml.certToPEM(cert);
            }
        };
        sig.loadSignature(signature);
        // We expect each signature to contain exactly one reference to the top level of the xml we
        //   are validating, so if we see anything else, reject.
        if (sig.references.length != 1)
            return false;
        let refUri = sig.references[0].uri;
        let refId = (refUri[0] === '#') ? refUri.substring(1) : refUri;
        // If we can't find the reference at the top level, reject
        let idAttribute = currentNode.getAttribute('ID') ? 'ID' : 'Id';
        if (currentNode.getAttribute(idAttribute) != refId)
            return false;
        // If we find any extra referenced nodes, reject.  (xml-crypto only verifies one digest, so
        //   multiple candidate references is bad news)
        let totalReferencedNodes = xpath(currentNode.ownerDocument,
            "//*[@" + idAttribute + "='" + refId + "']");
        if (totalReferencedNodes.length > 1)
            return false;
        return sig.checkSignature(fullXml);
    }

    /**
     *
     * @param container
     * @param callback
     * @returns {any}
     */
    public validatePostResponse(container: any, callback): any {

        let xml = new Buffer(container.SAMLResponse, 'base64').toString('utf8');
        let doc = new xmldom.DOMParser().parseFromString(xml);

        // Check if this document has a valid top-level signature
        let validSignature = false;
        if (this.options.certSignature && this.validateSignature(xml, doc.documentElement, this.options.certSignature)) {
            validSignature = true;
        }

        let assertions = xpath(doc, "/*[local-name()='Response']/*[local-name()='Assertion']");
        let encryptedAssertions = xpath(doc,
            "/*[local-name()='Response']/*[local-name()='EncryptedAssertion']");

        if (assertions.length + encryptedAssertions.length > 1) {
            // There's no reason I know of that we want to handle multiple assertions, and it seems like a
            //   potential risk vector for signature scope issues, so treat this as an invalid signature
            logger.error("Signatre invalide");
        }

        if (assertions.length == 1) {
            if (this.options.certSignature && !validSignature && !this.validateSignature(xml, assertions[0], this.options.certChiff)) {
                logger.error("Signature invalide");
            }
            return this.processValidlySignedAssertion(assertions[0].toString(), callback);
        }

        if (encryptedAssertions.length == 1) {
            if (!this.options.decryptionPvk)
                logger.error("Le paramètre 'decryptionPvk' est manquant pour décrypter la réponse SAML");

            let encryptedDatas = xpath(encryptedAssertions[0], "./*[local-name()='EncryptedData']");
            if (encryptedDatas.length != 1)
                logger.error("Signature invalide");
            let encryptedDataXml = encryptedDatas[0].toString();

            let xmlencOptions = {key: this.options.decryptionPvk};
            return this.decryptXml(encryptedDataXml, xmlencOptions)
                .then((decryptedXml: any) => {
                    let decryptedDoc = new xmldom.DOMParser().parseFromString(decryptedXml);
                    let decryptedAssertions = xpath(decryptedDoc, "/*[local-name()='Assertion']");
                    if (decryptedAssertions.length != 1)
                        logger.error("Invalid EncryptedAssertion content");

                    if (this.options.certSignature && !validSignature && !this.validateSignature(decryptedXml, decryptedAssertions[0], this.options.certSignature))
                        logger.error("Signature invalide");

                    this.processValidlySignedAssertion(decryptedAssertions[0].toString(), callback);
                });
        }

        // If there's no assertion, fall back on xml2js response parsing for the status &
        //   LogoutResponse code.

        let parserConfig = {
            explicitRoot: true,
            explicitCharkey: true,
            tagNameProcessors: [(<any>xml2js).processors.stripPrefix]
        };

        this.parseString(xml, parserConfig).then((doc: any) => {
            let response = doc.Response;
            if (response) {
                let assertion = response.Assertion;
                if (!assertion) {
                    let status = response.Status;
                    if (status) {
                        let statusCode = status[0].StatusCode;
                        if (statusCode && statusCode[0].$.Value === "urn:oasis:names:tc:SAML:2.0:status:Responder") {
                            let nestedStatusCode = statusCode[0].StatusCode;
                            if (nestedStatusCode && nestedStatusCode[0].$.Value === "urn:oasis:names:tc:SAML:2.0:status:NoPassive") {
                                if (this.options.certSignature && !validSignature) {
                                    logger.error("Signature invalide");
                                }
                                return callback(null, null, false);
                            }
                        }

                        // Note that we're not requiring a valid signature before this logic -- since we are
                        //   throwing an error in any case, and some providers don't sign error results,
                        //   let's go ahead and give the potentially more helpful error.
                        if (statusCode && statusCode[0].$.Value) {
                            let msgType = statusCode[0].$.Value.match(/[^:]*$/)[0];
                            if (msgType != 'Success') {
                                let msg = 'unspecified';
                                if (status[0].StatusMessage) {
                                    msg = status[0].StatusMessage[0]._;
                                } else if (statusCode[0].StatusCode) {
                                    msg = statusCode[0].StatusCode[0].$.Value.match(/[^:]*$/)[0];
                                }
                                let error: any = new Error('SAML provider returned ' + msgType + ' error: ' + msg);
                                let builderOpts = {
                                    rootName: 'Status',
                                    headless: true
                                };
                                error.statusXml = new xml2js.Builder(builderOpts).buildObject(status[0]);
                                throw error;
                            }
                        }
                    }
                    logger.error("L'assertion SAML est manquante");
                }
            } else {
                if (this.options.certSignature && !validSignature) {
                    logger.error("Signature invalide");
                }
                let logoutResponse = doc.LogoutResponse;
                if (logoutResponse) {
                    return callback(null, null, true);
                } else {
                    logger.error("Message de la réponse SAML inconnu");
                }
            }
        }).catch((e) => callback(e));
    }


    /**
     * Méthode permettant de décrypter le flux xml de retour suite à la connexion SAML
     * @param encryptedDataXml
     * @param xmlencOptions
     * @returns Promise
     */
    decryptXml(encryptedDataXml: string, xmlencOptions: any) {
        return new Promise((resolve, reject) => {
            try {
                let cb = function(test, result) {
                    resolve(result);
                };

                xmlenc.decrypt(encryptedDataXml, xmlencOptions, cb);
            }
            catch (e) {
                reject(e);
            }
        })
    }


    /**
     * Méthode permettant de parser le flux XML de retour
     * @param xml
     * @param parserConfig
     * @returns Promise
     */
    parseString(xml: string, parserConfig: any) {
        return new Promise((resolve, reject) => {
            try {
                let parser = new xml2js.Parser(parserConfig);
                let cb = (test, result) => {
                    resolve(result);
                };
                parser.parseString(xml, cb);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    /**
     *
     * @param xml
     * @param callback
     */
    protected processValidlySignedAssertion(xml: string, callback) {
        let msg;
        let parserConfig = {
            explicitRoot: true,
            tagNameProcessors: [(<any>xml2js).processors.stripPrefix]
        };
        let nowMs = new Date().getTime();
        let profile: any = {};
        let assertion;

        this.parseString(xml, parserConfig).then((doc) => {
            assertion = doc['Assertion'];

            let issuer = assertion.Issuer;
            if (issuer) {
                profile.issuer = issuer[0];
            }

            let authnStatement = assertion.AuthnStatement;
            if (authnStatement) {
                if (authnStatement[0].$ && authnStatement[0].$.SessionIndex) {
                    profile.sessionIndex = authnStatement[0].$.SessionIndex;
                }
            }

            let subject = assertion.Subject;
            let subjectConfirmation, confirmData;
            if (subject) {
                let nameID = subject[0].NameID;
                if (nameID) {
                    profile.nameID = nameID[0]._ || nameID[0];

                    if (nameID[0].$ && nameID[0].$.Format) {
                        profile.nameIDFormat = nameID[0].$.Format;
                        profile.nameQualifier = nameID[0].$.NameQualifier;
                        profile.spNameQualifier = nameID[0].$.SPNameQualifier;
                    }
                }

                subjectConfirmation = subject[0].SubjectConfirmation ?
                    subject[0].SubjectConfirmation[0] : null;
                confirmData = subjectConfirmation && subjectConfirmation.SubjectConfirmationData ?
                    subjectConfirmation.SubjectConfirmationData[0] : null;
                if (subject[0].SubjectConfirmation && subject[0].SubjectConfirmation.length > 1) {
                    logger.error("Unable to process multiple SubjectConfirmations in SAML assertion");
                }

                if (subjectConfirmation) {
                    if (confirmData && confirmData.$) {
                        let subjectNotBefore = confirmData.$.NotBefore;
                        let subjectNotOnOrAfter = confirmData.$.NotOnOrAfter;

                        let subjErr = this.checkTimestampsValidityError(
                            nowMs, subjectNotBefore, subjectNotOnOrAfter);
                        if (subjErr) {
                            throw subjErr;
                        }
                    }
                }
            }
            let conditions = assertion.Conditions ? assertion.Conditions[0] : null;
            if (assertion.Conditions && assertion.Conditions.length > 1) {
                msg = 'Unable to process multiple conditions in SAML assertion';
                throw new Error(msg);
            }
            if (conditions && conditions.$) {
                let conErr = this.checkTimestampsValidityError(
                    nowMs, conditions.$.NotBefore, conditions.$.NotOnOrAfter);
                if (conErr)
                    throw conErr;
            }

            let attributeStatement = assertion.AttributeStatement;
            if (attributeStatement) {
                let attributes = [].concat.apply([], attributeStatement.filter((attr) => {
                    return Array.isArray(attr.Attribute);
                }).map((attr) => {
                    return attr.Attribute;
                }));

                let attrValueMapper = (value) => {
                    return typeof value === 'string' ? value : value._;
                };

                if (attributes) {
                    attributes.forEach((attribute) => {
                        if (!attribute.hasOwnProperty('AttributeValue')) {
                            // if attributes has no AttributeValue child, continue
                            return;
                        }
                        let value = attribute.AttributeValue;
                        if (value.length === 1) {
                            profile[attribute.$.FriendlyName] = attrValueMapper(value[0]);
                        } else {
                            profile[attribute.$.FriendlyName] = value.map(attrValueMapper);
                        }
                    });
                }
            }

            if (!profile.mail && profile['urn:oid:0.9.2342.19200300.100.1.3']) {
                // See http://www.incommonfederation.org/attributesummary.html for definition of attribute OIDs
                profile.mail = profile['urn:oid:0.9.2342.19200300.100.1.3'];
            }

            if (!profile.email && profile.mail) {
                profile.email = profile.mail;
            }

            profile.getAssertionXml = () => {
                return xml;
            };

            callback(null, profile, false);
        })
            .catch((err) => callback(err))
    }

    /**
     *
     * @param nowMs
     * @param notBefore
     * @param notOnOrAfter
     * @returns {any}
     */
    protected checkTimestampsValidityError(nowMs: number, notBefore: string, notOnOrAfter: string) {

        if (this.options.acceptedClockSkewMs == -1)
            return null;

        if (notBefore) {
            let notBeforeMs = Date.parse(notBefore);
            if (nowMs + this.options.acceptedClockSkewMs < notBeforeMs)
            //return new Error('SAML assertion not yet valid');
                logger.error("SAML assertion not yet valid");

        }
        if (notOnOrAfter) {
            let notOnOrAfterMs = Date.parse(notOnOrAfter);
            if (nowMs - this.options.acceptedClockSkewMs >= notOnOrAfterMs)
                return new Error('SAML assertion expired');
        }

        return null;
    }

    /**
     *
     * @param container
     * @param callback
     */
    public validatePostRequest(container: any, callback) {

        let xml = new Buffer(container.SAMLRequest, 'base64').toString('utf8');
        let dom = new xmldom.DOMParser().parseFromString(xml);
        let parserConfig = {
            explicitRoot: true,
            tagNameProcessors: [(<any>xml2js).processors.stripPrefix]
        };
        let parser = new xml2js.Parser(parserConfig);
        parser.parseString(xml, (err, doc) => {
            if (err) {
                return callback(err);
            }

            // Check if this document has a valid top-level signature
            if (this.options.certSignature && !this.validateSignature(xml, dom.documentElement, this.options.certSignature)) {
                return callback(new Error('Invalid signature'));
            }

            Saml.processValidlySignedPostRequest(doc, callback);
        });
    }

    /**
     *
     * @param doc
     * @param callback
     * @returns {any}
     */
    protected static processValidlySignedPostRequest(doc: any, callback) {
        let request = doc.LogoutRequest;
        if (request) {
            let profile: any = {};
            if (request.$.ID) {
                profile.ID = request.$.ID;
            } else {
                return callback(new Error('Missing SAML LogoutRequest ID'));
            }
            let issuer = request.Issuer;
            if (issuer) {
                profile.issuer = issuer[0];
            } else {
                return callback(new Error('Missing SAML issuer'));
            }

            let nameID = request.NameID;
            if (nameID) {
                profile.nameID = nameID[0]._ || nameID[0];

                if (nameID[0].$ && nameID[0].$.Format) {
                    profile.nameIDFormat = nameID[0].$.Format;
                }
            } else {
                return callback(new Error('Missing SAML NameID'));
            }
            let sessionIndex = request.SessionIndex;
            if (sessionIndex) {
                profile.sessionIndex = sessionIndex[0];
            }

            callback(null, profile, true);
        } else {
            return callback(new Error('Unknown SAML request message'));
        }
    }

    /**
     *
     * @param decryptionCert
     * @returns {any}
     */
    public generateServiceProviderMetadata(decryptionCert) {
        let metadata: any = {
            'EntityDescriptor': {
                '@xmlns': 'urn:oasis:names:tc:SAML:2.0:metadata',
                '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                '@entityID': this.options.issuer,
                '@ID': this.options.issuer.replace(/\W/g, '_'),
                'SPSSODescriptor': {
                    '@protocolSupportEnumeration': 'urn:oasis:names:tc:SAML:2.0:protocol',
                },
            }
        };

        if (this.options.decryptionPvk) {
            if (!decryptionCert) {
                logger.error("Missing decryptionCert while generating metadata for decrypting service provider");
            }

            decryptionCert = decryptionCert.replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '');
            decryptionCert = decryptionCert.replace(/-+END CERTIFICATE-+\r?\n?/, '');
            decryptionCert = decryptionCert.replace(/\r\n/g, '\n');

            metadata.EntityDescriptor.SPSSODescriptor.KeyDescriptor = {
                'ds:KeyInfo': {
                    'ds:X509Data': {
                        'ds:X509Certificate': {
                            '#text': decryptionCert
                        }
                    }
                },
                // this should be the set that the xmlenc library supports
                'EncryptionMethod': [
                    {'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes256-cbc'},
                    {'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes128-cbc'},
                    {'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#tripledes-cbc'}
                ]
            };
        }

        if (this.options.appLogoutPath) {
            let logoutCallbackUrl: string = this.options.issuer + this.options.appLogoutPath;
            metadata.EntityDescriptor.SPSSODescriptor.SingleLogoutService = {
                '@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
                '@Location': logoutCallbackUrl
            };
        }

        metadata.EntityDescriptor.SPSSODescriptor.NameIDFormat = this.options.identifierFormat;
        metadata.EntityDescriptor.SPSSODescriptor.AssertionConsumerService = {
            '@index': '1',
            '@isDefault': 'true',
            '@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
            '@Location': this.options.issuer + this.options.appLoginPath
        };

        return xmlbuilder.create(metadata).end({pretty: true, indent: '  ', newline: '\n'});
    }


    /**
     * Permet de récupérer les certificats liés à un IDP
     * @param idp IdentityProviderProps
     * @param cb callBack
     */
    public getIdpInformations(idp: IdentityProviderProps, cb) {

        if (idp.shibbolethUrl && (!idp.certSignature && !idp.certChiffrement)) {

            let infosUrl = url.parse(idp.shibbolethUrl);

            let callback = (response) => {
                let str: string = "";
                response.on('data', function(chunk) {
                    str += chunk;
                });

                response.on('end', () => {
                    this.parseMetadataIdp(str, cb);
                });
            };

            if (infosUrl.protocol === "https:") {
                https.request(Saml.getIdpOptions(infosUrl, idp), callback).end();
            } else if (infosUrl.protocol === "http:") {
                http.request(Saml.getIdpOptions(infosUrl, idp), callback).end()
            } else {
                this.parseMetadataIdp(fs.readFileSync(idp.shibbolethUrl), cb);
            }
        }
        else {
            cb(idp);
        }
    }

    /**
     * Permet de récupérer les informations liés à l'IDP
     * @param infosUrl
     * @param idp IdentityProviderProps
     * @returns {{hostname, path, cert: Buffer, method: string, rejectUnauthorized: boolean}}
     */
    protected static getIdpOptions(infosUrl, idp) {
        return {
            hostname: infosUrl.hostname,
            path: infosUrl.pathname,
            cert: fs.readFileSync(idp.httpsCert),
            method: "GET",
            rejectUnauthorized: false
        };
    }

    /**
     *
     * @param assertionXML
     * @param next
     */
    parseMetadataIdp(assertionXML, next): void {

        let certSignature, certChiffrement, entryPoint, logoutPoint;

        let xmlParser = new xml2js.Parser({
            async: true,
            attrkey: '$',
            charkey: '_',
            explicitArray: true
        });

        xmlParser.parseString(assertionXML, (err, result) => {
            let keyDescriptors = result["EntityDescriptor"]["IDPSSODescriptor"][0]["KeyDescriptor"];


            // Récupération des certificats
            keyDescriptors.map((keyDescriptor) => {

                if (keyDescriptor.$.use === "signing") {
                    certSignature = (keyDescriptor["ds:KeyInfo"][0]["ds:X509Data"][0]["ds:X509Certificate"][0]);
                }
                if (keyDescriptor.$.use === "encryption") {
                    certChiffrement = (keyDescriptor["ds:KeyInfo"][0]["ds:X509Data"][0]["ds:X509Certificate"][0]);
                }
            });

            // récupération des services de login/logout
            let entryPoints = result["EntityDescriptor"]["IDPSSODescriptor"][0]["SingleSignOnService"];

            entryPoints.map(function(entryPointAvailable) {
                if (entryPointAvailable.$.Binding === "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect") {
                    entryPoint = entryPointAvailable.$.Location
                }
            });

            let logoutPoints = result["EntityDescriptor"]["IDPSSODescriptor"][0]["SingleLogoutService"];

            logoutPoints.map(function(logoutPointAvailable) {
                if (logoutPointAvailable.$.Binding === "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect") {
                    logoutPoint = logoutPointAvailable.$.Location
                }
            });

            this.options.idp.certSignature = Saml.certToPEM(Saml.removeLastLine(certSignature));
            this.options.idp.certChiffrement = Saml.certToPEM(Saml.removeLastLine(certChiffrement));
            this.options.idp.entryPoint = this.options.entryPoint = entryPoint;
            this.options.idp.logoutUrl = this.options.logoutUrl = logoutPoint;

            next(this.options.idp);

        });
    }

    /**
     * Permet de supprimer le dernier saut de ligne d'un certificat
     * @param str
     */
    public static removeLastLine(str: string): string {
        return str.substring(0, str.lastIndexOf("\n"));
    }
}