/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	moment = require('moment'),
	Pikaday = require('../util/pikaday'),

	HeaderSearch = React.createFactory(require('./HeaderSearch.react')),

	DateManager = require('../util/DateManager');

module.exports = HeaderMobileCalendar = React.createClass({
	componentDidMount: function() {
		var _this = this;

		var picker = new Pikaday({
        	field: document.getElementById('mobile--datepicker'),
	        format: 'D MMM YYYY',
	        minDate: moment().toDate(),
	        reposition: true,
	        onSelect: function() {
	        	_this.props.pickDate(this.getMoment());
	        }
	    });
	},

	render: function() {
		var date = DateManager.getMobileDate(this.props.days[0]);

		if (this.props.page === "calendar") {
			return (
				<div id="mobile--datepicker" className="date">
					<span>{ date }</span>
				</div>
			)
		}
		else if (this.props.page === "search") {
			return (
				<HeaderSearch search={ this.props.search } page={ this.props.page }/>
			)
		}
		else {
			var title = this.props.page;

			if (this.props.page === "recent") title = "New Shows";
			else if (this.props.page === "featured") title = "Recommended";

			return (
				 <div id="mobile--title">{ title }</div>
			)
		}
	}
});