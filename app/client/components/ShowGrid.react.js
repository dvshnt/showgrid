/** @jsx React.DOM */

var $ = require('jquery'),
	React = require('react'),
	moment = require('moment'),
	Header = require('./Header.react'),
	TableHead = require('./TableHead.react'),
	TableBody = require('./TableBody.react'),
	Footer = require('./Footer.react'),
	GridEngine = require('../util/GridEngine');

module.exports = ShowGrid = React.createClass({
	componentDidMount: function() {
		var _this = this;

		GridEngine.init();

		this.setProps({ range: GridEngine.getCellCount() });

		window.addEventListener("resize", function(e) {
			GridEngine.calculateCellCount();

			_this.setProps({ range: GridEngine.getCellCount() });
		});
	},

	nextPage: function () {
		if (typeof window != 'undefined' && window.document) {
			var _this = this;

			var offset = document.querySelectorAll("#table--head > .cell").length - 1;

			var day = moment(this.props.day, 'MMMM Do YYYY'),
				day = day.add(offset, 'days');

			var year = day.format('YYYY'),
				month = day.format('M'),
				dayD = day.format('D');

			var dataURL = 'http://www.showgridnashville.com/i/grid/' + year + '/' + month + '/' + dayD + '?range=' + offset;

			$.ajax({
				type: "GET",
				url: dataURL,
			}).success(function(data, status) {

				_this.setProps({ 
					venues: data,
					day: day.format('MMMM Do YYYY')
				});

			});
		}
	},

	previousPage: function () {
		if (typeof window != 'undefined' && window.document) {
			var _this = this;

			var offset = document.querySelectorAll("#table--head > .cell").length - 1;

			var day = moment(this.props.day, 'MMMM Do YYYY'),
				day = day.subtract(offset, 'days');

			var year = day.format('YYYY'),
				month = day.format('M'),
				dayD = day.format('D');

			var dataURL = 'http://www.showgridnashville.com/i/grid/' + year + '/' + month + '/' + dayD + '?range=' + offset;

			$.ajax({
				type: "GET",
				url: dataURL,
			}).success(function(data, status) {

				_this.setProps({ 
					venues: data,
					day: day.format('MMMM Do YYYY')
				});

			});
		}
	},

	render: function() {
		return (
			<section id="grid--container">
				<div className="arrow previous" onClick={ this.previousPage }></div>
				<div className="arrow next" onClick={ this.nextPage }></div>
				<section id="grid--fixed--container">
					<Header></Header>
					<TableHead 
						day={ this.props.day } 
						range={ this.props.range } />
				</section>
				<TableBody
					day={ this.props.day }
					range={ this.props.range } 
					venues={ this.props.venues } />
				<Footer></Footer>
			</section>
		)
	}
});