"use strict";

var utils = require("hornet-js-utils");
var React = require("react/addons");
var newforms = require("newforms");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var ToolTip = require("hornet-js-components/src/tool-tip/tool-tip");

var logger = utils.getLogger("hornet-js-components.form.grid-form");

var GridForm = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        form: React.PropTypes.oneOfType([      // Form instance or constructor
            React.PropTypes.func,
            React.PropTypes.instanceOf(newforms.Form)
        ]).isRequired,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        classNames: React.PropTypes.string
    },

    getDefaultProps() {
        return {classNames: "grid-form pure-g-r"}
    },

    render() {
        return (
            <div className={this.props.classNames}>
                {React.Children.map(
                    this.props.children,
                    (child) => {
                        return (child)? React.cloneElement(child, {
                            form: this.props.form
                            }):null;
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
        form: React.PropTypes.object,

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getDefaultProps() {
        return {classNames: "hornet-fieldset"}
    },

    render() {
        return (
            <fieldset className={this.props.classNames}>
                <legend>{this.props.name}</legend>
                {React.Children.map(
                    this.props.children,
                    child => {
                        return (child)? React.cloneElement(child, {
                            form: this.props.form
                            }):null;
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
        form: React.PropTypes.object,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getDefaultProps() {
        return {classNames: "pure-g-r"}
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
                    (child) => {
                        return (child)? React.cloneElement(child, {
                            form: this.props.form,
                            groupClass: child.props.groupClass || "pure-u-1-" + span
                            }):null;
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

        form: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            labelClass: "pure-u-1-2",
            fieldClass: "pure-u-1-2",
            icoToolTip: "/img/tooltip/ico_tooltip.png",
            lang: "en"
        }
    },

    render() {
        var form = this.props.form;
        var bf = form.boundField(this.props.name);
        return (
            <div className={"grid-form-field " + this.props.groupClass}>
                <div className="pure-g-r">
                    {this._renderLabel(bf)}
                    {this._renderField(bf)}
                </div>
            </div>
        );
    },

    _renderLabel: function (bf) {
        var urlIcoTooltip = this.genUrlTheme(this.props.icoToolTip);
        var inputLabel = <span className="inputLabel">{bf.label}</span>;

        if (this.props.abbr && !this.props.lang) {
            logger.warn("Fiel ", bf.name, " Must have lang with abbr configuration");
        }

        return (
            <div className={this.props.labelClass + " blocLabel"}>
                <label key={bf.name + "Label"} htmlFor={bf.idForLabel()} id={bf.name + "Label"}>

                    {(this.props.abbr) ?
                    <abbr lang={this.props.lang} title={this.props.abbr}>
                        {inputLabel}
                    </abbr> : {inputLabel}}

                    {bf.field.required ?
                    <span className="required">*</span> : null}

                    {this.props.toolTip ?
                    <ToolTip
                        alt={this.props.toolTip}
                        src={urlIcoTooltip}/> : null}
                </label>
            </div>
        );
    },

    _renderField: function (bf) {
        var errors = bf.errors();
        return (
            <div className={this.props.fieldClass}>
                {errors.isPopulated() && errors.render()}
                {this.props.prefix ? <span className="field-prefix">{this.props.prefix}</span> : null}
                {bf.render()}
                {this.props.suffix ? <span className="field-suffix">{this.props.suffix}</span> : null}
            </div>
        );
    }
});

module.exports = {GridForm: GridForm, FieldSet: FieldSet, Row: Row, Field: Field};
