/** @jsx React.DOM */
var React = require('react/addons'),
	SearchResultsRow = React.createFactory(require('./SearchResultsRow.react'));

module.exports = SearchResults = React.createClass({
	render: function() {
		var results = [];
		
		if (typeof this.props.results === "string" && this.props.results === "start") {
			results.push(
				<div className="search__text">
					<h3>For best results, search by venue or artist.</h3>
					<p>For example, <i>mercy lounge</i> or <i>alabama shakes</i></p>
					<p>To look at a particular date, use the date selector at the top of the calender.</p>
				</div>
			);
		}
		else if (typeof this.props.results === "string" && this.props.results === "pending") {
			results.push(<div className="search__throbber"></div>);
		}
		else if (this.props.results.length > 0) {
			for (var i=0; i < this.props.results.length; i++) {
				var key = this.props.results[i].id,
					result = this.props.results[i];

				results.push(<SearchResultsRow key={ key } result={ result }/>)
			}
		}
		else if (this.props.results.length <= 0) {
			results.push(
				<div className="search__text">
					<h2>Unfortunately, no results were found.</h2>
					<h3>For best results, search by venue or artist.</h3>
					<p>For example, <i>mercy lounge</i> or <i>alabama shakes</i></p>
					<p>To look at a particular date, use the date selector at the top of the calender.</p>
				</div>
			);
		}


		return (
			<div className="search--results">{ results }</div>
		)
	}
});

