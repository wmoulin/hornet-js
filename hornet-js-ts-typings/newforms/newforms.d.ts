declare class ErrorObject {
    get():any;
}
declare class CharField {
}
declare class EmailField {
}
declare class Textarea {
}
declare class HiddenInput {
}
declare class ChoiceField {
}
declare class RadioSelect {
}
declare class BooleanField {
}
declare class Select {
}
declare class ValidationError {
}
declare class TextInput {
}
declare class RegexField {
}
declare class EmailInput {
}
declare class MultipleChoiceField {
}



declare module "newforms" {

    interface Util {
        makeChoices(params:{}, name:string, value:string): void;
    }

    class BaseForm {
        constructor(kwargs:any);
        isValid():boolean;
        errors():ErrorObject;
        errors(name?:string):any;
        extend(prototypeProps?:{}, constructorProps?:{}):(params:{})=>void;
    }


    class forms {

        static util:Util;

        static Form : BaseForm ;

        static CharField(kwargs:{}):CharField;
        static EmailField(kwargs:{}):EmailField;
        static Textarea(kwargs:{}):Textarea;
        static HiddenInput(kwargs:{}):HiddenInput;

        static ChoiceField(kwargs:{}):ChoiceField;
        static RadioSelect(kwargs:{}):RadioSelect;
        static BooleanField(kwargs:{}):BooleanField;
        static Select(kwargs:{}):Select;
        static ValidationError(required: boolean, obj:any):ValidationError;
        static TextInput(kwargs:{}):TextInput;
        static RegexField(obj:{}, kwargs:{}):RegexField;
        static EmailInput(kwargs:{}):EmailInput;
        static MultipleChoiceField(kwargs:{}):MultipleChoiceField;

        /**
         * Adds a locale object to our own cache (for formats) and isomorph.time's cache
         * (for time parsing/formatting).
         * @param {string} lang
         * @param {string=} locale
         */
        static addLocale(lang:string, locale:{}):void;

        /**
         * Sets the language code for the default locale.
         * @param {string} lang
         */
        static setDefaultLocale(lang:string);
    }
    export = forms;
}
