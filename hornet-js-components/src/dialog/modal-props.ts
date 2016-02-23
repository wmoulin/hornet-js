"use strict";

import React = require("react");

export interface ModalProps extends React.Props<any>{
    onClickClose ?: React.MouseEventHandler;
    isVisible: boolean;
    title?: string;
    hideTitleBar ?: boolean;
    hideCloseBar?: boolean;
    closeLabel ?:string;
    closeSymbole ?:string;
    className ?:string;
    underlayClass ?:string;
    initialFocus ?:string;
    alert?: boolean;
    underlayClickExits?: boolean;
    escapeKeyExits?:boolean;
    verticallyCenter?: boolean;
    focusDialog?: boolean;
    manageFocus?:boolean;
    onShow?: Function;
}

