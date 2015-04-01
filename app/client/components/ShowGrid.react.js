/** @jsx React.DOM */

var $ = require('jquery'),
	React = require('react'),

	moment = require('moment'),

	Swipeable = React.createFactory(require('react-swipeable')),

	ControlNext = React.createFactory(require('./ControlNext.react')),
	ControlPrevious = React.createFactory(require('./ControlPrevious.react')),

	Header = React.createFactory(require('./Header.react')),
	Calendar = React.createFactory(require('./Calendar.react')),
	Footer = React.createFactory(require('./Footer.react')),

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

	render: function() {
		return (
			<section id="container">
				<ControlNext next={ this.nextPage }/>
				<ControlPrevious previous={ this.previousPage }/>

				<Header days={ this.props.days } />
				<Swipeable onSwipedLeft={ this.nextPage } onSwipedRight={ this.previousPage }>
					<Calendar venues={ this.props.venues } days={ this.props.days }/>
					<Footer/>
				</Swipeable>

			</section>
		)
	}
});