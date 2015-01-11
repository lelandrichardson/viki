var React = require('react/addons');
var AppActions = require('../actions/AppActions');

var cx = React.addons.classSet;

var ANIMATION_DURATION = 300;

var ModalMixin = (function () {

    return {

        propTypes: {
            beforeHide: React.PropTypes.func,
            afterShown: React.PropTypes.func,
            onShow: React.PropTypes.func,
            backdrop: React.PropTypes.bool,
            size: React.PropTypes.oneOf(["small", "medium", "large"]),
            modalId: React.PropTypes.string.isRequired
        },

        getDefaultProps: function () {
            return {
                backdrop: true,
                size: "medium"
            };
        },

        getInitialState: function () {
            return {
                shown: false,
                modalDisplay: "none"
            };
        },

        componentWillEnter: function ( callback ) {
            this.setState({
                modalDisplay: "block"
            });
            setTimeout(callback, 0);
        },

        componentDidEnter: function () {
            this.setState({
                shown: true
            });

            if (this.props.onShow) {
                this.props.onShow(this);
            }

            if (this.onShow) {
                this.onShow(this);
            }

            if (this.props.afterShown || this.afterShown) {
                setTimeout(function () {
                    this.afterShown && this.props.afterShown(this);
                    this.afterShown && this.afterShown(this);
                }.bind(this), ANIMATION_DURATION);
            }
        },

        componentWillLeave: function ( callback ) {
            this.setState({
                shown: false
            });

            setTimeout(callback, ANIMATION_DURATION);
        },

        hide: function () {
            var hide = true;

            if (this.props.beforeHide) {
                hide = this.props.beforeHide(this);
            }

            if (hide === false) {
                return; // hide was canceled
            }

            if (this.beforeHide) {
                hide = this.beforeHide(this);
            }

            if (hide === false) {
                return; // hide was canceled
            }

            AppActions.hideModal(this.props.modalId);
        },

        renderCloseButton: function () {
            return (
                <button
                    type="button"
                    className="close right"
                    onClick={this.hide}
                    dangerouslySetInnerHTML={{__html: '&times'}} />
            );
        },

        render: function () {
            var modalClassNames = cx({
                modal: true,
                shown: this.state.shown
            });

            var dialogClassNames = cx({
                "modal-dialog": true,
                "modal-sm": this.props.size === "small",
                "modal-md": this.props.size === "medium",
                "modal-lg": this.props.size === "large"
            });

            var backdrop = this.props.backdrop && <div ref="backdrop" className="modal-backdrop" onClick={this.hide}></div>;

            return (
                <div ref="modal" className={modalClassNames} style={{display: this.state.modalDisplay}}>
	                {backdrop}
                    <div ref="dialog" className={dialogClassNames}>
	                	{this.renderModal()}
                    </div>
                </div>
            );
        }
    }

}());

module.exports = ModalMixin;