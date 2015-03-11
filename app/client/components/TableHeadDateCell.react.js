/** @jsx React.DOM */
var React = require('react'),
	DateManager = require('../util/DateManager');

module.exports = TableHeadDateCell = React.createClass({
	render: function() {
		return (
			<div className="cell">
				<span>{ DateManager.formatHeadDate(this.props.day) }</span>
			</div>
		)
	}
});