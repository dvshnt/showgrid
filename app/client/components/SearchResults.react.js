/** @jsx React.DOM */
var React = require('react/addons'),
	SearchResultsRow = require('./SearchResultsRow.react');

module.exports = SearchResults = React.createClass({
	render: function() {
		var results = []
		
		for (var i=0; i < this.props.results.length; i++) {
			var key = this.props.results[i].id,
				result = this.props.results[i];

			results.push(<SearchResultsRow key={ key } result={ result }/>)
		}

		return (
			<div className="search--results">{ results }</div>
		)
	}
});

