"use strict";

import React = require("react");

export interface NotificationProps extends React.Props<any> {
    isModal?: boolean;
    errorsTitle?: string;
    infosTitle?: string;
}

export interface MessageItemProps extends React.Props<any> {
    field ?: string;
    text : string;
    anchor ?: string;
}




