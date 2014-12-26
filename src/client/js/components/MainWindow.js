/** @jsx React.DOM */
var React = require('react');
var SubItem = require('./SubItem');
var FullScreenItem = require('./FullScreenItem');
var ItemStore = require('../stores/ItemStore');


var MainWindow = React.createClass({

	mixins: [
		ItemStore.mixin()
	],

	getStateFromStores: function() {
		return {
			selected: ItemStore.getSelectedItem(),
			items: ItemStore.getSubItems()
		};
	},

	render: function() {

		var items = this.state.items.map(function(item, i){
			return (
				<SubItem key={i} item={item} />
			);
		});

		var mainItem = this.state.selected && <FullScreenItem item={this.state.selected} />;

		return (
			<div className="main-window">
				{mainItem}
				<div className="sub-items">
					{items}
				</div>
			</div>
		);
	}

});

module.exports = MainWindow;