import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import moment from 'moment';
import Pikaday from '../util/pikaday';

import HeaderCalendarDay from './HeaderCalendarDay';

import { getGrid } from '../actions/index';

var DateManager = require('../util/DateManager');


class HeaderCalendar extends Component {
	constructor(props) {
		super(props);
		
		this.goToToday = this.goToToday.bind(this);
	}

	componentDidMount() {
		var _this = this;

		var picker = new Pikaday({
        	field: document.getElementById('datepicker'),
	        format: 'D MMM YYYY',
	        minDate: moment().toDate(),
	        onSelect: function() {
	        	var day = this.getMoment();
	        	_this.props.getGrid(day);
	        }
	    });
	}

	goToToday(e) {
		this.props.getGrid(moment());
	}

	render() {
		var headDays = [];

		var { days } = this.props;
		var { cells } = this.props;


		var startDate = (days.length === 0) ? moment() : moment(days[0].date, 'MMMM Do YYYY');

		var backToToday = (!startDate.isSame(new Date(), 'day')) ? 'visible' : '';


		if (days.length > 1) {
			var month = startDate.format('MMMM');
			var monthClass = "month";

			for (var i=0; i < cells; i++) {
				headDays.push( <HeaderCalendarDay key={ i } day={ days[i].date }/> );
			}
		}
		else {
			var month = DateManager.getMobileDate(startDate);
			var monthClass = "month wide";
		}

		return (
			<div id="header__calendar">
				<div id="datepicker" className={ monthClass }><span>{ month }</span></div>
				{ headDays }
				<div id="back-to-today" className={ backToToday } onClick={ this.goToToday }><div></div>Back to Today</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		days: state.grid.days,
		cells: state.engine.cells
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getGrid }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderCalendar);