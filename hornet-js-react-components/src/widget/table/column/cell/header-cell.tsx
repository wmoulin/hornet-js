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
import { AbstractHeaderCell, AbstractHeaderCellProps } from "src/widget/table/column/cell/abstract-header-cell";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import { SortData, SortDirection } from "hornet-js-core/src/component/sort-data";

import * as classNames from "classnames";

export interface HeaderCellProps extends AbstractHeaderCellProps {

}

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.column.cell.header-cell");

/**
 * Classe Permettant de générer le rendu html d'un cellule d'entête de tableau
 */
export class HeaderCell<P extends HeaderCellProps, S> extends AbstractHeaderCell<P, any> {


    constructor(props: P, context?: any) {
        super(props, context);
    }

    static defaultProps = {
        sort: false
    };


    /**
     * @inheritDoc
     */
    shouldComponentUpdate(nextProps: HeaderCellProps, nextState: any) {
        return super.shouldComponentUpdate(nextProps, nextState) || nextState.isFocused === this.state.isFocused;
    }

    /**
     * @inheritDoc
     */
    renderCell(): JSX.Element {
        logger.trace("render HeaderCell -> column:", this.props.coordinates.column, " - line:", this.props.coordinates.row);
        // Gestion du titre de l'entête
        let isTriActifSurColonne = this.isSortedColumn(this.props.sortData);
        let urlImgArrow: string = "/img/tableau/ic_arrow_upward_black.svg";
        let imgClassName: ClassDictionary = {"arrow-sort": true};
        if (this.state.sortData && this.state.sortData.dir == SortDirection.DESC) {
            urlImgArrow = "/img/tableau/ic_arrow_downward_black.svg";
        }
        let title: string = this.handleSortTitle(this.isSortedColumn(this.props.sortData), "none").title;
        let titleDesc: any = isTriActifSurColonne && this.state.edition ?
            <div>{this.props.title}
                <img src={HeaderCell.genUrlTheme(urlImgArrow)} className={classNames(imgClassName)} alt={title}/>
            </div> : <div>{this.props.title}</div>;

        if (this.props.sortable && !this.props.contentState.itemInEdition) {
            titleDesc = this.getColumnTriComponent();
        }

        return (
            titleDesc
        );
    }

    /**
     * Rendu HTML d'une entête de colonne de tableau
     */
    protected getColumnTriComponent(): JSX.Element | JSX.ElementClass {
        logger.trace("getColumnTriComponent");

        let sort = this.props.sortData;
        /*let sortType: SortType = (this.state.sort as SortData).type || this.state.sort as SortType || DEFAULT_SORT_TYPE;*/
        let sortKey: string = (sort && sort.key) as string || this.props.keyColumn;

        /* Calcul du sens prochain sens de tri */
        let nextSortDir: SortDirection = SortDirection.ASC,
            columnNameToSort: string = (sort && sort.key) as string || null,
            columnSortByKey: string = this.state.sort && ((this.state.sort as SortData).key) as string || null;

        if (columnNameToSort && (columnNameToSort == this.props.keyColumn || columnNameToSort == columnSortByKey)) {
            logger.trace("sens de tri courant :", sort.dir);
            nextSortDir = (sort.dir == SortDirection.ASC) ? SortDirection.DESC : SortDirection.ASC;
            logger.trace("prochain sens de tri :", nextSortDir)
        }

        /* Données de tri à appliquer au prochain clic sur cette colonne */
        let nextTableSort: SortData = {
            key: sortKey,
            dir: nextSortDir/*,
             type: sortType*/
        };

        let functionOnSortData: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
            this.state.onSort(nextTableSort);
        };

        let handleOnKeyDown: React.KeyboardEventHandler<HTMLElement> = (e: React.KeyboardEvent<HTMLElement>) => {
            /* Le composant a le comportement d'un bouton : il doit prendre en compte les touches Entrée OU Espace
             * (cf. https://www.w3.org/TR/wai-aria-practices/#button > "Keyboard Interaction")  */
            if (e.keyCode == KeyCodes.SPACEBAR || e.keyCode == KeyCodes.ENTER) {
                this.state.onSort(nextTableSort);
            }
        };

        if (this.state.abbr && !this.state.lang) {
            logger.warn("Column ", this.props.keyColumn, " Must have lang with abbr configuration");
        }

        let urlImgArrow: string = "/img/tableau/ic_arrow_upward_black.svg";
        let imgClassName: ClassDictionary = {"arrow-sort": true};
        if (this.state.sortData && this.state.sortData.dir == SortDirection.DESC) {
            urlImgArrow = "/img/tableau/ic_arrow_downward_black.svg";
        }
        let title: string = this.handleSortTitle(this.isSortedColumn(this.props.sortData), "none").title;

        return (
            <div className="datatable-header-sort-liner" role="button" lang={this.state.lang}
                 onClick={functionOnSortData} onKeyDown={handleOnKeyDown} tabIndex={-1}>
                {!this.state.edition ?
                    <div>
                        <a href="#" className="arrow-sort-container" tabIndex={-1}>
                            {(this.state.abbr) ?
                                <abbr lang={this.state.lang} title={this.state.abbr}>
                                    {this.state.title}
                                </abbr> : this.state.title}
                        </a>
                        <img src={HeaderCell.genUrlTheme(urlImgArrow)} className={classNames(imgClassName)} alt={title}
                             tabIndex={-1}/>
                    </div>
                    :
                    <div>
                        {(this.state.abbr) ?
                            <abbr lang={this.state.lang} title={this.state.abbr}>
                                {this.state.title}
                            </abbr> : this.state.title}
                    </div>
                }
            </div>
        );
    }

}