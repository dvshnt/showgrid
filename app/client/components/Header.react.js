/** @jsx React.DOM */
var React = require('react'),

	HeaderPage = React.createFactory(require('./HeaderPage.react')),
	HeaderCalendar = React.createFactory(require('./HeaderCalendar.react'));


module.exports = Header = React.createClass({
	render: function() {
		return (
			<header>
				<HeaderPage/>
				<HeaderCalendar days={ this.props.days }/>
			</header>
		)
	}
});