///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react");
import utils = require("hornet-js-utils");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/dialog/modal-props");
var _ = utils._;
var logger = utils.getLogger("hornet-js-components.dialog.modal");

//var ReactModal = require("react-aria-modal");

import ReactModal = require("src/dialog/react-aria-modal");

@HornetComponent.ApplyMixins()
class Modal extends HornetComponent<PropTypesNs.ModalProps,any> {

    static displayName:string = "Modal";

    static propTypes = {
        onClickClose: React.PropTypes.func,
        isVisible: React.PropTypes.bool.isRequired,
        title: React.PropTypes.string,
        hideTitleBar: React.PropTypes.bool,
        hideCloseBar: React.PropTypes.bool,
        closeLabel: React.PropTypes.string,
        closeSymbole: React.PropTypes.string,
        className: React.PropTypes.string,
        underlayClass: React.PropTypes.string,
        initialFocus: React.PropTypes.string,
        alert: React.PropTypes.bool,
        underlayClickExits: React.PropTypes.bool,
        escapeKeyExits: React.PropTypes.bool,
        verticallyCenter: React.PropTypes.bool,
        focusDialog: React.PropTypes.bool,
        manageFocus: React.PropTypes.bool,
        onShow: React.PropTypes.func
    };

    static defaultProps = {
        isVisible: false,
        hideTitleBar: false,
        hideCloseBar: false,
        alert: false,
        underlayClickExits: false,
        verticallyCenter: true,
        focusDialog: true
    };

    constructor(props?:PropTypesNs.ModalProps, context?:any) {
        super(props, context);
        this.state = {
            i18n: this.i18n("dialog")
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isVisible !== nextProps.isVisible;
    }

    render() {
        if (utils.isServer) {
            return null
        }

        var title = this._getTitle();
        var closeLabel = this._getCloseLabel();
        var closeSymbole = this._getCloseSymbole();

        var titleBarRender = null;
        var closeBarRender = null;
        if (!this.props.hideTitleBar) {
            titleBarRender = (
                <div className="widget-dialogue-header">
                    <div className="widget-dialogue-title">{title}</div>
                </div>);
        }

        if (!this.props.hideCloseBar) {
            closeBarRender = (
                <div className="widget-dialogue-close">
                    <button type="button" className="hornet-button hornet-dialogue-croix"
                            onClick={this.props.onClickClose}
                            title={closeLabel}
                            aria-label={closeLabel}
                    >{closeSymbole}
                    </button>
                </div>);
        }
        return (

            <ReactModal
                mounted={this.props.isVisible}
                titleText={title}
                onExit={this.props.onClickClose || function() {}}
                verticallyCenter={this.props.verticallyCenter}
                manageFocus={this.props.manageFocus}
                focusDialog={this.props.focusDialog}
                initialFocus={this.props.initialFocus}
                alert={this.props.alert}
                underlayClickExits={this.props.underlayClickExits}
                escapeKeyExits={this.props.escapeKeyExits}
                dialogClass={this.props.className}
                underlayClass={this.props.underlayClass} onShow={this.props.onShow}
            >
                {titleBarRender}
                <div className="widget-dialogue-body">
                    {this.props.children}
                </div>
                {closeBarRender}
            </ReactModal>);

    }


    /**
     * Extrait le titre passé dans les propriétés du composant ou indique un titre par défaut
     * @returns Titre
     * @private
     */
    private _getTitle() {
        return this.props.title || this.state.i18n.title;
    }

    /**
     * Extrait le label de fermeture passé dans les propriétés du composant ou indique un label par défaut
     * @returns Titre
     * @private
     */
    private _getCloseLabel() {
        return this.props.closeLabel || this.state.i18n.closeLabel;
    }

    /**
     * Extrait le symbole de fermeture dans les propriétés du composant ou indique un symbole par défaut
     * @returns Titre
     * @private
     */
    private _getCloseSymbole() {
        return this.props.closeSymbole || this.state.i18n.closeSymbole;
    }
}

export = Modal;