///<reference path='../../../hornet-js-ts-typings/definition.d.ts'/>
"use strict";
import utils = require('hornet-js-utils');
import chai = require('chai');

var expect = chai.expect;
// initialisation du logger
var logger = utils.getLogger("hornet-js-core.test.store.notification-store-spec");
import NotificationStore = require('src/stores/notification-store');

import N = require('src/routes/notifications');

describe('NotificationStore', () => {
    var target;

    beforeEach(() => {
        target = new NotificationStore(null);
    });

    it('should not add err notif without id', () => {
        expect(target.addNotif({}, target.err_notifications)).to.be.false;
        expect(target.getErrorNotifications().length).to.be.equal(0);
    });

    it('should not add info notif without id', () => {
        expect(target.addNotif({}, target.info_notifications)).to.be.false;
        expect(target.getInfoNotifications().length).to.be.equal(0);
    });

    it('should add err notif with id', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        expect(target.addNotif(myNotif, target.err_notifications)).to.be.true;
        expect(target.getErrorNotifications()[0]).to.be.equal(myNotif);
    });

    it('should add info notif with id', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';
        expect(target.addNotif(myNotif, target.info_notifications)).to.be.true;
        expect(target.getInfoNotifications()[0]).to.be.equal(myNotif);
    });

    it('should replace already present err notif', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';
        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random';
        myNotif2.text = 'random';
        target.addNotif(myNotif, target.err_notifications);
        expect(target.addNotif(myNotif2, target.err_notifications)).to.be.true;
        expect(target.getErrorNotifications()[0]).to.be.equal(myNotif2);
    });

    it('should replace already present info notif', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';
        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random';
        myNotif2.text = 'random';
        target.addNotif(myNotif, target.info_notifications);
        expect(target.addNotif(myNotif2, target.info_notifications)).to.be.true;
        expect(target.getInfoNotifications()[0]).to.be.equal(myNotif2);
    });

    it('should add multiple err notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random2';
        myNotif2.text = 'random2';

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);
        notification.addNotification(myNotif2);

        //Act
        var handlersFn = (NotificationStore.handlers.EMIT_ERR_NOTIFICATION).bind(target);
        handlersFn(notification);

        //Assert
        expect(emitDone).to.be.true;
        expect(target.getErrorNotifications().length).to.be.equal(2);
        expect(target.getErrorNotifications()[0]).to.be.equal(myNotif);
        expect(target.getErrorNotifications()[1]).to.be.equal(myNotif2);
    });

    it('should add a false Array err notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);

        var handlersFn = (NotificationStore.handlers.EMIT_ERR_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getErrorNotifications().length).to.be.equal(1);
        expect(target.getErrorNotifications()[0]).to.be.equal(myNotif);
    });

    it('should add a false Array info notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);

        //Act
        var handlersFn = (NotificationStore.handlers.EMIT_INFO_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getInfoNotifications().length).to.be.equal(1);
        expect(target.getInfoNotifications()[0]).to.be.equal(myNotif);
    });

    it('should add multiple info notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random2';
        myNotif2.text = 'random2';

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);
        notification.addNotification(myNotif2);

        //Act
        var handlersFn = (NotificationStore.handlers.EMIT_INFO_NOTIFICATION).bind(target);
        handlersFn(notification);

        //Assert
        expect(emitDone).to.be.true;
        expect(target.getInfoNotifications().length).to.be.equal(2);
        expect(target.getInfoNotifications()[0]).to.be.equal(myNotif);
        expect(target.getInfoNotifications()[1]).to.be.equal(myNotif2);
    });

    it('should remove err notif', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        target.addNotif(myNotif, target.err_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_ERR_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getErrorNotifications().length).to.be.equal(0);
    });

    it('should remove undefined err notif', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        var alien = new N.NotificationType();
        alien.id = undefined;

        target.addNotif(myNotif, target.err_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(alien);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_ERR_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.false;
        expect(target.getErrorNotifications().length).to.be.equal(1);
    });

    it('should remove info notif', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        target.addNotif(myNotif, target.info_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_INFO_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getInfoNotifications().length).to.be.equal(0);
    });

    it('should remove undefined info notif', () => {

        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        var alien = new N.NotificationType();
        alien.id = undefined;

        target.addNotif(myNotif, target.info_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(alien);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_INFO_NOTIFICATION).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.false;
        expect(target.getInfoNotifications().length).to.be.equal(1);
    });

    it('should remove all err notifs', () => {

        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random4';

        var myNotif3 = new N.NotificationType();
        myNotif3.id = 'random5';

        target.addNotif(myNotif, target.err_notifications);
        target.addNotif(myNotif2, target.err_notifications);
        target.addNotif(myNotif3, target.err_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotification(myNotif);
        notification.addNotification(myNotif2);
        notification.addNotification(myNotif3);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_ALL_ERR_NOTIFICATIONS).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getErrorNotifications().length).to.be.equal(0);
    });

    it('should remove all info notifs', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random';

        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random2';

        var myNotif3 = new N.NotificationType();
        myNotif3.id = 'random3';

        target.addNotif(myNotif, target.info_notifications);
        target.addNotif(myNotif2, target.info_notifications);
        target.addNotif(myNotif3, target.err_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_ALL_INFO_NOTIFICATIONS).bind(target);
        handlersFn();

        expect(emitDone).to.be.true;
        expect(target.getInfoNotifications().length).to.be.equal(0);
        expect(target.getErrorNotifications().length).to.be.equal(1);
    });

    it('should remove all notifs', () => {
        var myNotif = new N.NotificationType();
        myNotif.id = 'random3';

        var myNotif2 = new N.NotificationType();
        myNotif2.id = 'random4';

        var myNotif3 = new N.NotificationType();
        myNotif3.id = 'random5';

        var myNotif4 = new N.NotificationType();
        myNotif4.id = 'random6';

        target.addNotif(myNotif, target.err_notifications);
        target.addNotif(myNotif2, target.info_notifications);
        target.addNotif(myNotif3, target.err_notifications);
        target.addNotif(myNotif4, target.info_notifications);

        var emitDone = false;
        target.addChangeListener(() => {
            emitDone = true;
        });

        var notification = new N.Notifications();
        notification.addNotifications([myNotif, myNotif2, myNotif3, myNotif4]);

        //Act
        var handlersFn = (NotificationStore.handlers.REMOVE_ALL_NOTIFICATIONS).bind(target);
        handlersFn(notification);

        expect(emitDone).to.be.true;
        expect(target.getInfoNotifications().length).to.be.equal(0);
        expect(target.getErrorNotifications().length).to.be.equal(0);
    });


    it('should dehydrate notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random4';

        target.addNotif(myNotif, target.err_notifications);

        //Act
        var dehydratation = target.dehydrate();

        //Assert
        expect(dehydratation).to.exist.to.have.keys(['err_notifications', 'info_notifications', 'modal_notifications', 'canRenderRealComponent']);
        expect(dehydratation.err_notifications[0]).to.exist.to.be.equals(myNotif);
    });

    it('should rehydrate notif', () => {
        //Arrange
        var myNotif = new N.NotificationType();
        myNotif.id = 'random5';

        target.rehydrate({
            err_notifications: [myNotif]
        });

        //Act
        var notifs = target.getErrorNotifications();

        //Assert
        expect(notifs.length).to.be.equals(1);
        expect(notifs[0]).to.be.equals(myNotif);
    });
});
