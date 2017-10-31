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
import * as React from "react";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { AbstractHeaderCell, AbstractHeaderCellProps } from "src/widget/table/column/cell/abstract-header-cell";
import { AbstractBodyCell, AbstractBodyCellProps } from "src/widget/table/column/cell/abstract-body-cell";
import { HeaderCell } from "src/widget/table/column/cell/header-cell";
import { BodyCell } from "src/widget/table/column/cell/body-cell";
import { InputTextInLineBodyCell } from "src/widget/table/column/cell/input/input-text-in-line-body-cell";
import { SortData } from "hornet-js-core/src/component/sort-data";
import { CellCoordinates } from "src/widget/table/column/cell/cell-coordinates";
import * as classNames from "classnames";
import { ContentState } from "src/widget/table/table-state";
import * as _ from "lodash";

import { CSSProperties } from "react";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.column");

/**
 * Propriétés d'une colonne d'entête de tableau
 */
export interface ColumnProps extends HornetComponentProps {
    id?: string;
    /** Nom de la colonne, correspondant au nom de la propriété contenant la valeur d'une cellule */
    keyColumn: string;
    /** Titre de la colonne */
    title?: string | JSX.ElementClass;
    /** titre de la cellule */
    titleCell?: string | Function;
    /** Texte complet lorsque le titre est un acronyme. La propriété lang devrait être valorisée dans ce cas. */
    abbr?: string;
    /** Propriétés de tri sur la colonne */
    sortable?: boolean;
    /** Propriétés d'edition sur la colonne */
    editable?: boolean;
    /** Propriété permettant de rendre éditable une cellule */
    isEditing?: boolean;
    /** indicateur de generation d'une cellule header */
    isHeader?: boolean;
    /** indique que le header est fixe */
    headerFixed?: boolean;
    /** style  des cellules */
    style?: CSSProperties;
    /** Titre du bouton de tri par colonne. Lorsque vide table.sortByTitle est utilisé par défaut. */
    sortByTitle?: string;
    /** Fonction déclenchée lors d'un clic sur une colonne, déclenchant le tri sur celle-ci */
    onSort?: (SortData) => void;
    /** Tri en cours sur le tableau */
    sortData?: SortData;
    /** fonction appelée par les cellules sur la navigation */
    navigateFct?: (CellCoordinates, NavigateDirection) => void;
    /** Fonction déclenchée lors du click sur la checkbox liée aux actions de masse */
    toggleSelectLines?: (item: any, all?: boolean) => void;
    /** gestion des touches clavier */
    handleChangeKeyboardMode?: any; // from content.tsx
    /** specifie le mode d'accessibilité au clavier */
    keyboardMode?: number; // from content.tsx
    /** permettre les actions de masse */
    actionMassEnabled?: boolean;
    /** nombre de colonne du tableau */
    nbColumns?: number;
    // Coordonnées de la cellule en cours de generation
    cellCoordinate?: CellCoordinates;
    /** objet representant l'état du tableau */
    contentState?: ContentState;
    /** la ligne est selectionnée */
    isSelected?: boolean;
    /** détermine si la colonne peut être masquée */
    hiddenable?: boolean;
    /** style de la colonne */
    defaultStyle?: CSSProperties;
    /** Texte alternatif */
    alt?: string;
}

/**
 * Propriétés d'une colonne d'entête de tableau
 */
export interface ColumnState extends HornetComponentProps {
    /** Tri en cours sur le tableau */
    sortData?: SortData;
    /** Nom de la colonne correspondant à keyColumn */
    column: string;
    /** index de la colonne */
    coordinates?: number;
    /** état de la colonne */
    isVisible?: boolean;
    /** Propriété permettant de rendre éditable une cellule */
    isEditing?: boolean;
}

/**
 * Classe abstraite d'une colonne de tableau
 */
export class Column<P extends ColumnProps, S extends ColumnState> extends HornetComponent<ColumnProps, ColumnState> {

    static defaultProps = {
        sortable: false,
        defaultStyle: {"width": "10em"},
        hiddenable: true
    };

    constructor(props: P, context: any) {
        super(props, context);
    }

    /**
     * @inheritDoc
     */
    shouldComponentUpdate(nextProps: ColumnProps, nextState: any) {
        return false;
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render Column");

        let cellProps = this.getCellProps();
        cellProps.key = "wc-" + cellProps.key;
        if (this.props.isHeader) {
            return this.wrap(this.getHeaderCell(), cellProps);
        }
        return this.wrap(this.getBodyCell(), cellProps);
    }

    /**
     * Getter pour le composant générant le entête de colonne
     * @return Class<HeaderCell<HeaderCellProps, any>>
     */
    public getHeaderCell(): Class<AbstractHeaderCell<AbstractHeaderCellProps, any>> {
        return HeaderCell;
    }

    /**
     * Getter pour le composant générant le contenu de colonne
     * @return Class<BodyCell<BodyCellProps, any>>
     */
    public getBodyCell(): Class<AbstractBodyCell<AbstractBodyCellProps, any>> {
        return (this.props.editable) ? Column.getEditableCell() : BodyCell;
    }

    /**
     * @inheritDoc
     */
    public static getEditableCell(): Class<InputTextInLineBodyCell<AbstractBodyCellProps, any>> {
        return InputTextInLineBodyCell;
    }

    /***
     * Méthode permettant de récupérer les propriétés d'une cellule
     * @returns {any} Propriétés d'une cellule
     */
    getCellProps(): any {
        let props: any = {
            coordinates: this.props.cellCoordinate,
            isSelected: this.props.isSelected,
            id: this.props.id
        };
        if (this.props.style) {
            props.style = this.props.style;
        }
        //
        // if (this.props.headerFixed || this.props.defaultStyle) {
        //     props.style = _.merge(props.style, this.props.defaultStyle);
        // }

        props.isEditing = this.state.isEditing;
        props.nbColumns = this.props.nbColumns;
        props.key = Column.getCellKey(props);

        return props;
    }

    static getCellKey(cellProps: any): any {
        return "cell-" + cellProps.id + "-" + cellProps.coordinates.row + "-" + cellProps.coordinates.column + "-wrapped";
    }

}