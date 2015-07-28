/** @jsx React.DOM */
var React = require('react'),
	moment = require('moment'),
	Pikaday = require('../util/pikaday'),

	HeaderCalendarDay = React.createFactory(require('./HeaderCalendarDay.react'));

module.exports = HeaderTable = React.createClass({
	componentDidMount: function() {
		var _this = this;

		var picker = new Pikaday({
        	field: document.getElementById('datepicker'),
	        format: 'D MMM YYYY',
	        minDate: moment().toDate(),
	        onSelect: function() {
	        	_this.props.pickDate(this.getMoment());
	        }
	    });
	},

	goToToday: function(e) {
		this.props.pickDate(moment());
	},

	render: function() {
		var startDate = moment(this.props.days[0].date, 'MMMM Do YYYY');

		var month = startDate.format('MMMM');

		var backToToday = (!startDate.isSame(new Date(), 'day') && this.props.page === 'calendar') ? 'visible' : '';

		var disabled = (this.props.page !== 'calendar') ? 'disabled' : '';

		return (
			<div id="header__calendar" className={ disabled }>
				<div id="datepicker" className="month"><span>{ month }</span></div>
				{
					this.props.days.map(function(day) {
						return <HeaderCalendarDay key={ day.id } day={ day.date }/>
	    			})
				}
				<div id="back-to-today" className={ backToToday } onClick={ this.goToToday }><div></div>Back to Today</div>
			</div>
		)
	}
});