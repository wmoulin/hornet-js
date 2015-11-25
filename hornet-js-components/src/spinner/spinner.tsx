///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react/addons");
import utils = require("hornet-js-utils");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/spinner/spinner-props");
import fluxInformationsStore = require("hornet-js-core/src/stores/flux-informations-store");
import Modal = require("src/dialog/modal");

var logger = utils.getLogger("hornet-js-components.spinner.spinner");

@HornetComponent.ApplyMixins()
class Spinner extends HornetComponent<PropTypesNs.SpinnerProps,any> {

    static displayName:string = "Spinner";

    static propTypes = {
        scheduleDelayInMs: React.PropTypes.number,
        minimalShowTimeInMs: React.PropTypes.number,
        loadingTitle: React.PropTypes.string,
        loadingText: React.PropTypes.string,
        imageLoadingUrl: React.PropTypes.string
    };

    static defaultProps = {
        scheduleDelayInMs: 300,
        minimalShowTimeInMs: 500
    };

    static storeListeners = {
        _scheduleStoreCheck: [fluxInformationsStore]
    };

    constructor(props?:PropTypesNs.SpinnerProps, context?:any) {
        super(props, context);
        this.state = {
            i18n: this.i18n("spinner"),
            isVisible: false
        }
    }

    /**
     * Fonction appelée lors d'une modification du store.
     * Elle planifie la récupération d'une valeur dans un délai configuré dans la propriété "scheduleDelayInMs".
     */
    @HornetComponent.AutoBind
    _scheduleStoreCheck() {
        //logger.trace("Schedule store check");
        setTimeout(this._retrieveOrScheduleStoreValueRecuperation, this.props.scheduleDelayInMs);
    }

    /**
     * Fonction qui demande la récupération des valeurs dans le store
     * Si le composant est actuellement affiché et que le temps configuré dans la propriété "minimalShowTimeInMs" n"est pas atteint,
     * alors une replanification est effectuée plutot qu"un appel au store
     *
     * @private
     */
    @HornetComponent.AutoBind
    private _retrieveOrScheduleStoreValueRecuperation() {
        var callStore = true;
        //On prévient les clignotements en donnant un seuil minimal à la durée d"affichage
        if (this.state.isVisible) {
            var showTime = Date.now() - this.state.lastVisibilitySwitch;
            if (showTime < this.props.minimalShowTimeInMs) {
                callStore = false;
            }
        }

        if (callStore) {
            this._retrieveStoreValue();
        } else {
            // On re-planifie
            this._scheduleStoreCheck();
        }
    }

    /**
     * Change la visibilité du composant selon l'état du store
     */
    private _retrieveStoreValue() {
        var store = this.getStore(fluxInformationsStore);

        var newVisibilityState = store.hasActionsRunning();
        if (newVisibilityState !== this.state.isVisible) {
            logger.trace("Changement visibilité du spinner:", newVisibilityState);
            this.setState({"isVisible": newVisibilityState, "lastVisibilitySwitch": Date.now()});
        }
    }


    render() {
        var contentSpinner = this.props.children || this._renderDefaultSpinnerContent();
        return (
            <Modal isVisible={this.state.isVisible} title={this._getLoadingTitle()} hideCloseBar={true} manageFocus={false}>
                <span role="progressbar">
                    {contentSpinner}
                </span>
            </Modal>
        );
    }

    private _renderDefaultSpinnerContent() {
        return (
            <div className="widget-spinner-body" tabIndex={0}>
                <div className="widget-spinner-content">{this._getLoadingText()}</div>
                <img src={this._getSpinnerImage()} alt={this._getLoadingTitle()}/>
            </div>
        );
    }

    /**
     * Return l'url de l'image spinner
     * @returns Url image spinner
     * @private
     */
    private  _getSpinnerImage() {
        return this.props.imageLoadingUrl || this.genUrlTheme("/img/spinner/ajax_loader_blue_128.gif");
    }

    /**
     * Extrait le libelle loadingText passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private _getLoadingText() {
        return this.props.loadingText || this.state.i18n.loadingText;
    }

    /**
     * Extrait le libelle loadingTitle passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private _getLoadingTitle() {
        return this.props.loadingTitle || this.state.i18n.loadingTitle;
    }
}

export = Spinner;