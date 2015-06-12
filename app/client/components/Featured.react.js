/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	HeaderPage = React.createFactory(require('./HeaderPage.react')),

	GridEngine = require('../util/GridEngine'),

	moment = require('moment');

module.exports = Featured = React.createClass({

	render: function() {
		return (
			<div className="recent--container">
				<h1>Featured Shows</h1>
			</div>
		)
	}
});

