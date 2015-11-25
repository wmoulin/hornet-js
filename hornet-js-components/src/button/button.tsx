///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react");
import PropTypesNs = require("src/button/button-props");

class Button extends React.Component<PropTypesNs.ButtonProps, any> {

    static displayName:string = "Button";

    static propTypes = {
        item: React.PropTypes.shape({
            type: React.PropTypes.string,
            id: React.PropTypes.string,
            name: React.PropTypes.string,
            value: React.PropTypes.string,
            onClick: React.PropTypes.func,
            className: React.PropTypes.string,
            label: React.PropTypes.string,
            title: React.PropTypes.string
        }).isRequired,
        disabled: React.PropTypes.bool
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        return (
            <button
                type={this.props.item.type}
                id={this.props.item.id}
                name={this.props.item.name}
                value={this.props.item.value}
                onClick={this.props.item.onClick}
                className={this.props.item.className}
                title={this.props.item.title}
                aria-label={this.props.item.title}
                disabled={this.props.disabled}>
                {this.props.item.label}
            </button>
        );
    }

}

export = Button;
