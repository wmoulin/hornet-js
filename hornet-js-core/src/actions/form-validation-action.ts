"use strict";
import Action = require("src/actions/action");
import ActionsChainData = require("src/routes/actions-chain-data");

export interface NewsFormValidation {
    validate():boolean;
    errors():Error;
    data: any;
}

export class FormValidationAction extends Action<ActionsChainData> {

    appForm:NewsFormValidation;
    eventNameFormNotValid:string = null;
    eventNameFormValid:string = null;

    withApplicationForm(applicationForm:any):FormValidationAction {
        this.appForm = applicationForm;
        return this;
    }

    /**
     * Evenement lancé uniquement si la formulaire N'est PAS valide
     * @param eventName
     * @returns {FormValidationAction}
     */
    dispatchIfFormNotValid(eventName:any):FormValidationAction {
        this.eventNameFormNotValid = eventName;
        return this;
    }

    /**
     * Evenement lancé uniquement si la formulaire N'est PAS valide
     * @param eventName
     * @returns {FormValidationAction}
     */
    dispatchIfFormValid(eventName:any):FormValidationAction {
        this.eventNameFormValid = eventName;
        return this;
    }

    execute(resolve, reject) {
        if (!this.appForm.validate()) {
            if (this.eventNameFormNotValid != null) {
                this.actionContext.dispatch(this.eventNameFormNotValid, this.appForm.data);
            }
            this.actionChainData.formError = this.appForm.errors();
            reject();
            return;
        } else if (this.eventNameFormValid != null) {
            this.actionContext.dispatch(this.eventNameFormValid, this.appForm.data);
        }
        resolve();
    }
}
