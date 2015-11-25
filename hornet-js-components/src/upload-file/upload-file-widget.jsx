"use strict";
var utils = require("hornet-js-utils");
var newforms = require("newforms");
var React = require("react");

var logger = utils.getLogger("hornet-js-components.upload-file.upload-file-widget");

/**
 Affiche une image et un input File, la value de cet argument est un objet de type File ou Image (Hornet).
 */
var FileWidget = newforms.ClearableFileInput.extend({
    constructor: function FileWidget(kwargs) {
        logger.trace("Construction FileWidget");

        if (!(this instanceof FileWidget)) {
            return new FileWidget(kwargs)
        }
        newforms.Widget.call(this, kwargs)
    },

    renderFile: function (file) {
        var fileTag = null;
        if (file && file.id > -1) {
            //n'affiche la image que si elle est présente sinon le tag est à null
            logger.trace("Route du fichier:" + this._fileRoute);
            if (!this._fileRoute) {
                throw new Error("You have to define a route to get the file");
            }

            var urlfile = utils.buildContextPath("/services/" + this._fileRoute + file.id);
            var fileTitle = "file id:" + file.id;
            if (this._fileTitle) {
                fileTitle = this._fileTitle;
            } else {
                throw new Error("You have to define a title for the file");
            }

            var type = undefined;
            if (file.mimeType) {
                type = file.mimeType.split("/")[0];
            }

            fileTag =
                <div className="grid-form-field pure-u-1-1">
                    <div className="pure-u-1-1">
                        {(type === "image") ? <img src={urlfile} alt={fileTitle}/> : <a href={urlfile}>{fileTitle}</a>}
                    </div>
                </div>;
        }
        return fileTag;
    },
    setComponentProperties: function (fileRoute, fileTitle) {
        this._fileRoute = fileRoute;
        this._fileTitle = fileTitle;
    }
});


//permettra l'appel au rendu de FileInput dans le render de notre composant
var renderFileFunction = newforms.ClearableFileInput.prototype.render;

FileWidget.prototype.render = function (name, value, kwargs) {
    var inputFile = null;
    if (!this.attrs.readOnly) {
        inputFile = renderFileFunction.call(this, name, value, kwargs);
    }
    var image = this.renderFile(value);
    return (
        <div>
            {inputFile}
            {image}
        </div>);
};

module.exports = FileWidget;