/** @jsx React.DOM */
var React = require('react/addons'),
	
	CalendarRowDayShow = React.createFactory(require('./CalendarRowDayShow.react')),

	DateManager = require('../util/DateManager');

module.exports = CalendarRowDay = React.createClass({
	render: function() {
		var shows = DateManager.getShowsOnDate(this.props.day, this.props.shows);

		return (
			<div className="day">
				{
					shows.map(function(show) {
						return <CalendarRowDayShow key={ show.id } show={ show }/>
					})
				}
			</div>
		)
	}
});

