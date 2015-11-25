"use strict";
var utils = require("hornet-js-utils");
var React = require("react");
var BreadCrumbItem = require("src/navigation/bread-crumb-item");
var pageInformationStore = require("hornet-js-core/src/stores/page-informations-store");
var HornetComponentMixin = require("hornet-js-core/src/mixins/react-mixins");
var HornetNavUtils = require("src/navigation/utils/navigation-utils").NavigationUtils;

var _ = utils._;

/**
 * Fil d'ariane
 */
var BreadCrumb = React.createClass({
    mixins: [HornetComponentMixin],

    propTypes: {
        /** Classe du "store" contenant la configuration de navigation */
        store: React.PropTypes.func.isRequired
    },

    statics: {
        storeListeners: [pageInformationStore]
    },

    getInitialState: function () {

        var pageInformationStoreInstance = this.getStore(pageInformationStore);
        var currentUrl = pageInformationStoreInstance.getCurrentUrlWithoutContextPath();
        return {
            i18n: this.i18n("breadcrumb"),
            data: this._getItems(currentUrl),
            currentUrl: currentUrl
        };
    },

    _getItems: function (currentUrl) {

        var store = this.getStore(this.props.store);
        var currentItem = HornetNavUtils.getCurrentItem(store.getConfigMenu(), currentUrl);
        var items = this._loopElement(store.getConfigMenu(), currentUrl, null, currentItem);
        var welcomePageUrl = utils.appSharedProps.get("welcomePageUrl");
        // Suppression du fil d'ariane si page d'accueil
        if (items.length == 1 && items[0].url == welcomePageUrl) {
            items = [];
        }

        /* Ajout de accueil dans le cas ou on est sur une page differente de accueil */
        if (items.length >= 1 && items[0].url != welcomePageUrl) {
            items.unshift({text: "navigation.welcome" , url: welcomePageUrl});
        }

        return items
    },

    componentDidMount: function () {
        this.getStore(this.props.store).addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        this.getStore(this.props.store).removeChangeListener(this.onChange);
    },

    onChange: function () {
        var currentUrl = this.getStore(pageInformationStore).getCurrentUrlWithoutContextPath();
        this.setState({
            currentUrl: currentUrl,
            data: this._getItems(currentUrl)
        });
    },

    _loopElement: function (menuDatas, currentUrl, currentElement, currentItemSelected) {

        var datas = [];
        for (var i = 0; i < menuDatas.length; i++) {
            if (menuDatas[i].submenu) {
                datas = datas.concat(this._loopElement(menuDatas[i].submenu, currentUrl, menuDatas[i], currentItemSelected))
            }
            if (datas.length == 0) {
                if (_.isEqual(menuDatas[i], currentItemSelected)) {

                    datas.unshift(menuDatas[i]);
                    break;
                }
            } else {
                datas.unshift(menuDatas[i]);
                break;
            }
        }
        return datas;
    },

    renderBreadCrumb: function () {
        var items = this.state.data;
        var ln = items.length;

        var breadCrumb = items.map(function (item, i) {

            var key = i + 1;
            var data = {};
            data.maxIndice = ln;
            data.currentIndice = key;
            data.item = item;

            return (
                <BreadCrumbItem key={key} data={data}/>
            );
        });
        return breadCrumb;
    },

    render: function () {

        return (
            <nav id="breadcrumb" role="navigation" aria-label={this.state.i18n.arialabel}>
                <ul className="fil-ariane">
                    {this.renderBreadCrumb()}
                </ul>
            </nav>
        );
    }
});

module.exports = BreadCrumb;