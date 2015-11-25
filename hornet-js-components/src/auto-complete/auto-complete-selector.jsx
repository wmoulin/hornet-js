"use strict";
var utils = require("hornet-js-utils");
var React = require("react/addons");
var classNames = require("classnames");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var _ = utils._;
var logger = utils.getLogger("hornet-js-components.auto-complete.auto-complete-selector");

/**
 * Représente la liste de choix de l'auto completion
 */
var AutoCompleteSelector = React.createClass({
    propTypes: {
        choices: React.PropTypes.array,
        onOptionSelected: React.PropTypes.func.isRequired,
        currentTyppedText: React.PropTypes.string,
        currentIndex: React.PropTypes.number,
        selectorId: React.PropTypes.string.isRequired,
        showComponent: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            onOptionSelected: function (event) {
                event.preventDefault();
            },
            currentTyppedText: "",
            showComponent: true
        };
    },

    getInitialState: function () {
        return {
            maxLengthItem: 0
        };
    },

    /**
     * Fonction appelée lors du click sur un élément de la liste
     **/
    _onListClick: function (event) {
        event.preventDefault();
        return this.props.onOptionSelected(event);
    },

    /**
     * Retourne le rendu de la liste de choix
     **/
    _renderOptionList: function () {


        var li = this.props.choices.map((choice, indexTab) => {

            var choiceTextFormatted = _.deburr(choice.text).toLowerCase();
            var currentTextFormatted = _.deburr(this.props.currentTyppedText).toLowerCase();

            var index = choiceTextFormatted.indexOf(currentTextFormatted);
            if (index === -1) return null; // Valeur saisie non présente

            var classes = {};
            classes["hornet-autocomplete-item"] = true;
            classes["hornet-autocomplete-item-active"] = this.props.currentIndex === indexTab;
            var classList = classNames(classes);

            return (
                <li onMouseDown={this._onListClick}
                    id={this.props.selectorId + "_" + indexTab}
                    className={classList}
                    data-real-text={choice.text}
                    data-real-value={choice.value}
                    key={choice.value}
                    role="option">

                    {choice.text.substring(0, index)}
                    <b>
                        {this.props.currentTyppedText}
                    </b>
                    {choice.text.substring(index + this.props.currentTyppedText.length)}

                </li>
            );
        });

        return li;
    },

    render: function () {

        // On génère la liste des <li>
        var li = this._renderOptionList();

        // On construit le ul englobant
        var classes = {};
        classes["hornet-autocomplete"] = true;
        classes["hornet-widget-positioned"] = true;
        classes["hornet-autocomplete-hidden"] = this.props.showComponent === false;
        var classList = classNames(classes);

        var styleUl = {"minWidth": "100%"};

        var classesContent = {};
        classesContent["hornet-autocomplete-content"] = this.props.choices.length > 0;
        var classContentList = classNames(classesContent);

        return (
            <div className={classList}>
                <div className={classContentList}>
                    <ul className="hornet-autocomplete-list" role="listbox" id={this.props.selectorId} style={styleUl}>
                        {li}
                    </ul>
                </div>
            </div>
        );
    }

});


module.exports = AutoCompleteSelector;
