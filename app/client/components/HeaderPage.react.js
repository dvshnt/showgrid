/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	
	HeaderPageOption = React.createFactory(require('./HeaderPageOption.react'));

module.exports = HeaderPage = React.createClass({
	showPageOptions: function() {
		var pageHeader = $("#header__page");

		if (pageHeader.hasClass("active")) {
			pageHeader.removeClass("active");
			return;
		}

		pageHeader.addClass("active");		
	},

	render: function() {
		return (
			<div id="header__page">
				<a href="/#/"><div id="header__page--logo"></div></a>
				<span id="header__page--location">Nashville</span>

				<div className="header__page--options-mobile" onClick={ this.showPageOptions }>
					<b className="icon-dot-3"></b>
				</div>
				<div className="header__page--options">
					<HeaderPageOption pageName="calendar" symbol="icon-calendar--full" text="Calendar" link="/#/" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="recent" symbol="icon-recent--full" text="New Shows" link="/#/recent" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="featured" symbol="icon-star--full" text="Recommended" link="/#/featured" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="alert" symbol="icon-bell--full" text="Alerts" link="/#/alerts" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="favorite" symbol="icon-heart--full" text="Favorites" link="/#/favorites" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="search" symbol="icon-search" text="Search" link="/#/search" page={this.props.page} selectPage={ this.props.selectPage }/>
				</div>
			</div>
		)
	}
});