"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var classNames = require("classnames");

var _ = utils._;

var logger = utils.getLogger("hornet-js-components.table.table-header-column");

var orderAsc = "ASC";
var orderDesc = "DESC";

var TableHeaderColumn = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: ({
        tableName: React.PropTypes.string,

        columnName: React.PropTypes.string,
        column: React.PropTypes.shape({
            title: React.PropTypes.string,
            sort: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            filter: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.object
            ]),
            render: React.PropTypes.func,
            custom: React.PropTypes.bool,
            enabled: React.PropTypes.bool
        }).isRequired,

        onChangeSortData: React.PropTypes.func,
        sort: React.PropTypes.object

    }),

    getInitialState: function () {
        logger.trace("getInitialState");
        return {
            i18n: this.i18n("table")
        };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        logger.trace("shouldComponentUpdate");
        return this.props.column !== nextProps.column
            || this.props.sort !== nextProps.sort;
    },

    render: function () {
        logger.trace("Rendu Header column Tableau");
        try {
            var column = this.props.column;
            if (!column.hide) {
                var sortData = this.props.sort;
                var columnName = this.props.columnName;

                logger.trace("pagination Data:", sortData);

                // Gestion du titre de l'entête
                var titleDesc = column.title;
                var classes = {"hornet-datatable-header": true};

                var ariasort = null;
                if (sortData) {
                    var isTriActifSurColonne = sortData.key === columnName;
                    if (column.sort) {
                        titleDesc = this._getColumnTriComponent(column, columnName, sortData);

                        // Gestion de la classe de l'entête th
                        classes["hornet-datatable-header-sortable-column"] = true;
                        if (isTriActifSurColonne) {
                            classes["hornet-datatable-header-sorted"] = true;
                            if (sortData.dir === orderDesc) {
                                classes["hornet-datatable-header-sorted-desc"] = true;
                            } else {
                                classes["hornet-datatable-header-sorted-asc"] = true;
                            }
                        }

                        classes["hornet-datatable-cell-custom"] = column.custom;
                        classes["hornet-datatable-cell-custom-" + columnName] = column.custom;

                        // Gestion du title
                        var titleSort = "";
                        if (isTriActifSurColonne && sortData.dir === orderDesc) {
                            titleSort += this.state.i18n.descending;
                            ariasort = "descending";
                        } else {
                            titleSort += this.state.i18n.ascending;
                            ariasort = "ascending";
                        }
                        var title = this._getSortByTitle(column.title, titleSort);
                    }
                }
                var className = classNames(classes);
                return (
                    <th scope="col" className={className} title={title} aria-sort={ariasort}>{titleDesc}</th>
                );
            } else {
                return null;
            }

        } catch (e) {
            logger.error("Render table-header-column exception", e);
            throw e;
        }
    },

    _getSortByTitle(title, sort){
        return this.formatMessage(
            this.props.messages.sortedByTitle || this.state.i18n.sortedByTitle,
            {
                "columnTitle": title,
                "sortTitle": sort
            });
    },

    /**
     * Rendu HTML d'une entête de colonne de tableau
     */
    _getColumnTriComponent: function (column, columnName, sortData) {
        logger.trace("_getColumnTriComponent");
        var sortType = column.sort.type || column.sort || "text";
        var sortKey = column.sort.by || columnName;

        // Récupération du sens de tri
        var sensTri = orderAsc;
        if (sortData && sortData.key === columnName) {
            logger.trace("sensTri :", sortData.dir)
            sensTri = (sortData.dir === orderAsc) ? orderDesc : orderAsc;
            logger.trace("sensTri :", sensTri)
        }

        sortData = {
            key: sortKey,
            dir: sensTri,
            type: sortType
        };

        if (column.abbr && !column.lang) {
            logger.warn("Column ", columnName, " Must have lang with abbr configuration");
        }

        return (
            <div className="hornet-datatable-header-sort-liner" aria-role="button" lang={column.lang}
                 onClick={this.props.onChangeSortData.bind(this, sortData)}>
                <a href="#">
                    {(column.abbr) ?
                    <abbr lang={column.lang} title={column.abbr}>
                        {column.title}
                    </abbr> : column.title}
                </a>
            </div>
        );
    }
});

module.exports = TableHeaderColumn;