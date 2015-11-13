import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
	
import CalendarRowDayShow from './CalendarRowDayShow';

var DateManager = require('../util/DateManager');


class CalendarRowDay extends Component {
	render() {
		var shows = DateManager.getShowsOnDate(this.props.day, this.props.shows);

		return (
			<div className="day">
				{
					shows.map(function(show) {
						return <CalendarRowDayShow key={ show.id } show={ show }/>
					})
				}
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CalendarRowDay);
