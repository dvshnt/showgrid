/** @jsx React.DOM */
var React = require('react/addons'),
	SearchResultsRow = React.createFactory(require('./SearchResultsRow.react'));

module.exports = SearchResults = React.createClass({
	render: function() {
		var results = [];
		
		if (this.props.results.length > 0) {
			for (var i=0; i < this.props.results.length; i++) {
				var key = this.props.results[i].id,
					result = this.props.results[i];

				results.push(<SearchResultsRow key={ key } result={ result }/>)
			}
		}
		else {
			results.push(<div className="search__no--results">There ain&#39;t a thing here</div>);
		}


		return (
			<div className="search--results">{ results }</div>
		)
	}
});

