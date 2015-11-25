/*
 * Utilisable uniquement côté naviguateur: accède au DOM.
 */
"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var GregorianCalendar = require("gregorian-calendar");
var DateTimeFormat = require("gregorian-calendar-format");

var Modal = require("src/dialog/modal");

var logger = utils.getLogger("hornet-js-components.calendar.calendar");

var RcCalendar = null;

if (!utils.isServer) {
    logger.trace("Execution sur le CLIENT(NAVIGATEUR)");
    RcCalendar = require("rc-calendar");

} else {
    logger.trace("Execution sur le SERVEUR");
}

var Calendar = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        /** Titre du champ, utilisé comme texte alternatif à l'image du bouton d'ouverture de calendrier.
         * Si non spécifié, le libellé calendar.agendaTitle est utilisé. */
        title: React.PropTypes.string,
        attributes: React.PropTypes.any, //fonctionne pas >>>React.PropTypes.arrayOf(React.PropTypes.string)
        /* instance de String ou Date */
        value: React.PropTypes.any,
        thisContext: React.PropTypes.any,
        /* Format(s) de saisie de date : surcharg(ent) éventuellement le format de date défini dans la locale */
        dateFormats: React.PropTypes.arrayOf(React.PropTypes.string),
        /* Année par défaut à utiliser lorsque le format n'inclut pas la date (par ex. 'dd/MM') */
        defaultYear: React.PropTypes.number
    },

    getInitialState: function () {
        var calendarLocale = this.i18n("calendar");
        utils.dateUtils.initTimeZone(calendarLocale);
        /* attribut HTML size du champ de saisie */
        var inputSize = calendarLocale.dateFormat.length;
        if(this.props.dateFormats instanceof Array && this.props.dateFormats[0]) {
            /* Le format de date est surchargé : on clone puis on modifie l'objet calendarLocale car cette modification
            doit rester spécifique à cette instance */
            calendarLocale = utils._.cloneDeep(calendarLocale);
            calendarLocale.dateFormat = this.props.dateFormats[0];
            /* lorsque le format de date indiqué ne contient pas l'année on ne l'affiche pas en en-tête de la popup calendrier (propriété monthYearFormat) */
            if(calendarLocale.monthYearFormat && calendarLocale.monthYearFormat.indexOf("yy") >= 0 && calendarLocale.dateFormat.indexOf("yy") < 0) {
                calendarLocale.monthYearFormat = "MMMM";
            }
            /* l'attribut size est dimensionné selon la taille du plus grand format possible */
            inputSize = calendarLocale.dateFormat.length;
            var dateFormat;
            for(var index in this.props.dateFormats) {
                dateFormat = this.props.dateFormats[index];
                if(dateFormat.length > inputSize) {
                    inputSize = dateFormat.length;
                }
            }
            logger.debug("Format de date surchargé par rapport à la configuration locale : ", this.props.dateFormats[0])
        }
        return {
            isVisible: false,
            value: this.props.value,
            calendarLocale: calendarLocale,
            inputSize: inputSize
        };
    },

    componentWillReceiveProps: function (nextProps) {
        logger.trace("Mise à jour de la valeur ", nextProps.value);
        //mise à jour de la valeur
        this.setState({
            value: nextProps.value
        });
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.value !== nextState.value || this.state.isVisible !== nextState.isVisible;
    },

    render: function () {
        logger.trace("render");
        var reactIconTag;
        var reactCalendarDialogueTag;

        this.props.attributes.attrs.ref = "dateInputWidget";
        this.props.attributes.attrs.size = this.state.inputSize;

        var reactDateInputTag = newforms.DateInput.prototype.render.call(this.props.thisContext, this.props.name, this.state.value, this.props.attributes);

        var dateToSelect = this._parse(this.state.value);
        if(!dateToSelect){
            //on force la date à la date du jour, car rcCalendar ne prend pas en compte la local
            dateToSelect = this._parse(new Date());
        }
        reactIconTag =
            <button className="agenda icon" type="button" onClick={this.showCalendar}>
                <img src={this.genUrlTheme("/img/calendar/ico_calendar.png")}
                     alt={this.props.title || this.state.calendarLocale.agendaTitle}/>
            </button>;

        reactCalendarDialogueTag =
            (<Modal isVisible={this.state.isVisible}
                    onClickClose={this.hideCalendar}
                    underlayClickExits={true}
                    escapeKeyExits={true}
                    title={this.state.calendarLocale.choiceDate}
                    onShow={this.patchRcCalendar}
                >
                <RcCalendar
                    ref="calendar"
                    locale={this.state.calendarLocale}
                    value={dateToSelect}
                    onSelect={this.setValueAndCloseCalendar} />
            </Modal>
            );

        return (
            <div>
                {reactDateInputTag}
                {reactIconTag}
                {reactCalendarDialogueTag}
            </div>
        );
    },

    patchRcCalendar : function () {
        var cal = this.refs["calendar"];
        cal.getMonthYear = function() {
            var locale = this.props.locale;
            var value = this.state.value;
            return new DateTimeFormat(locale.monthYearFormat, locale.format).format(value);
        }.bind(cal);
        cal.forceUpdate();
    },

    showCalendar: function () {
        //document.addEventListener("keydown", this._keyDown);

        this.setState({
            isVisible: true
        });
    },

    setValueAndCloseCalendar: function (date) {
        var strDate = this._formatDate(date);
        this.setState({
            value: strDate
        });

        //Pour fonctionner avec newforms on relance le handler fourni par celui-ci
        var target = this.refs.dateInputWidget.getDOMNode();
        target.value = strDate;
        this.props.attributes.attrs.onChange({
            target: target
        });

        this.hideCalendar();
    },

    onReinitialiserCalendar: function () {
        this.setState({
            value: this.props.value
        });
    },

    hideCalendar: function () {
        this.setState({
            isVisible: false
        });
        //document.removeEventListener('keydown', this._keyDown);
    },

    /**
     * Renvoie une instance de GregorianCalendar à partir de la date indiquée
     * @param date instance de String ou Date
     * @returns {GregorianCalendar}
     * @private
     */
    _parse: function (date) {
        logger.trace("Date à parser: ", date);
        var calendar;
        if(date) {

            if (utils._.isString(date)) {
                try {
                    calendar = utils.dateUtils.parseMultipleFmt(date, this.props.dateFormats, this.state.calendarLocale);
                } catch (err) {
                    logger.warn("Erreur pour parser la date suivante :", err);
                }
            } else if (utils._.isDate(date)) {
                calendar = new GregorianCalendar(this.state.calendarLocale);
                calendar.setTime(date.getTime());
            }
            /* Le format n'inclut pas l'année : on utilise l'année par défaut si celle-ci est définie ou alors l'année en cours */
            if(calendar && this.state.calendarLocale.dateFormat.indexOf("yy") < 0) {
                if(this.props.defaultYear) {
                    calendar.set(GregorianCalendar.YEAR, this.props.defaultYear);
                } else {
                    calendar.set(GregorianCalendar.YEAR, new Date().getFullYear());
                }
            }
        }
        return calendar;
    },

    _formatDate: function (date) {
        var strValue;
        try {
            if(date) {
                strValue = utils.dateUtils.format(date.getTime(), this.state.calendarLocale);
            }
        } catch (err) {
            logger.warn("Erreur pour formater la date suivante:", err);
        }
        if (!strValue) {
            strValue = "";
        }

        logger.trace("Date formatée : ", strValue + '  -- à partir de la valeur', date);
        return strValue;
    },

    _keyDown: function (e) {
        //logger.trace('Caractère saisie', e.keyCode);
        if (e.keyCode == utils.keyEvent.DOM_VK_ESCAPE) {
            this.hideCalendar();
        }
    }

});
module.exports = Calendar;