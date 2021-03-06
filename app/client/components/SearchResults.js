import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SearchResult from './SearchResult';


class SearchResults extends Component {
	constructor(props) {
		super(props);

		this.closeOnClick = this.closeOnClick.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.displaySearchResults = this.displaySearchResults.bind(this);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.active) {
			window.addEventListener("click", this.closeOnClick, false);
			window.addEventListener("keydown", this.handleKeydown, false);
			return;
		}
		
		window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.props.hide();
		}
	}

	closeOnClick(e) {
		if (e.target.id === "search-results" || e.target.type === "search" || e.target.type === "submit") {
			return false;
		}

		this.props.hide();
		return false;
	}

	displaySearchResults(query, results) {

		if(this.props.waiting) return null;

		if (query === "") {
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

			for (var i=0; i < results.length; i++) {
				list.push( <SearchResult show={ results[i] } /> );
			}

			return (
				<div className="success">
					{ list }
				</div>
			);	
		}
	}

	render() {
	
		var { results, waiting, searching, query } = this.props;

		var className = (this.props.active) ? "active" : "";

	

		if(this.props.waiting){
			className += " waiting";
		}
		
		var data = this.displaySearchResults(query, results);
		

		return (
			<div id="search-results" className={ className }>
				<div className="working"></div>
				{ data }
			</div>
		)
	}
};


function mapStateToProps(state) {
	return { 
		waiting: state.state.search.waiting,
		query: state.state.search.query,
		results: state.state.search.results.map( s => state.state.entities.shows[s] ),
		searching: state.state.search.searching
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)