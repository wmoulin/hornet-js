"use strict";
var newforms = require("newforms");
var utils = require("hornet-js-utils");
var React = require("react");
var FileWidget = require("src/upload-file/upload-file-widget");

var logger = utils.getLogger("hornet-js-components.upload-file.upload-file-field");
var mime = require("mime-types");

/*
 Field newforms permettant de construire un composant ImageField
 */
var UploadFileField = newforms.FileField.extend({
    widget: FileWidget,
    constructor(kwargs) {
        logger.trace("Construction UploadFileField");
        if (!(this instanceof UploadFileField)) {
            return new UploadFileField(kwargs);
        }
        newforms.FileField.call(this, kwargs);
        this.widget.setComponentProperties(kwargs.fileRoute, kwargs.fileTitle);
    }
});

UploadFileField.prototype.toJavaScript = function (uploadedFile) {
    if (uploadedFile) {
        if (this.widget && this.widget.attrs.maxSize && uploadedFile.size > this.widget.attrs.maxSize) {
            var maxSizeInMB = utils._.round(this.widget.attrs.maxSize / (1024 * 1024), 2);
            throw newforms.ValidationError(this.errorMessages.maxSize, {code:"maxLength", params: {maxSizeInMB: maxSizeInMB}});
        }
        if (this.widget && this.widget.attrs.accept) {

            var extension = "";
            /* recuperation de l'extension du fichier */
            /* par défaut, on recupere celle qui est associée au mime type : */
            if (uploadedFile.type) {
                extension = mime.extension(uploadedFile.type);
            }
            /* par contre, si l'extension est présente dans le nom du fichier */
            /* on la prend en priorité : */
            if (uploadedFile.name && uploadedFile.name.indexOf(".") != -1) {
                extension = utils._.last(uploadedFile.name.split("."));
            }

            /* comparaison de l'extension du fichier avec la liste des extensions autorisées (accept) */
            /* _.some renvoie true si au moins une des extensions autorisées correspond */
            var allowedType = utils._.some(this.widget.attrs.accept, function (accept) {
                return accept === "." + extension
            });
            if (!allowedType) {
                throw newforms.ValidationError(this.errorMessages.invalid, {code: "invalid", params: {fileTypeList:this.widget.attrs.accept}});
            }
        }
    }
    /* Dans les autres cas on utilise la fonction non surchargée */
    return newforms.FileField.prototype.toJavaScript.call(this, uploadedFile);
}

module.exports = UploadFileField;