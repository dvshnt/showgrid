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
			day_offset: 0,
			day: moment(),
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
		if (this.props.featured.length === 0) {
	   		this.props.getFeatured(this.state.page, this.state.day.clone().add(this.state.day_offset,"days").toISOString(), this.state.day.clone().add(this.state.day_offset+1,"days").toISOString());
		}
	}

	nextDay() {
		var offset = this.state.day_offset+1;
		this.props.getFeatured(this.state.page, this.state.day.clone().add(offset,"days").toISOString(),this.state.day.clone().add(offset+1,"days").toISOString());
		this.setState({
			day_offset: offset,
		});
	}

	previousDay() {
		var offset = this.state.day_offset-1;
		this.props.getFeatured(this.state.page, this.state.day.clone().add(offset,"days").toISOString(),this.state.day.clone().add(offset+1,"days").toISOString());
		this.setState({
			day_offset: offset,
		});
	}



	render() {
		var results = [];
		var currentDay = "";
		//console.log("OFFSET",this.state.day_offset)
		var day = this.state.day.clone().add(this.state.day_offset,"days").hour(0).minute(0).second(0);
		results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate(day) }</h3>);

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
