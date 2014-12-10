/** @jsx React.DOM */
var React = require('react');

var ModalMixin = (function() {
	var handlerProps = ['handleShow', 'handleHide'];
	
	var modalEvents = {
		handleShow: 'show.modal',
		handleHide: 'hide.modal',
	};
	
	return {

		propTypes: {
			handleShow: React.PropTypes.func, 
			handleHide: React.PropTypes.func,
			backdrop: React.PropTypes.bool,
			show: React.PropTypes.bool
		},

		getDefaultProps: function() {
			return {
				show: true
			}
		},

		componentDidMount: function() {
			var $modal = $(this.getDOMNode());

			$modal.on(modalEvents.handleHide, this._hide);
			$modal.on(modalEvents.handleShow, this._show);

			$(document).on("keydown.modal",function(e){
				if(e.which === 27) {
					this.hide();
				}
			}.bind(this));

			$modal.on("click",".modal-backdrop",this.hide);

			if(this.props.show) {
				this._show();
			}

		},

		componentWillUnmount: function() {
			$(this.getDOMNode()).off('.modal');
			$(document).off(".modal");
		},

		_hide: function(){
			var $modal = $(this.getDOMNode());
			$modal.removeClass("shown");
			setTimeout(function(){
				$modal.hide();
			},300);
		},

		_show: function(){
			var $modal = $(this.getDOMNode());
			$modal.show();
			setTimeout(function(){
				$modal.addClass("shown");
			},0);
		},

		hide: function() {
			$(this.getDOMNode()).trigger('hide')
		},

		show: function() {
			$(this.getDOMNode()).trigger('show')
		},

		renderCloseButton: function() {
			return (
				<button
					type="button"
					className="close right"
					onClick={this.hide}
					dangerouslySetInnerHTML={{__html: '&times'}} />
			);
		}
	}
}());

module.exports = ModalMixin;