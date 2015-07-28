/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	GridEngine = require('../util/GridEngine'),

	moment = require('moment');

module.exports = FeaturedShow = React.createClass({
	render: function() {
		var show = this.props.show;

		return (
			<div className="featured__show">
				<div className="background"></div>
				<div className="content">
					<h2>{ show.headliners }</h2>
					<h4>{ show.venue.name }</h4>
				</div>
			</div>
		)
	}
});

