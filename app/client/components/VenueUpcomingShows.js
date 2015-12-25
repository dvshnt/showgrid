import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment'
import Show from './ListItem.js';
import {sortBy} from 'lodash';

var DateManager = require('../util/DateManager');

class VenueUpcomingShows extends Component{
	constructor(props){
		super(props)
	}

	dateSeperator(date){
		return (
			<div className='date-seperator' >{date}</div>
		)
	}
		
	render(){

		sortBy(this.props.venue.shows,function(show){
			return show.created_at
		})

		var children = [];
		var prev_time = null;

		for(var i in this.props.venue.shows){
			var show = this.props.venue.shows[i];
			var date = moment(show.date);
			var next_time = DateManager.getFeaturedShowDate(date);
			if(next_time != prev_time) children.push(this.dateSeperator(next_time));
			prev_time = next_time
			children.push(<Show showVenueName={false} showStar={true} showTime={true} ticket_price={true} skip_header={true} showDate={false} show={show}/>);
		}

		if(this.props.venue.shows.length) var header = <header>Upcoming Shows</header>
		else var header = <header>No shows here yet.</header>

		return(
			<div className='venue-upcoming'>
				{header}
				<hr/>
				{children}
			</div>
		)
	}
}


// function mapStateToProps(state) {
// 	return {
// 		// grid: state.state.grid,
// 		// startDate: state.state.days[0]
// 	};
// }


// function mapDispatchToProps(dispatch) {
// 	return {}
// }


export default VenueUpcomingShows
