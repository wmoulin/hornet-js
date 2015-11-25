"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");
var FileWidget = require("src/upload-file/upload-file-widget");

var logger = utils.getLogger("hornet-js-components.upload-file.upload-file-field");

/*
 Field newforms permettant de construire un composant ImageField
 */
var UploadFileField = newforms.ImageField.extend({
    widget: FileWidget,
    constructor(kwargs) {
        logger.trace("Construction UploadFileField");
        if (!(this instanceof UploadFileField)) {
            return new UploadFileField(kwargs);
        }
        newforms.ImageField.call(this, kwargs);
        this.widget.setComponentProperties(kwargs.fileRoute, kwargs.fileTitle);
    }
});


module.exports = UploadFileField;