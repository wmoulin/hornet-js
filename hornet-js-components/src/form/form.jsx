"use strict";
var utils = require("hornet-js-utils");
var SimpleAction = require("hornet-js-core/src/actions/simple-action");
var React = require("react");
var newforms = require("newforms");
var Button = require("src/button/button");
var GridForm = require("src/form/grid-form").GridForm;
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
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool,
        /** Lorsque mis à true, le message d'information concernant les champs obligatoires est masqué.
         * Ignoré lorsque markRequired est à false car le message n'a pas lieu d'être affiché. */
        isMandatoryFieldsHidden: React.PropTypes.bool,
        /** Sous-titre éventuel */
        subTitle: React.PropTypes.string,
        /** Texte descriptif éventuel */
        text: React.PropTypes.string,
        /** Nom de la classe CSS à affecter au formulaire. */
        formClassName: React.PropTypes.string,

        /** Eléments contenus dans le formulaire */
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),

        name: React.PropTypes.string
    },

    childContextTypes: {
        /** Instance de formulaire newforms ou constructeur newforms */
        form: React.PropTypes.object,
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string,
        /** Indique si tous les éléments inclus sont en lecture seule. */
        readOnly: React.PropTypes.bool,
        /** Lorsqu'égal à false, les libellés des champs obligatoires ne sont pas marqués avec un astérisque */
        markRequired: React.PropTypes.bool
    },


    getChildContext: function() {
        return {
            form: this.state.form,
            imgFilePath: this.props.imgFilePath,
            readOnly: this.props.readOnly,
            markRequired: this.props.markRequired
        };
    },

    getDefaultProps: function () {
        return {
            isModal: false,
            readOnly: false,
            markRequired: true,
            isMandatoryFieldsHidden: false,
            subTitle: null,
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
    },

    componentDidMount: function () {
        /* On évite la soumission intempestive du formulaire en cas de clics répétés ou de touche entrée maintenue
          sur le bouton de soumission*/
        this.debouncedValidateAndSubmit = this.debounce(this.validateAndSubmit);
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
            var formConf = _.assign({validation: "manual", controlled: true }, nextProps.formConf);
            /* Par défaut, sur un changement de formulaire on orce le rendu React, car l'état interne de validation
            du formulaire a changé, mais pas l'état du composant page. La fonction onChange peut cependant être définie
             dans la configuration fournie formConf */
            if(!formConf.onChange) {
                formConf.onChange = this.forceUpdate.bind(this);
            }
            form = new nextProps.form(formConf);
        }

        /* On s'assure que l'état initial des champs du formulaire pourra être récupéré,
         notamment lors de changements d'état lecture seule/modification sur certains champs. */
        if((!form.initial || Object.keys(form.initial).length <= 0) && form.data) {
            form.initial = _.clone(form.data);
        }

        // surchage "validate" de newforms pour gérer le booléen "willValidate"
        var _oldValidate = form.validate;
        form.validate = function() {
            form.willValidate = true;
            return _oldValidate.apply(form, []);
        };

        form.errorConstructor = DivErrorList;
        return form;
    },

    /**
     * Déclenche la validation du formulaire, notifie les erreurs éventuelles et exéctute la fonction onSubmit présente dans les propriétés
     * @param form formulaire newforms. Doit être non nul.
     * @private
     */
    validateAndSubmit: function(form) {
        logger.trace("Validation et envoi du formulaire");

        this.executeAction(new SimpleAction(SimpleAction.REMOVE_ALL_ERR_NOTIFICATIONS).action());

        if (!form.validate()) {
            var formErrors = form.errors();
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
        this.props.onSubmit(form);
    },

    /**
     * Méthode permettant d'alimenter le bloc Notifications d'erreurs puis de déléguer l'évent au composant parent
     * @param e
     * @private
     */
    _submitHornetForm: function (e) {
        /* e.preventDefault ne doit pas être 'débouncée', sinon la soumission par défaut du formulaire serait effectuée */
        e.preventDefault();

        this.debouncedValidateAndSubmit(this.state.form);
    },

    render: function () {
        var classes = {
            "hornet-form": true,
            /* Application du style CSS readonly à tout le bloc lorsque tous les champs sont en lecture seule */
            "readonly": this.props.readOnly
        };

        logger.trace("render(), HornetForm ");

        /* La validation de formulaire HTML 5 est désactivée (noValidate="true") :
         on s'appuie uniquement sur les valideurs newForms et on a ainsi un rendu cohérent entre navigateurs. */
        return (
            <section>
                <div className={classNames(classes)}>
                    {this.props.markRequired && !this.props.isMandatoryFieldsHidden ?
                    <p className="discret">{this.state.i18n.fillField}</p> : null}
                    <form
                        name={this.props.name}
                        className={this.props.formClassName}
                        method="post"
                        onSubmit={this._submitHornetForm}
                        noValidate="true"
                        encType="multipart/form-data"
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
