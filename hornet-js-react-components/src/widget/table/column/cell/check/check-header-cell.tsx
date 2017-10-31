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
import { Logger } from "hornet-js-utils/src/logger";
import { AbstractHeaderCell, AbstractHeaderCellProps } from "src/widget/table/column/cell/abstract-header-cell";
import { CheckBox } from "src/widget/form/checkbox";
import * as React from "react";
import { ArrayUtils } from "hornet-js-utils/src/array-utils";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.column.cell.check.check-header-cell");

export interface CheckHeaderCellProps extends AbstractHeaderCellProps {

}

export class CheckHeaderCell<P extends CheckHeaderCellProps, S> extends AbstractHeaderCell<P, any> {
    private checkBoxRef: any;

    constructor(props: P, context?: any) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.props.dataSource.on("select", this.handleChange);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.dataSource.removeListener("select", this.handleChange);
    }

    /**
     * @inheritDoc
     */
    renderCell() {
        logger.trace("render CheckHeaderCell-> column:",
            this.props.coordinates.column, " - line:", this.props.coordinates.row, "checked =>", this.props.isSelected);

        // todo: rajouter title à la checkbox action de masse

        let functionToggleAll: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
            this.props.toggleSelectLines(null, !this.state.isSelected);
        };

        let title: string = this.state.isSelected ? "table.deselectedAllTitle" : "table.selectedAllTitle";

        let checkBoxProps: any = {
            ref: (instance: any) => {
                this.checkBoxRef = instance;
            },
            checked: this.state.isSelected,
            onChange: functionToggleAll,
            title: title && this.i18n(title),
            name: "selectedItems-" + this.state.value,
            disabled: this.props.contentState.items.length === 0 || this.props.contentState.itemInEdition
        };

        return (
            <CheckBox {...checkBoxProps}/>
        );
    }

    /**
     * Override de la méthode blurAction d'AbstractCell
     * retire la tabulation à une cellule que l'on vient de quitter
     * par navigation clavier
     * @param tableCellRef
     */
    protected blurActions(tableCellRef): void {
        // on met le focus sur le premier element HTML de type input
        if (tableCellRef instanceof HTMLInputElement) {
            (tableCellRef as HTMLElement).tabIndex = -1;
        } else if (tableCellRef.children) {
            this.blurActions(tableCellRef.children[0]);
        }
    }

    /**+
     * @inheritDoc
     */
    handleCellFocus(tableCellRef) {
        if (tableCellRef) {
            // on met le focus sur le premier element HTML de type input
            if (tableCellRef instanceof HTMLInputElement) {
                (tableCellRef as HTMLElement).focus();
                (tableCellRef as HTMLElement).tabIndex = 0;
            } else if (tableCellRef.children) {
                this.handleCellFocus(tableCellRef.children[0]);
            }
        }

    }

    /***
     * Evènement exécuté sur la sélection des cases à cocher
     * @param selectedItems
     * @param all
     */
    handleChange(selectedItems: any[], all: boolean) {
        if (this.checkBoxRef) {
            if (ArrayUtils.isInclude(this.props.contentState.items, selectedItems)) {
                // this.checkBoxRef.title = this.i18n("table.deselectedAllTitle");
                this.setState({isSelected: true});
            } else {
                // this.checkBoxRef.title = this.i18n("table.selectedAllTitle");
                this.setState({isSelected: false});
            }
        }
    }

    /**
     * Retourne le tabIndex pour les éléments du tableau
     * Si la colonne est la première on autorise la tabulation
     * exception faite des check column qui ne doivent pas être tabulable
     * au premier container
     * @returns valeur d'index pour tabulation
     */
    protected getTabIndexFullKind(): number {
        return -1;
    }
}
