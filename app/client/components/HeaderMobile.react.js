/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),

	HeaderMobilePage = React.createFactory(require('./HeaderMobilePage.react')),
	HeaderMobileMenu = React.createFactory(require('./HeaderMobileMenu.react'));


module.exports = HeaderMobile = React.createClass({
	openMenu: function() {
		var body = $("body");

		if (body.hasClass("mobile--open")) return;

		body.addClass("mobile--open");
	},

	closeMenu: function() {
		var body = $("body");

		if (body.hasClass("mobile--open")) {
			body.removeClass("mobile--open")
		}
		return;
	},

	render: function() {
		return (
			<div>
				<HeaderMobileMenu selectPage={ this.props.selectPage } closeMenu={ this.closeMenu }/>
				<HeaderMobilePage openMenu={ this.openMenu } page={ this.props.page } pickDate={ this.props.pickDate } days={ this.props.days } search={ this.props.search }/>
			</div>
		)
	}
});