"use strict";

var utils = require("hornet-js-utils");
var React = require("react/addons");
var newforms = require("newforms");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var ToolTip = require("hornet-js-components/src/tool-tip/tool-tip");
var classNames = require("classnames");
var ReadOnlyWidget = require("src/form/read-only-widget");

var logger = utils.getLogger("hornet-js-components.form.grid-form");

var newFormsPropType = React.PropTypes.oneOfType([      // Form instance or constructor
    React.PropTypes.func,
    React.PropTypes.instanceOf(newforms.Form)
]);

var GridForm = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        classNames: React.PropTypes.string,
        context: React.PropTypes.object,
        form: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            classNames: "grid-form pure-g-r"
        };
    },

    contextTypes: {
        form: React.PropTypes.object,
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool,
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool
    },

    childContextTypes: {
        /** Instance de formulaire newforms ou constructeur newforms */
        form: React.PropTypes.object,
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool,
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool
    },

    render() {
        var keyComponent = (this.context && this.context.form && this.context.form.autoId) ? this.context.form.autoId : "" +"GridFormChild-";
        return (
            <div className={this.props.classNames}>
                {React.Children.map(
                    this.props.children,
                    (child, i) => {
                        // définition des props des composants enfants
                        var childPropsSetByParent = {
                            key: keyComponent + i,
                            context: this.context
                        };

                        return (child)? React.cloneElement(child, childPropsSetByParent):null;
                    }
                )}
            </div>
        );
    }
});

var FieldSet = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        classNames: React.PropTypes.string,
        /* Formulaire newforms auxquel est rattaché cet ensemble de champs */
        form: newFormsPropType,
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            classNames: "hornet-fieldset"
        };
    },

    render() {
        return (
            <fieldset className={this.props.classNames}>
                <legend>{this.props.name}</legend>
                {React.Children.map(
                    this.props.children,
                    (child, i) => {
                        var keyComponent = (this.props.context && this.props.context.form && this.props.context.form.autoId) ? this.props.context.form.autoId : "" +"FieldSetChild-" +i;
                        // définition des props des composants enfants
                        var props = {
                            context: this.props.context,
                            readOnly: child.props.readOnly || this.props.readOnly || (this.props.context && this.props.context.readOnly),
                            key: keyComponent
                        };

                        return (child)? React.cloneElement(child, props):null;
                    }
                )}
            </fieldset>
        );
    }
});

var Row = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        classNames: React.PropTypes.string,
        /* Formulaire newforms auxquel est rattachée cette ligne de formulaire */
        form: newFormsPropType,
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            classNames: "pure-g-r",
            markRequired: true
        };
    },


    render() {
        var span = 0;
        React.Children.forEach(this.props.children,
            (child) => {
                var childSpan = 1;
                if (child) {
                    if (child.props.groupClass) {
                        var classTab = child.props.groupClass.split("-");
                        (classTab.length && (classTab.length - 1)) ?
                            childSpan = classTab[classTab.length - 1] : 1
                    }
                    span += Number(childSpan)
                }
            }
        );
        return (
            <div className={this.props.classNames}>
                {React.Children.map(
                    this.props.children,
                    (child, i) => {
                        var keyComponent = (this.props.context && this.props.context.form && this.props.context.form.autoId) ? this.props.context.form.autoId : "" +"RowChild-" +i;
                        // définition des props des composants enfants
                        var childPropsSetByParent = {
                            groupClass: child.props.groupClass || "pure-u-1-" + span,
                            key: keyComponent,
                            context: this.props.context,
                            readOnly: this.props.readOnly || child.props.readOnly || (this.props.context && this.props.context.readOnly)
                        };

                        return (child)? React.cloneElement(child, childPropsSetByParent):null;
                    }
                )}
            </div>
        );
    }
});

/**
 * Champ de formulaire
 */
var Field = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        abbr: React.PropTypes.string,
        lang: React.PropTypes.string,
        groupClass: React.PropTypes.string,
        labelClass: React.PropTypes.string,
        fieldClass: React.PropTypes.string,
        toolTip: React.PropTypes.string,
        icoToolTip: React.PropTypes.string,
        /** Préfixe (texte ou noeud) éventuellement ajouté entre le libellé et le champ de saisie.
         * Exemples : <Field prefix="M." name="nom"/> <Field prefix={<strong>M.</strong>} name="nom"/>*/
        prefix: React.PropTypes.any,
        /** Suffixe (texte ou noeud) éventuellement ajouté après le champ de saisie.
         * Exemples : <Field name="taille" suffix="cm"/> <Field name="taille" suffix={<strong>cm</strong>} />*/
        suffix: React.PropTypes.any,
        /* Formulaire newforms auxquel est rattaché ce champ */
        form: newFormsPropType,
        /* Indique que ce champ doit être en lecture seule */
        readOnly: React.PropTypes.bool,
        /* surcharge path du theme  */
        imgFilePath: React.PropTypes.string,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            labelClass: "pure-u-1-2",
            fieldClass: "pure-u-1-2",
            icoToolTip: "/img/tooltip/ico_tooltip.png",
            lang: "en",
            markRequired: true
        }
    },

    componentWillMount() {
        var boundField = (this.props.context && this.props.context.form) ? this.props.context.form.boundField(this.props.name) : null;
        if (boundField) {
            /* Sauvegardes préalables pour les éventuels passages ultérieurs en lecture seule ou en modification */
            this._saveForDynamicReadOnly(boundField);

            if(this.props.readOnly || this.props.context.readOnly) {
                this._applyReadOnly(boundField);
            }
        }
    },

    /**
     * Effectue les sauvegardes nécessaires sur le champ newforms indiqué de façon à ce qu'il puisse passer dynamiquement
     * de la lecture seule à la modification ou inversement.
     * @param boundField {BoundField} champ de formulaire newforms
     * @private
     */
    _saveForDynamicReadOnly(boundField) {
        var field = boundField.field;
        if (!field.hornetOldValidators && field.validators && field.validators.length > 0) {
            field.hornetOldValidators = field.validators;
        }
        if (!field.hornetOldValidate && field.validate) {
            field.hornetOldValidate = field.validate;
        }
        if (!field.hornetOldWidget && field.widget) {
            field.hornetOldWidget = field.widget;
        }
        var cleanFunction = boundField.form[utils._.camelCase("clean " + boundField.name)];
        if(!boundField.form["hornetOldClean" + boundField.name] && cleanFunction) {
            boundField.form["hornetOldClean" + boundField.name] = cleanFunction;
        }
    },

    /**
     * Passe un champ newforms en lecture seule
     * @param boundField {BoundField} champ de formulaire newforms
     * @private
     */
    _applyReadOnly(boundField) {
        var field = boundField.field;
        /* enlève toute validation */
        field.validators = [];
        field.validate = function (e) {};
        /* Une fonction de tye cleanNomDuChamp peut aussi être définie au niveau du formulaire */
        var cleanFunctionName = utils._.camelCase("clean " + boundField.name);
        if(boundField.form[cleanFunctionName]) {
            boundField.form[cleanFunctionName] = undefined;
        }

        /* pour les radio, checkbox et liste, positionne éventuellement un champ texte et change les valeurs du formulaire */
        if (field.custom && field.custom.useReadOnlyWidget === true) {
            if (field.choices && utils._.isArray(field.choices())) {
                field.widget = new ReadOnlyWidget();
                //On réinjecte les choices dans le widget
                field.setChoices(field.choices());
            }
        }
        if(field.widget) {
            field.widget.attrs = utils._.assign(field.widget.attrs, {disabled: true});
        }
    },

    /**
     * Rétablit la validation éventuelle et réaffecte le widget éventuellement sauvegardé
     * @param boundField {BoundField} champ de formulaire newforms
     * @private
     */
    _restoreValidation(boundField) {
        var field = boundField.field;

        if (field.hornetOldValidators) {
            field.validators = field.hornetOldValidators;
        }
        if (field.hornetOldValidate) {
            field.validate = field.hornetOldValidate;
        }
        var savedCleanFunction = boundField.form["hornetOldClean" + boundField.name];
        if(savedCleanFunction) {
            boundField.form[utils._.camelCase("clean " + boundField.name)] = savedCleanFunction;
        }
    },

    /**
     * Rétablit la donnée initiale
     * @param boundField {BoundField} champ de formulaire newforms
     * @private
     */
    _restoreData(boundField) {
        var updatedData = {};
        updatedData[boundField.name] = boundField.initialValue();
        /* On doit également s'assurer que le champ de saisie libre des champs en autocomplétion est restauré */
        if(boundField.form.initial) {
            var autocompleteInputName = boundField.name + "$text";
            var initialAutocompleteText = boundField.form.initial[autocompleteInputName];
            if(initialAutocompleteText) {
                updatedData[autocompleteInputName] = initialAutocompleteText;
            }
        }
        /* On rétablit la donnée initiale sans la valider. */
        boundField.form.updateData(updatedData, {validate : false});
    },

    /**
     * Passe un champ newforms en modification
     * @param boundField {BoundField} champ de formulaire newforms
     * @private
     */
    _applyModifiable(boundField) {
        var field = boundField.field;

        if (field.custom && field.custom.useReadOnlyWidget === true) {
            if (field.hornetOldWidget) {
                field.widget = field.hornetOldWidget;
                //On réinjecte les choices dans le widget
                field.setChoices(field.choices());
            }
        }

        if (field.widget && field.widget.attrs) {
            delete field.widget.attrs.disabled;
        }
    },

    componentWillReceiveProps(nextProps) {
        /* La propriété name ou la propriété form peuvent aussi éventuellement changer */
        if(nextProps.name != this.props.name || nextProps.context.form != this.props.context.form) {
            var boundField = nextProps.context.form.boundField(nextProps.name);
            if (boundField) {
                /* Sauvegardes préalables pour les éventuels passages ultérieurs en lecture seule ou en modification */
                this._saveForDynamicReadOnly(boundField);

                if(nextProps.readOnly || nextProps.context.readOnly) {
                    this._applyReadOnly(boundField);
                }
            }
        }

        /* Lorsque la propriété readOnly change, il faut modifier le widget newforms et les validateurs */
        if(nextProps.readOnly != this.props.readOnly || nextProps.context.readOnly != this.props.context.readOnly) {
            var boundField = nextProps.context.form.boundField(nextProps.name);
            if(boundField) {
                if (nextProps.readOnly ||nextProps.context.readOnly) {
                    /* Passage en lecture seule : la donnée initiale est rétablie et toute validation est supprimée */
                    this._restoreData(boundField);
                    this._applyReadOnly(boundField);
                } else {
                    /* Passage en modification : la validation est rétablie */
                    this._restoreValidation(boundField);
                    this._applyModifiable(boundField);
                }
            }
        }
    },

    render() {
        var form = (this.props.context && this.props.context.form) ? this.props.context.form  : null;
        var bf = form.boundField(this.props.name);
        var divClasses = {};
        divClasses["grid-form-field " + this.props.groupClass] = true;
        if(this.props.readOnly || this.props.context.readOnly)  {
            divClasses["readonly"] = true;
        }
        return (
            <div className={classNames(divClasses)}>
                <div className="pure-g-r">
                    {this._renderLabel(bf)}
                    {this._renderField(bf)}
                </div>
            </div>
        );
    },

    _renderLabel: function (bf) {
        var urlTheme = this.props.imgFilePath || this.props.context.imgFilePath || this.genUrlTheme(),
            urlIcoTooltip = urlTheme + this.props.icoToolTip,
            inputLabel = <span className="inputLabel">{bf.label}</span>;

        if (this.props.abbr && !this.props.lang) {
            logger.warn("Field ", bf.name, " Must have lang with abbr configuration");
        }

        return (
            <div className={this.props.labelClass + " blocLabel"}>
                <label key={bf.name + "Label"} htmlFor={bf.idForLabel()} id={bf.name + "Label"}>

                    {(this.props.abbr) ?
                        <abbr lang={this.props.lang} title={this.props.abbr}>
                            {inputLabel}
                        </abbr> : {inputLabel}}

                    {bf.field.required && (this.props.context.markRequired || this.props.markRequired)?
                        <span className="required">*</span> : null}

                    {this.props.toolTip ?
                        <ToolTip
                            alt={this.props.toolTip}
                            src={urlIcoTooltip}/> : null}
                </label>
            </div>
        );
    },

    /**
     * Génère le rendu du champ
     * @param bf {BoundField} champ de formulaire newforms
     * @returns {XML}
     * @private
     */
    _renderField: function (bf) {
        var errors = null;
        if (bf.form.willValidate) {
            errors = bf.errors();
        }
        var rendered = bf.render();
        return (
            <div className={this.props.fieldClass}>
                {errors && errors.isPopulated() && errors.render()}
                {this.props.prefix ? <span className="field-prefix">{this.props.prefix}</span> : null}
                {rendered}
                {this.props.suffix ? <span className="field-suffix">{this.props.suffix}</span> : null}
            </div>
        );
    }
});

module.exports = {GridForm: GridForm, FieldSet: FieldSet, Row: Row, Field: Field};
