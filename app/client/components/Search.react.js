/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),
	SearchResults = React.createFactory(require('./SearchResults.react')),

	GridEngine = require('../util/GridEngine'),

	moment = require('moment'),
	Pikaday = require('../util/pikaday');

module.exports = Search = React.createClass({
	componentDidMount: function() {
		var _this = this;

		if (this.props.query) {
			$(".search--bar__text").val(this.props.query);
			this.search();
		}

	    $(".search--bar__text").focus();
	},

	getInitialState: function () {
		return { results: [] };
	},

	searchTextChange: function () {

	},

	search: function() {
		var _this = this;

		var query = $(".search--bar__text").val().trim();
	
        ga('send', 'event', 'search', 'query', query);    

		$.ajax({
			type: "GET",
			url: GridEngine.domain + "/i/search?q=" + query
		}).success(function(data, status) {
			_this.setState({ 
				results: data.results
			});
		});	

		return false;
	},

	searchKeyDown: function(e) {
		var search = $(".container__search--button");

		if (search.hasClass("opened") && e.keyCode === 13) {
			this.search();
		}
	},

	render: function() {
		return (
			<div className="search--container">
				<form className="search--bar" action="" onSubmit={ this.search }>
					<a href="/#/" className="a__to--calendar"><div className="to--calendar"></div></a>
					<div className="search--bar__input">
						<input type="search" className="search--bar__text" placeholder="Search by venue or artist"/>
					</div>
					<input type="submit" className="search--bar__button" value=""/>
				</form>
				<SearchResults results={ this.state.results }/>
			</div>
		)
	}
});

