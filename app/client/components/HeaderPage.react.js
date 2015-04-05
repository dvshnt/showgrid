/** @jsx React.DOM */
var React = require('react');

module.exports = HeaderPage = React.createClass({
	render: function() {
		return (
			<section id="header--page">
				<a href="/">
					<h1 className="header--page__title" alt="Showgrid">SG</h1>
				</a>
			</section>
		)
	}
});