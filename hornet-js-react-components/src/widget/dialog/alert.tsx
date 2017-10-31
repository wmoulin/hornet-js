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

import * as React from "react";

import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { Button, ButtonProps } from "src/widget/button/button";
import { Modal } from "src/widget/dialog/modal";
import { Notification } from "src/widget/notification/notification";

export interface AlertProps extends HornetComponentProps {
    isVisible ?: boolean;
    onClickOk ?: React.MouseEventHandler<HTMLInputElement>; // L'utilisateur valide le message
    onClickCancel ?: React.MouseEventHandler<HTMLInputElement>; // L'utilisateur annule ou appui sur la croix fermer en haut à droite
    onClickClose ?: React.MouseEventHandler<HTMLInputElement>;
    title ?: string;
    message: string;
    valid ?: string;
    cancel ?: string;
    validTitle ?: string;
    cancelTitle ?: string;
    underlayClickExits ?: boolean;
    escapeKeyExits?: boolean;
    notificationId?: string;
    dialogId?: string;
}

export class Alert extends HornetComponent<AlertProps, any> {

    public props: AlertProps;

    static defaultProps = {
        isVisible: false,
        underlayClickExits: false,
        escapeKeyExits: true
    };

    constructor(props?: AlertProps, context?: any) {
        super(props, context);
    }

    setTitle(title: string, cb?) {
        this.setState({title: title}, cb);
        return this;
    }

    setMessage(message: string, cb?) {
        this.setState({message: message}, cb);
        return this;
    }

    setOnClickOk(onClickOk: React.MouseEventHandler<HTMLInputElement>, cb?) {
        this.setState({onClickOk: onClickOk}, cb);
        return this;
    }

    setOnClickCancel(onClickCancel: Function, cb?) {
        this.setState({onClickCancel: onClickCancel}, cb);
        return this;
    }

    setOnClickClose(onClickClose: Function, cb?) {
        this.setState({onClickClose: onClickClose}, cb);
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
     * @inheritDoc
     */
    render(): JSX.Element {
        if (!this.state.isVisible) return null;

        let notificationId: string = this.state.notificationId || "nAlert";

        return (
            <Modal alert={true} isVisible={true}
                   onClickClose={this.state.onClickClose}
                   underlayClickExits={this.state.underlayClickExits}
                   escapeKeyExits={this.state.escapeKeyExits}
                   title={this.state.title}
                   dialogId={this.state.dialogId}
            >
                <Notification id={notificationId}/>
                <div className="widget-alert-body">
                    {this.state.message}
                </div>
                <div className="widget-dialogue-footer">
                    <div className="grid has-gutter hornet-alert-buttons button-group">
                        <Button {...this.configOKButton()}/>
                        <Button {...this.configCancelButton()}/>
                    </div>
                </div>
            </Modal>);
    }

    /**
     * Configuration du bouton OK
     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (boolean|string), onClick: (*|defaultFunction)}}
     */
    private configOKButton(): ButtonProps {
        return {
            type: "button",
            id: "alertOK",
            name: "action:validMessage",
            value: "Valider",
            className: "hornet-button hornet-alert-button-ok",
            label: this.getValid(),
            title: this.getValidTitle(),
            onClick: this.state.onClickOk
        }
    }

    /**
     * Configuration du bouton ANNULER
     * @returns {{type: string, id: string, name: string, value: string, className: string, label: (*|string|cancel), onClick: (*|defaultFunction)}}
     */
    private configCancelButton(): ButtonProps {
        return {
            type: "button",
            id: "alertCancel",
            name: "action:annulerMessage",
            value: "Annuler",
            className: "hornet-button hornet-alert-button-cancel",
            label: this.getCancel(),
            title: this.getCancelTitle(),
            onClick: this.state.onClickCancel
        }
    }

    /**
     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private getValid(): string {
        return this.state.valid || this.i18n("form.valid");
    }

    /**
     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private getCancel(): string {
        return this.state.cancel || this.i18n("form.cancel");

    }

    /**
     * Extrait le libelle valid passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private getValidTitle(): string {
        return this.state.validTitle || this.i18n("form.validTitle");
    }

    /**
     * Extrait le libelle cancel passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    private getCancelTitle(): string {
        return this.state.cancelTitle || this.i18n("form.cancelTitle");
    }
}