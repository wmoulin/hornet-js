///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";
var Notifications = (function () {
    function Notifications() {
        this.notifications = new Array();
        this.canRenderRealComponent = false;
    }
    Notifications.prototype.getNotifications = function () {
        return this.notifications;
    };
    Notifications.prototype.getCanRenderRealComponent = function () {
        return this.canRenderRealComponent;
    };
    Notifications.prototype.addNotification = function (notification) {
        this.notifications.push(notification);
    };
    Notifications.prototype.addNotifications = function (notifications) {
        this.notifications = this.notifications.concat(notifications);
    };
    /**
     * Construit une instance de Notifications contenant une seule notification ayant l'identifiant et le message indiqués
     * @param id identifiant de la notification à créer
     * @param text message de la notification
     */
    Notifications.makeSingleNotification = function (id, text) {
        var notif = new NotificationType();
        notif.id = id;
        notif.text = text;
        var notifs = new Notifications();
        notifs.addNotification(notif);
        return notifs;
    };
    return Notifications;
})();
exports.Notifications = Notifications;
var NotificationType = (function () {
    function NotificationType() {
        this.id = "";
        this.text = "";
        this.anchor = "";
        this.field = "";
        this.canRenderRealComponent = false;
    }
    return NotificationType;
})();
exports.NotificationType = NotificationType;
//# sourceMappingURL=notifications.js.map