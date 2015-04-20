/** @jsx React.DOM */
var React = require('react');

module.exports = HeaderPage = React.createClass({
	render: function() {
		return (
			<div id="header__page">
				<div id="header__page--logo"></div>
				<span id="header__page--location">Nashville</span>
				<div id="header__page--search">
					<input className="search" type="text" placeholder="Search by venue or artist"/>
					<input className="search" type="button"/>
				</div>
			</div>
		)
	}
});