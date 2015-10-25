import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CalendarRow from './CalendarRow';


class Calendar extends Component {
	render() {
		return (
			<section id="calendar">
				{
					this.props.venues.map(function(venue) {
						return <CalendarRow key={ venue.id } venue={ venue }/>
    				})
				}
			</section>
		)
	}
};


function mapStateToProps(state) {
	return {
		venues: state.grid.venues
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Calendar);