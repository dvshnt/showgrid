/** @jsx React.DOM */
var React = require('react');

module.exports = HeaderPageLogo = React.createClass({
	render: function() {
		return (
			<a href="/">
				<h1 className="header--page__title" alt="Showgrid">SG</h1>
			</a>
		)
	}
});