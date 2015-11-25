"use strict";
var utils = require("hornet-js-utils");
var SimpleAction = require("hornet-js-core/src/actions/simple-action");
var React = require("react");
var newforms = require("newforms");
var Button = require("src/button/button");
var GridForm = require("src/form/grid-form").GridForm;
var ReadOnlyWidget = require("src/form/read-only-widget");
var classNames = require("classnames");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var N = require("hornet-js-core/src/routes/notifications");
var _ = utils._;
var logger = utils.getLogger("hornet-js-components.form.form");

/**
 * Composant permettant de rendre un formulaire Hornet de manière standardisée
 */
var Form = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        /** Instance de formulaire newforms ou constructeur newforms */
        form: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.instanceOf(newforms.Form)
        ]).isRequired,
        /** Configuration newforms */
        formConf: React.PropTypes.any,
        /** Indique si le formulaire est inclus dans une fenêtre modale. */
        isModal: React.PropTypes.bool,
        /** Fonction déclenchée lors de la soumission du formulaire */
        onSubmit: React.PropTypes.func,
        /** Configurations de boutons. Les boutons par défaut seront utilisés si cette propriété est vide */
        buttons: React.PropTypes.arrayOf(React.PropTypes.object),
        /** Indique si le formulaire est en lecture seule : dans ce cas aucun champ n'est modifiable. */
        readOnly: React.PropTypes.bool,
        /** Lorsque mis à true, le message d'information concernant les champs obligatoires est mesqué */
        isMandatoryFieldsHidden: React.PropTypes.bool,
        /** Sous-titre éventuel */
        subTitle: React.PropTypes.string,
        /** Texte descriptif éventuel */
        text: React.PropTypes.string,
        /** Action déclenchée lors de la soumission */
        action: React.PropTypes.string,
        /** Nom de la classe CSS à affecter au formulaire. */
        formClassName: React.PropTypes.string,

        /** Eléments contenus dans le formulaire */
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    getDefaultProps: function () {
        return {
            isModal: false,
            readOnly: false,
            isMandatoryFieldsHidden: false,
            subTitle: null,
            action: null,
            formConf: {},
            formClassName: "formRecherche",
            onSubmit : function(){}
        }
    },

    getInitialState: function () {
        return {
            i18n: this.i18n("form"),
            form: this._getFormInstance(this.props)
        };
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.form !== nextProps.form || !_.isEqual(this.props.formConf, nextProps.formConf)) {
            this.setState({
                form: this._getFormInstance(nextProps)
            });
        }

        if (this.props.onSubmit !== nextProps.onSubmit) {
            // Changement de la fonction onSubmit (il n'y a pas vraiment de cas où cela devrait arriver)
            this.throttledOnSubmit.cancel();
            this.throttledOnSubmit = this.throttle(nextProps.onSubmit);
        }
    },

    componentDidMount: function () {
        this.throttledOnSubmit = this.throttle(this.props.onSubmit);
    },

    /**
     * Retourne le formulaire actuellement utilisé
     * @returns {*}
     */
    getForm: function () {
        return this.state.form;
    },

    /**
     * Instancie le formulaire ou prend l'instance courante passée dans les props.
     * Si cette fonction instancie le formulaire, elle récupère la configuration passée dans la propriété formConf tout en ajoutant sa propre fonction onChange
     * @param nextProps
     * @returns {undefined}
     * @private
     */
    _getFormInstance: function (nextProps) {
        var form = undefined;
        if (nextProps.form instanceof newforms.Form) {
            logger.trace("Recuperation d'un formulaire déja instancié");
            form = nextProps.form
        } else {
            logger.trace("Instanciation d'un formulaire");
            var formConf = _.assign({onChange: this.forceUpdate.bind(this), validation: "manual", controlled: true }, nextProps.formConf);
            form = new nextProps.form(formConf);
        }
        form.errorConstructor = DivErrorList;
        return form;
    },

    /**
     * Méthode permettant d'alimenter le bloc Notifications d'erreurs puis de déléguer l'évent au composant parent
     * @param e
     * @private
     */
    _submitHornetForm: function (e) {
        e.preventDefault();

        this.executeAction(new SimpleAction(SimpleAction.REMOVE_ALL_ERR_NOTIFICATIONS).action());

        if (!this.state.form.validate()) {
            var formErrors = this.state.form.errors();
            if (formErrors) {
                var notificationsError = new N.Notifications();

                for (var field in formErrors.errors) {
                    if (formErrors.errors.hasOwnProperty(field)) {
                        formErrors.errors[field].data.forEach(function (error) {

                            var erreurNotification = new N.NotificationType();
                            erreurNotification.id = "ACTION_ERREUR_" + field + "_" + error.code;
                            erreurNotification.text = error.messages()[0];
                            erreurNotification.anchor = field + "_anchor";
                            erreurNotification.field = field;

                            notificationsError.addNotification(erreurNotification);
                        });
                    }
                }
                if (this.props.isModal) {
                    this.executeAction(new SimpleAction(SimpleAction.EMIT_MODAL_NOTIFICATION).action(), notificationsError);
                } else {
                    this.executeAction(new SimpleAction(SimpleAction.EMIT_ERR_NOTIFICATION).action(), notificationsError);
                }
            }
        }
        this.throttledOnSubmit(this.state.form);
    },

    render: function () {
        var classes = {
            "hornet-form": true,
            "readonly": this.props.readOnly
        };

        logger.trace("render(), HornetForm ");
        this._applyReadOnly(this.state.form, this.props.readOnly);

        /* La validation de formulaire HTML 5 est désactivée (noValidate="true") :
         on s'appuie uniquement sur les valideurs newForms et on a ainsi un rendu cohérent entre navigateurs. */
        return (
            <section>
                <div className={classNames(classes)}>
                    {!this.props.isMandatoryFieldsHidden ?
                    <p className="discret">{this.state.i18n.fillField}</p> : null}
                    <form
                        name={this.props.name}
                        className={this.props.formClassName}
                        method="post"
                        action={this.props.action}
                        onSubmit={this._submitHornetForm}
                        noValidate="true"
                    >
                        {this.props.subTitle ? <h1 className="sousTitreForm">{this.props.subTitle}</h1> : null}
                        {this.props.text ? <p className="texte">{this.props.text}</p> : null}

                        <GridForm form={this.state.form}>
                            {this.props.children}
                        </GridForm>

                        <ZoneButtons items={this.props.buttons}/>
                    </form>
                </div>
            </section>
        )
    },

    /**
     * Ajoute l'attribut readonly à tous les champs (widget de newforms).
     * Les radio et checkbox sont passés en label
     * @param form formulaire newforms
     * @param stateReadOnly {boolean} indique si le formulaire est en lecture seule
     */
    _applyReadOnly: function (form, stateReadOnly) {
        //champ disable
        var fieldNames = Object.keys(form.fields);
        for (var i = 0, l = fieldNames.length; i < l; i++) {
            var field = form.fields[fieldNames[i]];
            var custom = field.custom;
            //TODO: améliorer voir http://newforms.readthedocs.org/en/latest/custom_display.html

            /* pour les radio, checkbox et liste, positionne éventuellement un champs texte et change les valeurs du formulaire */
            if(stateReadOnly) {
                //enlève toute validation
                field.validators = [];
                field.validate = function (e) {
                };
                if (custom && custom.useReadOnlyWidget === true) {
                    if (field.choices && _.isArray(field.choices())) {
                        field.widget = new ReadOnlyWidget();
                        //On réinjecte les choices dans le widget
                        field.setChoices(field.choices());
                    }
                }
                field.widget.attrs = _.assign(field.widget.attrs, {disabled: stateReadOnly});
            }else{
                delete field.widget.attrs.disabled;
            }
        }
    }
});


/**
 * Composant représentant les buttons d'action du formulaire
 */
var ZoneButtons = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
      /** Configurations de boutons. Les boutons par défaut seront utilisés si cette propriété est vide */
      items: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    /**
     * Génère la configuration des boutons par défaut : "Valider" de type "submit" et "Annuler" de type "reset".
     * @returns {*[]}
     */
    getDefaultButtons() {
        return [{
            type: "submit",
            id: "form_btnValider",
            name: "action:valid",
            value: this.state.i18n.valid,
            className: "hornet-button",
            label: this.state.i18n.valid,
            title: this.state.i18n.validTitle
        },
            {
                type: "reset",
                id: "form_btnCancel",
                name: "action:cancel",
                value: this.state.i18n.cancel,
                className: "hornet-button",
                onClick: null,
                label: this.state.i18n.cancel,
                title: this.state.i18n.cancelTitle
            }
        ]
    },

    getInitialState: function () {
        return {
            i18n: this.i18n("form")
        };
    },

    render: function () {
        var buttons = this.props.items;
        if (!buttons) {
            buttons = this.getDefaultButtons();
        }

        return (
            <div className="button-group">
                {buttons.map(function (item, i) {
                    return <Button key={item.id + "_" + item.name} item={item} disabled={item.readOnly}/>;
                    })}
            </div>
        );
    }
});

var DivErrorList = newforms.ErrorList.extend({
    render: function () {
        return React.createElement("div", null, this.messages().map(function (error) {
                return React.createElement("div", {className: "formmgr-message-text"}, error)
            })
        )
    }
});

module.exports = Form;
