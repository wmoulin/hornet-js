///<reference path="../../hornet-js-ts-typings/lodash/lodash.d.ts"/>
"use strict";

import _ = require("lodash");
import register = require("src/common-register");
var logger = register.getLogger("hornet-js-utils.authentication-utils");

export interface Role {
    name: string;
}

export interface UserInformations {
    roles: Array<Role>;
}


export class AuthUtils {

    /**
     * Fonction retournant true si l'utilisateur courant a au moins un des roles demandés
     * @param currentUser L'utilisateur courant
     * @param roles La liste des roles à chercher ou un string contenant le role à chercher
     * @return {boolean}
     */
    static userHasRole(currentUser:UserInformations, roles:any):boolean {
        if (_.isString(roles)) {
            roles = [roles];
        } else if (!_.isArray(roles)) {
            throw new Error("'roles' doit être un tableau ou une chaine de caractères");
        }

        if (currentUser && _.isArray(currentUser.roles)) {

            logger.trace("User Role :", currentUser.roles);
            logger.trace("Role à valider :", roles);
            var rolesLength:number = roles.length;
            for (var i = 0; i < rolesLength; i++) {
                var roleToSearch:string = roles[i];
                var exactRole = _.find(currentUser.roles, function (role:Role) {
                    return role.name == roleToSearch;
                });
                if (exactRole) {
                    logger.trace("L'utilisateur a le role:", roleToSearch, currentUser);
                    return true;
                }
            }
        }
        logger.trace("L'utilisateur n'a aucun des rôles:", roles);
        return false;
    }
}
