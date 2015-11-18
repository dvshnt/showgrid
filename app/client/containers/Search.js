import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ListItem from '../components/ListItem';


class Search extends Component {
	constructor(props) {
		super(props);

		this.displaySearchResults = this.displaySearchResults.bind(this);
	}

	displaySearchResults(results) {
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

			list.push(<h4>Search results for: <i>{ this.props.query }</i></h4>);

			for (var i=0; i < results.length; i++) {
				list.push( <ListItem key={ results[i].id } show={ results[i] } showDate={ true } showStar={ true } /> );
			}

			return list;	
		}
	}

	render() {
		var results = this.displaySearchResults(this.props.results.results);

		return (
			<div id="list" className="search-list">
				{ results }
			</div>
		)
	}
};


function mapStateToProps(state) {
	return { 
		query: state.search.query, 
		results: state.search.results,
		waiting: state.search.waiting,
		searching: state.search.searching
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);
