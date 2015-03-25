/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),
	SearchResults = require('./SearchResults.react');

module.exports = Search = React.createClass({
	getInitialState: function() {
		return { results: [] };
	},

	search: function() {
		var _this = this;
		var query = $(".search--bar__text").val().trim();

		$.ajax({
			type: "GET",
			url: "http://localhost:8000/i/search?q=" + query,
		}).success(function(data, status) {
			_this.setState({ results: data.results });
		});	
	},

	render: function() {
		return (
			<div className="search--container">
				<div className="search--bar">
					<input type="text" className="search--bar__text" placeholder="Search by venue, date, or artist"/>
					<input type="button" className="search--bar__button" onClick={ this.search }/>
				</div>
				<SearchResults results={ this.state.results }/>
			</div>
		)
	}
});

