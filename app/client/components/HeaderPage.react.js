/** @jsx React.DOM */
var React = require('react'),
	HeaderPageLogo = React.createFactory(require('./HeaderPageLogo.react'));

module.exports = HeaderPage = React.createClass({
	render: function() {
		return (
			<section id="header--page">
				<HeaderPageLogo/>
			</section>
		)
	}
});