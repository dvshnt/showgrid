/** @jsx React.DOM */

var $ = require('jquery'),
	React = require('react'),

	Swipeable = React.createFactory(require('react-swipeable')),
	moment = require('moment'),

	Calendar = React.createFactory(require('./Calendar.react')),
	Search = React.createFactory(require('./Search.react')),

	GridEngine = require('../util/GridEngine'),
	DateManager = require('../util/DateManager');


React.initializeTouchEvents(true);

module.exports = ShowGrid = React.createClass({

	componentDidMount: function() {
		var _this = this;

		GridEngine.init();

		this.setProps({ range: GridEngine.getCellCount() });

		window.addEventListener("resize", function(e) {
			GridEngine.calculateCellCount();

			_this.setProps({ 
				range: GridEngine.getCellCount()
			});
		});
	},

	componentWillReceiveProps: function(nextProps) {
		// If range changes, we need to update the days array
		if (nextProps.range !== this.props.range) {
			var start = moment(this.props.days[0].date, 'MMMM Do YYYY');

			var days = DateManager.getDaysArray(start, nextProps.range);

			this.setProps({
				range: nextProps.range,
				days: days
			});
		}

	},

	nextPage: function () {
		var _this = this;

		// Get current calendar range
		var offset = this.props.range;

		// Get the last day that we will use to calculate the next page's days
		var day = DateManager.getStartOfNextPage(this.props.days[offset - 1].date);

		var dataURL = GridEngine.domain + '/i/grid/' + 
						day.format('YYYY') + '/' + 
						day.format('M') + '/' + 
						day.format('D') + '?range=' + offset;
		

		$.ajax({
			type: "GET",
			url: dataURL,
		}).success(function(data, status) {
			var days = DateManager.getDaysArray(day, offset);

			_this.setProps({ 
				venues: data,
				days: days
			});
		});
	},

	previousPage: function () {
		var _this = this;

		// Get current calendar range
		var offset = this.props.range;

		// Get the last day that we will use to calculate the next page's days
		var day = DateManager.getStartOfPreviousPage(this.props.days[0].date, offset);

		var dataURL = GridEngine.domain + '/i/grid/' + 
						day.format('YYYY') + '/' + 
						day.format('M') + '/' + 
						day.format('D') + '?range=' + offset;
		

		$.ajax({
			type: "GET",
			url: dataURL,
		}).success(function(data, status) {
			var days = DateManager.getDaysArray(day, offset);

			_this.setProps({ 
				venues: data,
				days: days
			});
		});
	},

	openSearch: function() {
		var search = $(".search--container"),
			button = $(".search--button"),
			grid = $("#grid--container");
		
		if (search.hasClass("active")) {
			button.removeClass("opened");
			search.removeClass("active");
			grid.removeClass("locked");
			return;
		}
		
		button.addClass("opened");
		search.addClass("active");
		grid.addClass("locked");
		search.find(".search--bar__text").focus();
	},

	render: function() {
		return (
			<section id="grid--container">
				<div className="container__search--button">
					<input className="search--button" type="button" onClick={ this.openSearch }/>
				</div>

				<Calendar days={ this.props.days } 
					venues={ this.props.venues } 
					range={ this.props.range }
					nextPage={ this.nextPage }
					previousPage={ this.previousPage }/>

				<Search/>

			</section>
		)
	}
});