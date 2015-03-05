/** @jsx React.DOM */

var React = require('react');

module.exports = Header = React.createClass({
	render: function() {
		return (
			<header>
				<a href="/">
					<span className="head--title">SG</span>
				</a>
			</header>
		)
	}
});