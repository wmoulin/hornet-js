///<reference path="../../../hornet-js-ts-typings/definition.d.ts"/>
"use strict";

import React = require("react");

export interface TabProps extends React.Props<any> {
    /** Titre de l'onglet (affiché dans la barre d'onglets) */
    title?: string;
    tabId?: string;
    panelId?: string;
    isVisible?: boolean;
    form?: any;
}

export interface TabsProps extends React.Props<any> {
    tabId?: string;
    panelId?: string;
    selectedTabIndex?: number;
    title?: string;
    form?: any;
}




