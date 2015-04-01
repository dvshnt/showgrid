/** @jsx React.DOM */
var React = require('react/addons'),
	CalendarRow = React.createFactory(require('./CalendarRow.react'));

module.exports = Calendar = React.createClass({
	render: function() {
		var days = this.props.days;

		return (
			<section id="calendar">
				{
					this.props.venues.map(function(venue) {
						return <CalendarRow key={ venue.id } days={ days } venue={ venue }/>
    				})
				}
			</section>
		)
	}
});