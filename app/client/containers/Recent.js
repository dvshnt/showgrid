import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import { getRecent } from '../actions/index';

var DateManager = require('../util/DateManager');


class Recent extends Component {
	componentDidMount() {
	    // Fetching first recent shows
	    this.props.getRecent();
	}

	render() {
		var results = [];
		var currentDay = "";

		if (this.props.recent.length > 0) {
			for (var i=0; i < this.props.recent.length; i++) {
				var key = this.props.recent[i].id,
					show = this.props.recent[i];

				if (currentDay === "" || show.created_at !== currentDay) {
					currentDay = show.created_at;
					results.push(<h3 key={ i }>{ DateManager.getRecentShowsDate(currentDay.split('T')[0]) }</h3>);
				}

				//results.push(<h5>{ show.headliners }</h5>);

				results.push(<ListItem key={ key } show={ show } showDate={ true } showStar={ true } />);
			}

			results.push(<div className="list-paginator">See More New Shows...</div>);
		}
		else {
			results = <h2>No Recently Added Shows</h2>;
		}


		return (
			<div id="list">
				{ results }
			</div>
		)

	}
};


function mapStateToProps(state) {
	return {
		recent: state.recent.results
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getRecent }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Recent);