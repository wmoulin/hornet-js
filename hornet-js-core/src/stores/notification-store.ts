///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import BaseStore = require("fluxible/addons/BaseStore");

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.stores.notification-store");

import N = require("src/routes/notifications");
import Action = require("src/actions/action");

class NotificationStore extends BaseStore {

    static storeName:string = "NotificationStore";

    private err_notifications:Array<N.INotificationType>;
    private info_notifications:Array<N.INotificationType>;
    private modal_notifications:Array<N.INotificationType>;
    private canRenderRealComponent:boolean;

    /**
     * @returns {Object} les fonctions 'handler' indexées par nom d'évènement
     */
    static initHandlers():Object {
        var handlers:any = new Object();
        handlers[Action.EMIT_ERR_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.EMIT_ERR_NOTIFICATION);
            this.handleAddNotif(notifs, this.err_notifications);
        };
        handlers[Action.EMIT_INFO_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.EMIT_INFO_NOTIFICATION);
            this.handleAddNotif(notifs, this.info_notifications);
        };
        handlers[Action.EMIT_MODAL_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.EMIT_MODAL_NOTIFICATION);
            this.handleAddNotif(notifs, this.modal_notifications);
        };
        handlers[Action.REMOVE_ERR_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.REMOVE_ERR_NOTIFICATION);
            this.handleRemove(notifs, this.err_notifications);
        };
        handlers[Action.REMOVE_INFO_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.REMOVE_INFO_NOTIFICATION);
            this.handleRemove(notifs, this.info_notifications);
        };
        handlers[Action.REMOVE_MODAL_NOTIFICATION] = function (notifs:N.Notifications) {
            logger.debug("notification Store : " + Action.REMOVE_MODAL_NOTIFICATION);
            this.handleRemove(notifs, this.modal_notifications);
        };
        handlers[Action.REMOVE_ALL_ERR_NOTIFICATIONS] =  function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_ERR_NOTIFICATIONS);
            this.err_notifications = Array<N.INotificationType>();
            this.modal_notifications = Array<N.INotificationType>();
            this.canRenderRealComponent = true;
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_INFO_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_INFO_NOTIFICATIONS);
            this.info_notifications = new Array<N.INotificationType>();
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_MODAL_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_MODAL_NOTIFICATIONS);
            this.modal_notifications = new Array<N.INotificationType>();
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_NOTIFICATIONS);
            this.initialize();
            this.emitChange();
        };
        return handlers;
    }

    static handlers:any = NotificationStore.initHandlers();

    constructor(dispatcher) {
        super(dispatcher);
        this.initialize();
    }

    private initialize() {
        this.err_notifications = new Array<N.INotificationType>();
        this.info_notifications = new Array<N.INotificationType>();
        this.modal_notifications = new Array<N.INotificationType>();
        this.canRenderRealComponent = true;
    }

    private testIntance(notifs:N.Notifications){
        if(!(notifs instanceof N.Notifications)){
            throw new Error("La notification n'est pas du type N.Notifications");
        }
    }

    private handleRemove(notifs:N.Notifications, notifStore:Array<N.INotificationType>) {
        this.testIntance(notifs);

        var doEmit = false;

        notifs.getNotifications().forEach((notif) => {
            doEmit = this.removeNotif(notif, notifStore) || doEmit;
        });

        if (doEmit) {
            this.emitChange();
        }
    }

    private removeNotif(notif:N.INotificationType, notifStore:Array<N.INotificationType>):boolean {
        if (notif.id === undefined) {
            logger.warn("Notification sans ID:", notif);
            return;
        }

        for (var i = 0; i < notifStore.length; i++) {
            if (notif.id == notifStore[i].id) {
                logger.debug("Suppression de la notif " + notif.id);
                notifStore.splice(i, 1);
                this.emitChange();
                break;
            }
        }
    }

    private handleAddNotif(notifs:N.Notifications, notifStore:Array<N.INotificationType>) {
        this.testIntance(notifs);

        var doEmit = false;

        notifs.getNotifications().forEach((notif) => {
            doEmit = this.addNotif(notif, notifStore) || doEmit;
        });

        if (doEmit) {
            this.emitChange();
        }
    }

    /**
     * Ajoute une notification et retourne true si une modification a bien été apportée
     */
    addNotif(notif:N.INotificationType, notifStore:Array<N.INotificationType>):boolean {
        var needToAdd = true;

        if (notif.id === undefined) {
            logger.warn("Notification sans ID:", notif);
            return false;
        }

        for (var i = 0; i < notifStore.length; i++) {
            if (notif.id == notifStore[i].id) {
                logger.debug("Notif déja présente, on remplace : ", notif.toString());
                notifStore[i] = notif;
                needToAdd = false;
                break;
            }
        }

        if (needToAdd) {
            logger.debug("Ajout de la notif ", notif.id);
            notifStore.push(notif);
        }

        return true;
    }

    getInfoNotifications():Array<N.INotificationType> {
        return this.info_notifications;
    }

    getErrorNotifications():Array<N.INotificationType> {
        return this.err_notifications;
    }

    getModalNotifications():Array<N.INotificationType> {
        return this.modal_notifications;
    }

    hasErrorNotitications():boolean {
        return this.err_notifications.length > 0;
    }

    canRenderComponent():boolean {
        return this.canRenderRealComponent;
    }

    rehydrate(state:any) {
        this.info_notifications = state.info_notifications;
        this.err_notifications = state.err_notifications;
        this.modal_notifications = state.modal_notifications;
        this.canRenderRealComponent = state.canRenderRealComponent;
    }

    dehydrate():any {
        return {
            info_notifications: this.info_notifications,
            err_notifications: this.err_notifications,
            modal_notifications: this.modal_notifications,
            canRenderRealComponent: this.canRenderRealComponent
        };
    }
}

export = NotificationStore;
