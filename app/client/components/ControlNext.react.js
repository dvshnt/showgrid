/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	moment = require('moment');


React.initializeTouchEvents(true);

module.exports = NextControl = React.createClass({
	render: function() {
		return (
			<div className="arrow next" onClick={ this.props.next }></div>
		)
	}
});