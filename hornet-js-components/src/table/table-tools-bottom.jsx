"use strict";

var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");

var TableToolsActionAdd = require("src/table/table-tools-action-add");
var TableToolsActionMass = require("src/table/table-tools-action-mass");
var TableToolsActionPagination = require("src/table/table-tools-action-pagination");

var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.table.table-bottom-tools");

var TableToolsBottom = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        tableName: React.PropTypes.string,
        options: React.PropTypes.object,
        routes: React.PropTypes.object,
        actions: React.PropTypes.object,
        messages: React.PropTypes.object,
        onchangePaginationData: React.PropTypes.func,
        pagination: React.PropTypes.object,

        openDeleteAlert: React.PropTypes.func,

        classAction: React.PropTypes.string,

        actionMassEnabled: React.PropTypes.bool,
        actionAddEnabled: React.PropTypes.bool,
        actionPaginationEnabled: React.PropTypes.bool,
        /** Choix de taille de page proposés */
        pageSizeSelect: React.PropTypes.arrayOf(React.PropTypes.shape({
            /** Taille de page */
            value: React.PropTypes.number.isRequired,
            /** Clé du libellé à rechercher dans messages ou dans le bloc de messages du composant "table" */
            textKey: React.PropTypes.string.isRequired
        })),

        children: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.array
        ]),
        /** Path permettant de surcharger les pictogrammes/images **/
        imgFilePath: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            actionMassEnabled: false,
            actionAddEnabled: false,
            actionPaginationEnabled: false
        };
    },

    render: function () {
        logger.trace("render");
        try {
            return (
                <div className="hornet-datatable-bottom pure-g">
                    <TableToolsActionMass {...this.props} enabled={this.props.actionMassEnabled}
                                                          classAction="pure-u-2-24"/>
                    <TableToolsActionAdd {...this.props} enabled={this.props.actionAddEnabled}
                                                         classAction="pure-u-1-24"/>
                    <TableToolsActionPagination {...this.props} enabled={this.props.actionPaginationEnabled}
                                                                classAction={"pure-u-21-24"}/>

                    {this.props.children}
                </div>
            );
        } catch (e) {
            logger.error("Render table-bottom-tools exception", e);
            throw e;
        }
    }
});

module.exports = TableToolsBottom;