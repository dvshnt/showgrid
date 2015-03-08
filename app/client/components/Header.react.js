/** @jsx React.DOM */

var React = require('react');

module.exports = Header = React.createClass({
	render: function() {
		return (
			<header>
				<a href="/">
					<h1 className="head--title" alt="Showgrid">SG</h1>
				</a>
			</header>
		)
	}
});