/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	DateManager = require('../util/DateManager'),

	FeaturedShow = React.createFactory(require('./FeaturedShow.react')),

	moment = require('moment');

module.exports = FeaturedDay = React.createClass({
	getInitialState: function() {
		var day = DateManager.getFeaturedShowDate(this.props.day.date);

		return {
			day: day,
			featured: this.props.day.shows
		}
	},
	
	render: function() {
		return (
			<div className="featured--day">
				<h2>{ this.state.day }</h2>
				{
					this.state.featured.map(function(show) {
						return <FeaturedShow show={ show }/> 
					})
				}
			</div>
		)
	}
});

