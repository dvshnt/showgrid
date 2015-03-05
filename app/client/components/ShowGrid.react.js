/** @jsx React.DOM */

var React = require('../node_modules/react/react'),
	moment = require('../node_modules/moment/moment'),
	Header = require('./Header.react'),
	TableHead = require('./TableHead.react'),
	TableBody = require('./TableBody.react'),
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
			var offset = document.querySelectorAll("#table--head > .cell").length - 1;

			var day = moment(this.props.day, 'MMMM Do YYYY'),
				day = day.add(offset, 'days');
				day = day.format('MMMM Do YYYY');

			this.setProps({ day: day });
		}
	},

	previousPage: function () {
		if (typeof window != 'undefined' && window.document) {
			var offset = document.querySelectorAll("#table--head > .cell").length - 1;

			var day = moment(this.props.day, 'MMMM Do YYYY'),
				day = day.subtract(offset, 'days');
				day = day.format('MMMM Do YYYY');

			this.setProps({ day: day });
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
			</section>
		)
	}
});