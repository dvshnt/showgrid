/** @jsx React.DOM */

var React = require('react/addons'),
	moment = require('moment');

module.exports = TableBody = React.createClass({
	render: function() {
		var rows = [],
			date = null;

		for (var k = 0; k < this.props.venues.length; k++) {
			var venue = this.props.venues[k];

			var row = [];
			row.push(
				<div className="venue">
			    	<div className={ venue.image_url }></div>
			    	<div className="name">{ venue.name }</div>
			    	<div className="address">
			    		{ venue.address.street }
			    	</div>
			    	<div className="address">
			    		{ venue.address.city },  { venue.address.state } { venue.address.zip_code }
			    	</div>
		    	</div>
		    );

		    date = moment(this.props.day, 'MMMM Do YYYY');
		    for (var i = 0; i < this.props.range; i++) {
		    	var shows = [];
		    	for (var j = 0; j < venue.shows.length; j++) {
		    		var showDate = moment(venue.shows[j].date, 'YYYY-MM-DD HH:mm:ssZZ').format('MMMM Do YYYY');
		    		
		    		if ( date.isSame(moment(showDate, 'MMMM Do YYYY')) ) {
		    			var time = moment(venue.shows[j].date, 'YYYY-MM-DD HH:mm:ssZZ').format('h A');

		    			 shows.push(
		    			 	<div className="show">
					            <div className="time">{ time}</div>
					        	<div className="artist">{ venue.shows[j].band_name }</div>
					        </div>
		    			 );
		    		}

		    	}							

	    		row.push(
	    			<div className="cell">
	    				{ shows }
	    			</div>
	    		);

				date = date.add(1, 'days');
		    }

			rows.push(
				<div className='table--row'>
					{ row }
				</div>
			);
		}

		return (
			<section id="table--body">
				<div className="table--body--pad"></div>
				{ rows }
			</section>
		)
	}
});