/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import * as React from "react";
import { HornetComponent } from "src/widget/component/hornet-component";

import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";

const Draggable = require("react-draggable");
const tabbable = require("tabbable");
const noScroll = require("no-scroll");

const logger = Utils.getLogger("hornet-js-react-components.widget.dialog.react-aria-modal");

class ModalManager {
    static modals: Array<any> = [];
    static active: any;

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
        let oModal = {
            modal: modal,
            idx: modal.props.idx,
            node: ReactDOM.findDOMNode(modal),
            initialFocus: opts.initialFocus,
            escapeKeyFn: opts.escapeKeyFn,
            underlayClickFn: opts.underlayClickFn,
            manageFocus: opts.manageFocus,
            prevFocusedNode: document.activeElement
        };
        ModalManager.modals.push(oModal);
        ModalManager.active = oModal;

        if (opts.manageFocus) {
            let tabbableNodes = tabbable(oModal.node);
            let focusNode;
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

        let oModal = _.remove(ModalManager.modals, (obj) => {
            return obj.modal === modal;
        });
        if (ModalManager.modals.length > 0) {
            let maxIdx = -1;
            ModalManager.modals.forEach((mObj) => {
                maxIdx = Math.max(maxIdx, mObj.idx);
            });
            let modalPos = _.findIndex(ModalManager.modals, (mObj) => {
                return mObj.idx === maxIdx;
            });
            ModalManager.active = ModalManager.modals[modalPos];
        }

        setTimeout(function() {
            /* L'attribut prevFocusedNode n'est pas forcément valorisé : en particulier sous IE, au moment de l'appel à
             * register(), document.activeElement peut être indéfini */
            if (oModal[0].prevFocusedNode) {
                oModal[0].prevFocusedNode.focus();
            }
        }, 0);
    }

    static checkFocus(e) {
        if (!ModalManager.active.manageFocus) return;
        let tabbableNodes = tabbable(ModalManager.active.node);
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
        if (ModalManager.active.manageFocus && (e.key === "Tab" || e.keyCode === KeyCodes.TAB)) {
            e.preventDefault();
            let tabbableNodes = tabbable(ModalManager.active.node);
            let currentFocusIndex = tabbableNodes.indexOf(e.target);
            let lastTabbableNode = tabbableNodes[tabbableNodes.length - 1];
            let firstTabbableNode = tabbableNodes[0];
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

        if (e.key === "Escape" || e.key === "Esc" || e.keyCode === KeyCodes.ESCAPE) {
            if (ModalManager.active.escapeKeyFn) ModalManager.active.escapeKeyFn();
        }
    }
}

class ReactAriaModalUnderlay extends HornetComponent<any, any> {
    render() {
        let style: __React.CSSProperties = {
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 5000 + this.state.idx,
            overflowX: "hidden",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch"
        };
        if (this.state.underlayColor) style["background"] = this.state.underlayColor;
        if (this.state.underlayClickExits) style["cursor"] = "pointer";

        return (
            <div className={this.state.underlayClass} style={style}>
                { React.cloneElement(this.state.children, {ref: "dialog"}) }
            </div>
        );
    }
}


class ReactAriaModalDialog extends HornetComponent<any, any> {

    componentDidMount() {
        super.componentDidMount();
        ModalManager.register(this, {
            manageFocus: this.state.manageFocus,
            initialFocus: this.state.initialFocus,
            underlayClickFn: this.state.underlayClickExits ? this.state.onExit : null,
            escapeKeyFn: this.state.escapeKeyExits ? this.state.onExit : null
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        ModalManager.unregister(this);
    }

    render() {
        let transformValue = (this.state.verticallyCenter) ? "translate(-50%, -50%)" : "translateX(-50%)";
        let topValue = (this.state.verticallyCenter) ? "50%" : "0";
        let style: __React.CSSProperties = {
            position: "absolute",
            left: this.state.isDraggable ? "40%" : "50%",
            top: this.state.isDraggable ? "35%" : topValue,
            margin: "auto",
            maxWidth: "100%",
            maxHeight: "90%",
            WebkitTransform: transformValue,
            transform: transformValue,
            cursor: "default",
            outline: this.state.focusDialog ? 0 : undefined
        };


        let props = null;

        let modal = (
            <div role={this.state.alert ? "alertdialog" : "dialog"}
                 aria-labelledby={this.state.titleId}
                 aria-label={this.state.titleText}
                 id={this.state.dialogId}
                 className={this.state.dialogClass}
                 style={style}
                 onClick={this.onClick}
                 tabIndex={this.state.focusDialog ? -1 : undefined}>
                {this.state.children}
            </div>
        );

        // if is draggable modal
        if (this.state.isDraggable) {
            props = {
                "bounds": "html",
                "handle": ".widget-dialogue-title"
            };
            return (
                <Draggable {...props}>
                    {modal}
                </Draggable>
            );
        }
        // if not
        return (
            <div {...props}>
                {modal}
            </div>
        );
    }

    /**
     * limite levent click au composant modal
     */
    onClick(evt): void {

        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        if (evt.cancelBubble) {
            evt.cancelBubble = true;
        }
        evt.nativeEvent.stopImmediatePropagation();

    }
}

export class ReactAriaModal extends HornetComponent<any, any> {
    static defaultProps = {
        mounted: true,
        manageFocus: true,
        underlayClickExits: false,
        underlayColor: "rgba(0,0,0,0.5)",
        escapeKeyExits: false,
        isDraggable: false
    };
    static number = 0;

    renderModal() {
        if (!this.state.container) this.state.container = document.createElement("div");
        if (!this.state.idx) this.state.idx = ++ReactAriaModal.number;
        let nProps = {};
        for (let prop in this.props) {
            nProps[prop] = this.props[prop];
        }
        //this.state.idx = this.state.idx;
        nProps["idx"] = this.state.idx;
        if (!this.state.firstRender) {
            document.body.appendChild(this.state.container);
            this.state.firstRender = true;
        }
        /* On est obligé de forcer le passage du contexte (context={(this.context)}) car ces composants sont créés en tant que
         noeuds fils du conteneur dom, qui n'a pas de contexte react. */
        ReactDOM.render(
            (
                <ReactAriaModalUnderlay {...nProps} context={(this.context)}>
                    <ReactAriaModalDialog {...nProps} context={(this.context)}>
                        {this.state.children}
                    </ReactAriaModalDialog>
                </ReactAriaModalUnderlay>
            ),
            this.state.container as HTMLElement
        );
    }

    removeModal() {
        if (this.state.container) {
            ReactDOM.unmountComponentAtNode(this.state.container);
            this.state.container.parentNode.removeChild(this.state.container);
            this.state.firstRender = false;
            delete this.state.container;
        }
    }

    render() {
        return null;
    }

    componentWillMount() {
        super.componentWillMount();
        if (!this.state.titleText && !this.state.titleId) {
            throw new Error("react-aria-modal instances should have a `titleText` or `titleId`");
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.state.mounted) {
            this.renderModal();
            if (this.state.onShow) {
                this.state.onShow();
            }
        }

    }

    componentDidUpdate(prevProps: any, prevState: any, prevContext: any) {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        if (prevProps.mounted && !this.state.mounted) {
            this.removeModal();
        } else if (this.state.mounted) {
            this.renderModal();
            if (this.state.onShow) {
                this.state.onShow();
            }
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.removeModal();
    }
}
