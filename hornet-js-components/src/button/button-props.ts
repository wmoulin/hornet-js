"use strict";

import React = require("react");

export interface ButtonProps {
    item?: ItemProps;
    disabled?: boolean;
}

export interface ItemProps{
    type?: string;
    id?: string;
    name?: string;
    value?: string;
    onClick?: React.MouseEventHandler;
    className?: string;
    label?: string;
    title?: string;
}