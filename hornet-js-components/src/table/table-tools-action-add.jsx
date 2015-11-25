"use strict";

var React = require("react")
var utils = require("hornet-js-utils");
var Icon = require("src/icon/icon");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-tools-action-add");

var TableToolsActionAdd = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,
        classAction: React.PropTypes.string,

        enabled: React.PropTypes.bool,
        icoAjouter: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            enabled: false,
            icoAjouter: "/img/tableau/ico_ajouter.png"
        };
    },

    getInitialState: function () {
        logger.trace("getInitialState");
        return ({
            i18n: this.i18n("table")
        })
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.enabled !== nextProps.enabled;
    },


    render: function () {
        logger.trace("render");
        try {
            return (
                (this.props.enabled) ? this._renderAddButton() : null
            );
        } catch (e) {
            logger.error("Render table-tools-actions-add exception", e);
            throw e;
        }
    },

    _renderAddButton: function () {

            var addAction = this.props.actions && this.props.actions.add;
            var addRoute = this.props.routes && this.props.routes.add;

            if (addRoute || addAction) {

                var addTitle = this._getAddTitle();
                return (
                    <div className={"hornet-datatable-action " + this.props.classAction}>
                        <Icon
                            url={addRoute || "#"}
                            onClick={addAction}
                            src={this.genUrlTheme(this.props.icoAjouter)}
                            alt={addTitle}
                            title={addTitle}
                        />
                    </div>
                );
            }else{
                logger.warn("Action Add problem configuration, addRoute :",addRoute,",addAction",addAction);
            }
    },

    _getAddTitle: function () {
        return this.props.messages.addTitle || this.state.i18n.addTitle;
    }
});

module.exports = TableToolsActionAdd;