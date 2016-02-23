"use strict";

var React = require("react");

var ReactDummyComponentMock = React.createClass({
    render: () => {
        return (<div id="ReactDummyComponentMock">{this.props.children}</div>);
    }
});

module.exports = ReactDummyComponentMock;
