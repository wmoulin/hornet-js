///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";

var React = require("react");
var ReactIntl = require("react-intl");
var IntlMixin = ReactIntl.IntlMixin;
var newforms = require("newforms");
var I18nFluxiblePlugin = require("src/i18n/i18n-fluxible-plugin");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.mixin.react-mixins");

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
        // formatMsg: React.PropTypes.func,
        //locales: React.PropTypes.string
    },
    getChildContext() {
        return {
            i18n: this.getHornetContext().i18n
            //formatMsg: this.getHornetContext().formatMsg
            //locales: this.getHornetContext().locales
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
        logger.info("Initialisation locale par défaut newforms");
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
        logger.debug("Locale par défaut newforms initialisée");
    }

};

/**
 * Mixin permettant de proposer une méthode de throttle sur la gestion des évènements afin de se protéger contre
 * les actions répétées de l'utilisateur (double click, appui sur la touche entrée, etc...).
 * Voir documentation de lodash pour explications sur la fonction utilisée.
 *
 * Ce mixin expose une méthode 'throttle' à chaque composant, il est nécessaire d'encapsuler la méthode à appeler avec
 * cette méthode dans la fonction "componentWillMount". Le mixin se charge d'annuler les appels potentiellement en cours lorsque le composant est démonté du DOM.
 *
 * Il est possible de configurer le délai (et même désactiver la fonction "throttle") en passant au composant la propriété "throttleDelay" (désactivation si le délai à est 0)
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
 * @type {{propTypes: {throttleDelay: *}, getDefaultProps: Function, throttle: Function, componentWillUnmount: Function}}
 */
var throttleMixin = {
    propTypes: {
        throttleDelay: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            throttleDelay: 500
        };
    },

    throttle: function (fn, conf) {
        if (this.props.throttleDelay === 0) {
            logger.trace("Pas de throttle, retour de la fonction");
            return fn;
        } else {
            if (!this._throttleFnArray) {
                // Instanciation du tableau de toutes les fonctions throttle
                this._throttleFnArray = [];
            }

            // Configuration de la fonction de throttle
            var throttleConf = _.assign({
                leading: true,
                trailing: false,
                throttleDelay: this.props.throttleDelay
            }, conf);
            logger.trace("Délai de throttle:", throttleConf.throttleDelay);

            var throttleFn = _.throttle(fn, throttleConf.throttleDelay, throttleConf);
            this._throttleFnArray.push(throttleFn);
            return throttleFn;
        }
    },

    componentWillUnmount: function () {
        if (_.isArray(this._throttleFnArray)) {
            logger.trace("Annulation du throttle de", this._throttleFnArray.length, "fonctions");
            _.forEach(this._throttleFnArray, function (fn) {
                fn.cancel();
            });
        }
    }
};



var ReactProptypesMixin = {

    ensureComponentHasPropTypesDeclared: function (componentName, componentPropTypes) {
        var errorMessage = (componentName + ': Component "' + componentName + '" does not have ' +
        '`propTypes` defined. All components must have ' +
        'defined `propTypes`.')

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
            invalidPropertiesString = invalidProperties.join(', ');
            errorMessage = (componentName + ' : The properties "' + invalidPropertiesString + '" were ' +
            'set on the ' + componentName + ', which were not ' +
            'declared in ' + componentName + '.propTypes. Only ' +
            'properties defined in ' + componentName + '.propTypes ' +
            'are allowed to be set on ' + componentName + '.');

            loggerPropsMixin.warn(errorMessage);
        }
    },

    ensureInternalPropertyValidityInReact: function (reactComponentInstance) {
        var errorMessage;

        if (!reactComponentInstance._reactInternalInstance ||
            !reactComponentInstance._reactInternalInstance._currentElement) {
            errorMessage = ('This React mixin depends on an instance of a React ' +
            'component to have a `_reactInternalInstance` property ' +
            'as well as a `_reactInternalInstance._currentElement` ' +
            'property. This instance does not. Was React updated ' +
            'recently?');

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

module.exports = {
    mixins: [FluxibleMixin, hornetContextMixin, internationalisationMixin, themeMixin, contextPathMixin, throttleMixin, ReactProptypesMixin]
};

