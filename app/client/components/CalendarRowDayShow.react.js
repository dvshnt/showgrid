/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = CalendarRowDayShow = React.createClass({	
	registerEvent: function() {
		ga('send', 'event', 'show', 'click', this.props.show.band_name);  	
		return true;
	},

	render: function() {
		var show = this.props.show,
			artist = show.band_name,
			time = DateManager.formatShowTime(show.date);

		if (show.website !== '') {
			artist = <a href={ show.website } target="_blank" onClick={ this.registerEvent }>{ show.band_name }</a>;
		}

		return (
			<div className="show">
				<div className="show--info">
	            	<div className="time">{ time }</div>
				</div>
	        	<div className="main">{ artist }</div>
	        </div>
		)
	}
});

