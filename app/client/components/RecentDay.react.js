/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	DateManager = require('../util/DateManager'),

	RecentShow = React.createFactory(require('./RecentShow.react')),

	moment = require('moment');

module.exports = RecentDay = React.createClass({
	getInitialState: function() {
		var day = DateManager.getRecentShowsDate(this.props.day.date);

		return {
			day: day,
			recent: this.props.day.shows
		}
	},
	
	render: function() {
		return (
			<div className="recent--day">
				<h2>{ this.state.day }</h2>
				{
					this.state.recent.map(function(show) {
						return <RecentShow show={ show }/> 
					})
				}
			</div>
		)
	}
});

