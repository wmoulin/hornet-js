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

import * as ReactDom from "react-dom";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";
import { MessageItem } from "src/widget/notification/notification-message-item";
import {
    ADD_NOTIFICATION_EVENT,
    CLEAN_ALL_NOTIFICATION_EVENT,
    CLEAN_NOTIFICATION_EVENT
} from "hornet-js-core/src/notification/notification-events";
import { BaseError } from "hornet-js-utils/src/exception/base-error";
import { Accordion } from "hornet-js-react-components/src/widget/accordion/accordion";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.notification.notification");

/**
 * Propriétés du composant Notification
 */
export interface NotificationProps extends HornetComponentProps {
    errorsTitle?: string;
    infosTitle?: string;
    personnalsTitle?: string;
    warningsTitle?: string;
    infos?: any;
    errors?: any;
    warnings?: any;
    exceptions?: Array<BaseError>;
    id: string;
    personnals?: any;
}

export interface NotificationContentState {
    infos?: any;
    warnings?: any;
    errors?: any;
    exceptions?: Array<BaseError>;
    personnals?: any;
    color?: string;
    logo?: string;

}

/**
 * Propriétés du contenu d'une notification
 */
export interface NotificationContentProps extends HornetComponentProps {
    errorsTitle?: string;
    warningsTitle?: string;
    personnalsTitle?: string;
    infosTitle?: string;
    infos?: any;
    warnings?: any;
    errors?: any;
    personnals?: any;
    color?: string;
    logo?: string;
    exceptions?: Array<BaseError>;
}

/**
 * Composant Notification
 */
export class Notification extends HornetComponent<NotificationProps, any> {

    static started = false;
    static INSTANCES = {};
    static ORDER = [];

    static defaultProps = {
        color: "black"
    };

    constructor(props?: NotificationProps, context?: any) {
        super(props, context);
        if (!Notification.started) {
            this.listen(ADD_NOTIFICATION_EVENT, (ev) => {
                let state: NotificationContentState = {};
                if (ev.detail.errors) state.errors = ev.detail.errors.getNotifications();
                if (ev.detail.infos) state.infos = ev.detail.infos.getNotifications();
                if (ev.detail.exceptions) state.exceptions = ev.detail.exceptions;
                if (ev.detail.warnings) state.warnings = ev.detail.warnings.getNotifications();
                if (ev.detail.personnals) {
                    state.personnals = ev.detail.personnals.getNotifications();
                    state.color = ev.detail.personnals.color;
                    state.logo = ev.detail.personnals.logo;
                }

                if (!ev.detail.id || !(ev.detail.id in Notification.INSTANCES)) {
                    ev.detail.id = Notification.ORDER[Notification.ORDER.length - 1];
                }
                Notification.INSTANCES[ev.detail.id].setState(state);
            });

            this.listen(CLEAN_NOTIFICATION_EVENT, (ev) => {
                if (!ev.detail.id || !(ev.detail.id in Notification.INSTANCES)) {
                    ev.detail.id = Notification.ORDER[Notification.ORDER.length - 1];
                }
                if (Notification.INSTANCES[ev.detail.id]) {
                    Notification.INSTANCES[ev.detail.id].setState({
                        infos: null,
                        errors: null,
                        exceptions: null,
                        warnings: null,
                        personnals: null
                    });
                }
            });

            this.listen(CLEAN_ALL_NOTIFICATION_EVENT, (ev) => {
                for (let id in Notification.INSTANCES) {
                    this.fire(CLEAN_NOTIFICATION_EVENT.withData({id: id}));
                }
            });
            Notification.started = true;
        }
    }

    setInfos(infos) {
        this.fire(ADD_NOTIFICATION_EVENT.withData({id: this.state.id, infos: infos}));
    }

    setWarnings(warnings) {
        this.fire(ADD_NOTIFICATION_EVENT.withData({id: this.state.id, warnings: warnings}));
    }

    setErrors(errors) {
        this.fire(ADD_NOTIFICATION_EVENT.withData({id: this.state.id, errors: errors}));
    }

    setExceptions(exceptions) {
        this.fire(ADD_NOTIFICATION_EVENT.withData({id: this.state.id, exceptions: exceptions}));
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <NotificationContent errorsTitle={this.state.errorsTitle}
                                 errors={this.state.errors}
                                 warningsTitle={this.state.warningsTitle}
                                 warnings={this.state.warnings}
                                 personnalsTitle={this.state.personnalsTitle}
                                 personnals={this.state.personnals}
                                 infosTitle={this.state.infosTitle}
                                 infos={this.state.infos}
                                 exceptions={this.state.exceptions}
                                 color={this.state.color}
                                 logo={this.state.logo}
                                 ref={(component) => {
                                     if (component === null) {
                                         delete Notification.INSTANCES[this.state.id];
                                         let idx = Notification.ORDER.indexOf(this.state.id);
                                         Notification.ORDER.splice(idx, 1);
                                     } else {
                                         if (this.state.id in Notification.INSTANCES) {
                                             let idx = Notification.ORDER.indexOf(this.state.id);
                                             Notification.ORDER.splice(idx, 1);
                                         }
                                         Notification.ORDER.push(this.state.id);
                                         Notification.INSTANCES[this.state.id] = component;
                                     }
                                 }}
            />);
    }
}

/**
 * Composant Contenu de Notification
 */
class NotificationContent extends HornetComponent<NotificationContentProps, any> {

    static firstRender = true;

    constructor(props?: NotificationProps, context?: any) {
        super(props, context);
    }


    componentDidMount() {
        super.componentDidMount();
        NotificationContent.firstRender = false;
        this.scrollToNotifications();
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        if (prevState != this.state) {
            this.scrollToNotifications();
        }
        /** Si il y a des notifications de type erreurs, on place le focus sur 1 er champ */
        if (this.state.errors && Array.isArray(this.state.errors) && this.state.errors.length > 0) {
            let element = document.getElementsByName(
                this.state.errors[0].field) ?
                document.getElementsByName(this.state.errors[0].field)[0] :
                document.getElementById(this.state.errors[0].field);
            if (element && element.focus) {
                Accordion.handleFocusOnAccordion(element);
                element.focus();
            } else {
                logger.error("Impossible de mettre le focus sur l'élément", this.state.field);
            }
        }

    }

    /**
     * Fait défiler la page courante de façon à afficher le bloc de notifications
     */
    scrollToNotifications() {
        if (this.state.infos || this.state.errors) {
            let element = ReactDom.findDOMNode(this) as any;
            if (element && element.scrollIntoView) {
                element.scrollIntoView();
            } else {
                logger.warn("Impossible de scroller sur les notifications.");
            }
        }
    }

    /**
     * Rendu d'un message d'erreur
     * @returns {any}
     */
    renderExceptionMessage() {
        let errorMessages = this.state.exceptions.map((exception: BaseError, index) => {
            let text = "";
            let stack;
            try {
                text = exception.message != null && exception.message !== "" ?
                    exception.message : this.i18n("error.message." + exception.code, exception.args);
                stack = this.exceptionStackDev(exception);
            } catch (e) {
                logger.error("Impossible de récupérer l'exception d'origine", e, "Exception d'origine : ", exception);
                text = e.message;
            }
            let messageItemKey = (exception.code) ? exception.code : index;
            return <MessageItem key={messageItemKey} text={text} className="error-message-text">{stack}</MessageItem>;
        });
        return (
            <section>
                <div className="messageBox errorBox error-message">
                    <div>
                        <h1 className="titleError error-message-title">{this._getErrorsTitle()}</h1>
                        <ul className="error-message-list">
                            {errorMessages}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }

    private exceptionStackDev(exception: BaseError) {
        let stack;
        if (process.env.NODE_ENV !== "production") {
            let stackToPrint = (exception.err_cause && exception.err_cause.stack) || exception.stack;
            if (stackToPrint) {
                stack = (
                    <div className="stack-dev">
                        <div className="stack-dev-title">{"Development Stacktrace : "}</div>
                        {stackToPrint.split("\n").map(stackLine => {
                            return <div className="stack-dev-line">{stackLine}</div>;
                        })}
                    </div>
                );
            }
        }
        return stack;
    }

    /**
     * Rendu d'un message d'erreur (rouge)
     * @returns {any}
     */
    renderErrorMessage() {
        let errorMessages = this.state.errors.map((message) => {
            return <MessageItem key={message.id} anchor={message.anchor} {...message} className="error-message-text"/>;
        });
        return (
            <section>
                <div className="messageBox errorBox error-message">
                    <div>
                        <h1 className="titleError error-message-title">{this._getErrorsTitle()}</h1>
                        <ul className="error-message-list">
                            {errorMessages}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * Rendu d'un message d'attention (Orange)
     * @returns {any}
     */
    renderWarningMessage() {
        let warningMessages = this.state.warnings.map((message) => {
            return <MessageItem key={message.id} anchor={message.anchor} {...message}
                                className="warning-message-text"/>;
        });
        return (
            <section>
                <div className="messageBox warningBox warning-message">
                    <div>
                        <h1 className="titleWarning warning-message-title">{this._getWarningsTitle()}</h1>
                        <ul className="warning-message-list">
                            {warningMessages}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }


    /**
     * Rendu d'un message d'information (vert)
     * @returns {any}
     */
    renderInfoMessage() {
        let infoMessages = this.state.infos.map((message) => {
            return <MessageItem key={message.id}  {...message} className="info-message-text"/>;
        });
        return (
            <section>
                <div className="messageBox infoBox info-message">
                    <div>
                        <h1 className="titleInfo info-message-title">{this._getInfosTitle()}</h1>
                        <ul className="info-message-list">
                            {infoMessages}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * Rendu d'un message personnel ( couleur et logo au choix)
     * @returns {any}
     */
    renderPersonnalMessage() {
        let personnalMessages = this.state.personnals.map((message) => {
            return <MessageItem key={message.id} anchor={message.anchor} {...message}
                                className="personnal-message-text"/>;
        });
        return (
            <section>
                <div className="messageBox personnalBox personnal-message"
                     style={{border: "0.063em solid " + this.state.color}}>
                    <div>
                        <h1 className="titlePersonnal personnal-message-title" style={{
                            color: this.state.color,
                            backgroundImage: "url('" + this.state.logo + "')"
                        }}>{this._getPersonnalsTitle()}</h1>
                        <ul style={{color: this.state.color}} className="personnal-message-list">
                            {personnalMessages}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <span>
                {(this.state.exceptions && this.state.exceptions.length > 0) ? this.renderExceptionMessage() : null}
                {(this.state.errors && this.state.errors.length > 0) ? this.renderErrorMessage() : null}
                {(this.state.warnings && this.state.warnings.length > 0) ? this.renderWarningMessage() : null}
                {(this.state.infos && this.state.infos.length > 0) ? this.renderInfoMessage() : null}
                {(this.state.personnals && this.state.personnals.length > 0) ? this.renderPersonnalMessage() : null}
            </span>
        );
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getInfosTitle() {
        return this.state.infosTitle || this.i18n("notification.infosTitle");
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getWarningsTitle() {
        return this.state.warningsTitle || this.i18n("notification.warningsTitle");
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getPersonnalsTitle() {
        return this.state.personnalsTitle || this.i18n("notification.personnalsTitle");
    }

    /**
     * Extrait le libelle valide passé dans les propriétés du composant ou indique un libellé par défaut
     * @returns {*|string|string}
     * @private
     */
    private _getErrorsTitle() {
        return this.state.errorsTitle || this.i18n("notification.errorsTitle");
    }
}