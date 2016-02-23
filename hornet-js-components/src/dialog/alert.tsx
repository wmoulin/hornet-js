"use strict";

import React = require("react");
import HornetComponent = require("src/hornet-component");
import Button = require("src/button/button");
import Modal = require("src/dialog/modal");
import PropTypesNs = require("src/dialog/alert-props");

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.dialog.alert");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class Alert extends HornetComponent<PropTypesNs.AlertProps,any> {

    static displayName:string = "Alert";

    static propTypes = {
        isVisible: React.PropTypes.bool,
        onClickOk: React.PropTypes.func, // L'utilisateur valide le message
        onClickCancel: React.PropTypes.func, // L'utilisateur annule ou appui sur la croix fermer en haut à droite
        onClickClose: React.PropTypes.func,
        title: React.PropTypes.string,
        message: React.PropTypes.string.isRequired,
        valid: React.PropTypes.string,
        cancel: React.PropTypes.string,
        validTitle: React.PropTypes.string,
        cancelTitle: React.PropTypes.string,
        underlayClickExits: React.PropTypes.bool,
        escapeKeyExits: React.PropTypes.bool
    };

    static defaultProps = {
        isVisible: true,
        underlayClickExits: false,
        escapeKeyExits: true
    };

    constructor(props?:PropTypesNs.AlertProps, context?:any) {
        super(props, context);
        this.state = {
            i18n: this.i18n("form")
        }
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible}
                   onClickClose={this.props.onClickClose}
                   alert={true}
                   underlayClickExits={this.props.underlayClickExits}
                   escapeKeyExits={this.props.escapeKeyExits}
                   title={this.props.title}
            >
                <div className="widget-alert-body">
                    {this.props.message}
                </div>
                <div className="widget-dialogue-footer">
                    <div className="hornet-alert-buttons button-group">
                        <Button item={this._configOKButton()}/>
                        <Button item={this._configCancelButton()}/>
                    </div>
                </div>
            </Modal>);
    }

    /**
     * Configuration du bouton OK
     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (boolean|string), onClick: (*|defaultFunction)}}
     * @private
     */
    private _configOKButton() {
        return {
            type: "button",
            id: "alertOK",
            name: "action:validMessage",
            value: "Valider",
            className: "hornet-button hornet-alert-button-ok",
            label: this._getValid(),
            title: this._getValidTitle(),
            onClick: this.props.onClickOk
        }
    }

    /**
     * Configuration du bouton ANNULER
     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (*|string|cancel), onClick: (*|defaultFunction)}}
     * @private
     */
    private  _configCancelButton() {
        return {
            type: "button",
            id: "alertCancel",
            name: "action:annulerMessage",
            value: "Annuler",
            className: "hornet-button hornet-alert-button-cancel",
            label: this._getCancel(),
            title: this._getCancelTitle(),
            onClick: this.props.onClickCancel
        }
    }

    /**
     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private _getValid() {
        return this.props.valid || this.state.i18n.valid;
    }

    /**
     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private _getCancel() {
        return this.props.cancel || this.state.i18n.cancel;

    }

    /**
     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private _getValidTitle() {
        return this.props.validTitle || this.state.i18n.validTitle;
    }

    /**
     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private  _getCancelTitle() {
        return this.props.cancelTitle || this.state.i18n.cancelTitle;
    }
}

export = Alert;