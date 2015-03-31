/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	moment = require('moment');


React.initializeTouchEvents(true);

module.exports = PreviousControl = React.createClass({
	render: function() {
		return (
			<div className="arrow previous" onClick={ this.props.previous }></div>
		)
	}
});