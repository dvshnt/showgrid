/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	GridEngine = require('../util/GridEngine'),

	FeaturedDay = React.createFactory(require('./FeaturedDay.react')),

	moment = require('moment');

module.exports = Featured = React.createClass({
	getInitialState: function() {
		return {
			page: 1,
			featured: []
		}
	},
	
	componentDidMount: function() {
		this.getFeaturedShows();
	},

	getFeaturedShows: function() {
		var _this = this; 

		$.ajax({
			type: "GET",
			url: GridEngine.domain + "/i/featured?page=" + _this.state.page
		}).success(function(data, status) {
			if (status === "nocontent") {
				$(".featured-more").remove();
				return;
			}

			_this.setState({
				featured: _this.state.featured.concat(data)
			});

			_this.state.page += 1;
		});
	},

	render: function() {
		var results = [];

		if (this.state.featured.length > 0) {
			for (var i=0; i < this.state.featured.length; i++) {
				var day = this.state.featured[i];

				results.push(<FeaturedDay day={ day }/>)
			}
		}

		return (
			<div className="featured--container">
				{ results }
				<div className="featured-more" onClick={ this.getFeaturedShows }>See More Recommended Shows...</div>
			</div>

		)
	}
});

