/** @jsx React.DOM */
var React = require('react'),
	DateManager = require('../util/DateManager');

module.exports = HeaderCalendarDay = React.createClass({
	render: function() {
		var date = DateManager.formatHeaderCalendarDay(this.props.day);

		return (
			<div className="day">
				<span>{ date }</span>
			</div>
		)
	}
});