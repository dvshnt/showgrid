/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react');

module.exports = HeaderPage = React.createClass({
	render: function() {
		return (
			<div id="header__page">
				<div id="header__page--logo"></div>
				<span id="header__page--location">Nashville</span>

				<form id="header__page--search"  action="" onSubmit={ this.props.launchSearch }>
					<input className="search" type="text" placeholder="Search by venue or artist"/>
					<input className="search" type="submit" value=""/>
				</form>
			</div>
		)
	}
});