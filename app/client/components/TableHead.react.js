/** @jsx React.DOM */

var React = require('react'),
	moment = require('moment');

module.exports = TableHead = React.createClass({

	render: function() {
		var days = [],
			date = null;

		for (var i = 0; i < this.props.range; i++) {
			date = moment(this.props.day, 'MMMM Do YYYY');
			date = date.add(i, 'days');
			date = date.format('dddd MMMM D');

			days.push(
				<div className="cell">
					<span>{ date }</span>
				</div>
			);
		}	

		return (
			<div id="table--head">
				<div className="cell">
					<span>Venue</span>
				</div>
				{ days }
			</div>
		)
	}
});