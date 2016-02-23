"use strict";
var utils = require("hornet-js-utils");
var _ = utils._;
var React = require("react");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-title");

var TableTitle = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: ({
        title: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        enabled: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    }),

    getDefaultProps: function () {
        return {
            title: "",
            enabled: false
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.title !== nextProps.title
            || this.props.enabled !== nextProps.enabled
            || this.props.children !== nextProps.children;
    },

    render: function () {
        logger.trace("Rendu title Table");

        try {
            if (this.props.enabled) {
                if (_.isObject(this.props.title)) {
                    var {render, ...other} = this.props.title;
                    return (
                        <div className="hornet-datatable-title" {...other}>
                            {render()}
                            {this.props.children}
                        </div>
                    );
                } else {
                    return (
                        <div className="hornet-datatable-title">
                            {this.props.title}
                            {this.props.children}
                        </div>
                    );
                }
            } else {
                return null;
            }
        } catch (e) {
            logger.error("Render table-title exception", e);
            throw e;
        }
    }
});


module.exports = TableTitle;