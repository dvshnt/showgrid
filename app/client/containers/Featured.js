import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import { getFeatured } from '../actions/index';

var DateManager = require('../util/DateManager');


class Featured extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.featured.length === 0) {
	    	this.props.getFeatured(this.state.page, '2015-12-05');
	    }
	}

	render() {
		var results = [];
		var currentDay = "";

		if (this.props.featured.length > 0) {
			for (var i=0; i < this.props.featured.length; i++) {
				var key = this.props.featured[i].id,
					show = this.props.featured[i];

				if (currentDay === "" || !currentDay.isSame(moment(show.date), 'days')) {
					currentDay = moment(show.date);
					results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate(currentDay) }</h3>);
				}

				results.push(<ListItem key={ key } show={ show } showDate={ false } showStar={ false } />);
			}
		}


		return (
			<div id="list">
				<p>
					You will notice a few shows that have some writing. This will be the focus of the Featured shows section as we expand. We will be writing a ton. We will write with verve, elasticity and any other exciting adjectives you can imagine that bring to mind motion and sound.
				</p>
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
