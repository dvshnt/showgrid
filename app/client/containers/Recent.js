import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import { getRecent } from '../actions/index';

var DateManager = require('../util/DateManager');


class Recent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.recent.length === 0) {
	    	this.props.getRecent(this.state.page);
	    }
	}

	render() {
		var results = [];
		var currentDay = "";

		if (this.props.recent && this.props.recent.length > 0) {
			for (var i=0; i < this.props.recent.length; i++) {
				var key = this.props.recent[i].id,
					show = this.props.recent[i];

				if (currentDay === "" || moment(show.created_at).isBefore(currentDay, 'days')) {
					currentDay = show.created_at;
					results.push(<h3 key={ i }>{ DateManager.getRecentShowsDate(currentDay.split('T')[0]) }</h3>);
				}

				results.push(<ListItem key={ key } show={ show } showDate={ true } showStar={ true } />);
			}
		}


		return (
			<div id="list">
				{ results }
			</div>
		)

	}
};


function mapStateToProps(state) {
	var recent = state.state.recent.map( s => state.state.entities.shows[s] );

	return {
		recent: recent
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getRecent }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Recent);