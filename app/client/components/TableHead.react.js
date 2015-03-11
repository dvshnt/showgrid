/** @jsx React.DOM */
var React = require('react'),
	TableHeadDateCell = React.createFactory(require('./TableHeadDateCell.react'));

module.exports = TableHead = React.createClass({
	render: function() {
		return (
			<div id="table--head">
				<div className="cell">
					<span>Venue</span>
				</div>
				{
					this.props.days.map(function(day) {
						return <TableHeadDateCell key={ day.id } day={ day.date }/>
	    			})
				}
			</div>
		)
	}
});