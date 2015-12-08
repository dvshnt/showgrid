import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getFeatured } from '../actions/index';

import $ from 'jquery';
import moment from 'moment';

class Splash extends Component {
	constructor(props) {
		super(props);

		this.state = {
			today: moment().format("dddd MMMM Do, YYYY"),
			featured: []
		};
	}

	componentDidMount() {
		$("body").addClass("lock");

	    if (this.props.featured.length === 0) {
	    	this.props.getFeatured(this.state.page, moment().add(1, 'days').format("YYYY-MM-DD"));
	    }
	}

	componentWillUnmount() {
		$("body").removeClass("lock");
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.featured && !this.props.featured) {
			
		}
	}

	render() {
		var results = [];
		for (var i = 0; i < this.props.featured.length; i++) {
			var show = this.props.featured[i];

			results.push(
				<div>
					<h2>{ show.headliners }</h2>
				</div>
			);
		}


		return (
			<div id="splash">
				<div className="date">
					{ this.state.today }
				</div>
				<div className="featured">
					{ results }
				</div>
			</div>
		);
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


export default connect(mapStateToProps, mapDispatchToProps)(Splash);