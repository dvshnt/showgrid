/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),

	HeaderMobileCalendar = React.createFactory(require('./HeaderMobileCalendar.react'));

module.exports = HeaderMobileMenu = React.createClass({
	render: function() {
		return (
			<div id="header__mobile">
				<div className="logo"></div>
				<HeaderMobileCalendar days={ this.props.days } pickDate={ this.props.pickDate } page={ this.props.page } search={ this.props.search }/>
				<div className="menu" onClick={ this.props.openMenu }><b className="icon-dot-3"></b></div>
			</div>
		)
	}
});