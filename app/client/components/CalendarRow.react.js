/** @jsx React.DOM */
var React = require('react/addons'),
	
	CalendarRowVenue = React.createFactory(require('./CalendarRowVenue.react')),
	CalendarRowDay = React.createFactory(require('./CalendarRowDay.react'));

module.exports = CalendarRow = React.createClass({
	render: function() {
		var venue = this.props.venue;

		var rowClass = (venue.shows.length > 0) ? "calendar__row" : "calendar__row mini";

		return (
			<div className={rowClass}>
				<CalendarRowVenue venue={ venue }/>
				{
					this.props.days.map(function(day) {
						return <CalendarRowDay key={ day.id } day={ day } venue={ venue } shows={ venue.shows }/>
					})
				}
			</div>
		)
	}
});

