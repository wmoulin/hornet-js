"use strict";

export class Notifications implements INotifications {

    notifications:Array<INotificationType>;
    canRenderRealComponent:boolean;

    constructor() {
        this.notifications = new Array<INotificationType>();
        this.canRenderRealComponent = false;
    }

    getNotifications():Array<INotificationType> {
        return this.notifications;
    }

    getCanRenderRealComponent():boolean {
        return this.canRenderRealComponent;
    }

    addNotification(notification:INotificationType) {
        this.notifications.push(notification);
    }

    addNotifications(notifications:Array<INotificationType>) {
        this.notifications = this.notifications.concat(notifications);
    }

    /**
     * Construit une instance de Notifications contenant une seule notification ayant l'identifiant et le message indiqués
     * @param id identifiant de la notification à créer
     * @param text message de la notification
     */
    static makeSingleNotification(id:string, text:string):Notifications {
        var notif:NotificationType = new NotificationType();
        notif.id = id;
        notif.text = text;

        var notifs:Notifications = new Notifications();
        notifs.addNotification(notif);

        return notifs;
    }
}

export class NotificationType implements INotificationType {
    id:string;
    text:string;
    anchor:string;
    field:string;
    canRenderRealComponent:boolean;

    constructor() {
        this.id = "";
        this.text = "";
        this.anchor = "";
        this.field = "";
        this.canRenderRealComponent = false;
    }
}

export interface INotificationType {
    id:string;
    text:string;
    anchor:string;
    field:string;
    canRenderRealComponent:boolean;
}


export interface INotifications {
    notifications:Array<INotificationType>;
    canRenderRealComponent:boolean;
}
