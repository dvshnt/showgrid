/** @jsx React.DOM */
var React = require('react'),

	HeaderCalendarDay = React.createFactory(require('./HeaderCalendarDay.react'));

module.exports = HeaderTable = React.createClass({
	render: function() {
		return (
			<section id="header--table">
				<div className="cell">
					<span>Venue</span>
				</div>
				{
					this.props.days.map(function(day) {
						return <HeaderCalendarDay key={ day.id } day={ day.date }/>
	    			})
				}
			</section>
		)
	}
});