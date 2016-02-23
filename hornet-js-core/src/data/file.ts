/**
 * Représente une image uploadé (même propriété que l'objet File HTML5)
 */
"use strict";
class File {
    id:number;
    originalname:string;
    name:string;
    mimeType:string;
    encoding:string;
    size:number;
    buffer:Array<number>;

}
export = File;
