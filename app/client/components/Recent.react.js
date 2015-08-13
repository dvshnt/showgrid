/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	GridEngine = require('../util/GridEngine'),

	RecentDay = React.createFactory(require('./RecentDay.react')),

	moment = require('moment');

module.exports = Recent = React.createClass({
	getInitialState: function() {
		return {
			page: 1,
			recent: []
		}
	},
	
	componentDidMount: function() {
		this.getRecentShows();
	},

	getRecentShows: function() {
		var _this = this; 

		$.ajax({
			type: "GET",
			url: GridEngine.domain + "/i/recent?page=" + this.state.page
		}).success(function(data, status) {
			if (status === "nocontent") {
				$(".recent--results-more").remove();
			}

			_this.setState({
				recent: _this.state.recent.concat(data)
			});
		});	

		this.state.page += 1;
	},

	render: function() {
		var results = [];

		if (this.state.recent.length > 0) {
			for (var i=0; i < this.state.recent.length; i++) {
				var key = this.state.recent[i].id,
					day = this.state.recent[i];

				results.push(<RecentDay key={ key } day={ day }/>)
			}
		}

		return (
			<div className="recent--container">
				{ results }
				<div className="recent--results-more" onClick={ this.getRecentShows }>See More New Shows...</div>
			</div>

		)
	}
});

