"use strict";

import React = require("react");
import utils = require("hornet-js-utils");
import HornetComponent = require("src/hornet-component");
import PropTypesNs = require("src/icon/icon-props");

var logger = utils.getLogger("hornet-js-components.icon.icon");

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class Icon extends HornetComponent<PropTypesNs.IconProps,any> {

    static displayName:string = "Icon";

    static propTypes = {
        src: React.PropTypes.string.isRequired,
        alt: React.PropTypes.string.isRequired,
        idImg: React.PropTypes.string,
        classImg: React.PropTypes.string,
        name: React.PropTypes.string,

        url: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        idLink: React.PropTypes.string,
        classLink: React.PropTypes.string,
        target: React.PropTypes.string,
        onClick: React.PropTypes.func
    };


    /**
     * Retire le focus de l'élément une fois cliqué de façon à permettre de scroller ou mettre le focus sur les
     * notifications éventuellement présentées suite à l'action.
     * @param event évènement
     * @private
     */
    @HornetComponent.AutoBind
    private  _iconOnClick(event:React.MouseEvent) {
        var domElement = event.currentTarget as any;
        if (domElement && domElement.blur) {
            domElement.blur();
        } else {
            logger.warn("_iconOnClick : impossible d'enlever le focus de l'élement");
        }
        /* Exécute ensuite la fonction fournie en propriétés */
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    render() {
        return (
            <a href={this.props.url} title={this.props.title} id={this.props.idLink} className={this.props.classLink}
               onClick={this._iconOnClick} target={this.props.target}>
                <img src={this.props.src} alt={this.props.alt} id={this.props.idImg} className={this.props.classImg}/>
            </a>
        )
    }
}

export = Icon;