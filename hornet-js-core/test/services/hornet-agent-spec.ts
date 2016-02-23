"use strict";

import utils = require("hornet-js-utils");

import HornetAgent = require("src/services/hornet-agent");
import TestUtils = require("hornet-js-utils/src/test-utils");
var expect = TestUtils.chai.expect;
var sinon = TestUtils.sinon;
var logger = TestUtils.getLogger("hornet-js-core.test.services.hornet-agent-spec");

describe("hornet-agent-spec", () => {

    describe("cache", () => {

        it("should deactivate cache if global cache deactivated", () => {
            // Arrange
            utils.setConfigObj({
                cache: {enabled: false}
            });

            // Act
            var instance = new HornetAgent().cache();

            // Assert

            expect((<any>instance).enableCache).to.be.false;
        });

        it("should activate cache with default ttl if global cache activate", () => {
            // Arrange
            utils.setConfigObj({
                cache: {enabled: true, timetolive: 45}
            });

            // Act
            var instance = new HornetAgent().cache();

            // Assert
            expect((<any>instance).enableCache).to.be.true;
            expect((<any>instance).timetoliveInCache).to.be.equals(45);
        });

        it("should activate cache with ttl if global cache activate", () => {
            // Arrange
            utils.setConfigObj({
                cache: {enabled: true, timetolive: 45}
            });

            // Act
            var instance = new HornetAgent().cache(90);

            // Assert
            expect((<any>instance).enableCache).to.be.true;
            expect((<any>instance).timetoliveInCache).to.be.equals(90);
        });
    });
});
