var React = require('react');
var ModalMixin = require('../../mixins/ModalMixin');

var AlertModal = React.createClass({

    mixins: [
        ModalMixin
    ],

    propTypes: {
        message: React.PropTypes.string,
        type: React.PropTypes.oneOf(["success", "info", "warning", "danger"]),
        button: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            message: "Something went wrong...",
            type: "danger",
            button: "OK"
        };
    },

    renderModal: function () {
        return (
            <div className="modal-content">
                <div className="modal-body">
                    <h3 className="center">{this.props.message}</h3>
                </div>
                <div className="modal-footer">
                    <button type="submit" className={'btn small block' + this.props.type} onClick={this.hide}>
                        {this.props.button}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = AlertModal;