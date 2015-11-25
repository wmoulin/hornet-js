"use strict";
var utils = require("hornet-js-utils");
var React = require("react");

var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var logger = utils.getLogger("hornet-js-components.table.table-caption");

var TableCaption = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        captionText: React.PropTypes.string
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.captionText !== nextProps.captionText;
    },

    render: function () {
        logger.trace("render");
        try {
            var render = null;
            if (this.props.captionText) {
                render = (
                    <caption className="hornet-datatable-caption">
                        {this.props.captionText}
                    </caption>
                );
            }

            return render;
        } catch (e) {
            logger.error("Render table-caption exception", e);
            throw e;
        }
    }
});

module.exports = TableCaption;