"use strict";

var React = require('react/addons');

/**
 * Composant react générique utilisé pour les TU.
 * Il rend ses fils dans un div tout en exposant des méthodes permettant de retrouver les props et le state avec lequel son rendu a été effectué.
 * Utilisation: appeler la fonction qui retourne un nouveau composant React
 * @return {*}
 */
/* istanbul ignore next */
function SpinnerReactMock() {
    var lastRenderedProps, lastRenderedState, nbRendering = 0;
    var isVisible = false;

    return React.createClass({
        statics: {
            getLastRenderedProps: function () {
                return lastRenderedProps;
            },
            getLastRenderedState: function () {
                return lastRenderedState;
            },
            getNbRendering: function () {
                return nbRendering;
            },
            setAppElement: function () {

            },
            getPropIsVisible: function () {
                return isVisible;
            }
        },

        render: function () {
            lastRenderedProps = this.props;
            lastRenderedState = this.state;
            isVisible = lastRenderedProps.isVisible;
            nbRendering++;
            return (<div name='simuleReactModal'>{this.props.children}</div>);
        }
    });
}


module.exports = SpinnerReactMock;