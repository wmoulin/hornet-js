"use strict";

import React = require("react");

export interface AlertProps extends React.Props<any> {
    isVisible ?: boolean;
    onClickOk ?: React.MouseEventHandler; // L'utilisateur valide le message
    onClickCancel ?: React.MouseEventHandler; // L'utilisateur annule ou appui sur la croix fermer en haut à droite
    onClickClose ?: React.MouseEventHandler;
    title ?: string;
    message: string;
    valid ?: string;
    cancel ?: string;
    validTitle ?: string;
    cancelTitle ?: string;
    underlayClickExits ?: boolean;
    escapeKeyExits?: boolean;
}

