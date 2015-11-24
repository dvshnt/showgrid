import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';
import { pageLoaded } from '../actions/index';


class Search extends Component {
	constructor(props) {
		super(props);

		this.displaySearchResults = this.displaySearchResults.bind(this);
	}

	componentDidMount() {
		this.props.pageLoaded();
	}

	displaySearchResults(results) {
		if (this.props.query === "") {
			return (
				<div className="fail">
					<p>For best results, search by venue or artist.</p>
					<p>For example, <i>mercy lounge</i> or <i>alabama shakes</i></p>
					<p>To look at a particular date, use the date selector at the top of the calender.</p>
				</div>
			);
		}
		
		if (results.length === 0 ) {
			return (
				<div className="fail">
					<h3>We couldn&#39;t find anything related to your query.</h3>
					<p>For best results, search by venue or artist.</p>
					<p>For example, <i>mercy lounge</i> or <i>alabama shakes</i></p>
					<p>To look at a particular date, use the date selector at the top of the calender.</p>
				</div>
			);		
		}

		if (results.length > 0) {
			var list = [];

			list.push(<h4 className="query">Search results for: <i>{ this.props.query }</i></h4>);

			for (var i=0; i < results.length; i++) {
				list.push( <ListItem key={ results[i].id } show={ results[i] } showDate={ true } showStar={ true } /> );
			}

			return list;	
		}
	}

	render() {
		var results = this.displaySearchResults(this.props.results);

		return (
			<div id="list" className="search-list-full">
				{ results }
			</div>
		)
	}
};


function mapStateToProps(state) {
	return { 
		query: state.state.search.query, 
		results: state.state.search.results.map( s => state.state.entities.shows[s] ),
		waiting: state.state.waiting,
		searching: state.state.search.searching
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ pageLoaded }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);
