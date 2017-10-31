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

import * as React from "react";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "src/widget/component/hornet-component";

/**
 * Propriétés de la classe TopButton
 */
export interface TopButtonProps extends HornetComponentProps {
    className?: string;
    /*id de la balise du header*/
    header?: string;
    /*id de la balise du footer*/
    footer?: string;
    id?: string;
    name?: string;
    title?: string;
}

/**
 * Bouton de retour vers le haut de la page
 */
export class TopButton extends HornetComponent<TopButtonProps, any> {

    static defaultProps = ({
        offset: 0,
        header: "header-container",
        footer: "footer-container"
    });

    constructor(props, context?:any) {
        super(props, context);

    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * Calcule si un élément est présent ou non a l'écran
     * @param {Element} elm - l'élément a rechercher
     * @return {boolean} true si l'élément est présent
    */
    private checkvisible(elm) {
        let rect = elm.getBoundingClientRect();
        let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

        //sauvegarde la la taille visible du footer
        let height = -(rect.top - viewHeight) + 16;
        this.setState({size : height});

        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    /**
     * Métohde de gestion du scroll à l'écran
     * @param event - evenement scroll
     */
    private handleScroll(event) {
        let header = document.getElementById(this.state.header);
        let footer = document.getElementById(this.state.footer);

        /* récupération de la hauteur du header : le composant ne s'affichera qu'au dela de cette hauteur */
        let height:number = 0;
        if(header){
            height  = header.getBoundingClientRect().height;
        }

        /*si le footer est visible, le composant s'affichera au dessus de celui-ci*/
        let visible: boolean = false;
        if(footer) {
            visible = this.checkvisible(footer);
        }

        this.setState({
            offset: height, visible: visible
        });
    }

    /**
     * Méthode de retour en haut de la page
     */
    private scrolltop(){
        window.scrollTo(0, 0);
    }

    /**
     * Génère le rendu spécifique du champ
     * @returns {any}
     * @override
     */
    render():JSX.Element {

        /* calcul de la position du scroll*/
        let scroll : number = 0;
        if(typeof window !== 'undefined') {
            scroll = window.scrollY || window.pageYOffset;
        }

        /*si le footer est visible, le composant s'affichera au dessus de celui-ci*/
        let style = {};
        if(this.state.visible){
            style = {bottom : this.state.size};
        }

        let shouldShow = scroll > this.state.offset;

        let contentButton = this.state.children || this.renderDefaultTopButtonContent();

        if(shouldShow) {
            return (
                <a className= {this.state.className || "top-button"}
                   style={style}
                   onClick={this.scrolltop}
                   id={this.state.id}
                   name={this.state.name}
                   title={this.state.title}
                >
                    {contentButton}
                </a>
            );
        }
        return null;
    }

    /**
     * Génére le contenu du bouton
     * @returns {any}
     */
    private renderDefaultTopButtonContent(): JSX.Element {
        return(
            <div className="top-button-content">
            </div>
        );
    }

}