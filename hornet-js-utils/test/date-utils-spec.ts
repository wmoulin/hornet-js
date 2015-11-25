/// <reference path="../../hornet-js-ts-typings/definition.d.ts" />
"use strict";

import TestUtils = require('src/test-utils');
import locale = require('test/locale/fr-fr');

import _ = require('lodash');
/* Format court : jour/mois */
var shortFormatLocale = _.cloneDeep(locale);
shortFormatLocale.dateFormat = 'dd/MM';

var logger = TestUtils.getLogger("hornet-js-utils.test.date-utils-spec");
import chai = require('chai');
import target = require('src/date-utils');

var expect = chai.expect;
var GregorianCalendar = require('gregorian-calendar');
var GregorianCalendarFormat = require('gregorian-calendar-format');

describe('DateUtils', () => {
    it('should parse date', () => {
        var result = target.parse('01/03/2017', locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getYear()).to.be.equal(2017);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should parse date with short format', () => {
        var result = target.parse('01/03', shortFormatLocale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should not parse malformed date', () => {
        var result = target.parse('/03/2017', locale);
        expect(result).to.be.undefined;
    });

    it('should not parse undefined date', () => {
        var result = target.parse(undefined, locale);
        expect(result).to.be.undefined;
    });

    it('should parse date matching the only format', () => {
        var result = target.parseMultipleFmt('01/03/2017', ['dd/MM/yyyy'], locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getYear()).to.be.equal(2017);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should parse date matching the second format', () => {
        var result = target.parseMultipleFmt('01/03/2017', ['yyyy-MM-dd', 'dd/MM/yyyy'], locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getYear()).to.be.equal(2017);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should parse date matching the only short format', () => {
        var result = target.parseMultipleFmt('01/03', ['dd/MM'], locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should parse date with locale format when formats array is undefiend', () => {
        var result = target.parseMultipleFmt('01/03/2017', undefined, locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getYear()).to.be.equal(2017);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should parse date with locale format when formats array is empty', () => {
        var result = target.parseMultipleFmt('01/03/2017', [], locale);
        expect(result).to.be.an.instanceOf(GregorianCalendar);
        expect(result.getYear()).to.be.equal(2017);
        expect(result.getMonth()).to.be.equal(2);
        expect(result.getDayOfMonth()).to.be.equal(1);
    });

    it('should not parse date matching no format', () => {
        var result = target.parseMultipleFmt('/03/2017', ['yyyy-MM-dd', 'yyyy/MM/dd'], locale);
        expect(result).to.be.undefined;
    });

    it('should not parse undefined date with multiple formats', () => {
        var result = target.parseMultipleFmt(undefined, ['yyyy-MM-dd', 'yyyy/MM/dd'], locale);
        expect(result).to.be.undefined;
    });

    it('should format date', () => {
        var dateToFormat:Date = new Date(2014, 3, 16);

        var result = target.format(dateToFormat.getTime(), locale);

        expect(result).to.be.equal('16/04/2014');
    });

    it('should format date with short format', () => {
        var dateToFormat:Date = new Date(2014, 3, 16);

        var result = target.format(dateToFormat.getTime(), shortFormatLocale);

        expect(result).to.be.equal('16/04');
    });

    it('should not format undefined date', () => {
        var expectedRes = '';

        var result = target.format(undefined, locale);

        expect(result).to.be.equal(expectedRes);
    });

    it('should convert from newforms format to GregorianCalendar format', () => {
        var result:string = target.newformsToGregorianCalFormat('%d/%m/%Y %H:%M:%S');
        expect(result).to.be.equal('dd/MM/yyyy HH:mm:ss')
    });

    it('should convert from GregorianCalendar to newforms format', () => {
        var result:string = target.gregorianCalToNewformsFormat('dd/MM/yyyy HH:mm:ss');
        expect(result).to.be.equal('%d/%m/%Y %H:%M:%S')
    });

});
