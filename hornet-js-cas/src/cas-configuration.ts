"use strict";

export class CasConfiguration {

    public appLoginPath:string;
    public appLogoutPath:string;
    public hostUrlReturnTo:string;
    public casValidateUrl:string;
    public casLoginUrl:string;
    public casLogoutUrl:string;
    public verifyFunction:any;

    /**
     * Instanciation de la configuration pour un appel CAS direct depuis l'application
     *
     * @param appLoginPath path relatif de l'application déclenchant le process de connexion
     * @param appLogoutPath path relatif de l'application déclenchant le process de déconnexion
     * @param hostUrlReturnTo url de retour après authentification sur le CAS
     * @param casValidateUrl url du service de validation des tichets CAS
     * @param casLoginUrl url de connexion du CAS
     * @param casLogoutUrl url de déconnexion du CAS
     * @param verifyFunction (facultatif) : fonction à utiliser pour la récupération/vérification des infos de l'utilisateur
     */
    constructor(appLoginPath:string, appLogoutPath:string, hostUrlReturnTo:string, casValidateUrl:string, casLoginUrl:string, casLogoutUrl:string, verifyFunction?:any) {
        this.appLoginPath = appLoginPath;
        this.appLogoutPath = appLogoutPath;
        this.hostUrlReturnTo = hostUrlReturnTo;
        this.casValidateUrl = casValidateUrl;
        this.casLoginUrl = casLoginUrl;
        this.casLogoutUrl = casLogoutUrl;
        this.verifyFunction = verifyFunction;
    }
}
