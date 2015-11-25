"use strict";
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-component.navigation.menu-infos-complementaires");

var MenuInfosComplementaires = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ])
    },

    render: function () {
        return <li className="nav-item infocomp">{this.props.children}</li>;
    }

});

module.exports = MenuInfosComplementaires;