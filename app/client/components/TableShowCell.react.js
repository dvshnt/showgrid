/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = TableShowCell = React.createClass({
	render: function() {
		var show = this.props.show,
			artist = show.band_name,
			time = DateManager.formatShowTime(show.date);

		if (show.website !== '') {
			artist = <a href={ show.website } target="_blank">{ show.band_name }</a>;
		}

		return (
			<div className="show">
	            <div className="time">{ time }</div>
	        	<div className="artist">{ artist }</div>
	        </div>
		)
	}
});

