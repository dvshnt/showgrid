/** @jsx React.DOM */
var React = require('react/addons'),
	
	CalendarRowDayShow = React.createFactory(require('./CalendarRowDayShow.react')),

	DateManager = require('../util/DateManager');

module.exports = CalendarRowDay = React.createClass({
	hexToRgb: function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},


	render: function() {
		var shows = DateManager.getShowsOnDate(this.props.day, this.props.shows);


		return (
			<div className="day">
				{
					shows.map(function(show) {
						return <CalendarRowDayShow key={ show.id } show={ show }/>
					})
				}
			</div>
		)
	}
});

