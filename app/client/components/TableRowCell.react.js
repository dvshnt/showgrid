/** @jsx React.DOM */
var React = require('react/addons'),
	
	TableShowCell = React.createFactory(require('./TableShowCell.react')),
	DateManager = require('../util/DateManager');

module.exports = TableRowCell = React.createClass({
	render: function() {
		var shows = DateManager.getShowsOnDate(this.props.day, this.props.shows);

		return (
			<div className="cell">
				{
					shows.map(function(show) {
						return <TableShowCell key={ show.id } show={ show }/>
					})
				}
			</div>
		)
	}
});

