/** @jsx React.DOM */
var React = require('react'),
	DateManager = require('../util/DateManager');

module.exports = HeaderCalendarDay = React.createClass({
	render: function() {
		var date = DateManager.formatHeaderCalendarDay(this.props.day),
			dow = date.split(" ", 1)[0],
			day = date.split(" ")[1] + " " + date.split(" ")[2];


		return (
			<div className="cell">
				<span>{ dow }<br/>{ day }</span>
			</div>
		)
	}
});