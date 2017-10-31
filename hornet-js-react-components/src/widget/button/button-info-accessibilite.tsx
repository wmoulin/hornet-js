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
import { Logger } from "hornet-js-utils/src/logger";
import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Icon } from "src/widget/icon/icon";
import { Modal } from "src/widget/dialog/modal";

const logger: Logger = Utils.getLogger("hornet-js-react-components.table.button-info-accessibilite");

/**
 * Propriétés du bouton et de sa modale d'information
 */
export interface ButtonInfoAccessibiliteProps extends HornetComponentProps {
    /** Messages internationalisés de tableau */
    message?: any;
    /** Descriptions de raccourcis clavier */
    shortcutDescriptions?: ShortcutDescription[];
    /** Source de l'image associé */
    srcImg?: string;
}

/**
 * Eléments de description de raccourci clavier
 */
export interface ShortcutDescription {
    /** Représentation(s) de la ou des touches du clavier */
    shortcuts: string[];
    /** Description de l'action correspondante */
    description: string;
    /** Lorsque shortcuts contient plusieurs éléments, indique si l'un OU l'autre de ces éléments peut-être utilisé */
    or?: boolean;
    /** Lorsque shortcuts contient plusieurs éléments, indique si tous les éléments sont nécessaires */
    and?: boolean;
}

/**
 * Bouton et modale d'information sur l'accessibilité clavier du composant Table
 */
export class ButtonInfoAccessibilite<P extends ButtonInfoAccessibiliteProps> extends HornetComponent<ButtonInfoAccessibiliteProps, any> {

    private shortcutsI18n = ButtonInfoAccessibilite.getI18n("shortcuts");

    static defaultProps = {
        message: "",
        shortcutDescriptions: []
    };

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <div className="button-info-accessibilite">
                <Icon
                    title={this.state.message.shortcuts ? this.state.message.shortcuts.iconTitle : this.shortcutsI18n.iconTitle}
                    alt={this.state.message.shortcuts ? this.state.message.shortcuts.iconTitle : this.shortcutsI18n.iconTitle}
                    action={this.handleShowInfoModal}
                    url={"#"}
                    src={this.props.srcImg || ButtonInfoAccessibilite.genUrlTheme() + "/img/button/icon_info.svg"}
                    classLink="button-info-accessibilite-button button-action"
                    hasPopUp={true}
                />
                {this.renderModal()}
            </div>
        );
    }

    private renderModal(): JSX.Element {
        return (
            <Modal ref="modal"
                   title={this.state.message.shortcuts ? this.state.message.shortcuts.modalTitle : this.shortcutsI18n.modalTitle}
                   className="modal-shortcuts-content"
                   escapeKeyExits={true}>
                <div className="widget-shortcuts-body">
                    <div className="widget-shortcuts-content">
                        <div className="shortCutsList">
                            <h4>{this.state.message.shortcuts ?
                                this.state.message.shortcuts.modalContentTitle : this.shortcutsI18n.modalContentTitle}</h4>
                            <ul>
                                {this.state.shortcutDescriptions.map(this.renderShortCut.bind(this))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    private renderShortCut(item, index) {
        let separator = (item.and) ? "+" : "/";
        let shortcuts = [];
        item.shortcuts.map(function (shortcut, i) {
            shortcuts.push(
                <kbd key={"shortcut-" + shortcut + "-" + i}>{shortcut}</kbd>
            );

            if ((i + 1) !== item.shortcuts.length) {
                shortcuts.push(separator);
            }

        });
        return (
            <li key={"item-shortcut-" + index}>
                <div>
                    <div>{shortcuts} :</div>
                    <div>{item.description}</div>
                </div>
            </li>
        );
    }

    private handleShowInfoModal() {
        (this.refs.modal as Modal).open();
    }

}