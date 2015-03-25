/** @jsx React.DOM */
var React = require('react');

module.exports = Header = React.createClass({
	render: function() {
		return (
			<header>
				<a className="head--title" href="/">SG</a>
			</header>
		)
	}
});