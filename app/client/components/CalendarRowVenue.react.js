/** @jsx React.DOM */
var React = require('react/addons');

module.exports = CalendarRowVenue = React.createClass({
	hexToRgb: function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},

	render: function() {
		this.props.venue.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var primaryColor = {
			'background': this.props.venue.primary_color,
			'padding': '6px 6px',
			'-webkit-transform': 'rotate(-2deg) skewX(-2deg)'
		};


		var accentColor = {
			'color': this.props.venue.secondary_color
		};


		return (
			<div className="venue">
				<div className="venueInner">
			    	<h3 className="name" style={ primaryColor }><a href={ this.props.venue.website } target="_blank" style={ accentColor }>{ this.props.venue.name }</a></h3>
			    	
					<div className={ this.props.venue.image_url }></div>

			    	<div className="address">
		    			{ this.props.venue.address.street }
			    	</div>
			    	<div className="address">
			    		{ this.props.venue.address.city },  { this.props.venue.address.state } { this.props.venue.address.zip_code }
			    	</div>
		    	</div>
			</div>
		)
	}
});

