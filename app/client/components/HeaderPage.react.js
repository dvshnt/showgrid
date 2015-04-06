/** @jsx React.DOM */
var React = require('react');

module.exports = HeaderPage = React.createClass({
	render: function() {
		return (
			<section id="header--page">
				<a href="/">SG</a>
				<a href="/#/search"><div className="to--search"></div></a>
			</section>
		)
	}
});