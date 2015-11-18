import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import { getFeatured } from '../actions/index';

var DateManager = require('../util/DateManager');


class Featured extends Component {
	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.featured.length === 0) {
	    	this.props.getFeatured();
	    }
	}

	render() {
		var results = [];
		var currentDay = "";

		if (this.props.featured.length > 0) {
			for (var i=0; i < this.props.featured.length; i++) {
				var key = this.props.featured[i].id,
					show = this.props.featured[i];

				if (currentDay === "" || show.date.split('T')[0] !== currentDay) {
					currentDay = show.date.split('T')[0];
					results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate(currentDay.split('T')[0]) }</h3>);
				}

				results.push(<ListItem key={ key } show={ show } showDate={ false } showStar={ false } />);
			}

			results.push(<div className="list-paginator">See More New Shows...</div>);
		}


		return (
			<div id="list">
				{ results }
			</div>
		)

	}
};


function mapStateToProps(state) {
	var featured = state.state.featured.map( s => state.state.entities.shows[s] );

	return {
		featured: featured
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getFeatured }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Featured);