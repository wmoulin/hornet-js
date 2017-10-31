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
import { ArrayUtils } from "hornet-js-utils/src/array-utils";
import { Logger } from "hornet-js-utils/src/logger";

import * as React from "react";
import * as classNames from "classnames";

import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { MenuActions } from "src/widget/table/menu-actions";
import { ToggleColumnsButton } from "src/widget/table/toggle-columns-button";
import { TableState, ContentState } from "src/widget/table/table-state";
import { Alert } from "src/widget/dialog/alert";
import { PaginateDataSource } from "hornet-js-core/src/component/datasource/paginate-datasource";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";

const logger: Logger = Utils.getLogger("hornet-js-components.widget.table.header");

/**
 * Propriétés du composant Header de tableau Hornet
 */
export interface HeaderProps extends HornetComponentProps {
    /**  Identifiant unique */
    id?: string;
    /** Identifiant du parent */
    parentId?: string;
    /** Titre du Table */
    title: string;
    /** message qui affiche le nombre total d'item dans le header */
    libelleNombreTotalItem?: string;
    /** Affichage du bouton d'accessibilité */
    showIconInfo?: boolean;
    /** Affichage du bouton d'accessibilité et du menu action*/
    hideMenuactions?: boolean;
    /** Affichage de l'action permettant de masquer/afficher les colonnes **/
    toggleColumns?: boolean;

    /** Informations de colonnes */
    columns?: any;
    /** Elements du table */
    items?: any[];
    /** Elements sélectionnés du Table */
    selectedItems?: number[];
    tableState?: TableState;
    /** content state */
    contentState?: ContentState;
    /** liste des PaginateDataSource de tous les <Content.tsx> du composant table, s'ils exitent */
    dataSourcesList?: PaginateDataSource<any>[];
}

/**
 * Header de tableau
 */
export class Header extends HornetComponent<HeaderProps, any> {

    private headerRef: any;
    private hiddenColumns: any;

    constructor(props: HeaderProps, context?: any) {
        super(props, context);
        if (!this.props.id) {
            this.state.id = this.state.parentId;
        }
        this.state.libelleNombreTotalItem = this.state.libelleNombreTotalItem ?
            this.state.libelleNombreTotalItem : "table.numberElementTitle";
        this.state.items = [];
        this.state.selectedItems = [];

        // gestion de l'event de changement de la liste des items du tableau
        this.handleChangeDataTable = this.handleChangeDataTable.bind(this);
        this.props.tableState.on(TableState.INDEX_CHANGE_EVENT, this.handleChangeDataTable);

        // gestion de l'event d'edidtion du tableau
        this.props.contentState.setMaxListeners(Infinity);
        this.handleEdition = this.handleEdition.bind(this);
        this.props.contentState.on(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
        this.hiddenColumns = (props as any).hiddenColumns;
        (props as any).contentState.on(ContentState.TOGGLE_COLUMNS_EVENT, this.handleChangeHiddenColumns);
    }

    componentWillUnmount() {
        this.props.tableState.removeListener(TableState.INDEX_CHANGE_EVENT, this.handleChangeDataTable);
        this.props.contentState.removeListener(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
        if (this.props.dataSourcesList) {
            this.props.dataSourcesList.map((dataSource, index) => {
                this.props.dataSourcesList[index].removeListener("select", this.handleChangeDataTable);
            });
        }
    }

    componentDidMount(): void {
        // gestion de l'event de selection des lignes du tableau
        // on s'abonne au select du dataSource de chaque content
        if (this.props.dataSourcesList && Array.isArray(this.props.dataSourcesList) && this.props.dataSourcesList.length > 0) {
            this.props.dataSourcesList.map((dataSource, index) => {
                this.props.dataSourcesList[index].setMaxListeners(Infinity);
                this.props.dataSourcesList[index].on("select", this.handleChangeDataTable);
            });
        }
        this.props.tableState.emit(TableState.RESIZE_EVENT, this.headerRef.clientWidth);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render");

        let headerContainerProps = {
            id: this.state.id,
            className: classNames({
                "datatable-header-title": true,
                "flex-container": true,
                "badge-selected-items-before": this.getTotalSelectedItemsForAllDataSource() != 0
            }),
            "data-badge": this.getTotalSelectedItemsForAllDataSource(),
            tabIndex: this.state.tabIndex
        };

        return (

            <div {...headerContainerProps} ref={(instance) => { this.headerRef = instance; }}>
                <div className="datatable-title">
                    <span className="datatable-title-span">
                        {this.state.title + " " + this.i18n(this.state.libelleNombreTotalItem,
                            {count: this.getTotalItemsForAllDataSource()})}
                    </span>
                </div>
                {(!this.state.hideMenuActions) ? this.renderMenuActions() : null}
                <Alert ref="alert" message={""}
                       onClickCancel={this.closeAlert}
                       onClickClose={this.closeAlert}/>
            </div>);
    }

    /**
     * Méthode permettant de mettre à jour le nombre de colonnes
     * @param hiddenColumns
     */
    handleChangeHiddenColumns(hiddenColumns) {
        this.hiddenColumns = hiddenColumns;
    }

    /**
     * Rendu HTML du menu des actions
     * @returns {any}
     */
    renderMenuActions(): JSX.Element {
        logger.trace("renderMenuActions");
        let children: any = this.getChildrenOf(MenuActions);
        let actions: any[] = [];

        // cas ou une seule action est déclarée
        if (children.props && !children.length) {
            actions.push(children);
        } else {
            actions = children;
        }

        // Détection de la présence du toggleColumnsButton
        let toggleColumnsButton: any = this.getComponentBy(ToggleColumnsButton);

        let WrappedToggleColumns = null;
        if (toggleColumnsButton) {
            let key: string = this.state.id + "toggleColumnsButton";
            WrappedToggleColumns = Header.wrap(
                ToggleColumnsButton,
                toggleColumnsButton,
                toggleColumnsButton.props,
                {
                    id: this.state.id,
                    key: key,
                    tabIndex: -1,
                    columns: this.props.columns,
                    contentState: this.props.contentState,
                    hiddenColumns: this.hiddenColumns
                }
            );
        }

        let menuActionsProps: any = {
            actions: actions,
            items: this.state.items,
            showAlert: this.showAlert,
            showIconInfo: this.props.showIconInfo,
            selectedItems: this.getSelectedItemsForAllContent(),
            id: this.state.id + "-menu-action",
            columns: this.props.columns,
            toggleColumnsButton: WrappedToggleColumns,
            contentState: this.props.contentState
        };

        return (
            <MenuActions {...menuActionsProps} />
        );
    }

    /**
     * cache le menuActions lorsque la table est en cours d'edition.
     * @param lineIndex
     */
    handleEdition(lineIndex: number): void {
        this.setState({hideMenuActions: lineIndex !== undefined && lineIndex !== null});
    }

    /**
     *
     * @param selectedItems
     * @param items
     */
    handleChangeDataTable(selectedItems: any[], items?: any[]) {
        this.setState({selectedItems: selectedItems, items: items ? items : this.state.items});
    }

    /**
     * Méthode déclenchant la fermeture de la fenêtre modale de suppresion d'un partenaire
     */
    private closeAlert(): void {
        (this.refs.alert as Alert).close();
    }

    /**
     * Méthode déclenchant la fermeture de la fenêtre modale de suppresion d'un partenaire
     */
    private validateAlert(fct?: Function): void {
        (this.refs.alert as Alert).close(fct);
    }

    /***
     * Déclenche l'affichage de la modale de suppression d'un partenaire
     * @param message
     * @param title
     * @param {Function} fct fonction exécutée sur la validation
     */
    private showAlert(message: string, title: string, fct: Function): void {
        (this.refs.alert as Alert).setMessage(message);
        (this.refs.alert as Alert).setTitle(title);
        (this.refs.alert as Alert).setOnClickOk(() => {
            this.validateAlert(fct);
        }).open();
    }

    /**
     * fonction qui retourne la liste des items selectionés sur l'ihm lors de la pagination
     * @returns {any[]}
     */
    private getSelectedItemsForAllContent(): any[] {
        logger.trace("getSelectedItemsForAllContent");
        let resultList: any[] = [];
        // recupere la liste de tous les items selectionés dans les dataSources des contents
        this.props.dataSourcesList.map((dataSource, index) => {
            resultList = ArrayUtils.unionWith(this.props.dataSourcesList[index].selected, resultList);
        });
        // intersection des items affichés avec les items selectionés dans le dataSource
        resultList = ArrayUtils.intersectionWith(resultList, this.state.items);
        return resultList;
    }

    /**
     * Retourne la somme totale des items de tous les dataSource de tous les contents
     * @returns {number}
     */
    private getTotalItemsForAllDataSource(): number {
        logger.trace("getTotalItemsForAllDataSource");
        let result: number = 0;
        this.props.dataSourcesList.map((dataSource: DataSource<any>) => {
            let nbItem: number = 0;

            if (dataSource) {
                // si le dataSource est de type PaginateDataSource, on prend le totalItems sinon on prend le result.length
                if (dataSource instanceof PaginateDataSource) {
                    let pagDt: PaginateDataSource<any> = dataSource as PaginateDataSource<any>;
                    nbItem = pagDt && pagDt.pagination && pagDt.pagination.totalItems ? pagDt.pagination.totalItems : 0;
                } else {
                    nbItem = dataSource.results ? dataSource.results.length : 0;
                }
                result += nbItem;
            }
        });

        return result;
    }

    /**
     * Retourne la somme totale des items de tous les dataSource de tous les contents
     * @returns {number}
     */
    private getTotalSelectedItemsForAllDataSource(): number {
        logger.trace("getTotalSelectedItemsForAllDataSource");
        let result: number = 0;
        this.props.dataSourcesList.map((dataSource: DataSource<any>) => {
            if (dataSource) {
                // si le dataSource est de type PaginateDataSource, on prend le totalItems sinon on prend le result.length
                result += (dataSource.selected) ? dataSource.selected.length : 0;
            }
        });
        return result;
    }
}
