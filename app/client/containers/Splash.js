import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PanelItem from '../components/PanelItem';

import { getFeatured } from '../actions/index';

import $ from 'jquery';
import moment from 'moment';

var DateManager = require('../util/DateManager');


class Splash extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			page: 1
		}
	}

	componentDidMount() {
		var start = moment();
		var end = start.clone().add(1, 'days');

	    this.props.getFeatured(this.state.page, start.format(), end.format());
	}

	componentWillUpdate(nextProps, nextState) {

	}

	render() {
		var results = [];

		for (var i=0; i < this.props.featured.length; i++) {
			var key = this.props.featured[i].id,
				show = this.props.featured[i];

			results.push(<PanelItem key={ key } show={ show } />);
		}

		return (
			<div id="splash">
				<h4 className="date">Today</h4>
				<section className="featured">
					{ results }
				</section>
				<section className="recent">

				</section>
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