///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import ReactElement = __React.ReactElement;
import ClassicElement = __React.ClassicElement;

import React = require("react");
import Tab = require("src/tab/tab");
var classNames = require("classnames");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/tab/tab-props");

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.tab.tabs");

@HornetComponent.ApplyMixins()
class Tabs extends HornetComponent<PropTypesNs.TabsProps,any> {

    static displayName = "hornet-tabs";

    static propTypes = {
        tabId: React.PropTypes.string,
        panelId: React.PropTypes.string,
        selectedTabIndex: React.PropTypes.number,
        title: React.PropTypes.string,
        form: React.PropTypes.any,

    };

    static defaultProps = {
        tabId: "tab",
        panelId: "panel",
        selectedTabIndex: 0
    };

    constructor(props?:PropTypesNs.TabsProps, context?:any) {
        super(props, context);
        this.state = {
            showIndexPanel: props.selectedTabIndex
        };
    }


    componentWillReceiveProps(nextProps) {
        this._showPanel(nextProps.selectedTabIndex);
    }

    render() {
        logger.trace("Rendu Onglets, Nombre de composants fils =", React.Children.count(this.props.children));
        var tableauDesTabs = this._getTabs(this.props.children);

        var listeLi = tableauDesTabs.map((tab, index) => {
                var onClick = (e) => { this._showPanel(index); };
                var isSelected = this.state.showIndexPanel === index;
                var classNameLi = classNames({
                    "hornet-tab": true,
                    "hornet-tab-focused hornet-tab-selected": isSelected
                });

                return (
                    <li id={this.props.tabId + "-" + index} className={classNameLi} role="tab" aria-selected={isSelected}>
                        <a onClick={onClick} className="hornet-tab-label hornet-tab-content" href="#">{tab.props.title}</a>
                    </li>
                );
            }
        );

        var renduFils = tableauDesTabs.map((child, currentIndex) => {
            var visibleProp = {
                tabId: this.props.tabId + "-" + currentIndex,
                panelId: this.props.panelId + "-" + currentIndex,
                isVisible: (currentIndex === this.state.showIndexPanel),
                form: this.props.form
            };

            return React.cloneElement(child, visibleProp);
        });

        return (
            <div className="pure-u-1">
                <div className="hornet-tabview">
                    <ul className="hornet-tabview-list" role="tablist">
                        {listeLi}
                    </ul>
                    <div className="hornet-tabview-panel">
                        {renduFils}
                    </div>
                </div>
            </div>
        )
    }

    private _getTabs(children) {
        var tableauDesTabs = [];
        React.Children.map(children, function (child:any) {
            if (child.type.displayName === Tab.displayName) {
                tableauDesTabs.push(child);
            }
        });
        return tableauDesTabs;
    }

    @HornetComponent.AutoBind
    private _showPanel(index) {
        this.setState({
            showIndexPanel: index
        });
    }
}


export = Tabs;
