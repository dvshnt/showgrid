/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	HeaderPage = React.createFactory(require('./HeaderPage.react')),

	GridEngine = require('../util/GridEngine'),

	moment = require('moment');

module.exports = OnSale = React.createClass({

	render: function() {
		return (
			<div className="recent--container">
				<h1>Tickets On Sale Soon</h1>
			</div>
		)
	}
});

