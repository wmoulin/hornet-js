/// <reference path="../node/node.d.ts" />

declare class WError implements Error {
    constructor(...props:string[]);
    constructor(cause?:Error, ...props:string[]);
    name:string;
    message:string;
    stack:string;

    cause():Error;
    toString():string;
}

declare class VError implements Error {
    constructor(...props:string[]);
    constructor(cause?:Error, ...props:string[]);
    name:string;
    message:string;
    stack:string;

    cause():Error;
    toString():string;
    static WError: typeof WError;
}


declare module "verror" {
    export = VError;
}
