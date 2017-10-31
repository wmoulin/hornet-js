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
import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Dropdown, Position } from "src/widget/dropdown/dropdown";
import { CheckBox } from "src/widget/form/checkbox";
import { fireHornetEvent, HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { ColumnState } from "hornet-js-react-components/src/widget/table/column";
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.toggle-columns-button");

const SELECTALL_KEYCOLUMN: string = "selectAll";

export interface ToggleColumnsButtonProps extends HornetComponentProps {
    /**
     *
     */
    columns?: any;

    /**
     * colonnes masquées par défaut
     */
    hiddenColumns?: any;

    /**
     * Méthode appelée après chaque changement
     * @param any
     */
    onChange?: (any) => void;

    /**
     * Affiche de l'option de sélection complet
     */
    selectAllItem?: boolean;
}

/**
 * Classe permettant de générer le rendu html du bouton permettant d'afficher/masquer les colonnes
 */
export class ToggleColumnsButton extends HornetComponent<ToggleColumnsButtonProps, any> {

    static defaultProps = {
        selectAllItem: true
    };

    constructor(props: HornetComponentProps, context?: any) {
        super(props, context);
        this.state.title = this.i18n("toggleColumnsButton.title");
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        return (
            <Dropdown
                id="table-settings"
                icon="ico-table-settings-white"
                items={this.configureDropDownItems()}
                position={Position.BOTTOMRIGHT}
                closeClick={false}
                title={this.state.title}
            />
        );
    }

    /**
     * Rendu du HTML
     * @param column
     * @returns {any}
     */
    protected renderDropDownItem(column): JSX.Element {

        let checked: boolean = !(this.props.hiddenColumns && this.props.hiddenColumns[column.keyColumn]);
        if (column.keyColumn === SELECTALL_KEYCOLUMN) {
            checked = this.isAllChecked();
        }

        let checkBoxProps: any = {
            checked: checked,
            onChange: column.action,
            title: column.label,
            name: this.props.columns.id + "-checkbox-" + column.keyColumn,
            id: this.props.columns.id + "-checkbox-" + column.keyColumn
        };

        return (
            <div className="toggle-column-item-content">
                <div className="toggle-column-item-checkbox fl">
                    <CheckBox {...checkBoxProps}/>
                </div>
                <div className="toggle-column-item-label fl">{column.title}</div>
            </div>
        );
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.columns.columns.map((column) => {
            let isVisible: boolean = !this.state.hiddenColumns[column.keyColumn];
            fireHornetEvent(new HornetEvent<ColumnState | string>("UPDATE_COLUMN_VISIBILITY").withData({
                column: column.keyColumn,
                isVisible: isVisible
            }));
        });
    }

    /**
     * méthode permettant de configurer les items de la liste
     * @returns {Array}
     */
    protected configureDropDownItems(): any[] {
        let dropdownItems = [];

        if (this.props.selectAllItem) {
            dropdownItems.push(this.configureSelectAllItem());
        }
        this.props.columns.columns.map((column, index) => {
            column.action = this.handleToggleColumn.bind(this, column.keyColumn, this.props.columns.id);
            dropdownItems.push({
                label: this.renderDropDownItem(column),
                action: column.action,
                className: "material-dropdown-menu__link",
                key: column.id || index + "-table-settings-" + index
            });
        });

        return dropdownItems;
    }

    /**
     * Méthode de sélection/déselection associé au "Sélectionner tout"
     */
    protected handleToggleAllColumns(): void {
        let checkbox: HTMLInputElement = (document.getElementById(this.props.columns.id + "-checkbox-" + SELECTALL_KEYCOLUMN) as any);
        let checked: boolean = checkbox.checked;

        Promise.resolve(
            this.props.columns.columns.map((column) => {
                this.toggleColumn(column.keyColumn, !checked);
                this.toggleCheckBox(column.keyColumn, !checked);
                fireHornetEvent(new HornetEvent<ColumnState | string>("UPDATE_COLUMN_VISIBILITY").withData({
                    column: column.keyColumn,
                    isVisible: !checked
                }));
            })
        ).then(() => {
            this.toggleCheckBox(SELECTALL_KEYCOLUMN, !checked);
        });

        // On exécute la méthode applicative de changement si elle a été déclarée
        if (this.props.onChange) {
            this.props.onChange(this.getColumnsState());
        }

        // On met à jour le ContentState
        this.state.contentState.setHiddenColumns(this.getColumnsState());
    }

    /**
     * Méthode permettant de masquer/afficher une colonne
     * @param keyColumn: string
     */
    protected handleToggleColumn(keyColumn: string): void {

        // Récupération de l'état de la checkbox
        let checkbox: HTMLInputElement = (document.getElementsByName(this.props.columns.id + "-checkbox-" + keyColumn)[0] as any);

        this.toggleColumn(keyColumn, !checkbox.checked);
        this.toggleCheckBox(keyColumn, !checkbox.checked);

        if (this.props.selectAllItem) {
            this.controlSelectAllChecked();
        }
        // On exécute la méthode applicative de changement si elle a été déclarée
        if (this.props.onChange) {
            this.props.onChange(this.getColumnsState());
        }

        fireHornetEvent(new HornetEvent<ColumnState | string>("UPDATE_COLUMN_VISIBILITY").withData(keyColumn));

        // On met à jour le ContentState
        this.state.contentState.setHiddenColumns(this.getColumnsState());
    }

    /**
     * contrôle si l'état de toutes les checkbox afin de gérer l'état de la checkbox "selectAll"
     */
    controlSelectAllChecked(): void {
        // On contrôle si tout est sélectionné afin de cocher/décocher le sélectionner tous
        let bool: boolean = true;
        this.props.columns.columns.map((column) => {
            if (bool) {
                let checkbox: HTMLInputElement =
                    (document.getElementsByName(this.props.columns.id + "-checkbox-" + column.keyColumn)[0] as any);
                bool = checkbox.checked;
            }
        });

        this.toggleCheckBox(SELECTALL_KEYCOLUMN, bool);
    }

    /**
     * Permet de connaître l'état des colonnes sélectionnées
     * @returns {{}}
     */
    protected getColumnsState() {
        let columnsState = {};
        this.props.columns.columns.map((column, index) => {
            let checkbox: HTMLInputElement =
                (document.getElementsByName(this.props.columns.id + "-checkbox-" + column.keyColumn)[0] as any);
            if (column.keyColumn !== SELECTALL_KEYCOLUMN) {
                columnsState[column.keyColumn] = !checkbox.checked;

                if (!checkbox.checked) {
                    columnsState["hidden-" + index] = index;
                }
            }
        });
        return columnsState;
    }

    /**
     * Méthode de toggleColumn
     * @param keyColumn
     * @param checked
     */
    protected toggleColumn(keyColumn: string, checked?: boolean): void {
        // Gestion du masquage des cellules
        let cells: HTMLCollection = document.getElementsByClassName(this.props.columns.id + "-" + keyColumn);

        for (let i = 0; i < cells.length; i++) {

            // La colonne est à afficher
            if (checked) {
                (cells[i] as any).style.display = "table-cell";
            } else {
                (cells[i] as any).style.display = "none";
            }
        }

        // Gestion du colspan du/des loader(s)
        let loader: HTMLCollection = document.getElementsByClassName(this.props.columns.id + "-tr-with-colspan");
        let nbColumns = this.getNbColumnsAlreadyDisplayed();
        for (let i = 0; i < loader.length; i++) {
            (loader[i] as any).childNodes[0].colSpan = nbColumns;
        }
    }

    /**
     * Permet de cocher/décocher une checkbox
     * @param keyColumn
     * @param checked
     */
    toggleCheckBox(keyColumn: string, checked?: boolean): void {
        let checkbox: HTMLInputElement =
            (document.getElementsByName(this.props.columns.id + "-checkbox-" + keyColumn)[0] as any);
        checkbox.checked = checked;
    }

    /**
     * Récupération du nombre de colonnes affichées
     * @returns {number}
     */
    protected getNbColumnsAlreadyDisplayed(): number {
        // Calcul du nombre de colonnes déjà affichées
        let columns: NodeList = document.getElementById(this.props.columns.id + "-tr-header").childNodes;
        let nbColumns: number = columns.length;

        for (let i = 0; i < columns.length; i++) {
            if ((columns[i] as any).style.display == "none") {
                nbColumns--;
            }
        }

        return nbColumns;
    }

    /**
     * Permet de configurer l'item selectAll
     * @returns {{label: JSX.Element, action: any, className: string, key: string}}
     */
    protected configureSelectAllItem(): any {

        let conf: any = {
            keyColumn: SELECTALL_KEYCOLUMN,
            label: this.i18n("dropdown.selectAll"),
            title: this.i18n("dropdown.selectAll"),
            action: this.handleToggleAllColumns
        };
        return {
            label: this.renderDropDownItem(conf),
            action: conf.action,
            className: "material-dropdown-menu__link",
            key: this.props.columns.id + "-table-settings-select-all"
        };
    }

    /**
     * Méthode permettant de déterminer si toutes les cases sont cochées
     * @returns {boolean}
     */
    protected isAllChecked(): boolean {
        let bool: boolean = true;
        if (this.props.hiddenColumns) {
            this.props.columns.columns.map((column) => {
                if (this.props.hiddenColumns[column.keyColumn]) {
                    bool = false;
                }
            });
        }

        return bool;
    }
}