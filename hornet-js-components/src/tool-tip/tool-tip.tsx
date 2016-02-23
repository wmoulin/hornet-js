"use strict";

import React = require("react");
import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-component.tool-tip.tool-tip");
import HornetComponent = require("src/hornet-component");
import PropsNs = require("src/tool-tip/tool-tip-props");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class ToolTip extends HornetComponent<PropsNs.ToolTipProps,any> {

    static displayName:string = "ToolTip";

    static propTypes = {
        src: React.PropTypes.string,
        icoToolTip: React.PropTypes.string,
        alt: React.PropTypes.string.isRequired,
        idImg: React.PropTypes.string,
        classImg: React.PropTypes.string,
        idSpan: React.PropTypes.string,
        classSpan: React.PropTypes.string
    };

    static defaultProps = {
        classImg: "imgTooltip",
        classSpan: "tooltip",
        icoToolTip: "/img/tooltip/ico_tooltip.png"
    };

    render() {
        var urlIcoTooltip = this.props.src || this.genUrlTheme(this.props.icoToolTip);
        return (
            <span className={this.props.classSpan} id={this.props.idSpan} data-tooltip={this.props.alt}
                  aria-haspopup={true}>
                <img id={this.props.idImg} alt={this.props.alt} src={urlIcoTooltip} className={this.props.classImg}/>
            </span>
        )
    }
}

export = ToolTip;