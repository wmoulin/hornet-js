"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var AutoCompleteSelector = require("src/auto-complete/auto-complete-selector");

var _ = utils._;
var keyEvent = utils.keyEvent;
var logger = utils.getLogger("hornet-js-components.auto-complete.auto-complete");

var HIDDEN_INPUT_FIELD_REF = "AutoCompleteComponent#InputField";

var AutoCompleteComponent = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        onUserInputChange: React.PropTypes.func.isRequired,
        sourceStore: function (props, propName) {
            var store = props[propName];
            if (!store) {
                return new Error("The sourceStore must be provided ");
            }

            if (!store.class || !store.functionName || !_.isFunction(store.class.prototype[store.functionName])) {
                return new Error("The sourceStore must provide a class and method \"" + store.functionName + "\" ");
            }
        },
        actionClass: React.PropTypes.any,
        minValueLength: React.PropTypes.number,
        maxElements: React.PropTypes.number,
        delay: React.PropTypes.number,
        renderAttributes: React.PropTypes.any,
        inputFieldName: React.PropTypes.string.isRequired,
        initialValue: React.PropTypes.string,
        initialText: React.PropTypes.string,
        i18n: React.PropTypes.any.isRequired,
        /** Indique que la propriété readonly doit être valorisée sur le champ HTML */
        readOnly: React.PropTypes.bool,
        /** Indique que la propriété disabled doit être valorisée sur le champ HTML */
        disabled: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            minValueLength: 3,
            initialValue: "",
            initialText: "",
            i18n: {
                "inputWidgetTitle": "Aide à la saisie d\"un champ auto-completion"
            },
            readOnly: false,
            disabled: false,
            delay: 500
        };
    },

    getInitialState: function () {
        var inputWidget = new newforms.TextInput();
        var choices = this._retrieveChoicesFromStore();

        var ariaSelectorId = this.props.inputFieldName + "$select_" + Date.now();

        return {
            inputTextWidget: inputWidget,
            inputTextWidgetValue: this.props.initialText,
            inputValueWidgetValue: this.props.initialValue,
            choiceValues: this._filterChoices(this.props.initialText, choices),
            selectedIndex: null,
            shouldShowChoices: false,
            ariaSelectorId: ariaSelectorId
        };
    },

    componentDidMount: function componentDidMount() {
        logger.trace("auto-complete componentDidMount");
        this._throttledTriggerAction = _.throttle(this._triggerAction, this.props.delay);

        var sourceStore = this.props.sourceStore;

        //On utilise le mixin fluxible pour s"enregister auprès du store
        this._attachStoreListener(this.getListener(sourceStore.class, this._onListWidgetChange));
    },

    /**
     * Gère l'appel du composant parent ainsi que l'appel de l'action lorsque les valeurs ont changées.
     * Note: Ce traitement est présent dans cette fonction afin de fournir un objet DOM correcte à la fonction de callBack du composant parent (newForms...)
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        logger.trace("auto-complete componentDidUpdate");
        if (this._hasChanged(prevState)) {
            logger.trace("auto-complete componentDidUpdate _hasChanged");
            var newText = this.state.inputTextWidgetValue;
            var newValue = this.state.inputValueWidgetValue;
            var canScheduleAction = this._callParentOnUserInputChange(prevState);
            canScheduleAction = canScheduleAction !== false && this.props.actionClass && _.isUndefined(newValue);

            // Check si le callback ne désactive pas l'appel et si le texte saisie peut déclencher l'action
            if (canScheduleAction && this._isValidTextWidgetInput(newText)) {
                logger.trace("Prise en compte:", newText);
                this._throttledTriggerAction(newText);
            }

            if (this.state.choiceValues.length === 1 && _.deburr(this.state.inputTextWidgetValue).toLowerCase() == _.deburr(this.state.choiceValues[0].text).toLowerCase()) {
                var choice = this.state.choiceValues[0];
                this.changeInputTextWidgetValue(choice.text, choice.value);
            }
        }
    },

    /**
     * Lance l'action fournie par le composant parent
     * @param newText
     * @private
     */
    _triggerAction: function (newText) {
        logger.trace("Execution:", newText);
        var actionInstance = new (this.props.actionClass)();
        this.executeAction(actionInstance.action(), {
            "value": newText,
            "maxElements": this.props.maxElements
        });
    },

    /**
     * Retourne true si les valeurs saisies ont réellement changé
     * @param prevState
     * @private
     */
    _hasChanged: function (prevState) {
        return prevState.inputTextWidgetValue != this.state.inputTextWidgetValue || prevState.inputValueWidgetValue != this.state.inputValueWidgetValue;
    },

    /**
     * Fonction appelée lorsque l'utilisateur a modifié le champ de saisie libre.
     * Cette fonction met à jour le state pour refléter l'état du champ de saisie
     * @param newText
     * @param newValue
     */
    changeInputTextWidgetValue: function (newText, newValue) {
        this.setState({"inputTextWidgetValue": newText, "inputValueWidgetValue": newValue});

        //On demande l'affichage de la liste
        this._showChoices();

        // On force un nouveau filtrage de la liste
        this._onListWidgetChange(newText);
    },

    /**
     * Appelle la fonction de callback fournie par le composant parent en construisant les objets nécessaires
     * @param prevState
     * @return {boolean} Le retour de la fonction de callback du parent
     * @private
     */
    _callParentOnUserInputChange: function (prevState) {
        var hiddenInputFieldReactElement = this.refs[HIDDEN_INPUT_FIELD_REF];
        if (_.isUndefined(hiddenInputFieldReactElement)) {
            logger.warn("Callback appelé après la destruction du composant, ignore de l'action");
        } else {
            var oldValues = {
                value: prevState.inputValueWidgetValue,
                text: prevState.inputTextWidgetValue
            };
            var newValues = {
                value: this.state.inputValueWidgetValue,
                text: this.state.inputTextWidgetValue
            };
            return this.props.onUserInputChange(oldValues, newValues, this.props.maxElements, hiddenInputFieldReactElement.getDOMNode());
        }
    },

    /**
     * Fonction appelée lorsque l'utilisateur change la valeur présente dans le champs de saisie
     */
    _onInputTextWidgetChange: function (event) {
        var value = event.target.value;
        // TODO: effacer ce test; workarround en attendant la prise en compte du pullrequest https://github.com/facebook/react/pull/3826
        if (this.state.inputTextWidgetValue != value) {
            this.changeInputTextWidgetValue(value);
        }
    },

    /**
     * Fonction appelée lors d'un appui de touche sur le widget d'input
     * @param e évènement
     * @private
     */
    _onInputTextWidgetKeyDown: function (e) {
        var key = e.keyCode;

        if (key == keyEvent.DOM_VK_DOWN) {
            this._navigateInChoices(1);
            e.preventDefault();
        } else if (key == keyEvent.DOM_VK_UP) {
            this._navigateInChoices(-1);
            e.preventDefault();
        } else if (key == keyEvent.DOM_VK_ESCAPE) {
            this.setState({"selectedIndex": null});
            // On demande le masquage des choix
            this._hideChoices();
            e.preventDefault();
        } else if (key == keyEvent.DOM_VK_TAB || key == keyEvent.DOM_VK_ENTER || key == keyEvent.DOM_VK_RETURN) {
            var selectionAppened = this._selectCurrentIndex();
            if (selectionAppened) {
                // En cas de selection on annule l'action par défaut
                e.preventDefault();
            }
        }
    },


    /**
     * Fonction appelée lorsque l'utilisateur clique sur un item de la liste des valeurs possibles
     * @param event
     */
    _onListWidgetSelected: function (event) {
        var selectedText = event.currentTarget.dataset.realText;
        var selectedValue = event.currentTarget.dataset.realValue;
        logger.trace("Selection click [", selectedValue, "]:", selectedText);
        this.changeInputTextWidgetValue(selectedText, selectedValue);
    },

    /**
     * Fonction appelée lorsque la liste des valeurs possibles doit changer.
     * Cela est possible par un évenement provenant du Store ou pour forcer un nouveau filtrage de la liste côté client
     */
    _onListWidgetChange: function (newText) {
        if (!_.isString(newText)) {
            //Si la valeur est fournie on la prend sinon on prend celle du state
            newText = this.state.inputTextWidgetValue;
        }
        this.setState({"choiceValues": this._filterChoices(newText, this._retrieveChoicesFromStore())});
    },

    /**
     * Retourne la liste de choix filtrée par rapport au texte
     * @param filterText
     * @param choices
     * @returns {*}
     * @private
     */
    _filterChoices: function (filterText, choices) {
        if (!this._isValidTextWidgetInput(filterText)) {
            return [];
        } else {
            return _.filter(choices, function (choice) {
                var choiceTextFormatted = _.deburr(choice.text).toLowerCase();
                var filterTextFormatted = _.deburr(filterText).toLowerCase();
                return _.isString(choiceTextFormatted) && choiceTextFormatted.indexOf(filterTextFormatted) != -1;
            });
        }
    },

    /**
     * Remonte la liste de choix présente dans le store
     * @returns {*}
     * @private
     */
    _retrieveChoicesFromStore: function () {
        var sourceStore = this.props.sourceStore;
        return this.getStore(sourceStore.class)[sourceStore.functionName]();
    },


    /**
     * Retourne true si le texte saisi par l'utilisateur correspond aux critères de taille min
     * @param input
     * @returns {boolean}
     * @private
     */
    _isValidTextWidgetInput: function (input) {
        return (_.isString(input) && input.length >= this.props.minValueLength);
    },

    /**
     * Navige au sein de la liste de choix
     * @param delta
     * @private
     */
    _navigateInChoices: function (delta) {
        var newIndex = this.state.selectedIndex === null ? (delta === 1 ? 0 : delta) : this.state.selectedIndex + delta;
        var choicesLength = this.state.choiceValues.length;

        if (newIndex < 0) {
            //On va à la fin
            newIndex += choicesLength;
        } else if (newIndex >= choicesLength) {
            //On retourne au début
            newIndex -= choicesLength;
        }

        this.setState({
            selectedIndex: newIndex
        });

        // On s"assure de l'affichage de la liste déroulante
        this._showChoices();
    },

    /**
     * Selectionne l'élement actuellement en surbrillance dans la liste de choix
     * @return boolean si une selection a effectivement eu lieu
     * @private
     */
    _selectCurrentIndex: function () {
        var selection = (this.state.choiceValues || [] )[this.state.selectedIndex];
        if (_.isObject(selection)) {
            this.setState({"selectedIndex": null});
            this.changeInputTextWidgetValue(selection.text, selection.value);
            return true;
        }
        return false;
    },

    /**
     * Demande l'affichage du composant de choix
     * @private
     */
    _showChoices: function () {
        if (this.state.shouldShowChoices !== true)
            this.setState({shouldShowChoices: true});
    },

    /**
     * Demande le masquage du composant de choix
     * @private
     */
    _hideChoices: function () {
        if (this.state.shouldShowChoices !== false) {
            this.setState({shouldShowChoices: false});
        }
    },

    /**
     * Retourne true si le composant de liste doit s'afficher
     * @private
     */
    _shouldShowChoices: function () {
        var shouldShow = this.state.shouldShowChoices === true;

        logger.trace("shouldShowChoices = ", shouldShow);
        logger.trace("inputValueWidgetValue = ", this.state.inputValueWidgetValue);
        logger.trace("choiceValues = ", this.state.choiceValues);

        if (shouldShow) {
            //Note: on garde la coercition de type
            if (this.state.choiceValues.length === 1 && this.state.choiceValues[0].value == this.state.inputValueWidgetValue) {
                logger.trace("this.state.choiceValues[0].value = ", this.state.choiceValues[0].value);
                // Un seul choix possible et c"est déja celui sélectionné: on n"affiche pas
                shouldShow = false;
            }
        }
        return shouldShow;
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("auto-complete shouldComponentUpdate");
        return (
            this.state.inputTextWidgetValue !== nextState.inputTextWidgetValue ||
            this.state.choiceValues !== nextState.choiceValues
        );
    },

    render: function () {
        logger.trace("auto-complete  render");
        var shouldShow = this._shouldShowChoices();

        var renderAttrs;
        if (this.props.renderAttributes) {
            renderAttrs = this.props.renderAttributes.attrs;
        }

        var inputTextWidgetKwargs = {
            controlled: true,
            attrs: {
                "onChange": this._onInputTextWidgetChange,
                "onKeyDown": this._onInputTextWidgetKeyDown,
                "onFocus": this._showChoices,
                "onBlur": this._hideChoices,
                "autoComplete": "off",
                "aria-autocomplete": "list",
                "aria-expanded": shouldShow,
                "aria-owns": this.state.ariaSelectorId,
                "aria-activedescendant": shouldShow ? this.state.ariaSelectorId + "_" + this.state.selectedIndex : undefined,
                "aria-required": renderAttrs ? renderAttrs["aria-required"] : undefined,
                "aria-invalid": renderAttrs ? renderAttrs["aria-invalid"] : undefined,
                "title": this.props.i18n.inputWidgetTitle,
                "readOnly": this.props.readOnly,
                "disabled": this.props.disabled,
                "id": this.props.inputFieldName + "$text"
            }
        };
        /* Champ de saisie libre */
        var renderedInputWidget = this.state.inputTextWidget.render(this.props.inputFieldName + "$text", this.state.inputTextWidgetValue, inputTextWidgetKwargs);

        /* Le champ caché contient l'identifiant de l'élément sélectionné. C'est cet identifiant qui est ensuite
         utilisé par les actions. */
        return (
            <div className="">
                <input ref={HIDDEN_INPUT_FIELD_REF} type="hidden" name={this.props.inputFieldName}
                       value={this.state.inputValueWidgetValue}/>

                {renderedInputWidget}

                <AutoCompleteSelector
                    choices={this.state.choiceValues}
                    onOptionSelected={this._onListWidgetSelected}
                    currentTyppedText={this.state.inputTextWidgetValue}
                    currentIndex={this.state.selectedIndex}
                    selectorId={this.state.ariaSelectorId}
                    showComponent={shouldShow}/>
            </div>
        );

    }

});

module.exports = AutoCompleteComponent;