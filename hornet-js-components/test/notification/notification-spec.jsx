"use strict";

var React = require('react');
var TestUtils = require('hornet-js-utils/src/test-utils');
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

var Notification = require('src/notification/notification');

var logger = TestUtils.getLogger("hornet-js-components.test.notification.notification-spec");

describe('Notification', () => {
    it('Affichage du bloc de notifications Erreur avec une erreur...', () => {
        // Arrange

        var errors = [
            {
                id: 'error1',
                anchor: 'error1',
                text: 'erreur sur la page 1'
            }
        ];
        var infos = [];

        var store = construitStore(errors, infos);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Notification/>
                </div>
            , contexte
        );

        // Assert
        var $box = $('.errorBox');
        expect($box).to.exist;

        var $listErrors = $('.errorBox ul li');
        expect($listErrors.length).is.equal(1);
    });

    it('Affichage du bloc de notifications Informations avec une info...', () => {
        // Arrange

        var errors = [];
        var infos = [
            {
                id: 'info1',
                anchor: 'info1',
                text: 'info sur la page 1'
            }
        ];

        var store = construitStore(errors, infos);
        var contexte = construitLeContext(store);

        // Act
        var $ = render(() =>
                <div>
                    <Notification/>
                </div>
            , contexte
        );

        // Assert
        var $box = $('.infoBox');
        expect($box).to.exist;

        var $listInfos = $('.infoBox ul li');
        expect($listInfos.length).is.equal(1);
    });
});

function construitStore(errors, infos) {
    var NotificationStore = {
        getInfoNotifications() {
            return infos
        },
        getErrorNotifications() {
            return errors
        },
        getModalNotifications() {
            return {}
        }
    };

    return NotificationStore;
}

function construitLeContext(Store) {
    var context = {
        getStore: function (store) {
            return Store;
        },
        executeAction: () => {
        },

        locale: "fr-FR",
        i18n: function (keysString) {
            return keysString;
        }
    };
    return context;
};