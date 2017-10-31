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
import * as _ from "lodash";
import {
    AbstractField,
    HornetBasicFormFieldProps,
    HornetClickableProps,
    HornetMediaProps
} from "src/widget/form/abstract-field";
import { UploadedFile } from "hornet-js-core/src/data/file";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.form.upload-file-field");

/**
 * Propriétés d'un champ de formulaire de type groupe de boutons radios
 */
export interface UploadFileFieldProps extends HornetClickableProps,
    HornetMediaProps,
    HornetBasicFormFieldProps {
    /** Fichier sélectionné accessible en consultation */
    defaultFile?: UploadedFile;
    /** Méthode de rendu du composant en lecture seule */
    renderPreviewFile?: any;
    /** Texte affiché dans le bouton si aucun fichier n'est sélectionné */
    buttonLabel?: string;
    /** Texte affiché si un ou plusieurs fichiers sont sélectionnés */
    fileSelectedLabel?: string;
    /** permet de surcharger le css du bouton de suppression */
    classNameDelete?: string;
}

/**
 * Composant champ de formulaire de type envoi de fichier
 */
export class UploadFileField<P extends UploadFileFieldProps> extends AbstractField<UploadFileFieldProps, any> {

    private inputFileElement: HTMLElement;
    public readonly props: Readonly<UploadFileFieldProps>;

    static defaultProps = _.assign(AbstractField.defaultProps, {
        fileSelectedLabel: UploadFileField.getI18n("uploadFile.selectedFile", { "count": 0 })
    });

    constructor(props?: P, context?: any) {
        super(props, context);
        this.state.readOnlyFile = this.state.defaultFile;
        if (!this.state.buttonLabel) {
            this.state.buttonLabel = this.state.name;
        }
        this.state.activeButtonLabel = this.state.buttonLabel;
    }


    setReadOnlyFile(readOnlyFile: boolean, callback?: () => any): this {
        this.setState({readOnlyFile: readOnlyFile}, callback);
        return this;
    }

    /**
     * Gestion du changement de fichier sélectionné
     * @param e évènement
     */
    private handleChange(e: __React.SyntheticEvent<HTMLElement>): void {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let hasSelected: boolean = false;
        if (input.files && input.files.length > 0) {
            hasSelected = true;
            this.setState({activeButtonLabel: this.i18n("uploadFile.selectedFile", { "count": input.files.length })});

        } else {
            this.setState({activeButtonLabel: this.i18n("uploadFile.selectedFile", { "count": 0 })});
        }

        /* Déclenchement de la fonction onChange éventuellement passée en propriété */
        if (this.state.onChange) {
            this.state.onChange(e);
        }
    }

    /**setReadOnlyFile
     * @returns {any} les propriétés du fichier en consultation converties en attributs html data
     */
    private getDataFileProps(): any {
        let dataProps: any = {};
        if (this.state.defaultFile) {
            dataProps["data-file-id"] = this.state.defaultFile.id;
            dataProps["data-file-originalname"] = this.state.defaultFile.originalname;
            dataProps["data-file-name"] = this.state.defaultFile.name;
            dataProps["data-file-mime-type"] = this.state.defaultFile.mimeType;
            dataProps["data-file-encoding"] = this.state.defaultFile.encoding;
            dataProps["data-file-size"] = this.state.defaultFile.size;
        }
        return dataProps;
    }

    /**
     * @override
     */
    setCurrentValue(formData: any): this {
        //let value:any = _.get(formData, this.state.name);
        if(!formData) {
            this.handleDelete();
        }
        this.setState({
            readOnlyFile: formData,
            defaultFile: formData
        });

        return this;
    }

    /**
     * Génère le rendu spécifique du champ
     * @returns {any}
     */
    renderWidget(): JSX.Element {

        let preview = "";
        if (this.props.renderPreviewFile) {
            preview = this.props.renderPreviewFile(this.state.readOnlyFile);
        }

        /* On n'inclut pas les propriétés spécifiques ou celles dont on surcharge la valeur */
        let htmlProps = _.omit(this.getHtmlProps(), ["defaultFile", "type", "onChange"]);
        _.assign(htmlProps, {"className": htmlProps["className"] ? htmlProps["className"] + " uploadfile" : " uploadfile"});
        _.assign(htmlProps, {"data-multiple-caption": this.state.fileSelectedLabel});

        let cssDelete = (this.props.classNameDelete) ? "hornet-button hornet-button-right upload-delete-button " + this.props.classNameDelete : "hornet-button hornet-button-right upload-delete-button";
        /* On ne peut assigner programmatiquement la valeur d'un champ de type fichier (problème de sécurité potentiel)
         * on utilise donc ici les attributs data-* pour stocker les propriétés de l'éventuel fichier déjà sélectionné.
         * Celles-ci seront ensuite récupérées lors de l'envoi du formulaire, si un autre fichier n'a pas été sélectionné.*/
        let dataProps = this.getDataFileProps();
        let inputFile = <input ref={(elt) => {
            this.registerHtmlElement(elt);
            this.inputFileElement = elt;
        }} type="file" onChange={this.handleChange}

                               {...dataProps} {...htmlProps} />;

        let labelProps = {
            htmlFor: htmlProps["id"],
            readOnly: htmlProps["readOnly"],
            className: "upload-content"
        };


        return (
            <div className="upload-container">
                {inputFile}
                <label {...labelProps}>

                    <a href="#" aria-haspopup={true} onClick={this.downloadButtonActionHandler}
                       onKeyDown={this.downloadButtonKeyDownHandler} disabled={htmlProps["readOnly"]}>
                        <span className="upload-text">{this.state.activeButtonLabel}</span>
                    </a>
                </label>
                {(this.htmlElement) && this.htmlElement.files.length ?
                    <button type="button"
                            className={cssDelete}
                            onClick={this.handleDelete}
                            aria-label={this.i18n("uploadFile.labelSupprimer")}
                            disabled={this.state.readOnly}>X</button>
                    : ""}
                {preview}
            </div>);
    }

    /* suppression du fichier sélectionné  dans le champs input */
    handleDelete() {
        this.htmlElement.value = "";
        this.setState({defaultFile: null, activeButtonLabel: this.i18n("uploadFile.selectedFile", { "count": 0 })});

    }

    /**
     * Déclenchement d'un click sur l'input file afin d'ouvrir la boite de dialogue
     * d'upload de fichier
     */
    protected downloadButtonActionHandler() {
        this.inputFileElement.click();
    }

    /**
     * Appel au gestionnaire d'action pour l'ouverture de la boite de dialogue
     * uniquement sur presse des touches entrée et espace
     * @param e
     */
    protected downloadButtonKeyDownHandler(e: React.KeyboardEvent<HTMLAnchorElement>) {
        if (!(e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
            let keyCode: number = e.keyCode;
            if (keyCode == KeyCodes.ENTER || keyCode == KeyCodes.SPACEBAR) {
                this.downloadButtonActionHandler();
            }
        }
    }

}