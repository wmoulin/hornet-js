"use strict";
var utils = require("hornet-js-utils");
var newforms = require("newforms");
var React = require("react");

var logger = utils.getLogger("hornet-js-components.upload-file.upload-file-widget");

/**
 Affiche une image et un input File, la value de cet argument est un objet de type File ou Image (Hornet).
 */
var FileWidget = newforms.ClearableFileInput.extend({
    constructor: function FileWidgetConstructor(kwargs) {
        logger.trace("Construction FileWidget");

        if (!(this instanceof FileWidget)) {
            return new FileWidget(kwargs)
        }
        newforms.Widget.call(this, kwargs)
    },

    getDefaultProps: function () {
        return {
            disabled: false
        };
    },

    /**
     * Génère le rendu correspondant au fichier 'file' :
     *  - sous forme d'une balise HTML img lorsque le fichier est une image
     *  - sous forme d'un lien HTML lorsque le fichier n'est pas une image
     * @param file fichier
     * @returns {*}
     */
    renderFile: function (file) {
        var fileTag = null;
        if(file) {
            if (file.id > -1) {
                /* Le fichier est présent côté serveur */
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

				// Lorsque le fichier Photo n'est pas une image, on affiche simplement un lien
				// L'attribut data-pass-thru="true" est nécessaire pour court-circuiter le routeur client 
				// (car ce lien pointe directement vers une ressource fournie par la partie /services)
				// Ensuite :
				// - si le navigateur est capable d'ouvrir le fichier :
				// l'attribut target permet de l'ouvrir dans un nouvel onglet
				// la valeur est unique par fichier : ainsi, un deuxième clic sur le lien ouvre le fichier dans le même onglet,
				// mais le lien d'un autre fichier s'ouvre dans un autre onglet
				// - si le navigateur ne sait pas ouvrir le fichier, il propose un telechargement 
                var fileTarget = "newTabForPhoto"+file.id;
                
                fileTag =
                    <div className="grid-form-field pure-u-1-1">
                        <div className="pure-u-1-1">
                            {(type === "image") ? <img src={urlfile} alt={fileTitle}/> :
                                <a href={urlfile} data-pass-thru="true" target={fileTarget}>{fileTitle}</a>}
                        </div>
                    </div>;
            } else if(file.name) {
                /* Le fichier vient d'être sélectionné : on affiche son nom */
                fileTag =
                    <div className="grid-form-field pure-u-1-1">
                        <div className="pure-u-1-1">{file.name}</div>
                    </div>;
            }
        }
        return fileTag;
    },
    setComponentProperties: function (fileRoute, fileTitle) {
        this._fileRoute = fileRoute;
        this._fileTitle = fileTitle;
    },

    /**
     * Surcharge de la méthode valueFromData : on ne prend pas en compte le paramètre files, car lorsqu'on met à jour
     * le formulaire via la méthode updateData, l'attribut form.files n'est pas mis à jour.
     * @param data
     * @param files
     * @param name
     * @returns {*}
     */
    valueFromData(data, files, name) {
        return newforms.ClearableFileInput.prototype.valueFromData.call(this, data, {}, name);
    }
});


//permettra l'appel au rendu de FileInput dans le render de notre composant
var renderFileFunction = newforms.ClearableFileInput.prototype.render;

/** Fonction onChange d'origine fournie par newforms */
var originalOnchange;

/**
 * Suercharge de la fonction onChange : on ne déclenche que lorsque la valeur n'est pas vide. En effet, React déclenche
 * un évènement onChange sur l'annulation de la popup de sélection de fichier, alors que le comportement standard des
 * navigateurs sur un champ de type fichier est de ne pas déclencher d'évènement.
 * @param event {SyntheticEvent} évènement React
 */
var onFileChanged = function (event) {
  if(event.target.value) {
      if(originalOnchange) {
          originalOnchange(event);
      }
  }
};

FileWidget.prototype.render = function (name, value, kwargs) {
    var inputFile = null;
    if (!this.attrs.readOnly && !this.attrs.disabled) {
        if(!kwargs) {
            kwargs = {};
        }
        if(!kwargs.attrs) {
            kwargs.attrs = {}
        }
        originalOnchange = kwargs.attrs.onChange;
        kwargs.attrs.onChange = onFileChanged;
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