"use strict";

var tabbable = require("tabbable");
var noScroll = require("no-scroll");

import React = require("react");
import HornetComponent = require("src/hornet-component");
import utils = require("hornet-js-utils");
var _ = utils._;

var logger = utils.getLogger("hornet-js-components.dialog.react-aria-modal");

var PropTypes = React.PropTypes;

var Props = {
    underlayClass: PropTypes.string,
    underlayColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    underlayClickExits: PropTypes.bool,
    escapeKeyExits: PropTypes.bool,
    alert: PropTypes.bool,
    dialogClass: PropTypes.string,
    dialogId: PropTypes.string,
    focusDialog: PropTypes.bool,
    initialFocus: PropTypes.string,
    titleId: PropTypes.string,
    titleText: PropTypes.string,
    verticallyCenter: PropTypes.bool,
    onShow: PropTypes.func,
    onExit: PropTypes.func.isRequired,
    manageFocus: PropTypes.bool,
    mounted: PropTypes.bool
};

class ModalManager {
    static modals:Array<any> = [];
    static active:any;

    static listen() {
        document.addEventListener("focus", ModalManager.checkFocus, true);
        document.addEventListener("click", ModalManager.checkClick, true);
        document.addEventListener("touchend", ModalManager.checkClick, true);
        document.addEventListener("keydown", ModalManager.checkKey, true);
        noScroll.on();
    }
    static leave() {
        document.removeEventListener("focus", ModalManager.checkFocus, true);
        document.removeEventListener("click", ModalManager.checkClick, true);
        document.removeEventListener("touchend", ModalManager.checkClick, true);
        document.removeEventListener("keydown", ModalManager.checkKey, true);
        noScroll.off();
    }

    static register(modal, opts) {
        if (ModalManager.modals.length === 0) ModalManager.listen();
        var oModal = {
            modal: modal,
            idx: modal.props.idx,
            node: React.findDOMNode(modal),
            initialFocus: opts.initialFocus,
            escapeKeyFn: opts.escapeKeyFn,
            underlayClickFn: opts.underlayClickFn,
            manageFocus: opts.manageFocus,
            prevFocusedNode: document.activeElement
        };
        ModalManager.modals.push(oModal);
        ModalManager.active = oModal;

        if (opts.manageFocus) {
            var tabbableNodes = tabbable(oModal.node);
            var focusNode;
            if (typeof opts.initialFocus === "string") {
                focusNode = document.querySelector(opts.initialFocus);
                if (!focusNode) logger.warn("La prop 'initialFocus' ne correspond à aucun noeud DOM > tentative de mettre le focus sur le 1er élement tabulable");
            } else {
                focusNode = opts.initialFocus;
            }

            if (!focusNode) {
                focusNode = tabbableNodes[0];
                if (!focusNode) logger.warn("Impossible de donner le focus à un élément de la modale, aucun élément tabulable trouvé");
            }

            if (focusNode) focusNode.focus();
        }
    }

    static unregister(modal) {
        if (ModalManager.modals.length === 1) ModalManager.leave();

        var oModal = _.remove(ModalManager.modals, (obj) => { return obj.modal === modal; });
        if (ModalManager.modals.length > 0) {
            var maxIdx = -1;
            ModalManager.modals.forEach((mObj) => { maxIdx = Math.max(maxIdx, mObj.idx); });
            var modalPos = _.findIndex(ModalManager.modals, (mObj) => { return mObj.idx === maxIdx; });
            ModalManager.active = ModalManager.modals[modalPos];
        }

        setTimeout(function() {
            /* L'attribut prevFocusedNode n'est pas forcément valorisé : en particulier sous IE, au moment de l'appel à
            * register(), document.activeElement peut être indéfini */
            if(oModal[0].prevFocusedNode) {
                oModal[0].prevFocusedNode.focus();
            }
        }, 0);
    }

    static checkFocus(e) {
        if (!ModalManager.active.manageFocus) return;
        var tabbableNodes = tabbable(ModalManager.active.node);
        if (ModalManager.active.node.contains(e.target)) return;
        tabbableNodes[0].focus();
    }

    static checkClick(e) {
        if (ModalManager.active.node.contains(e.target)) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        if (ModalManager.active.underlayClickFn) ModalManager.active.underlayClickFn();
    }

    static checkKey(e) {
        if (ModalManager.active.manageFocus && (e.key === "Tab" || e.keyCode === 9)) {
            e.preventDefault();
            var tabbableNodes = tabbable(ModalManager.active.node);
            var currentFocusIndex = tabbableNodes.indexOf(e.target);
            var lastTabbableNode = tabbableNodes[tabbableNodes.length - 1];
            var firstTabbableNode = tabbableNodes[0];
            if (e.shiftKey) {
                if (e.target === firstTabbableNode) {
                    lastTabbableNode.focus();
                    return;
                }
                tabbableNodes[currentFocusIndex - 1].focus(0);
                return;
            }
            if (e.target === lastTabbableNode) {
                firstTabbableNode.focus();
                return;
            }
            tabbableNodes[currentFocusIndex + 1].focus();
        }

        if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
            if (ModalManager.active.escapeKeyFn) ModalManager.active.escapeKeyFn();
        }
    }
}

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class ReactAriaModalUnderlay extends HornetComponent<any,any> {
    static displayName:string = "ReactAriaModalUnderlay";
    static propTypes = Props;

    render() {
        var style = { position: "fixed", top: 0, left: 0, bottom: 0, right: 0, zIndex: 1000 + this.props.idx, overflowX: "hidden", overflowY: "auto", WebkitOverflowScrolling: "touch" };
        if (this.props.underlayColor) style["background"] = this.props.underlayColor;
        if (this.props.underlayClickExits) style["cursor"] = "pointer";

        return (
            <div className={this.props.underlayClass} style={style}>
                { React.cloneElement(this.props.children, { ref: "dialog" }) }
            </div>
        );
    }
}


@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class ReactAriaModalDialog extends HornetComponent<any,any> {
    static displayName:string = "ReactAriaModalDialog";
    static propTypes = Props;

    componentDidMount() {
        ModalManager.register(this, {
            manageFocus: this.props.manageFocus,
            initialFocus: this.props.initialFocus,
            underlayClickFn: this.props.underlayClickExits ? this.props.onExit : null,
            escapeKeyFn: this.props.escapeKeyExits ? this.props.onExit : null
        });
    }

    componentWillUnmount() {
        ModalManager.unregister(this);
    }

    render() {
        var transformValue = (this.props.verticallyCenter) ? "translate(-50%, -50%)" : "translateX(-50%)";
        var topValue = (this.props.verticallyCenter) ? "50%" : "0";
        var style = { position: "absolute", left: "50%", top: topValue, margin: "auto", maxWidth: "100%", WebkitTransform: transformValue, transform: transformValue, cursor: "default", outline: this.props.focusDialog ? 0 : undefined };

        return (
            <div role={this.props.alert ? "alertdialog" : "dialog"}
                 aria-labelledby={this.props.titleId}
                 aria-label={this.props.titleText}
                 id={this.props.dialogId}
                 className={this.props.dialogClass}
                 style={style}
                 tabIndex={this.props.focusDialog ? -1 : undefined}>
                {this.props.children}
            </div>
        );
    }
}

@HornetComponent.ApplyMixins()
@HornetComponent.Error()
class ReactAriaModal extends HornetComponent<any,any> {
    static displayName:string = "ReactAriaModal";
    static propTypes = Props;
    static defaultProps = {
        mounted: true,
        manageFocus: true,
        underlayClickExits: false,
        underlayColor: "rgba(0,0,0,0.5)",
        escapeKeyExits: false
    };
    static number = 0;

    renderModal() {
        if (!this.state.container) this.state.container = document.createElement("div");
        if (!this.state.idx) this.state.idx = ++ReactAriaModal.number;
        this.props.idx = this.state.idx;
        if (!this.state.firstRender) {
            document.body.appendChild(this.state.container);
            this.state.firstRender = true;
        }
        React.render(
            (
                <ReactAriaModalUnderlay {...this.props}>
                    <ReactAriaModalDialog {...this.props}>
                        {this.props.children}
                    </ReactAriaModalDialog>
                </ReactAriaModalUnderlay>
            ),
            this.state.container as HTMLElement
        );
    }

    removeModal() {
        if (this.state.container) {
            React.unmountComponentAtNode(this.state.container);
            this.state.container.parentNode.removeChild(this.state.container);
            this.state.firstRender = false;
            delete this.state.container;
        }
    }

    render() {
        return null;
    }

    componentWillMount() {
        if (!this.props.titleText && !this.props.titleId) {
            throw new Error("react-aria-modal instances should have a `titleText` or `titleId`");
        }
    }

    componentDidMount() {
        if (this.props.mounted) {
            this.renderModal();
            if (this.props.onShow) {
                this.props.onShow();
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.mounted && !this.props.mounted) {
            this.removeModal();
        } else if (this.props.mounted) {
            this.renderModal();
            if (this.props.onShow) {
                this.props.onShow();
            }
        }
    }

    componentWillUnmount() {
        this.removeModal();
    }
}

export = ReactAriaModal;
