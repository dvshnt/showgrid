/** @jsx React.DOM */
var React = require('react/addons');

module.exports = CalendarRowVenue = React.createClass({
	render: function() {
		return (
			<div className="venue">
		    	<div className={ this.props.venue.image_url }></div>
		    	
		    	<h3 className="name"><a href={ this.props.venue.website } target="_blank">{ this.props.venue.name }</a></h3>
		    	
		    	<div className="address">
		    		{ this.props.venue.address.street }
		    	</div>
		    	<div className="address">
		    		{ this.props.venue.address.city },  { this.props.venue.address.state } { this.props.venue.address.zip_code }
		    	</div>
	    	</div>
		)
	}
});

