/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	Router = require('react-router'),
	moment = require('moment'),

	Header = React.createFactory(require('./Header.react')),

	GridEngine = require('../util/GridEngine'),
	DateManager = require('../util/DateManager');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

module.exports = App = React.createClass({
	getInitialState: function() {
		var venues = GridEngine.getVenues(),
			range = GridEngine.getCellCount(),
			days = DateManager.getDaysArray(moment(), range);

		var page = this.getCurrentPage(),
			searchQuery = "",
			searchResults = "start";

		return {
			venues: venues,
			range: range,
			days: days,
			page: page,
			query: searchQuery,
			results: searchResults
		};
	},

	getCurrentPage: function() {
		var path = window.location.hash;

		if (path.indexOf("search") > -1) return "search";
		else if (path.indexOf("recent") > -1) return "recent";
		else if (path.indexOf("onsale") > -1) return "onsale";
		else if (path.indexOf("featured") > -1) return "featured";
		else if (path.indexOf("alerts") > -1) return "alerts";
		else if (path.indexOf("favorites") > -1) return "favorites";

		return "calendar";
	},

	selectPage: function(page) {
		var body = $("body");

		if (body.hasClass("mobile--open")) {
			body.removeClass("mobile--open")
		}
		
		this.setState({
			page: page
		});
		return;
	},

	componentDidMount: function() {
		var _this = this;

		window.addEventListener("resize", function(e) {
			GridEngine.calculateCellCount();

			_this.setState({ 
				range: GridEngine.getCellCount()
			});
		});
	},

	componentWillUpdate: function(nextProps, nextState) {
		// If range changes, we need to update the days array
		if (nextState.range !== this.state.range) {
			var start = moment(this.state.days[0].date, 'MMMM Do YYYY');

			var days = DateManager.getDaysArray(start, nextState.range);

			this.setState({
				range: nextState.range,
				days: days
			});
		}

	},

	pickDate: function(start) {
		ga('send', 'event', 'pick date', 'select');

		var _this = this;

		var dataURL = GridEngine.domain + '/i/grid/' + 
						start.format('YYYY') + '/' + 
						start.format('M') + '/' + 
						start.format('D') + '?range=' + _this.state.range;
		
		$.ajax({
			type: "GET",
			url: dataURL,
		}).success(function(data, status) {
    		var days = DateManager.getDaysArray(start, _this.state.range);

			_this.setState({
				venues: data,
				days: days
			});
        	
            return true;
		});
	},

	nextPage: function () {
		ga('send', 'event', 'paging', 'click', 'next page');		

		var _this = this;

		// Get current calendar range
		var offset = this.state.range;

		// Get the last day that we will use to calculate the next page's days
		var day = DateManager.getStartOfNextPage(this.state.days[offset - 1].date);

		var dataURL = GridEngine.domain + '/i/grid/' + 
						day.format('YYYY') + '/' + 
						day.format('M') + '/' + 
						day.format('D') + '?range=' + offset;
		

		$.ajax({
			type: "GET",
			url: dataURL,
		}).success(function(data, status) {
			var days = DateManager.getDaysArray(day, offset);

			_this.setState({ 
				venues: data,
				days: days
			});
		});
	},

	previousPage: function () {
		ga('send', 'event', 'paging', 'click', 'previous page');  

		var _this = this;

		// Get current calendar range
		var offset = this.state.range;

		// Get the last day that we will use to calculate the next page's days
		var day = DateManager.getStartOfPreviousPage(this.state.days[0].date, offset);

		var dataURL = GridEngine.domain + '/i/grid/' + 
						day.format('YYYY') + '/' + 
						day.format('M') + '/' + 
						day.format('D') + '?range=' + offset;
		

		$.ajax({
			type: "GET",
			url: dataURL,
		}).success(function(data, status) {
			var days = DateManager.getDaysArray(day, offset);

			_this.setState({ 
				venues: data,
				days: days
			});
		});
	},

	search: function() {
		var _this = this;

		this.setState({ 
			results: "pending"
		});


		// Hacky way to work around double search bars for mobile and desktop (500px = breakpoint)
		var query = "";
		if (window.innerWidth > 500) {
			query = $(".search--bar__text").val().trim();
		}
		else {
			query = $("#header__mobile .search--bar__text").val().trim();
		}
	

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

	render: function() {
		return (
			<div>
				<Header days={ this.state.days } pickDate={ this.pickDate } selectPage={ this.selectPage } page={ this.state.page } search={ this.search }/>
				<RouteHandler 
					venues={ this.state.venues } 
					range={ this.state.range } 
					days={ this.state.days }

					next={ this.nextPage }
					previous={ this.previousPage }

					page={ this.state.page }

					query={ this.state.query }
					results={ this.state.results }/>
			</div>
		)
	}
});
