///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>

"use strict";
import utils = require("hornet-js-utils");
import React = require("react");
import NotificationStore = require("hornet-js-core/src/stores/notification-store");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/notification/notification-props");
import MessageItem = require("src/notification/notification-message-item");

var logger = utils.getLogger("hornet-js-components.basic.notification");

@HornetComponent.ApplyMixins()
class Notification extends HornetComponent<PropTypesNs.NotificationProps,any> {

    static displayName:string = "Notification";

    static propTypes = {
        isModal: React.PropTypes.bool,
        errorsTitle: React.PropTypes.string,
        infosTitle: React.PropTypes.string
    };

    static storeListeners = [NotificationStore];

    constructor(props?:PropTypesNs.NotificationProps, context?:any) {
        super(props, context);
        this.state = this._getState();
    }

    @HornetComponent.AutoBind
    onChange() {
        this.setState(this._getState());
    }

    /**
     * Génère l'état du composant à partir des informations du store NotificationStore
     * @returns {{infoMessages: *, errorMessages: *, modalMessages: *}}
     * @private
     */
    _getState() {
        var store = this.getStore(NotificationStore);
        return {
            /* On clone les tableaux de messages du store, sinon lorsque le store sera modifié,
             les tableaux seront modifiés avant même qu'un appel à setState ait été réalisé sur ce composant,
             ce qui ne permet plus d'utiliser correctement les méthodes du type shouldComponentUpdate */
            infoMessages: utils._.cloneDeep(store.getInfoNotifications()),
            errorMessages: utils._.cloneDeep(store.getErrorNotifications()),
            modalMessages: utils._.cloneDeep(store.getModalNotifications())
        };
    }

    /**
     * @param nextProps propriétés suivantes
     * @param nextState état suivant
     * @returns {boolean} true les messages de notification ont été modifiés
     */
    shouldComponentUpdate(nextProps, nextState) {
        var shouldUpdate = (!utils._.isEqual(nextState.infoMessages, this.state.infoMessages)
        || !utils._.isEqual(nextState.errorMessages, this.state.errorMessages)
        || !utils._.isEqual(nextState.modalMessages, this.state.modalMessages));
        return shouldUpdate;
    }

    componentDidMount() {
        this.scrollToNotifications();
    }

    componentDidUpdate() {
        this.scrollToNotifications();
    }

    /**
     * Fait défiler la page courante de façon à afficher le bloc de notifications
     */
    scrollToNotifications() {
        var element = React.findDOMNode(this) as any;
        if (element && element.scrollIntoView) {
            element.scrollIntoView();
        } else {
            logger.warn("Impossible de scroller sur les notifications.");
        }
    }

    renderErrorMessage() {
        var errorMessages = this.state.errorMessages.map((message) => {
            return <MessageItem key={message.id} anchor={message.anchor} {...message} />
        });
        return (
            <section>
                <div className="messageBox errorBox">
                    <div>
                        <h1 className="titleError">{this._getErrorsTitle()}</h1>
                        <ul>
                            {errorMessages}
                        </ul>
                    </div>
                </div>
            </section>
        )
    }

    renderInfoMessage() {
        var infoMessages = this.state.infoMessages.map((message) => {
            return <MessageItem key={message.id}  {...message} />
        });
        return (
            <section>
                <div className="messageBox infoBox">
                    <div>
                        <h1 className="titleInfo">{this._getInfosTitle()}</h1>
                        <ul>
                            {infoMessages}
                        </ul>
                    </div>
                </div>
            </section>
        )
    }

    renderModalMessage() {
        var modalMessages = this.state.modalMessages.map((message) => {
            return <MessageItem key={message.id} {...message} />
        });
        return (
            <section>
                <div className="messageBox errorBox">
                    <div>
                        <h1 className="titleError">{this._getErrorsTitle()}</h1>
                        <ul>
                            {modalMessages}
                        </ul>
                    </div>
                </div>
            </section>
        )
    }

    render() {
        if (this.state.modalMessages.length > 0 && this.props.isModal) {
            return (
                <span> {this.renderModalMessage()} </span>
            )
        }
        else {
            return (
                <span>
                    {(this.state.errorMessages.length > 0) ? this.renderErrorMessage() : null}
                    {(this.state.infoMessages.length > 0) ? this.renderInfoMessage() : null}
                </span>
            )
        }
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getInfosTitle() {
        return this.props.infosTitle || this.i18n("notification.infosTitle");
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getErrorsTitle() {
        return this.props.errorsTitle || this.i18n("notification.errorsTitle");
    }
}
module.exports = Notification;