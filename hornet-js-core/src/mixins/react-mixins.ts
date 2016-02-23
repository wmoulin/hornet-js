"use strict";

var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var lodashObjects = require("lodash/object");
var lodashArrays = require("lodash/array");
var logger = utils.getLogger("hornet-js-core.mixin.react-mixins");

require("react-safe-render")(React, {
    errorHandler: function (errReport) {
        logger.error(`Error|${errReport.displayName}|${errReport.method}| ${errReport.error}`, errReport);
    }
});

var loggerPropsMixin = utils.getLogger("hornet-js-core.mixin.react-props-mixins");

var _ = utils._;

import PageInformationsStore = require("src/stores/page-informations-store");

export var FluxibleMixin = require("fluxible").FluxibleMixin;

var hornetContextMixin = {
    propTypes: {
        context: React.PropTypes.object
    },
    getHornetContext() {
        return this.props.context || this.context;
    }
};

var themeMixin = {
    genUrlTheme: function (path) {
        var themeUrl = this.getHornetContext().getStore(PageInformationsStore).getThemeUrl();
        return themeUrl + (path === undefined ? "" : path);
    }
};


var mergePropsMixin = {
    /**
     * Fonction qui constitue la liste des props à transmettre d'un composant parent à son enfant
     * On prend toutes les props du parent, en enlevant celle qui posent problème : children
     * Une liste supplémentaire de props à exclure peut être indiquée en entrée de la fonction
     *
     * Puis on rajoute les props spécifiques à l'enfant
     * (à la fois celles qui sont fournies par le parent,
     * et celles qui sont définies à la déclaration du composant dans la page)
     * On utilise un merge pour s'assurer qu'elles écrasent celles du parent
     *
     * Fonction utilisée dans le contexte du parent (this)
     *
     * @param childProps les props du composant enfant (valeur par défaut ou définie à la déclaration du composant dans la page)
     * @param childPropsSetByParent les props du composant enfant qui sont injectées dynamiquement par le parent
     * @param parentPropsToExclude tableau des noms des props du parent à exclure
     * @returns {*}
     */
    mergeParentPropsWithChildProps: function (childProps, childPropsSetByParent, parentPropsToExclude?) {

        // props à ignorer lors de la propagation du parent vers l'enfant

        // on ne garde pas la props "children" du parent
        let propsToOmit = ["children"];

        // on ne garde pas les props indiquées dans parentPropsToExclude
        if (parentPropsToExclude) {
            propsToOmit = lodashArrays.union(propsToOmit, parentPropsToExclude);
        }

        // la fonction étant appellée sur le composant parent, this.props contient ses propriétés
        // on enleve celles qu'on ne veut pas garder
        let propsToPassDown = lodashObjects.omit(this.props, propsToOmit);

        // fusion de childProps dans la variable résultat propsToPassDown
        lodashObjects.merge(propsToPassDown, childPropsSetByParent);
        lodashObjects.merge(propsToPassDown, childProps);

        return propsToPassDown;
    }
};


var contextPathMixin = {
    genUrl: function (path) {
        return utils.buildContextPath(path);
    },

    getContextPath: function () {
        return utils.getContextPath();
    },

    genUrlStatic: function (path) {
        return utils.buildStaticPath(path);
    }
};


var internationalisationMixin = {
    mixins: [IntlMixin],

    contextTypes: {
        i18n: React.PropTypes.func,
        locales: React.PropTypes.string
    },
    childContextTypes: {
        i18n: React.PropTypes.func
    },
    getChildContext() {
        return {
            i18n: this.getHornetContext().i18n
        };
    },

    /**
     * Retourne le texte correspondant à la clé passé en paramètre (voir fichier d'internationalisation).
     * Si elle n'existe pas retourne la clé.
     * @param keysString
     * @returns {context.messages|*}
     */
    i18n: function (keysString:string) {
        return this.getHornetContext().i18n(keysString);
    },

    /**
     * Initialise la localisation par défaut pour la librairie newforms
     */
    initNewFormsLocale: function () {
        logger.trace("Initialisation locale par défaut newforms");
        var locale = this.getHornetContext().locale;
        var shortmonths = this.i18n("calendar.format.shortMonths");
        var months = this.i18n("calendar.format.months");
        var dateFormats = [utils.dateUtils.gregorianCalToNewformsFormat(this.i18n("calendar.dateFormat"))];
        var dateTimeFormats = [utils.dateUtils.gregorianCalToNewformsFormat(this.i18n("calendar.dateFormat"))];

        newforms.addLocale(locale, {
            b: shortmonths,
            B: months,
            DATE_INPUT_FORMATS: dateFormats,
            DATETIME_INPUT_FORMATS: dateTimeFormats
        });
        newforms.setDefaultLocale(locale);
    }

};

/**
 * Mixin permettant de proposer des méthodes 'throttle' et 'debounce' sur la gestion des évènements afin de se protéger contre
 * les actions répétées de l'utilisateur (double click, appui maintenu sur la touche entrée, etc...).
 *
 * Voir la documentation de lodash pour des explications détaillées sur ces fonctions (https://lodash.com/docs#throttle).
 *
 * Ce mixin expose une méthode 'throttle' et une méthode 'debounce' à chaque composant.
 * Il est préférable d'encapsuler la méthode à appeler dans la fonction "componentWillMount" plutôt qu'à chaque rendu.
 *
 * Pour le throttle, le mixin se charge d'annuler les appels potentiellement en attente lorsque le composant est démonté du DOM.
 *
 * Il est possible de configurer le délai et même de le désactiver en passant au composant
 * la propriété "throttleDelay" ou la propriété "debounceDelay" (désactivation si le délai à est 0). Le délai par défaut est de 500ms.
 *
 * Exemple d'utilisation:
 * React.createClass{
 *      componentWillMount: function () {
 *          this.throttleOnSubmit = this.throttle(this.props.onSubmit);
 *      },
 *
 *      onChange: function (e) {
 *          e.preventDefault();
 *          this.throttleOnSubmit(this.state.data);
 *      }
 * }
 *
 *
 * @type {{propTypes: {throttleDelay: number, debounceDelay: number}, getDefaultProps: Function, throttle: Function, componentWillUnmount: Function}}
 */
var throttleMixin = {
    propTypes: {
        throttleDelay: React.PropTypes.number,
        debounceDelay: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            throttleDelay: 500
        };
    },

    /**
     * Limite le nombre d'appels successifs à la fonction fn en imposant un intervalle de temps minimum entre chaque appel.
     * Intervalle minimum par défaut : 500ms.
     * Cet intervalle est configurable avec la propriété throttleDelay.<br/>
     * Exemple d'utilisation : sur les boutons de pagination d'un tableau, permet de faire défiler les pages à un rythme raisonnable lorsque la touche entrée est maintenue enfoncée.
     * @param fn fonction à contrôler
     * @param conf configuration éventuelle<br/>
     * <ul>
     *     <li>conf.leading : {boolean} indique si la fonction doit être éxécutée dès le premier appel. Par défaut à true.</li>
     *     <li>conf.trailing : {boolean} indique si la fonction doit être exécutée à la fin de la série d'appels et une fois le délai terminé. Par défaut à false.</li>
     * </ul>
     * @returns {function} une fonction encapsulant la fonction fn
     */
    throttle: function (fn, conf) {
        var throttleDelay = this.props.throttleDelay;
        /* La définition de la valeur par défaut en utilisant getDefaultProps dans le mixin ne fonctionne pas bien */
        if (throttleDelay === undefined || throttleDelay == null) {
            throttleDelay = 500;
        }
        if (throttleDelay === 0) {
            logger.trace("Pas de throttle, retour de la fonction");
            return fn;
        } else {
            if (!this._throttleFnArray) {
                // Instanciation du tableau de toutes les fonctions encapsulées par un throttle
                this._throttleFnArray = [];
            }

            // Configuration de la fonction de throttle
            var throttleConf = _.assign({
                leading: true,
                trailing: false
            }, conf);
            logger.trace("Délai de throttle:", throttleDelay);

            var throttledFn = _.throttle(fn, throttleDelay, throttleConf);
            this._throttleFnArray.push(throttledFn);
            return throttledFn;
        }
    },

    /**
     * Empêche les exécutions suivantes de la fonction fn lorsque le délai entre chaque appel est inférieur au minimum.
     * Délai minimum par défaut : 500ms.
     * Ce délai est configurable avec la propriété de composant debounceDelay.<br/>
     * Exemple d'utilisation : sur un formulaire, permet de soumettre une seule fois le formulaire lorsque la touche entrée reste enfoncée sur le bouton de validation.
     * @param fn fonction à contrôler
     * @param conf configuration éventuelle<br/>
     * <ul>
     *     <li>conf.leading : {boolean} indique si la fonction doit être éxécutée dès le premier appel. Par défaut à true.</li>
     *     <li>conf.trailing : {boolean} indique si la fonction doit être exécutée à la fin de la série d'appels et une fois le délai terminé. Par défaut à false.</li>
     * </ul>
     * @returns {function} une fonction encapsulant la fonction fn
     */
    debounce: function (fn:Function, conf?:any) {
        var debounceDelay = this.props.debounceDelay;
        /* La définition de la valeur par défaut en utilisant getDefaultProps dans le mixin ne fonctionne pas bien */
        if (debounceDelay === undefined || debounceDelay == null) {
            debounceDelay = 500;
        }
        if (debounceDelay === 0) {
            logger.trace("Pas de debounce, retour de la fonction");
            return fn;
        } else {
            if (!this._debounceFnArray) {
                // Instanciation du tableau de toutes les fonctions encapsulées par un throttle
                this._debounceFnArray = [];
            }

            // Configuration de la fonction de debounce
            var debounceConf = _.assign({
                leading: true,
                trailing: false
            }, conf);
            logger.trace("Délai de debounce:", debounceDelay);

            var debouncedFn = _.debounce(fn, debounceDelay, debounceConf);
            this._debounceFnArray.push(debouncedFn);
            return debouncedFn;
        }
    },

    /**
     * On s'assure de ne pas déclencher d'appel de fonction gérée par throttle ou debounce une fois le composant démonté.
     * Cela a surtout de l'intérêt pour les cas où la propriété de configuration 'trailing' est à true
     * (les appels de fonctions sont mis en attente et déclenchés une fois le délai passé)
     */
    componentWillUnmount: function () {
        if (_.isArray(this._throttleFnArray)) {
            logger.trace("Annulation du throttle de ", this._throttleFnArray.length, " fonctions");
            _.forEach(this._throttleFnArray, function (fn) {
                fn.cancel();
            });
        }

        if (_.isArray(this._debounceFnArray)) {
            logger.trace("Annulation du debounce de ", this._debounceFnArray.length, " fonctions");
            _.forEach(this._debounceFnArray, function (fn) {
                fn.cancel();
            });
        }
    }
};

var ReactProptypesMixin;
if (process.env.NODE_ENV === "production") {
    /* Désactivation du mixin de vérification des propriétés en environnement de production */
    ReactProptypesMixin = {};
} else {
    ReactProptypesMixin = {

        ensureComponentHasPropTypesDeclared: function (componentName, componentPropTypes) {
            var errorMessage = (componentName + ": Component '" + componentName + "' does not have " +
            "`propTypes` defined. All components must have " +
            "defined `propTypes`.");

            if (!componentPropTypes) {
                loggerPropsMixin.warn(errorMessage);
            }
        },

        ensurePropsMatchComponentPropTypes: function (componentName, componentPropTypes, propsToCheck) {
            var invalidProperties = [],
                invalidPropertiesString,
                errorMessage;

            Object.keys(propsToCheck).forEach(function (propName) {
                if (propName !== "children" && !componentPropTypes[propName]) {
                    invalidProperties.push(propName);
                }
            });

            if (invalidProperties.length) {
                invalidPropertiesString = invalidProperties.join(", ");
                errorMessage = (componentName + " : The properties '" + invalidPropertiesString + "' were " +
                "set on the " + componentName + ", which were not " +
                "declared in " + componentName + ".propTypes. Only " +
                "properties defined in " + componentName + ".propTypes " +
                "are allowed to be set on " + componentName + ".");

                loggerPropsMixin.warn(errorMessage);
            }
        },

        ensureInternalPropertyValidityInReact: function (reactComponentInstance) {
            var errorMessage;

            if (!reactComponentInstance._reactInternalInstance || !reactComponentInstance._reactInternalInstance._currentElement) {
                errorMessage = ("This React mixin depends on an instance of a React " +
                "component to have a `_reactInternalInstance` property " +
                "as well as a `_reactInternalInstance._currentElement` " +
                "property. This instance does not. Was React updated " +
                "recently?");

                loggerPropsMixin.warn(errorMessage);
            }
        },

        componentWillMount: function () {
            this.ensureInternalPropertyValidityInReact(this);

            var componentType = this._reactInternalInstance._currentElement.type;

            this.ensureComponentHasPropTypesDeclared(componentType.displayName, componentType.propTypes);
            this.ensurePropsMatchComponentPropTypes(componentType.displayName, componentType.propTypes, this.props);
        },

        componentWillReceiveProps: function (newProps) {
            this.ensureInternalPropertyValidityInReact(this);

            var componentType = this._reactInternalInstance._currentElement.type;

            this.ensurePropsMatchComponentPropTypes(componentType.displayName, componentType.propTypes, newProps);
        }

    };
}

module.exports = {
    mixins: [FluxibleMixin, hornetContextMixin, internationalisationMixin, themeMixin, contextPathMixin, throttleMixin, ReactProptypesMixin, mergePropsMixin]
};
