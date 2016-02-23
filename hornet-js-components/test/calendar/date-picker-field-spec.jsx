"use strict";

var TestUtils = require("hornet-js-utils/src/test-utils");
var logger = TestUtils.getLogger("hornet-js-components.test.calendar.date-picker-field-spec");

var expect = TestUtils.chai.expect;
var render = TestUtils.render;
var newforms = require("newforms");

var DatePickerField = require("src/calendar/date-picker-field");


describe("DatePickerField", () => {
    describe(".toJavaScript", () => {
        it("doit renvoyer une date lorsque le paramètre est une date", () => {
            var testField = DatePickerField({});
            var testValue = new Date();
            var result = testField.toJavaScript(testValue);
            expect(result).to.be.an.instanceOf(Date);
        });

        it("doit renvoyer une date lorsque le paramètre est chaîne de caractères au bon format", () => {
            var testField = DatePickerField({});
            var testValue = "2015-07-08";
            var result = testField.toJavaScript(testValue);
            expect(result).to.be.an.instanceOf(Date);
            expect(result.getFullYear()).to.be.equal(2015);
            expect(result.getMonth()).to.be.equal(6);
            expect(result.getDate()).to.be.equal(8);
        });

        it("doit déclencher une erreur de validation lorsque le paramètre est une chaîne de caractère au mauvais format ", () => {
            var testField = DatePickerField({});
            var testValue = "07-08";
            try {
                testField.toJavaScript(testValue);
                fail("ValidationError non déclenchée");
            } catch (err) {
                expect(err).to.be.instanceof(newforms.ValidationError);
            }
        });
    });

    describe("DatePickerField.toJavaScript avec format sans année", () => {
        it("doit renvoyer une date lorsque le paramètre est une date", () => {
            var kwargs = {controlled: true, inputFormats: ['%d/%m']};
            var testField = DatePickerField(kwargs);
            var testValue = new Date();
            var result = testField.toJavaScript(testValue);
            expect(result).to.be.an.instanceOf(Date);
        });

        it("doit renvoyer une date  initialisée avec l'année en court lorsque le paramètre est chaîne de caractères au bon format", () => {
            var kwargs = {controlled: true, inputFormats: ["%d/%m"]};
            var testField = DatePickerField(kwargs);
            var testValue = "08/07";
            var result = testField.toJavaScript(testValue);
            expect(result).to.be.an.instanceOf(Date);
            expect(result.getFullYear()).to.be.equal(new Date().getFullYear());
            expect(result.getMonth()).to.be.equal(6);
            expect(result.getDate()).to.be.equal(8);
        });

        it("doit renvoyer une date  initialisée avec l'année indiquée lorsque le paramètre est chaîne de caractères au bon format", () => {
            var kwargs = {controlled: true, inputFormats: ["%d/%m"], defaultYear: 2012};
            var testField = DatePickerField(kwargs);
            var testValue = "08/07";
            var result = testField.toJavaScript(testValue);
            expect(result).to.be.an.instanceOf(Date);
            expect(result.getFullYear()).to.be.equal(kwargs.defaultYear);
            expect(result.getMonth()).to.be.equal(6);
            expect(result.getDate()).to.be.equal(8);
        });

        it("doit déclencher une erreur de validation lorsque le paramètre est une chaîne de caractère au mauvais format ", () => {
            var kwargs = {controlled: true, inputFormats: ["%d/%m"]};
            var testField = DatePickerField(kwargs);
            var testValue = "08";
            try {
                testField.toJavaScript(testValue);
                fail("ValidationError non déclenchée");
            } catch (err) {
                expect(err).to.be.instanceof(newforms.ValidationError);
            }
        });

    });
});

