import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link, Navigation } from 'react-router';
import CalendarRowVenue from './CalendarRowVenue';
import CalendarRowDay from './CalendarRowDay';


class CalendarRow extends Component {
	render() {
		var shows = [];

		var { days, venue } = this.props;

		var rowClass = (venue.shows.length > 0) ? "calendar__row" : "calendar__row mini";


		for (var i=0; i < days.length; i++) {
			shows.push( <CalendarRowDay key={ i } day={ days[i] } shows={ venue.shows }/> );
		}


		return (
			<div className={ rowClass }>				
				<CalendarRowVenue venue={ venue } />
				{ shows }
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		days: state.state.days
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CalendarRow);