/** @jsx React.DOM */
var React = require('react');
var ModalMixin = require('../mixins/ModalMixin');
var Eventable = require('../mixins/Eventable');
var TopNavActions = require('../actions/TopNavActions');

var AddItemModal = React.createClass({

    mixins: [ModalMixin, Eventable],

    subscriptions: {
        "ADD_NEW_ITEM_CLICK": function(e){
            this.show();
        }
    },

    getInitialState: function() {
        return {
            text: this.props.text || ''
        };
    },

    render: function() {
        
        return (
            <div className="modal">
                <div className="modal-backdrop"></div>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <b className="txt-large">Add Item</b>
                        </div>
                        <div className="modal-body">
                            <input 
                                type="text" 
                                onChange={this.onTextChange}
                                value={this.state.text} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn" onClick={this.handleItemAdded}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    onTextChange: function(/*object*/ event) {
        this.setState({
            text: event.target.value
        });
    },

    handleItemAdded: function(){
        console.log("in handleItemAdded");
        TopNavActions.addItem({ text: this.state.text });
        this.setState({text: ''});
        this.hide();

    }

});

module.exports = AddItemModal;