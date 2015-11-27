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

		this.getNextPage = this.getNextPage.bind(this);

		this.state = {
			page: 1,
			lastPage: false
		};
	}

	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.featured.length === 0) {
	    	this.props.getFeatured(this.state.page);
	    }
	}

	getNextPage() {
		if (!this.state.lastPage) {
			var _this = this;
	
			var page = this.state.page;
	
			this.props.getFeatured(page + 1)
				.then(function(response) {
					if (response.payload.status === "last_page") {
						_this.setState({
							lastPage: true
						});
						return;
					}
	
					_this.setState({
						page: page + 1
					});
				});
		}
	}

	render() {
		var results = [];
		var currentDay = "";

		if (this.props.featured.length > 0) {
			for (var i=0; i < this.props.featured.length; i++) {
				var key = this.props.featured[i].id,
					show = this.props.featured[i];

				if (currentDay === "" || currentDay.isSame(show.date, 'days')) {
					currentDay = moment(show.date);
					results.push(<h3 key={ i }>{ DateManager.getFeaturedShowDate(currentDay) }</h3>);
				}

				results.push(<ListItem key={ key } show={ show } showDate={ false } showStar={ false } />);
			}

			results.push(
				<div onClick={ this.getNextPage } className="list-paginator">
					{ this.state.lastPage ? "No more featured shows." : "See More Featured Shows..." }
				</div>
			);
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