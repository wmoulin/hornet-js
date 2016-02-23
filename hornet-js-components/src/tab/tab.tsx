"use strict";

import React = require("react/addons");
import utils = require("hornet-js-utils");
import newforms = require("newforms");
var classNames = require("classnames");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/tab/tab-props");

var logger = utils.getLogger("hornet-js-components.tab.tab");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class Tab extends HornetComponent<PropTypesNs.TabProps,any> {

    static displayName = "hornet-tab";

    static propTypes = {
        /** Titre de l'onglet (affiché dans la barre d'onglets) */
        title: React.PropTypes.string,
        tabId: React.PropTypes.string,
        panelId: React.PropTypes.string,
        isVisible: React.PropTypes.bool,
        forceRender: React.PropTypes.bool
    };

    static defaultProps = {
        tabId: "tab",
        panelId: "panel",
        forceRender: false
    };

    render() {
        var classNameContent = classNames({
            "hornet-tab-panel": true,
            "hornet-tab-panel-selected": this.props.isVisible
        });

        return this.props.isVisible || this.props.forceRender ? (
            <div id={this.props.panelId}
                 aria-labelledby={this.props.tabId}
                 className={classNameContent}
                 role="tabpanel"
                 aria-hidden={!this.props.isVisible}>
                {React.Children.map(this.props.children,
                    (child:React.ReactElement<any>) => {

                        return React.cloneElement(child);
                        })
                    }
            </div>) : null;
    }
}

export = Tab;
