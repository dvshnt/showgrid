import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { prepareSearch, getSearchResults } from '../actions/index';

import SearchResults from './SearchResults';


class HeaderSearch extends Component {
	constructor(props, context) {
		super(props, context);

		this.search = this.search.bind(this);
		this.prepareToSearch = this.prepareToSearch.bind(this);
		this.submitSearchForm = this.submitSearchForm.bind(this);
		this.showSearchResults = this.showSearchResults.bind(this);
		this.hideSearchResults = this.hideSearchResults.bind(this);
		this.backToMobileHome = this.backToMobileHome.bind(this);

		this.state = {
			active: props.initialActive
		};
	}

	showSearchResults() {
		console.log("Search link active: " + this.context.history.isActive('/search'));

		if (!this.context.history.isActive('/search')) {
			this.setState({
				active: true
			});
		}
	}

	hideSearchResults() {
		this.setState({
			active: false
		});
	}

	search(query) {
		this.props.getSearchResults(query);
	}

	prepareToSearch() {
		if (!this.state.active) {
			this.showSearchResults();
		}

		var query = React.findDOMNode(this.refs.searchQuery).value;

		var _this = this;

		if (query !== "") {
			this.props.prepareSearch();

			clearTimeout(this.timer);
			this.timer = setTimeout(function() {
				_this.search(query);
			}, 700);
		}
	}

	submitSearchForm(e) {
		e.preventDefault();
		
		this.prepareToSearch();

		this.hideSearchResults();

		this.context.history.pushState(null, '/search')
	}

	backToMobileHome() {
		var logo = document.getElementById("header__logo");
		var search = document.getElementById("header__search");
		var options = document.getElementById("header__options");
		var calendar = document.getElementById("header__calendar");

		logo.style.display = "block";
		search.style.display = "none";
		options.style.display = "block";
		calendar.style.display = "block";
	}

	render() {
		var results = <SearchResults active={ this.state.active } hide={ this.hideSearchResults }/>;

		var changeListener = this.context.history.isActive('/search') ? function() {} : this.prepareToSearch;

		return (
			<form id="header__search" action="" onSubmit={ this.submitSearchForm }>
				<input type="search" ref="searchQuery" placeholder="Search by venue or artist" onChange={ changeListener } onFocus={ this.showSearchResults }/>
				<input type="submit" value=""/>
				{ results }
			</form>
		)
	}
};


HeaderSearch.propTypes = { 
	initialActive: React.PropTypes.bool
};

HeaderSearch.defaultProps = { 
	initialActive: false
};


HeaderSearch.contextTypes = {
	history: PropTypes.object.isRequired
};


function mapStateToProps(state) {
	return {};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getSearchResults, prepareSearch }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearch)