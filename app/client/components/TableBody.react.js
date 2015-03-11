/** @jsx React.DOM */
var React = require('react/addons'),
	TableRow = React.createFactory(require('./TableRow.react'));

module.exports = TableBody = React.createClass({
	render: function() {
		var days = this.props.days;

		return (
			<section id="table--body">
				<div className="table--body--pad"></div>
				{
					this.props.venues.map(function(venue) {
						return <TableRow key={ venue.id } days={ days } venue={ venue }/>
    				})
				}
			</section>
		)
	}
});