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
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import  { HornetComponent } from "src/widget/component/hornet-component";
import { ReactAriaModal } from "src/widget/dialog/react-aria-modal";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";

import * as classNames from "classnames";

import ReactNode = __React.ReactNode;
import MouseEvent = __React.MouseEvent;

export interface ModalProps extends HornetComponentProps {
    onClickClose ?: __React.MouseEventHandler<HTMLInputElement>;
    isVisible?: boolean;
    title?: string;
    hideTitleBar ?: boolean;
    hideCloseBar?: boolean;
    closeLabel ?: string;
    closeSymbole ?: string;
    className ?: string;
    underlayClass ?: string;
    initialFocus ?: string;
    alert?: boolean;
    underlayClickExits?: boolean;
    escapeKeyExits?: boolean;
    verticallyCenter?: boolean;
    focusDialog?: boolean;
    manageFocus?: boolean;
    onShow?: Function;
    context?: any;
    isDraggable?: boolean;
    withoutOverflow?: boolean;
    dialogId?: string;
}

export class Modal extends HornetComponent<ModalProps, any> {

    static defaultProps = {
        isVisible: false,
        hideTitleBar: false,
        hideCloseBar: false,
        alert: false,
        underlayClickExits: true,
        verticallyCenter: true,
        focusDialog: true,
        withoutOverflow: false
    };

    constructor(props?: ModalProps, context?: any) {
        super(props, context);
    }

    setTitle(title: string, cb?) {
        this.setState({title: title}, cb);
        return this;
    }

    setCloseLabel(closeLabel: string, cb?) {
        this.setState({closeLabel: closeLabel}, cb);
        return this;
    }

    setCloseSymbole(closeSymbole: string, cb?) {
        this.setState({closeSymbole: closeSymbole}, cb);
        return this;
    }

    setChildren(children: ReactNode, cb?) {
        this.setState({children: children}, cb);
        return this;
    }

    open(cb?) {
        this.setState({isVisible: true}, cb);
        return this;
    }

    close(cb?) {
        this.setState({isVisible: false}, cb);
        return this;
    }

    /**
     * Gestion par défaut du clic sur le bouton de fermeture
     * @param event
     */
    private onClickClose(event: MouseEvent<HTMLInputElement>): void {
        this.close();
    }

    /**
     * Gestion par défaut du clic sur echap
     * @param event
     */
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.keyCode == KeyCodes.ESCAPE) {
            if (this.state.onClickClose) {
                this.state.onClickClose(event);
            } else {
                this.close();
            }
        }
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        if (Utils.isServer) {
            return null;
        }

        let title = this.getTitle();
        let closeLabel = this.getCloseLabel();
        let closeSymbole = this.getCloseSymbole();

        let titleBarRender = null;
        let closeBarRender = null;

        let titleClasses: ClassDictionary = {};
        titleClasses["widget-dialogue-title"] = true;
        titleClasses["react-draggable-cursor"] = this.state.isDraggable;

        let titleClassName = classNames(titleClasses);

        if (!this.state.hideTitleBar) {
            titleBarRender = (
                <div className="widget-dialogue-header">
                    <div className={titleClassName}>{title}</div>
                </div>);
        }

        if (!this.state.hideCloseBar) {
            closeBarRender = (
                <div className="widget-dialogue-close">
                    <button type="button" className="hornet-button hornet-dialogue-croix"
                            onClick={this.state.onClickClose || this.onClickClose}
                            title={closeLabel}
                            aria-label={closeLabel}
                    >{closeSymbole}
                    </button>
                </div>);
        }


        let bodyClasses: ClassDictionary = {
            "widget-dialogue-body": true,
            "modal-overflow-y": !this.state.withoutOverflow
        };


        return this.state.isVisible ?
            (

                <ReactAriaModal
                    titleText={title}
                    onShow={this.state.onShow}
                    onExit={this.state.onClickClose || this.onClickClose}
                    dialogClass={this.state.className}
                    verticallyCenter={this.state.verticallyCenter}
                    escapeKeyExits={this.state.escapeKeyExits}
                    underlayClickExits={this.state.underlayClickExits}
                    alert={this.state.alert}
                    underlayClass={this.state.underlayClass}
                    initialFocus={this.state.initialFocus}
                    focusDialog={this.state.focusDialog}
                    manageFocus={this.state.manageFocus}
                    isDraggable={this.state.isDraggable}
                    id={this.state.dialogId}
                >
                    {titleBarRender}
                    <div className={classNames(bodyClasses)}>
                        {this.state.children}
                    </div>
                    {closeBarRender}
                </ReactAriaModal>
            ) : null;

    }


    /**
     * Extrait le titre passé dans les propriétés du composant ou indique un titre par défaut
     * @returns Titre
     * @private
     */
    private getTitle() {
        return this.state.title || this.i18n("dialog.title");
    }

    /**
     * Extrait le label de fermeture passé dans les propriétés du composant ou indique un label par défaut
     * @returns Titre
     * @private
     */
    private getCloseLabel() {
        return this.state.closeLabel || this.i18n("dialog.closeLabel");
    }

    /**
     * Extrait le symbole de fermeture dans les propriétés du composant ou indique un symbole par défaut
     * @returns Titre
     * @private
     */
    private getCloseSymbole() {
        return this.state.closeSymbole || this.i18n("dialog.closeSymbole");
    }
}