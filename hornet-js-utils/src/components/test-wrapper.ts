"use strict";

var React = require("react/addons");

/* istanbul ignore next */
var TestWrapper = React.createClass({
    childContextTypes: {
        i18n: React.PropTypes.func,
        locales: React.PropTypes.string,
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    },

    getChildContext() {
        return {
            i18n: this.props.context.i18n,
            locales: this.props.context.locales,
            getStore: this.props.context.getStore,
            executeAction: this.props.context.executeAction
        };
    },

    propsTypes: {
        elements: React.PropTypes.func.isRequired
    },

    render() {
        return this.props.elements();
    }
});

export = TestWrapper;
