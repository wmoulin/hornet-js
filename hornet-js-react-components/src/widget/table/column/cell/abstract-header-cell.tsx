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
import { SortData, SortDirection } from "hornet-js-core/src/component/sort-data";
import { AbstractCell, AbstractCellProps } from "src/widget/table/column/cell/abstract-cell";
import { ColumnState } from "hornet-js-react-components/src/widget/table/column";
import * as classNames from "classnames";
import { ContentState } from "hornet-js-react-components/src/widget/table/table-state";

export interface SortTitleInformations {
    ariasort: string;
    title: string;
}

export interface AbstractHeaderCellProps extends AbstractCellProps {
    /** Nom de la colonne, correspondant au nom de la propriété contenant la valeur d'une cellule */
    keyColumn: string;
    /** Fonction déclenchée lors d'un clic sur une colonne, déclenchant le tri sur celle-ci */
    onSort?: (SortData) => void;
    /** Tri en cours sur le tableau */
    sortData?: SortData;
    /** Texte complet lorsque le titre est un acronyme. La propriété lang devrait être valorisée dans ce cas. */
    abbr?: string
    /** Propriétés de tri sur la colonne */
    sort?: boolean;
    /** indique que le header est fixe */
    headerFixed: boolean;
    /** Titre de la colonne */
    title?: string | JSX.ElementClass;
    sortable?: boolean;
    sortByTitle?: boolean;
    className?: string;
}

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.column.cell.abstract-header-cell");

/**
 * Classe permettant de générer le rendu html d'un cellule du header d'un tableau
 */
export class AbstractHeaderCell<P extends AbstractHeaderCellProps, S> extends AbstractCell<P, S> {

    constructor(props: P, context?: any) {
        super(props, context);
        this.props.contentState.on(ContentState.TOGGLE_COLUMNS_EVENT, this.handleChangeHiddenColumns);
        this.props.contentState.on(ContentState.EDITION_CLIC_EVENT, this.handleEditionQuit);

    }

    /**
     * @inheritDoc
     */
    shouldComponentUpdate(nextProps: AbstractHeaderCellProps, nextState: any) {
        return true;
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.contentState.removeListener(ContentState.EDITION_CLIC_EVENT, this.handleEditionQuit);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render AbstractHeaderCell -> column:", this.props.coordinates.column, " - line:",
            this.props.coordinates.row, "- isFocused:", this.state.isFocused, "- tabIndex:", this.state.tabIndex);
        return (
            <th {...this.getDefaultThProps(-1)}>
                {this.renderCell()}
            </th>
        );
    }

    renderCell() {
        return (
            this.state.value
        );
    }

    /***
     * Retourne les propriétés par défaut d'un élément de type Td
     * @returns {{ref: ((instance:HTMLTableCellElement)=>undefined), className: string, onKeyDown: any, tabIndex: number, aria-selected: (((props:any)=>boolean)|any), onFocus: any, style: any}}
     */
    getDefaultThProps(lineIndex: number) {

        logger.trace("Rendu Header column Tableau");

        let classes: ClassDictionary = {"datatable-header": true, "fixed": (this.props.headerFixed)};

        if (this.props.className) {
            classes[this.props.className] = true;
        }

        let ariasort: string = "none";
        let title: string;
        if (this.props.sortable && !this.props.contentState.itemInEdition) {

            let isTriActifSurColonne = this.isSortedColumn(this.props.sortData);

            // Gestion de la classe de l'entête th
            classes["datatable-header-sortable-column"] = true;
            if (isTriActifSurColonne) {
                classes["datatable-header-sorted"] = true;

                if (this.props.sortData.dir == SortDirection.DESC) {
                    classes["datatable-header-sorted-desc"] = true;
                } else {
                    classes["datatable-header-sorted-asc"] = true;
                }
            }

            classes["datatable-cell-custom"] = true;
            classes["datatable-cell-custom-" + this.props.keyColumn] = true;

            let titleObject: SortTitleInformations = this.handleSortTitle(isTriActifSurColonne, ariasort);
            ariasort = titleObject.ariasort;
            title = titleObject.title;
        }

        classes[this.props.id + "-" + this.props.keyColumn] = true;

        classes["is_disabled"] = this.props.contentState.itemInEdition !== undefined && this.props.contentState.itemInEdition !== null;
        let key = this.props.id + "-colHeader-0-" + this.props.coordinates.column;
        let tabIndex = this.getTabIndexFullKind();

        return ({
            ref: (instance: HTMLTableCellElement) => {
                if (instance) {
                    this.tableCellRef = instance;
                }
            },
            className: classNames(classes),
            onFocus: this.handleFocus.bind(this),
            onBlur: this.handleBlur.bind(this),
            onKeyDown: this.handleKeyDown.bind(this),
            style: this.props.style,
            key: key,
            title: title ? title : this.state.title,
            "aria-sort": ariasort,
            id: key,
            tabIndex: tabIndex
        });
    }

    protected handleSortTitle(isTriActifSurColonne: boolean, ariasort: string): SortTitleInformations {
        // Gestion du title
        let sortDirection: string;
        if (isTriActifSurColonne) {
            /* Le tri est actif sur la colonne : on indique donc le sens de tri qui s'appliquera au prochain tri.
             * L'attribut aria-sort indique par contre le sens de tri courant (cf. https://www.w3.org/TR/wai-aria-1.1/#aria-sort) */
            if (this.props.sortData.dir == SortDirection.DESC) {
                sortDirection = this.i18n("table.ascending");
                ariasort = "descending";
            } else {
                sortDirection = this.i18n("table.descending");
                ariasort = "ascending";
            }
        } else {
            sortDirection = this.i18n("table.ascending");
            /* Pas de tri actif : on ne doit pas valoriser l'attribut aria-sort */
        }
        let title = this.getSortByTitle(this.props.title, sortDirection);
        return {ariasort: ariasort, title: title};
    }

    /**
     * Génère le texte du bouton de tri par colonne
     * @param columnTitle titre de la colonne
     * @param sortDirection description de la direction du tri
     */
    protected getSortByTitle(columnTitle: string | JSX.ElementClass, sortDirection: string): string {
        return this.i18n((this.props.sortByTitle) || this.i18n("table.sortByTitle"),
            {
                "columnTitle": (columnTitle as JSX.ElementClass).render ?
                    (columnTitle as JSX.ElementClass).render() : columnTitle as string,
                "sortTitle": sortDirection
            }) as string;
    }

    /**
     * Test si une column est trié
     * @param column colonne de tableau
     * @param sort données de tri courant du tableau
     * @return true lorsque le tri du tableau est actif sur la colonne indiquée
     */
    public isSortedColumn(sort: SortData): boolean {
        let sorted: boolean = false;
        if (sort && sort.key) {
            if (this.props.keyColumn && sort.key === this.props.keyColumn) {
                // tri personnalisé sur la colonne : la clé de tri du tableau doit être égale à la clé de tri personnalisé/
                sorted = true;
            } else {
                // tri simple : la clé de tri du tableau doit être égale à la clé de la colonne
                sorted = false;
            }
        }
        return sorted;
    }

    /**
     * Retourne le tabIndex pour les éléments du tableau
     * Si la colonne est la première on autorise la tabulation
     * @returns valeur pour l'index de tabulation
     */
    protected getTabIndexFullKind(): number {
        let firstVisibleCoord = this.props.contentState.firstVisibleColumnState.coordinates;
        return (this.props.coordinates.column == firstVisibleCoord) ? 0 : -1;
    }

    /**
     * Gestion des tabulations pour la première colonne visible
     */
    protected handleChangeHiddenColumns(hiddenColumns, firstVisibleColumnState: ColumnState, oldFirstiVisibleColumnState: ColumnState): void {
        if (firstVisibleColumnState.coordinates == this.props.coordinates.column) {
            this.tableCellRef.tabIndex = 0;
        }
        if (oldFirstiVisibleColumnState && oldFirstiVisibleColumnState.coordinates == this.props.coordinates.column) {
            this.tableCellRef.tabIndex = -1;
        }
    }

    /**
     * Prise en compte de la sortie du mode edition
     * @param lineIndex
     */
    public handleEditionQuit(lineIndex: number) {
        if (lineIndex) {
            this.setState({edition: true});
        } else {
            this.setState({edition: false});
        }
    }
}
