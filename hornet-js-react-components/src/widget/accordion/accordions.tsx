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
import * as classNames from "classnames";
import { Accordion, TAB_ID_NAME } from "src/widget/accordion/accordion";
import { GroupComponent, GroupComponentProps } from "src/widget/group/abstract-group-component";
import * as _ from "lodash";


const logger = Utils.getLogger("hornet-js-react-components.widget.accordion.accordions");

export interface AccordionsProps extends GroupComponentProps {
    multiSelectable?: boolean;
    beforeHideAccordion?: (accordionRef?: Accordion, index?: number) => void;
    afterShowAccordion?: (accordionRef?: Accordion, index?: number) => void;
}

export class Accordions<P extends AccordionsProps> extends GroupComponent<AccordionsProps, any> {

    static defaultProps = {
        id: "accordion",
        multiSelectable: false
    };

    protected oltTabIxFocused: number;

    /** liste des instances Accordion*/
    private accordionList: Array<Accordion> = [];

    constructor(props?: P, context?: any) {
        super(props, context);
        this.state.visibleAccordion = this.initializeAccordions();
        this.state.tabIndex = [];
    }

    initializeAccordions() {
        let visibleAccordion = [];
        React.Children.map(this.state.children, (child: any) => {
            visibleAccordion.push(child.props.isOpen);
        });

        return visibleAccordion;
    }

    componentWillReceiveProps(nextProps, nextContext: any) {
        super.componentWillReceiveProps(nextProps, nextContext);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("Rendu accordion, Nombre de composants fils =", React.Children.count(this.state.children));

        this.state.totalAccordion = React.Children.count(this.state.children);

        let classNameUl = classNames({
            "accordion": true
        });

        return (
            <div>
                <ul className={classNameUl} id={this.state.id}>
                    {this.renderAccordion()}
                </ul>
            </div>
        );
    }


    /**
     * controle de l'action sur le clique
     * @param index
     * @param strDomId
     * @param callback function
     */
    handleClickAccordion(index: number, strDomId = '', callback: any) {
        let accordion;
        let visibleAccordion = _.cloneDeep(this.state.visibleAccordion);
        if (this.state.multiSelectable) {
            visibleAccordion[index] = !visibleAccordion[index];
            if (!visibleAccordion[index]) {
                this.handleBeforeHideAccordion(index);
            }
        } else {
            let cpt = React.Children.count(this.state.children);
            for (let i = 0; i < cpt; i++) {
                if (this.state.visibleAccordion[i]) {
                    this.handleBeforeHideAccordion(i);
                }
                visibleAccordion[i] = (index == i) ? !visibleAccordion[i] : false;
            }
        }

        this.setState({visibleAccordion: visibleAccordion}, () => {
            accordion = _.find(this.accordionList, {props: {panelIndex: index}});
            if (accordion && accordion.state.isOpen && this.props.afterShowAccordion) {
                this.props.afterShowAccordion(accordion, index);
            }
            if (typeof callback === 'function') {
                callback(strDomId);
            }
        });
    }

    private handleBeforeHideAccordion(index: number) {
        let accordion = _.find(this.accordionList, {props: {panelIndex: index}});
        if (accordion && this.props.beforeHideAccordion) {
            this.props.beforeHideAccordion(accordion, index);
        }
    }

    scrollToFocus = (strDomId: any) => {
        let domNode = document.getElementById(strDomId);
        //on se positionne sur l'element ayant l'erreur
        if (domNode) {
            window.scroll(
                domNode.offsetLeft,
                domNode.offsetTop
            );
        }
    }

    /**
     * Action sur le focus de l'accordion
     * @param index
     * @param event
     * @param targetEvent
     */
    handleFocusAccordion = (index: number, event: any, targetEvent: any) => {
        let strDomId = targetEvent.id; // ID de l'element dans le DOM qui declenche le focus
        let isAccordionElement = strDomId.indexOf(TAB_ID_NAME); //vérifie si l'element est un header d'accordion

        if (isAccordionElement == -1) {
            //controle si l'accordion est deja ouvert
            if (!this.state.visibleAccordion[index]) {
                this.handleClickAccordion(index, strDomId, this.scrollToFocus);
            }
        } else {
            let tabIndex = _.cloneDeep(this.state.tabIndex);
            this.state.children.map((child, i) => {
                tabIndex[i] = (i == index ) ? 0 : -1;
            });
            this.setState({tabIndex: tabIndex});
        }
    }

    /**
     * Rendu de l'acorodion
     */
    private renderAccordion() {
        return React.Children.map(this.state.children, (child: any, index) => {
            if (child.type === Accordion) {
                let defaultKey: string = this.state.id + "-" + index;
                let key: string = Accordions.generateKey(child, defaultKey);
                let props = {
                    id: this.state.id + "-",
                    key: key,
                    panelIndex: index,
                    isOpen: this.state.visibleAccordion[index],
                    tabIndex: (this.state.tabIndex[index]),
                    handleClickAccordion: this.handleClickAccordion,
                    handleFocusAccordion: this.handleFocusAccordion,
                    totalAccordion: this.state.children.length,
                    ref: (accordion) => {
                        if (accordion) {
                            this.accordionList.push(accordion);
                        }
                    }
                };
                return React.cloneElement(child, props);
            }
        })
    }
}
