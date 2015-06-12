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

	render: function() {
		var month = moment(this.props.days[0].date, 'MMMM Do YYYY').format('MMMM');

		var disabled = (this.props.page !== 'calendar') ? 'disabled' : '';

		return (
			<div id="header__calendar" className={ disabled }>
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