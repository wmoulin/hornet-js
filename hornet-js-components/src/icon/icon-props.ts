///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react");

export interface IconProps extends React.Props<any> {
    src:string;
    alt: string;
    idImg?: string;
    classImg?: string;
    url: string;
    title: string;
    idLink?: string;
    classLink?: string;
    target?: string;
    onClick?: React.MouseEventHandler;
}

