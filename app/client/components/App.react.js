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
	mixins: [Router.State, Router.Navigation],

	getInitialState: function() {
		var venues = GridEngine.getVenues(),
			range = GridEngine.getCellCount(),
			days = DateManager.getDaysArray(moment(), range);

		return {
			venues: venues,
			range: range,
			days: days
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

	nextPage: function () {
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

	render: function() {
		return (
			<div>
				<RouteHandler 
					venues={ this.state.venues } 
					range={ this.state.range } 
					days={ this.state.days }
					next={ this.nextPage }
					previous={ this.previousPage }/>
			</div>
		)
	}
});