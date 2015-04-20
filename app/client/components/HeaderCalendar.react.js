/** @jsx React.DOM */
var React = require('react'),

	HeaderCalendarDay = React.createFactory(require('./HeaderCalendarDay.react'));

module.exports = HeaderTable = React.createClass({
	render: function() {
		return (
			<div id="header__calendar">
				<div id="datepicker" className="month"><span>April</span></div>
				{
					this.props.days.map(function(day) {
						return <HeaderCalendarDay key={ day.id } day={ day.date }/>
	    			})
				}
			</div>
		)
	}
});