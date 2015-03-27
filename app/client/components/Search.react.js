/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),
	SearchResults = require('./SearchResults.react'),

	moment = require('moment'),
	Pikaday = require('../util/pikaday');

module.exports = Search = React.createClass({
	componentDidMount: function() {

		var picker = new Pikaday({
	        field: document.getElementById("search__date--picker"),
	        format: 'MMMM Do',
	        minDate: moment().toDate(),
	        onSelect: function() {
	            $("#search__date--picker")
	            	.data("date", this.getMoment().format('YYYY-MM-DD'))
	            	.addClass("picked");

	           	$(".search--bar__clear").addClass("ready");
	        }
	    });

	},

    focusDatepicker: function () {
    	$("#search__date--picker").addClass("focused");
    },
	   
    focusSearchText: function () {
    	$(".search--bar__text").addClass("focused");
    },
	   
    blurDatepicker: function () {
    	$("#search__date--picker").removeClass("focused");
    },
	   
    blurSearchText: function () {
    	$(".search--bar__text").removeClass("focused");
    },

	getInitialState: function () {
		return { results: [], day: "Select Date" };
	},

	searchTextChange: function () {
		var searchText = $(".search--bar__text"),
			searchClear = $(".search--bar__clear"),
			datepicker = $("#search__date--picker");

		if ((searchText.val() !== "" || datepicker.hasClass("picked")) && !searchClear.hasClass("ready")) {
			searchClear.addClass("ready");
			return;
		}

		else if (searchText.val() === "" && !datepicker.hasClass("picked")) {
			searchClear.removeClass("ready");
		}
	},

	search: function() {
		var _this = this;

		var query = $(".search--bar__text").val().trim(),
			date = $("#search__date--picker").data("date");

		$.ajax({
			type: "GET",
			url: "http://localhost:8000/i/search?q=" + query + "&d=" + date,
		}).success(function(data, status) {
			_this.setState({ 
				results: data.results, 
				day: (data.day) ? moment(data.day).format("MMMM Do") : "Select Date" });
		});	
	},

	clearSearch: function() {
		var searchText = $(".search--bar__text"),
			datepicker = $("#search__date--picker");

		datepicker.removeClass("picked").val("Select Date").data("date", "");

		searchText.val("");
	},

	render: function() {
		return (
			<div className="search--container">
				<div className="search--bar">
					<input type="button" id="search__date--picker" value={ this.state.day } data-date="" onClick={ this.pickDate } onFocus={ this.focusSearchText } onBlur={ this.blurSearchText }/>
					<input type="text" className="search--bar__text" placeholder="Search by venue or artist" onFocus={ this.focusDatepicker } onBlur={ this.blurDatepicker } onChange={ this.searchTextChange }/>
					<input type="button" className="search--bar__clear" onClick={ this.clearSearch }/>
					<input type="button" className="search--bar__button" value="Search" onClick={ this.search }/>
				</div>
				<SearchResults results={ this.state.results }/>
			</div>
		)
	}
});

