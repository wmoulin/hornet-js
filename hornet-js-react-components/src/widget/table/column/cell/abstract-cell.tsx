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
import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { NavigateDirection } from "src/widget/table/navigation-direction";
import { CellCoordinates } from "src/widget/table/column/cell/cell-coordinates";
import { ContentState } from "src/widget/table/table-state";
import { DataSource } from "hornet-js-core/src/component/datasource/datasource";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import * as _ from "lodash";

export interface AbstractCellProps extends HornetComponentProps {
    id?: string;
    // si une cellule est selectionnée
    isSelected?: boolean;
    // permet de savoir si une cellule du tableau est en cours d'edition
    isEditing?: boolean;
    style?: any;
    // valeur d'une cellule su tableau
    value?: any;
    // les coordonées lign eet colonnes d'une cellule
    coordinates?: CellCoordinates;
    // si une cellule est focus
    isFocused?: boolean;
    toggleSelectLines?: (item: any, selectAll?: boolean) => void; // from content.tsx
    handleChangeKeyboardMode?: any; // from content.tsx
    keyboardMode?: number; // from content.tsx
    contentState?: ContentState; // from content.tsx
    dataSource?: DataSource<any>; // from content.tsx
    keyColumn?: string; // from content.tsx
    handleKeyDown?: () => void; // from content.tsx
    isHeader?: boolean; // from content.tsx
    cellCoordinate?: CellCoordinates; // from content.tsx
    navigateFct?: (CellCoordinates, NavigateDirection) => void; // from content.tsx

}

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.table.column.cell.abstract-cell");

/**
 * Classe abstraite d'une cellule de tableau
 */
export abstract class AbstractCell<P extends AbstractCellProps, S> extends HornetComponent<P, any> {

    /** Référence vers l'élémeent du DOM HTML correspondant à la cellule */
    public tableCellRef: HTMLTableCellElement;

    constructor(props: P, context: any) {
        super(props, context);
        this.state.isFocused = false;
        this.state.isEditing = false;
        this.props.contentState.on(ContentState.FOCUS_CHANGE_EVENT, this.handleFocus);
        this.props.contentState.on(ContentState.BLUR_EVENT, this.handleBlur);

        // chaque cellule ecoute levent de clic sur licone d'edition d'une ligne du tableau
        this.handleEdition = this.handleEdition.bind(this);

        // chaque cellule ecoute l'event de clic sur l'icone d'edition d'une ligne du tableau
        this.props.contentState.on(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return this.state.editable !== undefined && this.state.isEditing !== nextState.isEditing;
    }

    componentWillUnmount() {
        this.props.contentState.removeListener(ContentState.FOCUS_CHANGE_EVENT, this.handleFocus);
        this.props.contentState.removeListener(ContentState.BLUR_EVENT, this.handleBlur);
        this.props.contentState.removeListener(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
    }

    /**
     * Gère les évènements clavier déclenchés par les cellules
     * @param e évènement
     */
    protected handleKeyDown(e: KeyboardEvent): void {
        if ((this.props.toggleSelectLines) && (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
            this.handleKeyDownWithModifier(e);
        } else if (this.props.navigateFct) {
            /* On ne prend en compte que les évènements clavier sans modificateur, pour ne pas surcharger
             * des raccourcis standards tels Alt+ArrowLeft */
            let keyCode: number = e.keyCode;

            let preventDefault: boolean = true;
            /* Implémentation des interactions clavier correspondant au rôle ARIA "grid"
             * (cf. https://www.w3.org/TR/wai-aria-practices/#grid) */
            switch (keyCode) {
                case KeyCodes.RIGHT_ARROW:
                    logger.trace("Focus sur la cellule suivante de la même ligne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.RIGHT);
                    break;
                case KeyCodes.LEFT_ARROW :
                    logger.trace("Focus sur la cellule précédente de la même ligne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.LEFT);
                    break;
                case KeyCodes.DOWN_ARROW :
                    logger.trace("Focus sur la cellule suivante de la même colonne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.BOTOM);
                    break;
                case KeyCodes.UP_ARROW :
                    logger.trace("Focus sur la cellule précédente de la même colonne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.TOP);
                    break;
                case KeyCodes.HOME :
                    logger.trace("Focus sur la première cellule de la ligne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.HOME_COL);
                    break;
                case KeyCodes.END :
                    logger.trace("Focus sur la dernière cellule de la ligne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.END_COL);
                    break;
                case KeyCodes.PAGE_UP :
                    logger.trace("Focus sur la première cellule de la colonne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.HOME_LINE);
                    break;
                case KeyCodes.PAGE_DOWN :
                    logger.trace("Focus sur la dernière cellule de la colonne");
                    this.props.navigateFct(this.props.cellCoordinate, NavigateDirection.END_LINE);
                    break;
                case KeyCodes.ENTER :
                    /* Lorsque la cellule contient un lien ou un bouton, on la touche entrée sert à activer celui-ci */
                    if (e.target != this.tableCellRef[this.props.cellCoordinate.row]) {
                        preventDefault = false;
                        break;
                    }
                default :
                    preventDefault = false;
            }
            /* On supprime le comportement par défaut pour les touches utilisées pour la navigation :
             pour éviter par exemple de faire défiler les ascenseurs */
            if (preventDefault) {
                e.preventDefault();
            }
        }
    }

    /**
     * Gère les évènements clavier déclenchés par les cellules permettant de sélectionner des cellules de tableau
     * @param e évènement clavier
     */
    protected handleKeyDownWithModifier(e: KeyboardEvent): void {
        let preventDefault: boolean = false;
        /* Implémentation des interactions clavier correspondant au rôle ARIA "grid",
         * permettant la sélection de cellules
         * (cf. https://www.w3.org/TR/wai-aria-practices/#grid) */
        switch (e.keyCode) {
            case KeyCodes.SPACEBAR:
                if (e.shiftKey) {
                    logger.trace("Shift + Space : sélection/déselection de la ligne");
                    this.props.toggleSelectLines(this.props.value);
                }
                preventDefault = true;
                break;
            case 65:
                if (e.ctrlKey) {
                    logger.trace("Ctrl + A : sélection/déselection de toutes les lignes");
                    this.props.toggleSelectLines(null, !this.props.isSelected);
                }
                preventDefault = true;
                break;

            case 67: // Gestion de la copie de la cellule dans le presse-papier
                if (e.ctrlKey) {
                    document.addEventListener("copy", (e) => {

                        // Cas d'un champ input
                        let value = this.getInputValue(this.tableCellRef);
                        if (this.tableCellRef && this.tableCellRef.textContent && !value) {
                            value = this.tableCellRef.textContent;
                        }

                        (e as any).clipboardData.setData("text/plain", value);
                        e.preventDefault(); // default behaviour is to copy any selected text
                    });
                    document.execCommand("copy");
                }
                break;
            // TODO à implémenter : Control + Space (sélection de colonne), Shift + Arrow (sélection de cellules contigues)
            // Shift + F8 (ajout de cellule non contigue à la sélection)
        }
        /* On supprime le comportement par défaut pour les raccoourcis de sélection, pour éviter par exemple
         de sélectionner tous les éléments de la page */
        if (preventDefault) {
            e.preventDefault();
        }
    }

    /**
     * Méthode permettant de récupérer la valeur d'un champ input
     * @param node
     * @returns {string}
     */
    getInputValue(node) {

        let value = "";
        if (node && node.children) {
            for (let i = 0; i < node.children.length; i++) {
                if (!value) {
                    if (node.children[i].localName != "input" && node.children[i].children) {
                        value = this.getInputValue(node.children[i]);
                    } else if (node.children[i].localName == "input") {
                        value = node.children[i].value;
                    }
                }
            }
        }

        return value;
    }

    /**
     * met a true la props isEditing a true lorsque la cellule est en cours d'edition
     * @param lineIndex
     */
    handleEdition(lineIndex: number) {
        let nameClass: string = "default-body-cell";
        if (_.isNull(lineIndex)) {
            this.setState({isEditing: false});
            this.tableCellRef.removeAttribute("disabled");
            this.tableCellRef.classList.remove("datatable-cell-in-edition");

        } else if (lineIndex === this.props.cellCoordinate.row) {
            this.setState({isEditing: (lineIndex === this.props.cellCoordinate.row)});
            this.tableCellRef.classList.add("datatable-cell-in-edition");
        } else {
            if (this.tableCellRef.localName == "th") {
                this.tableCellRef.classList.add("is_disabled");
                this.tableCellRef.classList.remove("datatable-header-sortable-column", "datatable-header-sorted", "datatable-header-sorted-asc");
            } else {
                this.tableCellRef.setAttribute("disabled", "true");
            }
        }
    }

    /**
     * Action exécutée sur un click de la checkbox
     * @param e
     */
    handleBlur = (oldCell: CellCoordinates) => {
        if (this.props.cellCoordinate.isSame(oldCell) && this.tableCellRef) {
            this.blurActions(this.tableCellRef);
        }
    };

    /**
     * Méthode encapsulant le traitement qui permet de gerer la perte de focus sur une cellule
     * cette méthode à vocation à permettre la surcharge
     * @param oldCell
     */
    protected blurActions(tableCellRef): void {
        this.setCellTabIndex(tableCellRef, -1);
    }

    /**
     * Mise à jour de l'index de tabulation et positionnement facultatif du focus
     * pour la cellule du tableau
     * @param tableCellRef cellule à atteindre
     * @param value valeur pour tabIndex de la cellule
     * @param isFocus indicateur si le focus doit aussi être appliqué
     */
    protected setCellTabIndex(tableCellRef, value: number, isFocus?: boolean): void {
        if (tableCellRef && tableCellRef.firstChild && (tableCellRef.firstChild as HTMLElement).focus) {
            (tableCellRef.firstChild as HTMLElement).tabIndex = value;
            if (isFocus) {
                (tableCellRef.firstChild as HTMLElement).focus();
            }
        }
        else {
            tableCellRef.tabIndex = value;
            if (isFocus) {
                tableCellRef.focus();
            }
        }
    }

    /**
     * methode qui permet de mettre le focus sur une cellule
     * @param oldCell cellule à vérifier pour un départ
     * @param newCell cellule à vérifier pour l'arrivée
     */
    handleFocus = (oldCell: CellCoordinates, newCell: CellCoordinates) => {
        if (this.props.cellCoordinate) {
            if (this.props.cellCoordinate.isSame(oldCell)) {
                if (this.tableCellRef) {
                    this.tableCellRef.tabIndex = -1;
                }
                this.setState({isFocused: false});
            }
            if (this.props.cellCoordinate.isSame(newCell)) {
                this.setState({isFocused: true}, this.handleCellFocus(this.tableCellRef));
            }
        }
    };

    /**
     * Permet de mettre le focus sur l'AbstractBodyCell
     * Si le contenu de la cellule est de type HTMLElement (button ou input text etc), on place le focus sur cet element
     * sinon on met le focus sur toute la cellule
     */
    handleCellFocus(tableCellRef): any {
        if (tableCellRef) {
            this.setCellTabIndex(this.tableCellRef, 0, true);
        }
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        throw new Error("not use this render !");
    }

    /**
     * @returns {boolean} la valeur de l'attribut HTML tabIndex à attribuer à la cellule
     */
    protected getTabIndex(): number {
        return -1;
    }

}