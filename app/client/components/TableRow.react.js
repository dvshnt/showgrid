/** @jsx React.DOM */
var React = require('react/addons'),
	
	TableVenueCell = React.createFactory(require('./TableVenueCell.react')),
	TableRowCell = React.createFactory(require('./TableRowCell.react'));

module.exports = TableRow = React.createClass({
	render: function() {
		var venue = this.props.venue;

		return (
			<div className="table--row">
				<TableVenueCell venue={ venue } />
				{
					this.props.days.map(function(day) {
						return <TableRowCell key={ day.id } day={ day } shows={ venue.shows }/>
					})
				}
			</div>
		)
	}
});

