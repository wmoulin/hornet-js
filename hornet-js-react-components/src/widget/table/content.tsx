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

import {Utils} from "hornet-js-utils";
import {ArrayUtils} from "hornet-js-utils/src/array-utils";
import {SortData, SortDirection} from "hornet-js-core/src/component/sort-data";
import {Logger} from "hornet-js-utils/src/logger";
import * as React from "react";
import {HornetComponent} from "src/widget/component/hornet-component";
import {
    HornetComponentProps,
    IHornetComponentAsync,
    IHornetComponentDatasource
} from "hornet-js-components/src/component/ihornet-component";
import {HornetComponentDatasourceProps} from "src/widget/component/hornet-component";
import {Alert} from "src/widget/dialog/alert";
import {SpinnerLoader, SpinnerOverlay, SpinnerTableProps} from "src/widget/table/spinner-table";
import {DataSource} from "hornet-js-core/src/component/datasource/datasource";
import {PaginateDataSource} from "hornet-js-core/src/component/datasource/paginate-datasource";
import {ColumnProps} from "src/widget/table/column";
import {Columns} from "src/widget/table/columns";
import {ColumnState} from "src/widget/table/column";
import {ActionColumn} from "src/widget/table/column/action-column";
import {EditionActionColumn} from "src/widget/table/column/edition-action-column";
import {CheckColumn} from "src/widget/table/column/check-column";
import {CellCoordinates} from "src/widget/table/column/cell/cell-coordinates";
import {ContentState} from "src/widget/table/table-state";
import {NavigateDirection} from "src/widget/table/navigation-direction";
import {Form} from "src/widget/form/form";
import {LineBefore} from "src/widget/table/line/line-before";
import {LineAfter} from "src/widget/table/line/line-after";
import { Notification } from "src/widget/notification/notification";
import * as classNames from "classnames";
import * as _ from "lodash";
import {HornetEvent} from "hornet-js-core/src/event/hornet-event";
import {Direction} from "hornet-js-core/src/component/datasource/paginate-datasource";

export const UNIT_SIZE = "em";
export const UPDATE_COLUMN_VISIBILITY = new HornetEvent<ColumnState | string>("UPDATE_COLUMN_VISIBILITY");

/**
 * Modes de d'interaction accessible au clavier
 */
export enum KeyboardInteractionMode {
    /** Navigation en lecture seule avec les flèches */
    NAVIGATION = 0,
    /** Edition : même si les cellules ne sont pas éditables, des boutons d'édition peuvent être disponibles.
     * Ils sont accédés via la tabulation */
    ACTIONABLE = 1
}

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.content");

export interface ContentProps extends HornetComponentProps, HornetComponentDatasourceProps {
    id?: string;
    /** Determine si le header du tableau doit etre fixe */
    headerFixed?: boolean;
    /** largeur du tabelau  */
    width?: number;
    /** fonction pour modifier le css des lignes du tableau */
    customRowsClass?: Function;
    /** Fonction déclenchée lors de la soumission du formulaire, lorsque celui-ci est valide */
    onSubmit?: (data: any, item: any) => void;
    /** Schema JSON de validation */
    schema?: any;
    /** Identifiant du groupe de notifications auquel seront rattachées les notifications d'erreurs de validation
     * du formulaire */
    notifId?: string;
    /**  titre du tableau (utilisé pour le caption lié à l'accessibilité */
    title?: string;

    /** gestion des events emit du content State */
    contentState?: ContentState; //from table.tsx
    /** Détermine si des colonnes sont cachées par défaut */
    hiddenColumns?: any;  // from ToggleColumnsButton.tsx

    withoutForm?: boolean;

    isContentVisible?: boolean;
}

/**
 * Classe permettant de générer le rendu graphique d'uncomposant Tableau
 */
export class Content extends HornetComponent<ContentProps, any> implements IHornetComponentAsync, IHornetComponentDatasource {

    public readonly props: Readonly<ContentProps>;

    private sortData: SortData[];
    private tableTrsRef: any[] = [];

    private tBodyRef: HTMLElement;

    /** nombre total de colonnes affichées */
    private totalColumns: number;

    /** colonnes masquées */
    private hiddenColumns: any;

    /** Collection de colonne avec coordonnées et état */
    private columnsWithVisibilityMap: Array<ColumnState> = new Array<ColumnState>();

    constructor(props?: ContentProps, context?: any) {
        super(props, context);
        this.props.contentState.setMaxListeners(Infinity);
        this.props.dataSource && this.props.dataSource.setMaxListeners(Infinity);
        this.state.keyboardMode = KeyboardInteractionMode.NAVIGATION;
        this.state.items = [];
        this.state.inProgress = false;
        this.state.isContentVisible = true;

        let result = this.props.dataSource && this.props.dataSource.results;
        if (result) {
            this.state.items = this.props.dataSource instanceof PaginateDataSource ?
                this.props.dataSource.getItemsByPage(this.props.dataSource.pagination.pageIndex || Direction.FIRST) : result;
            this.props.dataSource.select([]);
        }

        this.state.spinner = false;

        this.state.actionMassEnabled = this.hasChildrenOfComponentTypeOf(Columns, CheckColumn);
        this.hiddenColumns = props.hiddenColumns;
        this.totalColumns = this.getTotalColumnsVisible();
        this.props.contentState.on(ContentState.TOGGLE_COLUMNS_EVENT, this.handleChangeHiddenColumns);

        if (this.props.dataSource && this.props.dataSource.getDefaultSort()) {
            this.sortData = this.props.dataSource.getDefaultSort().sort;
        }
        // chaque cellule ecoute levent de clic sur l'icone d'edition d'une ligne du tableau
        this.handleEdition = this.handleEdition.bind(this);

        this.props.contentState.on(ContentState.EDITION_CLIC_EVENT, this.handleEdition);

        this.initializeColumnVisibilityWithCoord();
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        super.componentDidMount();
        let result = this.props.dataSource.results;
        if (result) {

            if (this.props.dataSource instanceof PaginateDataSource) {
                // nothing
            } else {
                this.props.contentState.setItems(result);
            }
        }
        this.props.dataSource.on("init", this.setItem);
        this.props.dataSource.on("fetch", this.setItem);
        this.props.dataSource.on("pagination", this.setItemPaginate);
        this.props.dataSource.on("sort", this.sort);
        this.props.dataSource.on("delete", this.setItem);
        this.props.dataSource.on("add", this.setItem);
        this.props.dataSource.on("filter", this.setItem);
        this.props.dataSource.on("loadingData", this.displaySpinner);
        this.props.dataSource.on("select", this.handleChangeSelectedItems.bind(this));

        this.listen(UPDATE_COLUMN_VISIBILITY, this.updateColumnVisibility);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        super.componentWillUnmount();
        this.props.dataSource.removeListener("fetch", this.setItem);
        this.props.dataSource.removeListener("init", this.setItem);
        this.props.dataSource.removeListener("pagination", this.setItemPaginate);
        this.props.dataSource.removeListener("sort", this.sort);
        this.props.dataSource.removeListener("add", this.setItem);
        this.props.dataSource.removeListener("filter", this.setItem);
        this.props.dataSource.removeListener("delete", this.setItem);
        this.props.dataSource.removeListener("loadingData", this.displaySpinner);
        this.props.dataSource.removeListener("select", this.handleChangeSelectedItems.bind(this));
        this.remove(UPDATE_COLUMN_VISIBILITY, this.updateColumnVisibility);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("rendu du tableau ", this.state.onSubmit ? "avec un formulaire" : "sans formulaire");

        // On réinitialise les tableau des ref liées aux Tr
        this.tableTrsRef = [];

        // lorque la fonction submit est definit, on met le content dans un composant form
        return (
            this.state.onSubmit && !this.props.withoutForm ?
                <Form ref="lineForm" hideButtons={true} className="form-table" schema={this.state.schema}
                      notifId={this.state.notifId} onSubmit={this.handleSubmit} isMandatoryFieldsHidden={true}>
                    {this.renderContent()}
                </Form> : this.renderContent()
        );
    }

    /**
     * Calcule le nombre de colonnes à afficher
     * @returns {number}
     */
    getTotalColumnsVisible(): number {
        let nbColumns: number = this.getChildrenOf(Columns).length;
        if (this.hiddenColumns) {
            nbColumns -= _.keys(_.pickBy(this.hiddenColumns, _.identity)).length;
        }
        return nbColumns;
    }

    /**
     * Calcule le nombre de colonnes à afficher
     * @returns {number}
     */
    getTotalColumnsVisibleFromState() {
        let visibleColumnState = this.columnsWithVisibilityMap.filter((columnState) => {
            if (columnState.isVisible) {
                return true;
            }
        });
        return visibleColumnState.length;
    }

    /**
     * Méthode permettant de mettre à jour le nombre de colonnes
     * @param hiddenColumns
     */
    handleChangeHiddenColumns(hiddenColumns) {
        this.hiddenColumns = hiddenColumns;
        this.totalColumns = this.getTotalColumnsVisible();
    }

    /**
     * met a true la props isEditing a true lorsque la cellule est en cours d'edition
     * @param lineIndex
     */
    public handleEdition(lineIndex: number) {
        if (Array.isArray(this.tableTrsRef)) {
            this.tableTrsRef.map((tr: any, index: number) => {
                if (tr.instance && tr.instance.classList) {
                    let list = tr.instance.classList;
                    (index === lineIndex) ? list.add("datatable-line-selected") : list.remove("datatable-line-selected");
                }
            });
        }
    }

    /**
     * Méthode qui controle l'affichage et la suppression du spinner
     * @param flag booléen true pour l'afficher false sinon
     */
    displaySpinner(flag: boolean) {
        if (!this.props.hideSpinner) {
            flag ? this.showSpinnerComponent() : this.hideSpinnerComponent();
        }
    }

    /**
     * Méthode permettant de setter les data dans le tableau
     * @param result tableau d'élément
     */
    private setItem(result): void {
        this.props.contentState.setItems(result);
        this.setState({items: result}, () => {
            if (this.tBodyRef && this.tBodyRef.scrollHeight > this.tBodyRef.clientHeight && this.state.items.length > 0) {
                this.props.contentState.emit(ContentState.RESIZE_EVENT, this.props.width - 1.2);
            }
        });
    }

    /**
     * Méthode permettant de setter les data dans le tableau
     * @param result tableau d'éléments
     */
    private setItemPaginate(result): void {
        this.props.contentState.setItems(result.list);
        this.setState({items: result.list}, () => {
            if (this.tBodyRef && this.tBodyRef.scrollHeight > this.tBodyRef.clientHeight && this.state.items.length > 0) {
                this.props.contentState.emit(ContentState.RESIZE_EVENT, this.props.width - 1.2);
            }
        });
    }

    /**
     * Méthode permettant de tri les data
     * @param result tableau d'éléments
     * @param {SortData[]} sortData critères de tri.
     */
    private sort(result: any, sortData: SortData[]): void {
        this.props.contentState.setItems(result);
        this.sortData = sortData;
        this.setState({items: result});
    }

    /**
     * @inheritDoc
     */
    public setDataSource(value: any, callback?: () => any): this {
        this.setState({dataSource: value}, callback);
        return this;
    }

    /**
     * Fonction de validation du formulaire
     * elle rappel la fonction de validation passé dans les props avec l'item qui etait en cours d'edition mis a jour avec les valeurs saisies
     * @param data
     */
    handleSubmit(data: any): void {

        if (this.state.onSubmit) {
            let item = this.props.contentState.itemInEdition;
            // merge les data avec l'item
            for (let name in data) {
                if (item[name]) {
                    item[name] = data[name];
                }
            }

            Promise.resolve()
                .then(() => {
                    this.state.onSubmit(item);
                })
                .then(() => {
                    this.props.contentState.setItemInEdition(null, null);
                });
        }
    }

    /**
     * Rendu du content
     * @returns {any}
     */
    renderContent(): JSX.Element {
        logger.trace("renderContent ");
        let columns = this.initColumnsProps();


        if (this.props.dataSource.results.length > 500) {

            console.log("TROP DE DATA POUR LE TABLEAU");
        }

        let tableProps: any = {
            role: "grid",
            "aria-readonly": "true",
            key: this.props.id,
            id: this.props.id
        };

        let headerTable = this.state.isContentVisible ? this.renderTHeader(columns) : null;

        return (
            <div className="datatable-content" tabIndex={this.state.tabIndex}>
                <SpinnerOverlay ref="spinnerOverlay" isVisible={this.state.spinner}
                                nbColumns={this.getTotalColumnsVisible()}
                                width={this.props.width}/>
                <table {...tableProps}>
                    {this.renderCaption(columns)}
                    {headerTable}
                    {this.renderTBody(columns)}
                </table>

                <Alert ref="alert" message={""}
                       onClickCancel={this.closeAlert}
                       onClickClose={this.closeAlert}/>
            </div>
        );
    }

    /**
     * Rendu HTML du caption avec notion d'ordre de tri (si tri il y a)
     * @param columns
     * @returns {any}
     */
    renderCaption(columns): JSX.Element {
        let title: string = this.props.title;
        if (this.sortData) {
            columns.map((column) => {
                if (column.props) {
                    let sortColumn = _.find(this.sortData, {key: column.props.keyColumn});
                    if (sortColumn) {
                        title += ":" + this.i18n("table.sortedByTitle", {columnTitle: column.props.title}) + " ";
                        title += sortColumn.dir == SortDirection.ASC ? this.i18n("table.ascending") : this.i18n("table.descending");
                    }
                }
            });
        }

        return (
            <caption className={"hidden"}>{title}</caption>
        );
    }

    /**
     * Evènement permettant de déclencher le tri
     * @param sortData
     */
    public onSort(sortData: SortData) {

        let conf: any = sortData;
        this.sortData = [sortData];

        if (this.state.clientSideSorting) {
            conf.clientSideSorting = true;
        }

        (this.props.dataSource as DataSource<any>).sort([sortData]);
    }

    /**
     * Rendu du header du tableau HTML
     * @param columns: colonnes déclarées dans le composant Page
     * @returns {any}
     */
    renderTHeader(columns): JSX.Element {

        let classnameThead = classNames({
            "datatable-columns": !this.state.headerFixed,
            "datatable-columns-fixed": this.state.headerFixed && this.state.items.length > 0,
            "datatable-columns-disabled": this.state.items.length == 0
        });

        let tHeadProps: any = {
            className: classnameThead,
            id: this.props.id + "-thead"
        };

        return (
            <thead {...tHeadProps}>
            <tr id={this.props.id + "-tr-header"}>
                {this.renderRowHeader(columns)}
            </tr>
            <SpinnerLoader ref="spinnerLoader"
                           isVisible={this.state.spinner}
                           className={this.props.id}
                           nbColumns={this.getTotalColumnsVisible()}
            />
            </thead>
        );
    }

    /**
     * Rendu HTML d'un ligne du composant Table
     * @param columns: colonnes déclaréesisContentVisible dans le composant Page
     * @returns {any}
     */
    renderRowHeader(columns: Array<React.ReactElement<any>>) {
        let Ths = [];
        logger.trace("renderRowHeader ");

        let selectedElements = this.props.dataSource ? this.props.dataSource.selected : [];

        columns.map((column: any, index: number) => {

            let props: any = this.getColProps(columns, index);
            let sortColumn = _.find(this.sortData, {key: (column.props as ColumnProps).keyColumn});
            if (this.sortData && sortColumn) {
                (props as ColumnProps).sortData = sortColumn;
            }
            // si la colonne ne contient que le checkBox, on applique pas (text-overflow: ellipsis;)
            if ((column as React.ReactElement<any>).type == CheckColumn) {
                props.className = classNames({"datatable-header-no-text-overflow": true});
            }

            props.isSelected = ArrayUtils.isInclude(this.props.contentState.items, selectedElements);
            props.onSort = this.onSort.bind(this);
            props.cellCoordinate = new CellCoordinates(index, -1);
            props.isHeader = true;
            props.style = props.style || column.props.style;
            props.key = this.state.id + "-" + props.cellCoordinate.row + "-" + props.cellCoordinate.column + "-wrapped";
            let Wrapped = HornetComponent.wrap(column.type, column, props, column.props);
            let col = <Wrapped key={"wc-" + props.key}/>;
            Ths.push(col);
        });

        return Ths;
    }

    renderDatatableMessage(content): JSX.Element {
        logger.trace("renderDatatableMessage ");
        let tdProps: React.AllHTMLAttributes<HTMLElement> = {};
        tdProps.colSpan = this.totalColumns;
        tdProps.className = classNames({"datatable-message-content": true, "txtcenter": true});
        tdProps.style = {width: this.state.width + UNIT_SIZE};
        return (
            <tr key="emptyRow">
                <td {...tdProps}>{content}</td>
            </tr>);
    }

    /**
     * Crée le body du tableau HTML
     * @param columns
     * @returns {any}
     */
    renderTBody(columns): JSX.Element {
        logger.trace("renderTBody ");
        let rows = [];
        if (!(this.state.items && this.state.items.length > 0 && this.state.isContentVisible)) {
            // Cas d'un tableau sans résultats
            rows.push(this.renderDatatableMessage(this.state.emptyResult || this.i18n("table.emptyResult")));
        } else {
            this.state.items.map((item, lineIndex) => {

                let rowBefore = this.renderExpandableRow(item, columns, lineIndex, true);
                if (rowBefore) {
                    rows.push(rowBefore);
                }

                rows.push(this.renderRowBody(item, columns, lineIndex));

                let rowAfter = this.renderExpandableRow(item, columns, lineIndex);
                if (rowAfter) {
                    rows.push(rowAfter);
                }
            });
        }

        let classNameTbody = classNames({
            "datatable-data": !this.props.headerFixed,
            "datatable-data-fixed": this.state.headerFixed && this.state.items.length > 0
        });
        let tBodyProps: any = {
            className: classNameTbody,
            ref: (element) => this.tBodyRef = element
        };
        // if (!this.props.headerFixed) {
        //     tBodyProps.style = {
        //         width: this.props.width + UNIT_SIZE
        //     }
        // }

        return (
            <tbody {...tBodyProps} >{rows}</tbody>);
    }

    /**
     * Rendu HTML d'une ligne LineAfter
     * @param item
     * @param columns
     * @param lineIndex
     * @param isBefore
     * @returns {any}
     */
    renderExpandableRow(item: any, columns: Array<React.ReactElement<any>>, lineIndex: number, isBefore?: boolean): JSX.Element {
        logger.trace("renderExpandableRow ");
        let ComponentType = isBefore ? LineBefore : LineAfter;
        let rowType: string = isBefore ? "before" : "after";
        let cells = [], row = null;

        columns.map((column, index) => {

            let children: any[] = Content.getChildrenFrom(column, ComponentType);
            if (children && Array.isArray(children) && children.length > 0) {
                let LineComponent: any = Content.getComponentFromParentBy(column, ComponentType);

                if (!LineComponent.props.visible || (LineComponent.props.visible && LineComponent.props.visible(item))) {
                    let colSpan: number = this.totalColumns;

                    let kids = [];

                    children.map((child, i) => {
                        let Wrapped = Content.wrap(
                            child.type,
                            child,
                            child.props,
                            {
                                value: item,
                                rowType: rowType,
                                key: this.props.id + "expandable-line-wrapped" + index + "-" + i + "-" + lineIndex
                            });
                        kids.push(<Wrapped/>);
                    });

                    cells.push(
                        <td colSpan={colSpan}
                            key={this.props.id + "-expandable-line-cell" + rowType + "-" + lineIndex}>
                            <div>{kids}</div>
                        </td>);

                    let key: string = this.props.id + "-expandable-line-" + rowType + "-" + lineIndex;

                    let TrClassName: ClassDictionary = {
                        "datatable-expandable-line": true,
                        "datatable-expandable-line-hidden": !LineComponent.props.displayed,
                        "datatable-expandable-line-displayed": LineComponent.props.displayed
                    };

                    TrClassName[this.props.id + "-tr-with-colspan"] = true;

                    let trProps: any = {
                        ref: (instance: HTMLTableCellElement) => {
                            if (instance) {
                                // referme les lignes expanded.
                                instance.classList.add("datatable-expandable-line-hidden");
                                instance.classList.remove("datatable-expandable-line-displayed");
                            }
                        },
                        style: {},
                        id: key,
                        key: key,
                        className: classNames(TrClassName)
                    };

                    row = <tr {...trProps}>{cells}</tr>;
                }
            }
        });

        return row;
    }

    /**
     * Rendu HTML d'une ligne de tableau
     * @param item
     * @param columns
     * @param lineIndex
     * @returns {any}
     */
    renderRowBody(item: any, columns: Array<React.ReactElement<any>>, lineIndex: number) {
        logger.trace("renderRowBody ");

        let tds = [];

        let classNamesRow: ClassDictionary = {};

        let isSelected = ArrayUtils.getIndexById(this.props.dataSource.selected, item) !== -1;

        // Injection de la class CSS surchargée
        if (this.state.customRowsClass) {
            classNamesRow = this.state.customRowsClass(item);
        }
        classNamesRow["datatable-odd"] = (lineIndex % 2) != 0;
        classNamesRow["datatable-even"] = (lineIndex % 2) == 0;

        columns.map((column: any, index) => {

            let props = this.getColProps(columns, index);
            props.value = item;
            props.isSelected = isSelected;
            props.cellCoordinate = new CellCoordinates(index, lineIndex);
            props.key = this.props.id + "-columns-colBody-" + props.cellCoordinate.row + "-" + props.cellCoordinate.column + "-wrapped";
            props.style = props.style || column.props.style;

            // TODO: voi si on peut accéder aux propriétés d'un ActionColumn et s'assurer qu'elles matchent avec l'interface
            if ((column as React.ReactElement<any>).type === ActionColumn
                || (column as React.ReactElement<any>).type === EditionActionColumn) {
                props.showAlert = this.showAlert;
            }

            let Wrapped = HornetComponent.wrap(column.type, column, props, column.props);
            let wrappedElement = <Wrapped key={"wc-" + props.key}/>;
            tds.push(wrappedElement);
        });

        let trProps: any = {
            ref: (instance: HTMLTableCellElement) => {
                if (instance) {
                    this.tableTrsRef.push({"instance": instance, "value": item});
                    Content.updateClasslistSelectedLine(instance, isSelected);
                }
            },
            key: this.props.id + "-line-" + lineIndex,
            className: classNames(classNamesRow),
            role: "row"
        };

        return (
            <tr {...trProps}>
                {tds}
            </tr>
        );
    }

    /**
     * Evènement lancé lors d'une déctection de sélection de ligne: ajout/suppression d'une class
     */
    handleChangeSelectedItems(selectedItems: any[]) {
        this.tableTrsRef.map((element: any) => {
            if (element && element.instance.classList) {
                if (_.findIndex(selectedItems, {"id": element.value.id}) !== -1) {
                    if (!element.instance.classList.contains("datatable-line-selected")) {
                        element.instance.classList.add("datatable-line-selected");
                    }
                } else if (element.instance.classList.contains("datatable-line-selected")) {
                    element.instance.classList.remove("datatable-line-selected");
                }
            }
        });
    }

    /**
     * Initialisation des colonnes et des propriétés associées
     * @returns {columns}
     */
    initColumnsProps() {
        logger.trace("initColumnsProps ");
        let columns = this.getChildrenOf(Columns);
        if (this.props.headerFixed) {
            columns = this.fixColumnsWidth(columns);
        }
        return columns;
    }

    /***
     * Méthode permettant de fixer la largeur des colonnes dans le cas d'un header Fixe
     * @param columns
     * @returns {any}
     */
    fixColumnsWidth(columns) {
        logger.trace("fixColumnsWidth ");
        let totalColumnWidth: number = this.state.width;
        let nbColumnsWithoutDefaultWidth = 0;

        columns.map((cell) => {
            if (cell.props.width) {
                totalColumnWidth = totalColumnWidth - cell.props.width;
            } else {
                nbColumnsWithoutDefaultWidth++;
            }
        });

        let defaultColumnWidth = totalColumnWidth / nbColumnsWithoutDefaultWidth;

        columns.map((cell, index) => {
            if (!cell.props.width) {
                columns[index].props.width = defaultColumnWidth;
            }
        });

        return columns;
    }

    /**
     * Modifie le mode d'accessibilité au clavier
     * @param mode NAVIGATION ou ACTIONABLE
     */
    private handleChangeKeyboardMode(mode: KeyboardInteractionMode): void {
        /* La condition permet d'éviter de mettre à jour inutilement l'état React et ainsi de déclencher un rendu complet */
        if (mode != this.state.keyboardMode) {
            this.setState({
                keyboardMode: mode
            });
        }
    }

    /**
     * Méthode premettant d'afficher le spinner
     * @returns {Table}
     */
    showSpinnerComponent(): this {
        (this.refs.spinnerLoader as SpinnerLoader<SpinnerTableProps, SpinnerTableProps>).progress(true);
        (this.refs.spinnerOverlay as SpinnerOverlay<SpinnerTableProps, SpinnerTableProps>).progress(true);
        return this;
    }

    /**
     * Méthode premettant de masquer le spinner
     * @returns {Table}
     */
    hideSpinnerComponent(): this {
        (this.refs.spinnerLoader as SpinnerLoader<SpinnerTableProps, SpinnerTableProps>).progress(false);
        (this.refs.spinnerOverlay as SpinnerOverlay<SpinnerTableProps, SpinnerTableProps>).progress(false);
        return this;
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
     *  Méthode permettant de cocher/décocher une(des) ligne(s) du tableau
     * @param item (l'item selectioonné : deselectioné)
     * @param selectAll (le teoggle de selection multiple
     */
    protected toggleSelectLines(item: any, selectAll?: boolean) {
        // recupere la liste des items selectionnés sur la page courante
        let selectedItems: any[] = ArrayUtils.intersectionWith(this.props.dataSource.selected, this.state.items);

        if (item) { // si on a un item, on met a jour la liste des items selectionés sur la page
            this.removeOrPush(selectedItems, item, true);
        } else if (selectAll) { // sinon s'il faut sélectionner tous les items
            selectedItems = this.state.items;
        } else {
            this.state.items.map((item) => { // sinon, on deselection tous les items
                this.removeOrPush(selectedItems, item);
            });
        }

        this.props.dataSource.select(selectedItems);
    }

    /***
     *
     * @param coordinates coordonnées de la cellule qui a déclenché la navigation
     * @param direction sens de la direction choisie
     */
    protected navigateToCell(coordinates: CellCoordinates, direction: NavigateDirection): void {
        let focusCell: CellCoordinates = null;
        let targetColumn: number;
        let columnState: ColumnState;
        switch (direction) {
            case NavigateDirection.BOTOM:
                focusCell = new CellCoordinates(coordinates.column, Math.min(this.state.items.length, coordinates.row + 1));
                break;
            case NavigateDirection.TOP:
                focusCell = new CellCoordinates(coordinates.column, Math.max(-1, coordinates.row - 1));
                break;
            case NavigateDirection.LEFT:
                targetColumn = coordinates.column - 1;
                columnState = this.columnsWithVisibilityMap[targetColumn];
                while (columnState && !columnState.isVisible) {
                    targetColumn -= 1;
                    columnState = this.columnsWithVisibilityMap[targetColumn];
                }
                if (columnState) {
                    focusCell = new CellCoordinates(targetColumn, coordinates.row);
                }
                break;
            case NavigateDirection.RIGHT:
                targetColumn = coordinates.column + 1;
                columnState = this.columnsWithVisibilityMap[targetColumn];
                while (columnState && !columnState.isVisible) {
                    targetColumn += 1;
                    columnState = this.columnsWithVisibilityMap[targetColumn];
                }
                if (columnState) {
                    focusCell = new CellCoordinates(targetColumn, coordinates.row);
                }
                break;
            case NavigateDirection.HOME_COL:
                targetColumn = 0;
                columnState = this.columnsWithVisibilityMap[targetColumn];
                while (columnState && !columnState.isVisible) {
                    targetColumn += 1;
                    columnState = this.columnsWithVisibilityMap[targetColumn];
                }
                focusCell = new CellCoordinates(targetColumn, coordinates.row);
                break;
            case NavigateDirection.END_COL:
                targetColumn = this.columnsWithVisibilityMap.length - 1;
                columnState = this.columnsWithVisibilityMap[targetColumn];
                while (columnState && !columnState.isVisible) {
                    targetColumn -= 1;
                    columnState = this.columnsWithVisibilityMap[targetColumn];
                }
                focusCell = new CellCoordinates(targetColumn, coordinates.row);
                break;
            case NavigateDirection.HOME_LINE:
                focusCell = new CellCoordinates(coordinates.column, 0);
                break;
            case NavigateDirection.END_LINE:
                let items = this.state.items;
                focusCell = new CellCoordinates(coordinates.column, items.length - 1);
                break;
        }

        //verifier que la table n'est pas en edition
        //sinon verifier que la cellule n'est pas disabled
        if (!this.props.contentState.itemInEdition) {
            this.props.contentState.setFocusOn(focusCell);
        } else if (focusCell.row === this.props.contentState.itemInEdition.row) {
            this.props.contentState.setFocusOn(focusCell);
        }
    }

    /***
     * Méthode permettant de récupérer les propriétés d'une cellule
     * @param columns: colonnes déclarées dans le composant Page
     * @param columnIndex: Index de colonne
     * @returns {any} Propriétés d'une cellule
     */
    getColProps(columns: any, columnIndex: number): any {
        logger.trace("getColProps ");

        let props: any = {};

        props.coordinates = {column: columnIndex};
        props.handleChangeKeyboardMode = this.handleChangeKeyboardMode;
        props.toggleSelectLines = this.toggleSelectLines.bind(this);
        props.nbColumns = columns.length;
        props.actionMassEnabled = this.state.actionMassEnabled;
        props.navigateFct = this.navigateToCell.bind(this);
        props.keyboardMode = this.state.keyboardMode;
        props.headerFixed = this.props.headerFixed;
        props.contentState = this.props.contentState;
        props.dataSource = this.props.dataSource;
        props.id = this.props.id;


        let style:any = Content.mergeObjects({}, columns[columnIndex].props.style);

        if (columns[columnIndex].props.width) {
            style["width"] =  columns[columnIndex].props.width;
        }

        // Permet de masquer des colonnes par défaut
        if (this.hiddenColumns && this.hiddenColumns[columns[columnIndex].props.keyColumn]) {
            style.display = "none";
            this.hiddenColumns["hidden_" + columnIndex] = props.keyColumn;
        } else {
            style.display = "table-cell";
        }

        props.style = Content.mergeObjects(columns[columnIndex].props.defaultStyle, style);

        return props;
    }

    /**
     * permet de supprimer ou d'ajouter l'item dans la liste selectedItems
     * et de le supprimer dans le dataSource.
     * @param selectedItems
     * @param item
     * @param orPush
     */
    private removeOrPush(selectedItems: any[], item: any, orPush?: boolean) {
        let indexOf = ArrayUtils.getIndexById(selectedItems, item);
        if (indexOf !== -1) {
            selectedItems.splice(indexOf, 1);
            this.props.dataSource.removeUnSelectedItem(item);
        } else if (orPush) {
            selectedItems.push(item);
        }
    }

    /**
     * Méthode qui met a jour le style css pour la selection des lignes
     * @param instance
     * @param isSelected
     */
    static updateClasslistSelectedLine(instance: HTMLTableCellElement, isSelected: boolean): void {
        if (isSelected && !instance.classList.contains("datatable-line-selected")) {
            instance.classList.add("datatable-line-selected");
        } else if (!isSelected) {
            instance.classList.remove("datatable-line-selected");
        }
    }

    /**
     * met à jour la visibilité d'une colonne dans la collection référentielle
     * Cette méthode est déclenchée par un HornetEvent
     * @param ev hornetEvent contenant la valeur en booléen sur le visibilité de la colonne
     */
    private updateColumnVisibility(ev: HornetEvent<ColumnState | string>) {
        this.columnsWithVisibilityMap.map((state) => {
            if (typeof ev.detail == "string") {
                if (state.column == ev.detail) {
                    state.isVisible = !state.isVisible;
                }

            } else {
                let myObject: ColumnState = (ev.detail as ColumnState);
                if (state.column == myObject.column) {
                    state.isVisible = myObject.isVisible;
                }
            }
        });
        this.setFirstVisibleColumnState();
    }

    /**
     * Initilisation des états de visibilité des colonnes
     * On commence à true car les colonnes masquées par défaut
     * seront traitées dans le ToggleColumnsButton
     * et que celles ne pouvant pas être maquées et donc toujours visibles
     * ne sont pas gérées dans le ToggleColumnsButton
     */
    private initializeColumnVisibilityWithCoord() {
        let columns: any[] = this.getChildrenOf(Columns);
        columns.forEach((column, index) => {
            if (column) {
                this.columnsWithVisibilityMap.push({
                    column: column.props.keyColumn,
                    coordinates: index,
                    isVisible: true
                });
            }
        });
        this.setFirstVisibleColumnState();
    }

    /**
     * Propage dans le contentState le columnState de la première column visible
     *
     */
    private setFirstVisibleColumnState(): void {
        let visibleColumnStates = this.columnsWithVisibilityMap.filter((column) => {
            if (column.isVisible) {
                return true;
            }
        });
        this.props.contentState.setFirstVisibleColumnState(visibleColumnStates[0]);
    }
}