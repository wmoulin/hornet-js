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
 * hornet-js-core - Ensemble des composants qui forment le coeur de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as nodeUtil from "util";
import * as _ from "lodash";

const logger: Logger = Utils.getLogger("hornet-js-core.event.hornet-event");

declare global {
    interface Window {
        CustomEvent: CustomEvent;
        Event: Event;
    }
}

/* Inclusion du polyfill pour support du constructeur CustomEvent pour IE >= 9 */
if (typeof window !== "undefined" && typeof window.CustomEvent !== "function" && document.createEvent) {
    (function () {
        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = (window.Event as any).prototype;
        window.CustomEvent = CustomEvent as any;
    })();
}


/**
 * Reprend la structure de la classe Event JavaScript
 */
export class BaseEvent {
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    currentTarget: EventTarget;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    returnValue: boolean;
    srcElement: Element;
    target: EventTarget;
    timeStamp: number;
    type: string;
    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) {};
    preventDefault() {}
    stopImmediatePropagation() {}
    stopPropagation() {}
    static AT_TARGET: number;
    static BUBBLING_PHASE: number;
    static CAPTURING_PHASE: number;
    constructor(type: string, eventInitDict?: EventInit) {};
}

if (!Utils.isServer) {
    nodeUtil.inherits(BaseEvent, Event);
}

export class HornetEvent<EventDetailInterface> extends BaseEvent {
    // héritage de BaseEvent pour permettre l'autocomplétion/compilation typescript sur les attributs classiques des Event
    // même si en réalité c'est pas directement un HornetEvent qui est déclenché mais un clone
    name:string;
    detail:EventDetailInterface;

    constructor(name:string) {
        super(name);
        this.name = name;
    }

    /**
     * @returns {HornetEvent<EventDetailInterface>} un clone de cet évènement
     */
    private clone():HornetEvent<EventDetailInterface> {
        var cloned:HornetEvent<EventDetailInterface> = new HornetEvent<EventDetailInterface>(this.name);
        /* On ne peut cloner les autres attributs : cela déclenche une erreur de type Illegal invocation*/
        return cloned;
    }

    /**
     * @param data détail de l'évènement à créer
     * @returns {HornetEvent} un clone de cet évènement alimenté avec le détail indiqué
     */
    withData(data:EventDetailInterface):HornetEvent<EventDetailInterface>  {
        /* Avec Chrome 50, on ne peut utiliser clone ou cloneDeep sur une instance de Event :
        en effet Event.toString() renvoie  [object Event], et cette signature ne fait pas partie des éléments
        clonables de lodash
        (cf. lodash.baseCLone() : https://github.com/lodash/lodash/blob/master/dist/lodash.js#L2330
        et https://github.com/lodash/lodash/blob/master/dist/lodash.js#L70)
        */
        //var cloneEvent = _.clone(this, 1);
        var cloneEvent:HornetEvent<EventDetailInterface> = this.clone();
        cloneEvent.detail = data;
        return cloneEvent;
    }
}

export function listenWindowEvent(eventName:string, callback:EventListener, capture:boolean = true) {
    window.addEventListener(eventName, callback, capture);
}

export function listenOnceWindowEvent(eventName:string, callback:EventListener, capture:boolean = true) {
    var wrapped = function() {
        // on supprime le listener pour simuler l'écoute unique de l'évènement
        removeWindowEvent(eventName, wrapped, capture);
        callback.apply(undefined, arguments);
    };
    listenWindowEvent(eventName, wrapped, capture);
}

export function removeWindowEvent(eventName:string, callback:EventListener, capture:boolean = true) {
    window.removeEventListener(eventName, callback, capture);
}

export function listenHornetEvent<T extends HornetEvent<any>>(event:T, callback:(ev:T)=>void, capture:boolean = true) {
    if (!Utils.isServer) {
        listenWindowEvent(event.name, callback as any, capture);
    } else {
        logger.warn("HornetEvent.listenHornetEvent can't be called from nodejs !!");
    }
}

export function listenOnceHornetEvent<T extends HornetEvent<any>>(event:T, callback:(ev:T)=>void, capture:boolean = true) {
    if (!Utils.isServer) {
        listenOnceWindowEvent(event.name, callback as any, capture);
    } else {
        logger.warn("HornetEvent.listenOnceHornetEvent can't be called from nodejs !!");
    }
}

export function removeHornetEvent<T extends HornetEvent<any>>(event:T, callback:(ev:T)=>void, capture:boolean = true) {
    if (!Utils.isServer) {
        removeWindowEvent(event.name, callback as any, capture);
    } else {
        logger.warn("HornetEvent.removeWindowEvent can't be called from nodejs !!");
    }
}

export function fireHornetEvent<T extends HornetEvent<any>>(event:T, eventOptions:any = {}) {
    if (!Utils.isServer) {

        var ev = new CustomEvent(event.name, _.assign({
                detail: event.detail
            }, {
                bubbles: true,
                cancelable: true
            },
            eventOptions
        ));

        window.dispatchEvent(ev);
    } else {
        logger.warn("HornetEvent.fireHornetEvent can't be called from nodejs !!");
    }
}

export interface RequestEventDetail {
    inProgress: boolean;
}

export var ASYNCHRONOUS_REQUEST_EVENT = new HornetEvent<RequestEventDetail>("ASYNCHRONOUS_REQUEST");
export var ASYNCHRONOUS_REQUEST_EVENT_COMPONENT = new HornetEvent<RequestEventDetail>("ASYNCHRONOUS_REQUEST_COMPONENT");

export class ServiceEvent {
    public static setRequestInProgress(inProgress:boolean) {
        fireHornetEvent(ASYNCHRONOUS_REQUEST_EVENT.withData({inProgress:inProgress}));
    }
    public static setRequestComponentInProgress(inProgress:boolean) {
        fireHornetEvent(ASYNCHRONOUS_REQUEST_EVENT_COMPONENT.withData({inProgress:inProgress}));
    }
}

export interface ChangeUrlWithDataEventDetail { url: string; data: any, cb: () => void }
export var CHANGE_URL_WITH_DATA_EVENT = new HornetEvent<ChangeUrlWithDataEventDetail>("CHANGE_URL_WITH_DATA_EVENT");