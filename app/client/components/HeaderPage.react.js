/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	
	HeaderPageOption = React.createFactory(require('./HeaderPageOption.react'));

module.exports = HeaderPage = React.createClass({

	render: function() {
		return (
			<div id="header__page">
				<div id="header__page--logo"></div>
				<span id="header__page--location">Nashville</span>

				<div className="header__page--options">
					<HeaderPageOption pageName="calendar" symbol="icon-calendar" text="Calendar" link="/#/" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="featured" symbol="icon-star" text="Awesome Shows" link="/#/featured" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="recent" symbol="icon-recent" text="Recently Added" link="/#/recent" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="onsale" symbol="icon-ticket" text="On Sale Soon" link="/#/onsale" page={this.props.page} selectPage={ this.props.selectPage }/>
					<HeaderPageOption pageName="search" symbol="icon-search" text="Search" link="/#/search" page={this.props.page} selectPage={ this.props.selectPage }/>
				</div>
			</div>
		)
	}
});