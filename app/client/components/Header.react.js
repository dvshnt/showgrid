/** @jsx React.DOM */
var React = require('react'),

	HeaderPage = React.createFactory(require('./HeaderPage.react')),
	HeaderCalendar = React.createFactory(require('./HeaderCalendar.react')),

	HeaderSearch = React.createFactory(require('./HeaderSearch.react'));


module.exports = Header = React.createClass({
	render: function() {
		return (
			<header id="header">
				<HeaderPage selectPage={ this.props.selectPage } search={ this.props.search } page={ this.props.page }/>
				<HeaderCalendar days={ this.props.days } pickDate={ this.props.pickDate } page={ this.props.page }/>
				<HeaderSearch search={ this.props.search }  page={ this.props.page }/>
			</header>
		)
	}
});