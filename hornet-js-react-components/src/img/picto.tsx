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

import { HornetComponent } from "src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import * as React from "react";
import * as classNames from "classnames";

export interface PictoProps extends HornetComponentProps {
    picto: string,
    width?: number,
    height?: number,
    className?: string,
    color?: string
}

/**
 * Class permettant la gestion des images en SVG
 */
export class Picto<P extends PictoProps, S> extends HornetComponent<P, any> {

    static defaultProps = {
        width: 24,
        height: 24,
        color: "#000000"
    };

    static black = {
        editer: HornetComponent.genUrlTheme("/img/tableau/black/ico_editer.svg"),
        consulter: HornetComponent.genUrlTheme("/img/tableau/black/ico_consulter.svg"),
        supprimer: HornetComponent.genUrlTheme("/img/tableau/black/ico_supprimer.svg"),
        addCircle: HornetComponent.genUrlTheme("/img/tableau/black/ico_ajouter.svg"),
        settings: HornetComponent.genUrlTheme("/img/picto/black/ico_settings.svg"),
        close: HornetComponent.genUrlTheme("/img/picto/black/ico_close.svg"),
        add: HornetComponent.genUrlTheme("/img/picto/black/ico_add.svg"),
        user: HornetComponent.genUrlTheme("/img/picto/black/ico_user.svg"),
        userCircle: HornetComponent.genUrlTheme("/img/picto/black/account_circle_white.svg")

    };
    static blue = {
        editer: HornetComponent.genUrlTheme("/img/tableau/blue/ico_editer.svg"),
        consulter: HornetComponent.genUrlTheme("/img/tableau/blue/ico_consulter.svg"),
        supprimer: HornetComponent.genUrlTheme("/img/tableau/blue/ico_supprimer.svg"),
        quickEdit: HornetComponent.genUrlTheme("/img/tableau/blue/ico_editer_line.svg"),
        addCircle: HornetComponent.genUrlTheme("/img/tableau/blue/ico_ajouter.svg"),
        settings: HornetComponent.genUrlTheme("/img/picto/blue/ico_settings.svg"),
        close: HornetComponent.genUrlTheme("/img/picto/blue/ico_close.svg"),
        add: HornetComponent.genUrlTheme("/img/picto/blue/ico_add.svg"),
        user: HornetComponent.genUrlTheme("/img/picto/blue/ico_user.svg"),
        userCircle: HornetComponent.genUrlTheme("/img/picto/blue/account_circle_white.svg")

    };
    static white = {
        editer: HornetComponent.genUrlTheme("/img/tableau/white/ico_editer.svg"),
        consulter: HornetComponent.genUrlTheme("/img/tableau/white/ico_consulter.svg"),
        supprimer: HornetComponent.genUrlTheme("/img/tableau/white/ic_delete_white_24px.svg"),
        ajouter: HornetComponent.genUrlTheme("/img/tableau/white/ico_ajouter.svg"),
        info: HornetComponent.genUrlTheme("/img/picto/white/ico_info.svg"),
        settings: HornetComponent.genUrlTheme("/img/picto/white/ico_settings.svg"),
        close: HornetComponent.genUrlTheme("/img/picto/white/ico_close.svg"),
        add: HornetComponent.genUrlTheme("/img/picto/white/ico_add.svg"),
        user: HornetComponent.genUrlTheme("/img/picto/white/ico_user.svg"),
        userCircle: HornetComponent.genUrlTheme("/img/picto/white/account_circle_white.svg")
    };
    static grey = {
        close: HornetComponent.genUrlTheme("/img/picto/grey/ico_close.svg"),
        add: HornetComponent.genUrlTheme("/img/picto/grey/ico_add.svg"),
        user: HornetComponent.genUrlTheme("/img/picto/grey/ico_user.svg"),
        userCircle: HornetComponent.genUrlTheme("/img/picto/grey/account_circle_white.svg")
    };
    static editable = {
        editer: HornetComponent.genUrlTheme("/img/tableau/ico_editer_line.svg"),
        valider: HornetComponent.genUrlTheme("/img/tableau/ico_enregistrer.svg"),
        annuler: HornetComponent.genUrlTheme("/img/tableau/ico_annuler.svg"),
    };
    static export = {
        csv: HornetComponent.genUrlTheme("/img/tableau/ico_export_csv.svg"),
        ods: HornetComponent.genUrlTheme("/img/tableau/ico_export_ods.svg"),
        odt: HornetComponent.genUrlTheme("/img/tableau/ico_export_odt.svg"),
        pdf: HornetComponent.genUrlTheme("/img/tableau/ico_export_pdf.svg"),
        xls: HornetComponent.genUrlTheme("/img/tableau/ico_export_xls.svg")
    };

    render(): JSX.Element {
        return (
            <div className="svg-container" style={{"width": "32px", "height": "35px"}}>
                <div className="svg-content" style={{"width": this.props.width, "height": this.props.height}}>
                    {this.renderSvg()}
                </div>
            </div>
        );
    }


    /**
     * Rendu graphique de svg
     * @returns {any}
     */
    renderSvg(): JSX.Element {

        let svgClass: ClassDictionary = {
            "picto-svg": true
        };
        if (this.props.className) {
            svgClass[this.props.className] = true
        }

        let svgProps = {
            viewBox: "0 0 24 24",
            fill: this.props.color,
            xmlns: "http://www.w3.org/2000/svg",
            height: "24",
            width: "24",
            className: classNames(svgClass)
        };


        let svg = null;
        switch (this.props.picto) {
            case "editer":
                svg =
                    <g>
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </g>
                break;
            case "consulter":
                svg =
                    <g>
                        <path
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </g>
                break;
            case "supprimer":
                svg =
                    <g>
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </g>
                break;
            case "addCircle":
                // xml = '';
                break;
            case "settings":
                // xml = '';
                break;
            case "close":
                // xml = '';
                break;
            case "add":
                svg =

                    <g>
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </g>

                break;
            case "user":
                svg =

                    <g>
                        <circle id="svg_1" r="4" cy="9" cx="11.631579"/>
                        <path id="svg_2"
                              d="m11.631579,15c-2.67,0 -8,1.34 -8,4l0,2l16,0l0,-2c0,-2.66 -5.329999,-4 -7.999999,-4zm7.759999,-9.64"/>
                        <path id="svg_3" fill="none" d="m2.631579,-0.328947l24,0l0,24l-24,0l0,-24z"/>
                    </g>

                break;
            case "userCircle":
                svg =
                    <g>
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                    </g>

                break;
            case "arrowDown":
                svg =
                    <g>
                        <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
                        <path d="M0-.75h24v24H0z" fill="none"/>
                    </g>
                break;
            case "settings":
                svg = <g>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path
                        d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </g>
                break;
            case "moreActions":
                svg = <g>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path
                        d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </g>
                break;
            default:
                svg =
                    <g>
                        <path fill="#989898"
                              d="M23.1,0H0.9C0.4,0,0,0.4,0,0.9v18.2C0,19.6,0.4,20,0.9,20h22.2c0.5,0,0.9-0.4,0.9-0.9V0.9   C24,0.4,23.6,0,23.1,0z M22,11.6L18.5,8c0,0-1-1-1.9-1c-1,0-1.9,1-1.9,1s-2.6,3-3.6,4c1.6,0.7,4,4.6,2.2,3.5   C11.4,14.3,8.2,13,8.2,13l-6.1,4V2h20v9.6H22z M3.8,6c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2S7.2,8.2,6,8.2S3.8,7.2,3.8,6z"/>
                    </g>

                break;
        }
        return (
            <svg {...svgProps}>
                {svg}
            </svg>
        )
    }
}
