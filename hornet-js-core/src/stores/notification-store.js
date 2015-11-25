///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseStore = require("fluxible/addons/BaseStore");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-core.stores.notification-store");
var N = require("src/routes/notifications");
var Action = require("src/actions/action");
var NotificationStore = (function (_super) {
    __extends(NotificationStore, _super);
    function NotificationStore(dispatcher) {
        _super.call(this, dispatcher);
        this.initialize();
    }
    /**
     * @returns {Object} les fonctions 'handler' indexées par nom d'évènement
     */
    NotificationStore.initHandlers = function () {
        var handlers = new Object();
        handlers[Action.EMIT_ERR_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.EMIT_ERR_NOTIFICATION);
            this.handleAddNotif(notifs, this.err_notifications);
        };
        handlers[Action.EMIT_INFO_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.EMIT_INFO_NOTIFICATION);
            this.handleAddNotif(notifs, this.info_notifications);
        };
        handlers[Action.EMIT_MODAL_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.EMIT_MODAL_NOTIFICATION);
            this.handleAddNotif(notifs, this.modal_notifications);
        };
        handlers[Action.REMOVE_ERR_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.REMOVE_ERR_NOTIFICATION);
            this.handleRemove(notifs, this.err_notifications);
        };
        handlers[Action.REMOVE_INFO_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.REMOVE_INFO_NOTIFICATION);
            this.handleRemove(notifs, this.info_notifications);
        };
        handlers[Action.REMOVE_MODAL_NOTIFICATION] = function (notifs) {
            logger.debug("notification Store : " + Action.REMOVE_MODAL_NOTIFICATION);
            this.handleRemove(notifs, this.modal_notifications);
        };
        handlers[Action.REMOVE_ALL_ERR_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_ERR_NOTIFICATIONS);
            this.err_notifications = Array();
            this.modal_notifications = Array();
            this.canRenderRealComponent = true;
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_INFO_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_INFO_NOTIFICATIONS);
            this.info_notifications = new Array();
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_MODAL_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_MODAL_NOTIFICATIONS);
            this.modal_notifications = new Array();
            this.emitChange();
        };
        handlers[Action.REMOVE_ALL_NOTIFICATIONS] = function () {
            logger.debug("notification Store : " + Action.REMOVE_ALL_NOTIFICATIONS);
            this.initialize();
            this.emitChange();
        };
        return handlers;
    };
    NotificationStore.prototype.initialize = function () {
        this.err_notifications = new Array();
        this.info_notifications = new Array();
        this.modal_notifications = new Array();
        this.canRenderRealComponent = true;
    };
    NotificationStore.prototype.testIntance = function (notifs) {
        if (!(notifs instanceof N.Notifications)) {
            throw new Error("La notification n'est pas du type N.Notifications");
        }
    };
    NotificationStore.prototype.handleRemove = function (notifs, notifStore) {
        var _this = this;
        this.testIntance(notifs);
        var doEmit = false;
        notifs.getNotifications().forEach(function (notif) {
            doEmit = _this.removeNotif(notif, notifStore) || doEmit;
        });
        if (doEmit) {
            this.emitChange();
        }
    };
    NotificationStore.prototype.removeNotif = function (notif, notifStore) {
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
    };
    NotificationStore.prototype.handleAddNotif = function (notifs, notifStore) {
        var _this = this;
        this.testIntance(notifs);
        var doEmit = false;
        notifs.getNotifications().forEach(function (notif) {
            doEmit = _this.addNotif(notif, notifStore) || doEmit;
        });
        if (doEmit) {
            this.emitChange();
        }
    };
    /**
     * Ajoute une notification et retourne true si une modification a bien été apportée
     */
    NotificationStore.prototype.addNotif = function (notif, notifStore) {
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
    };
    NotificationStore.prototype.getInfoNotifications = function () {
        return this.info_notifications;
    };
    NotificationStore.prototype.getErrorNotifications = function () {
        return this.err_notifications;
    };
    NotificationStore.prototype.getModalNotifications = function () {
        return this.modal_notifications;
    };
    NotificationStore.prototype.hasErrorNotitications = function () {
        return this.err_notifications.length > 0;
    };
    NotificationStore.prototype.canRenderComponent = function () {
        return this.canRenderRealComponent;
    };
    NotificationStore.prototype.rehydrate = function (state) {
        this.info_notifications = state.info_notifications;
        this.err_notifications = state.err_notifications;
        this.modal_notifications = state.modal_notifications;
        this.canRenderRealComponent = state.canRenderRealComponent;
    };
    NotificationStore.prototype.dehydrate = function () {
        return {
            info_notifications: this.info_notifications,
            err_notifications: this.err_notifications,
            modal_notifications: this.modal_notifications,
            canRenderRealComponent: this.canRenderRealComponent
        };
    };
    NotificationStore.storeName = "NotificationStore";
    NotificationStore.handlers = NotificationStore.initHandlers();
    return NotificationStore;
})(BaseStore);
module.exports = NotificationStore;
//# sourceMappingURL=notification-store.js.map