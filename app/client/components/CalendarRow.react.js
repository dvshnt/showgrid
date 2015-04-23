/** @jsx React.DOM */
var React = require('react/addons'),
	
	CalendarRowVenue = React.createFactory(require('./CalendarRowVenue.react')),
	CalendarRowDay = React.createFactory(require('./CalendarRowDay.react'));

module.exports = CalendarRow = React.createClass({
	render: function() {
		var venue = this.props.venue;

		return (
			<div className="calendar__row">
				<CalendarRowVenue venue={ venue }/>
				{
					this.props.days.map(function(day) {
						return <CalendarRowDay key={ day.id } day={ day } shows={ venue.shows }/>
					})
				}
			</div>
		)
	}
});

