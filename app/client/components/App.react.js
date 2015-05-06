/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	Router = require('react-router'),
	moment = require('moment'),

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

		var searchQuery = "";

		return {
			venues: venues,
			range: range,
			days: days,
			query: searchQuery
		};
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

	launchSearch: function() {
		var search = $("input.search[type=text]").val().trim();

		if (search || window.innerWidth <= 500) {
			this.setState({
				query: search
			});

			window.location.href = "/#/search";
		}

		return false;
	},

	render: function() {
		return (
			<div>
				<RouteHandler 
					venues={ this.state.venues } 
					range={ this.state.range } 
					days={ this.state.days }

					next={ this.nextPage }
					previous={ this.previousPage }

					query={ this.state.query }
					pickDate={ this.pickDate }
					launchSearch={ this.launchSearch }/>
			</div>
		)
	}
});
