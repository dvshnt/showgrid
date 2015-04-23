/** @jsx React.DOM */
var React = require('react'),
	moment = require('moment'),

	HeaderCalendarDay = React.createFactory(require('./HeaderCalendarDay.react'));

module.exports = HeaderTable = React.createClass({
	render: function() {
		var month = moment(this.props.days[0].date, 'MMMM Do YYYY').format('MMMM');

		return (
			<div id="header__calendar">
				<div id="datepicker" className="month"><span>{ month }</span></div>
				{
					this.props.days.map(function(day) {
						return <HeaderCalendarDay key={ day.id } day={ day.date }/>
	    			})
				}
			</div>
		)
	}
});