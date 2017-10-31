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
import { ASYNCHRONOUS_REQUEST_EVENT_COMPONENT } from "hornet-js-core/src/event/hornet-event";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { RequestEventDetail } from "hornet-js-core/src/event/hornet-event";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.spinner.spinner-component");


/**
 * Propriétés du spinner
 */
export interface SpinnerProps extends HornetComponentProps {
    /** Temps d'attente minimal (en ms) avant affichage */
    minimalShowTimeInMs?: number;

    /** Titre de la fenêtre modale*/
    loadingTitle?: string;

    /** Texte affiché dans la modale */
    loadingText?: string;

    /** Image d'attente */
    imageLoadingUrl?: string;

    /** visibilité */
    isVisible?: boolean;

}

/**
 * Composant affichant une image (par défaut une roue dentée animée) et un texte d'attente
 * dans une fenêtre modale en attendant la fin d'une action longue.
 */
export class SpinnerComponent<P extends SpinnerProps, S extends SpinnerProps>  extends HornetComponent<SpinnerProps, SpinnerProps> {

    /** Décompte le nombre d'évènements en attente de terminaison */
    protected count: number = 0;

    /**delay permettant de decaler dans le temps les demandes d'affichage du spinner fixé à 500ms (optimisation)*/
    protected static defaultProps = {
        minimalShowTimeInMs: 500
    };

    constructor(props?: P, context?: any) {
        super(props, context);
        this.copyInitialPropsToState(({isVisible: props.isVisible ? props.isVisible : false} as P), this.state);
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.listen(ASYNCHRONOUS_REQUEST_EVENT_COMPONENT, this.asyncRequestEventTreatment);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.remove(ASYNCHRONOUS_REQUEST_EVENT_COMPONENT, this.asyncRequestEventTreatment);
    }

    protected asyncRequestEventTreatment(ev: HornetEvent<RequestEventDetail>) {
        this.progress(ev.detail.inProgress);
    }

    /**
     * @inheritDoc
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isVisible !== nextState.isVisible;
    }


    /**
     * gestion des compteurs d'affichage/fermeture du spinner
     */
    public progress(inProgress: boolean) {
        logger.trace("spinnerCount", this.count, "inProgressFlag", inProgress);
        if (inProgress) {
            this.count++;
            this.openSpinner();
        } else {
            this.count--;
            if (this.count === 0)
                this.closeSpinner();
        }
    }

    /**
     * Affichage Spinner
     */
    openSpinner() {
        if (this.count > 0) {
            this.setState({isVisible: true});
        }
    }

    /**
     * Fermeture Spinner
     */
    closeSpinner() {
        this.setState({isVisible: false});
    }


    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            ( this.state.isVisible && this.count > 0) ?
                <div className="component-spinner">
                    <div>{this.getLoadingText()}</div>
                    <img src={this.getSpinnerImage()} alt={this.getLoadingTitle()}/>
                </div> : <div/>
        );
    }

    /**
     * Return l'url de l'image spinner
     * @returns Url image spinner
     * @private
     */
    protected getSpinnerImage(): string {
        return this.props.imageLoadingUrl || HornetComponent.genUrlTheme("/components/img/spinner/spinner.gif");
    }

    /**
     * Extrait le libelle loadingText passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    protected getLoadingText(): string {
        return this.props.loadingText || this.i18n("spinner.loadingText");
    }

    /**
     * Extrait le libelle loadingTitle passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns Titre
     * @private
     */
    protected getLoadingTitle(): string {
        return this.props.loadingTitle || this.i18n("spinner.loadingTitle");
    }
}