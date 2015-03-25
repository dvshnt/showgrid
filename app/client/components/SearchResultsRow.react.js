/** @jsx React.DOM */
var React = require('react/addons'),
	SearchResultsShow = require('./SearchResultsShow.react');

module.exports = SearchResultsRow = React.createClass({
	render: function() {
		return (
			<div className="search--results__row">
				<div className="search--results__row__venue">
					<a href={ this.props.result.website }>{ this.props.result.name }</a>
				</div>
				{
					this.props.result.shows.map(function(show) {
						return <SearchResultsShow show={ show }/> 
    				})
				}
			</div>
		)
	}
});

