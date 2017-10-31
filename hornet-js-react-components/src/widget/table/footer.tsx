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
import { ContentState } from "src/widget/table/table-state";
import { Pager } from "src/widget/pager/pager";

const logger: Logger = Utils.getLogger("hornet-js-components.widget.table.footer");

/**
 * Propriétés du composant pagination de tableau Hornet
 */
export interface FooterProps extends HornetComponentProps {
    /** Classe CSS personnalisée */
    className?: string;
    /** contentState de gestion des events d'edition */
    contentState?: ContentState;
    /** indicateur de disabled */
    disabled?: boolean;
}

/**
 * Outils de pagination de tableau
 */
export class Footer extends HornetComponent<FooterProps, any> {

    static defaultProps = {
        className: "hornet-datatable-bottom"
    };

    constructor(props: FooterProps, context?: any) {
        super(props, context);
        this.state.i18n = this.i18n("table");

        // gestion de l'event d'eidtion du tableau
        this.props.contentState.setMaxListeners(Infinity);
        this.handleEdition = this.handleEdition.bind(this);
        this.props.contentState.on(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
    }

    componentWillUnmount() {
        this.props.contentState.removeListener(ContentState.EDITION_CLIC_EVENT, this.handleEdition);
    }

    /**
     * cache le menuActions lorsque la table est en cours d'edition.
     * @param lineIndex
     */
    handleEdition(lineIndex: number): void {
        this.setState({disabled: lineIndex !== undefined && lineIndex !== null});
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.trace("render");

        return (
            <div className={this.state.className} disabled={this.state.disabled}>
                {this.state.disabled ? this.setChildrenDisabled() : this.props.children}
            </div> );
    }

    /**
     * ajoute la props disabled au pager.
     * @returns {Array}
     */
    setChildrenDisabled(): Array<any> {
        let children = [];
        React.Children.map(this.props.children, (child: React.ReactChild) => {
            if ( ( child as React.ReactElement<any> ).type === Pager) {
                children.push(this.wrap(Pager, ( child as React.ReactElement<any> ).props,  {disabled: this.state.disabled}));
            } else {
                children.push(( child as React.ReactElement<any> ).props.children);
            }
        });

        return children;

    }
}
