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
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { IHornetComponentAsync } from "hornet-js-components/src/component/ihornet-component";
import { SpinnerComponentInput } from "src/widget/spinner/spinner-component-input";
import { SpinnerProps } from "src/widget/spinner/spinner-component";

const logger = Utils.getLogger("hornet-js-react-components.widget.tab.tab");

/**
 * Propriétés d'un onglet
 */
export interface TabProps extends HornetComponentProps {
    /** Titre de l'onglet (affiché dans la barre d'onglets) */
    title?: string;
    id?: string;
    panelId?: string;
    isVisible?: boolean;
    forceRender?: boolean;
    prefixId?: string;
    index?: number;
    /** Méthode appelée lorsque l'onglet est sélectionné(flag=true) ou désélectionné()*/
    onSelect?: Function;
    onClick?: Function;
    mount?: boolean
}

/**
 * Composant Onglet
 */
export class Tab extends HornetComponent<TabProps, any> implements IHornetComponentAsync {

    static defaultProps = {
        id: "tab",
        forceRender: false,
        spinner: false,
        mount: true
    };

    _status: boolean;

    constructor(props?: TabProps, context?: any) {
        super(props, context);
        if (!this.props.mount) {
            this.state.spinner = true;
            if (this.state.children && this.state.children.props && this.state.children.props.dataSource) {
                if (!this.state.children.props.dataSource.status) {
                    this.state.children.props.dataSource.on("loadingData", (value) => {
                        this.setState({ spinner: value });
                    });
                }
            }
        }
    }


    /**
     * @inheritDoc
     */
    componentDidUpdate(prevProps: any, prevState: any, prevContext: any) {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        if (this.props.onSelect && this.state.isVisible && !prevState.isVisible) {
            this.props.onSelect(this, true);
        }
    }

    /**
     * @inheritDoc
     */
    componentWillUpdate(nextProps: TabProps, nextState: any, nextContext: any): void {
        super.componentWillUpdate(nextProps, nextState, nextContext);
        if (this.props.onSelect && this.state.isVisible != nextState.isVisible && nextState.isVisible === false) {
            this.props.onSelect(this, false);
        }
    }

    displaySpinner(flag: boolean) {
        flag ? this.showSpinnerComponent() : this.hideSpinnerComponent();
    }
    /**
     * Méthode qui permet d'afficher le spinner du composant plutot que celui de la page.
     */
    showSpinnerComponent(): void {
        this.state.spinner = true;
    };
    /**
     * Méthode qui permet de cacher le spinner du composant plutot que celui de la page.
     */
    hideSpinnerComponent(): void {
        this.state.spinner = false;
    };

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        let classNameContent = classNames({
            "tab-panel": true,
            "tab-panel-selected": this.state.isVisible
        });

        return (
            <section key={this.props.prefixId + "sectionTabPanel-" + this.props.index}
                style={{ "display": this.state.isVisible ? "block" : "none" }}
                id={this.props.prefixId + "sectionTabPanel-" + this.props.index}
                role="tabpanel"
                aria-hidden={!this.state.isVisible}
                aria-labelledby={this.props.prefixId + "tabList-item-" + this.props.index}>
                <SpinnerComponentInput ref="spinnerComponent" isVisible={this.state.spinner && this.state.isVisible} />
                {this.state.mount ?
                    <div id={this.state.panelId}
                        className={classNameContent}>
                        {this.state.children}
                    </div>
                    : null}
            </section>)
    }
}
