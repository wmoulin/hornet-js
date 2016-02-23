
"use strict";
import utils = require("hornet-js-utils");
import React = require("react");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/notification/notification-props");

var logger = utils.getLogger("hornet-js-components.basic.notification");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class MessageItem extends HornetComponent<PropTypesNs.MessageItemProps,any> {

    static displayName:string = "MessageItem";

    static propTypes = {
        text: React.PropTypes.string.isRequired,
        field: React.PropTypes.string,
        anchor: React.PropTypes.string
    };

    @HornetComponent.AutoBind
    setFocus(e:React.MouseEvent) {
        e.preventDefault();
        var element = document.getElementById(this.props.field);
        if (element && element.focus) {
            element.focus();
        } else {
            element = document.getElementById(this.props.field + "$text");
            if (element && element.focus) {
                element.focus();
            } else {
                logger.warn("Impossible de mettre le focus sur l'élément", this.props.field);
            }
        }
    }

    _renderLink() {
        return (
            <a href="#" onClick={this.setFocus}>{this.i18n(this.props.text)}</a>
        )
    }

    _renderSpan() {
        return (
            <span>{this.i18n(this.props.text)}</span>
        )
    }

    render() {
        return (
            <li>
                {(!this.props.anchor) ? this._renderSpan() : this._renderLink()}
            </li>
        );
    }

}

export = MessageItem;