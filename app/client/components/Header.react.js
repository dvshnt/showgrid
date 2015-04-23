/** @jsx React.DOM */
var React = require('react'),

	HeaderPage = React.createFactory(require('./HeaderPage.react')),
	HeaderCalendar = React.createFactory(require('./HeaderCalendar.react'));


module.exports = Header = React.createClass({
	render: function() {
		return (
			<header id="header">
				<HeaderPage launchSearch={ this.props.launchSearch }/>
				<HeaderCalendar days={ this.props.days }/>
			</header>
		)
	}
});