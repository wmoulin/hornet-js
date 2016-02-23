"use strict";

var utils = require("hornet-js-utils");
var React = require("react");
var TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var render = TestUtils.render;

var proxyquire = require("proxyquire").noCallThru();

var d3 ={
    draw: function(){},
    select: function(){return this;},
    selectAll: function(){return this;},
    attr: function(){return this;},
    append: function(){return this;},
    data: function(){return this;},
    enter: function(){return this;},
    style: function(){return this;},
    each: function(){return this;},
    text: function(){return this;},
    transition: function(){return this;},
    duration: function(){return this;},
    attrTween: function(){return this;},
    exit: function(){return this;},
    remove: function(){return this;},
    selectMatches : function(n, s) {return this},
    svg: {
        arc: function(){return this;},
        innerRadius: function(){return this;},
        outerRadius: function(){return this;}
    },
    layout: {
        pie: function(){return this},
        sort:function(){return this},
        value:function(){return function(){}}
    }
};

var HornetDonut = proxyquire("src/chart/chart-donut", {"d3":d3});

describe("HornetDonut", () => {
    it("doit être configuré avec les informations paramétrées", () => {
        // Arrange
        var data = [
            {"label": "Agro-alimentaire","value": "16","color": "#3366CC"},
            {"label": "Electro-ménager","value": "16","color": "#DC3912"},
            {"label": "Habillement","value": "29","color": "#FF9900"},
            {"label": "Santé","value": "16","color": "#109618"},
            {"label": "Sport","value": "20","color": "#990099"}
        ];
        var messages = {};
        var context ={
            getStore: (store) => {
                return {
                    getThemeUrl : function() {
                        return "utltheme";
                    }
                };
            },
            executeAction: () => {
            },
            i18n: function (keysString) {
                return keysString;
            }
        };

        var messages = {
            "description": "Répartition sous forme graphique",
            "title": "Répartition sous forme graphique"
        }

        var HornetDonutInstance = new HornetDonut();
        HornetDonutInstance.draw("quotesDonut", data, 450, 190, 160, 130, 30, 0);

        // Act
        var $ = render(() => <HornetDonut data={data} messages={messages}/>, context),
            $svg = $("svg");

        // Assert
        expect($svg).to.have.attr("width", "800");
        expect($svg).to.have.attr("height", "500");
    });
});
