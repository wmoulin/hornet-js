///<reference path="../../hornet-js-ts-typings/lodash/lodash.d.ts"/>
"use strict";
var _ = require("lodash");
var register = require("src/common-register");
var logger = register.getLogger("hornet-js-utils.authentication-utils");
var AuthUtils = (function () {
    function AuthUtils() {
    }
    /**
     * Fonction retournant true si l'utilisateur courant a au moins un des roles demandés
     * @param currentUser L'utilisateur courant
     * @param roles La liste des roles à chercher ou un string contenant le role à chercher
     * @return {boolean}
     */
    AuthUtils.userHasRole = function (currentUser, roles) {
        if (_.isString(roles)) {
            roles = [roles];
        }
        else if (!_.isArray(roles)) {
            throw new Error("'roles' doit être un tableau ou une chaine de caractères");
        }
        if (currentUser && _.isArray(currentUser.roles)) {
            logger.trace("User Role :", currentUser.roles);
            logger.trace("Role à valider :", roles);
            var rolesLength = roles.length;
            for (var i = 0; i < rolesLength; i++) {
                var roleToSearch = roles[i];
                var exactRole = _.find(currentUser.roles, function (role) {
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
    };
    return AuthUtils;
})();
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=authentication-utils.js.map