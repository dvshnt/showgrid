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
}


function mapStateToProps(state) {
	var venues = state.state.grid.map(function(v) {
		var result = state.state.entities.venues[v];

		if (result.shows.length > 0 && typeof result.shows[0] !== 'object') {
			result.shows = result.shows.map(function(s) {
				return state.state.entities.shows[s]
			});
		}

		return result;
	});

	return {
		venues: venues
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Calendar);