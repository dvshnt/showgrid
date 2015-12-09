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

		this.nextDay = this.nextDay.bind(this);
		this.previousDay = this.previousDay.bind(this);

		this.state = {
			day: moment(),
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.featured.length === 0) {
	    	var start = this.state.day.format();
	    	var end = this.state.day.clone().add(1, 'days').format();

	    	this.props.getFeatured(this.state.page, start, end);
	    }
	}

	nextDay() {
		var start = this.state.day.clone().add(1, 'days');
		var end = start.clone().add(1, 'days');

	    this.props.getFeatured(this.state.page, start.format(), end.format());

	    this.setState({
	    	day: start
	    });
	}

	previousDay() {
		var start = this.state.day.clone().subtract(1, 'days');
		var end = this.state.day;

	    this.props.getFeatured(this.state.page, start.format(), end.format());

	    this.setState({
	    	day: start
	    });
	}

	render() {
		var results = [];
		var currentDay = "";

		results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate( this.state.day ) }</h3>);

		if (this.props.featured.length > 0) {
			for (var i=0; i < this.props.featured.length; i++) {
				var key = this.props.featured[i].id,
					show = this.props.featured[i];

				results.push(<ListItem key={ key } show={ show } showDate={ false } showStar={ false } />);
			}
		}
		else {
			results.push(<h4 className="noshows">Go out with an old friend or something.</h4>);
		}

		results.splice(1, 0, <p>
				You will notice a few shows that have some writing. This will be the focus of the Featured shows section as we expand. We will be writing a ton. We will write with verve, elasticity and any other exciting adjectives you can imagine that bring to mind motion and sound.<br></br><br></br>If you wanna write with us, email &nbsp;<a href="mailto:writing@showgrid.com"><b>writing@showgrid.com</b></a>&nbsp; and tell us (candidly) about your favorite concert experience.
			</p>
		);


		return (
			<div id="list">
				<div className="arrow previous" onClick={ this.previousDay }></div>
				<div className="arrow next" onClick={ this.nextDay }></div>
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
