import moment from 'moment';
import 'moment-timezone';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import { getFeatured } from '../actions/index';
import DocMeta from 'react-doc-meta'
var DateManager = require('../util/DateManager');
import Loader from '../components/Loader';

class Featured extends Component {
	constructor(props) {
		super(props);

		this.nextDay = this.nextDay.bind(this);
		this.previousDay = this.previousDay.bind(this);

		this.state = {
			day: moment().tz('America/Chicago').hour(0).minute(0).second(0),
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
		var start = this.state.day.clone();
		var end = this.state.day.clone().hour(23).minute(59).second(59);

   		this.props.getFeatured(this.state.page, start.toISOString(), end.toISOString());
	}

	nextDay() {
		var start = this.state.day.clone().add(1, 'days');
		var end = this.state.day.clone().add(1, 'days').hour(23).minute(59).second(59);

		this.props.getFeatured(this.state.page, start.toISOString(), end.toISOString());
		this.setState({
			day: this.state.day.clone().add(1, 'days')
		});
	}

	previousDay() {
		var start = this.state.day.clone().subtract(1, 'days');
		var end = this.state.day.clone().subtract(1, 'days').hour(23).minute(59).second(59);

		this.props.getFeatured(this.state.page, start.toISOString(), end.toISOString());
		
		this.setState({
			day: this.state.day.clone().subtract(1, 'days')
		});
	}



	render() {
		var results = [];
		var currentDay = "";
		
		results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate(this.state.day) }</h3>);

		if (this.props.featured.length > 0) {
			for (var i=0; i < this.props.featured.length; i++) {
				var key = this.props.featured[i].id,
					show = this.props.featured[i];

				results.push(<ListItem key={ key } show={ show } showDate={ false } showStar={ false } showTime={ true }/>);
			}
		}
		else {
			results.push(<h4 className="noshows">Go out with an old friend or something.</h4>);
		}
		
		var tags = [
			{name: "description", content: "lorem ipsum dolor"},
			{itemProp: "name", content: "The Name or Title Here"},
			{itemProp: "description", content: "This is the page description"},
			{name: "twitter:card", content: "product"},
			{name: "twitter:title", content: "Page Title"},
			{property: "og:title", content: "Title Here"},	
		]
		return (
			<div id="list">
				<DocMeta tags={tags} />
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
