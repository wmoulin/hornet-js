"use strict";

import TestUtils = require("src/test-utils");
var logger = TestUtils.getLogger("hornet-js-utils.test.logger-spec");

describe("Logger", () => {
    it("should log strings", () => {
        logger.trace("Trace !");
        logger.debug("Debug !");
        logger.info("Info !");
        logger.warn("Warn !");
        logger.error("Error !");
        logger.fatal("Fatal !");
        logger.log("inexistantLevel', 'Default: Error");
    });

    it("should log complexe pattern", () => {
        logger.trace("Trace !", new Error("My Error Message"));
        logger.debug("Debug !", "second message");
        logger.info("Info !", {debug: "it works"});
        logger.warn("Warn !", {debug: "it works"});
        logger.error("Error !", "Test error");
        logger.fatal("Fatal !", {debug: "it works"});
        logger.log("inexistantLevel", "Default: Error", "Test default");
    });

    it("should log complexe pattern with log fn", () => {
        logger.log("debug", {debug: "it works"}, new Error("has expected"));
    });
});
