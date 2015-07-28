/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),

	GridEngine = require('../util/GridEngine'),

	FeaturedShow = React.createFactory(require('./FeaturedShow.react')),

	moment = require('moment');

module.exports = Featured = React.createClass({
	getInitialState: function() {
		return {
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
			url: GridEngine.domain + "/i/featured"
		}).success(function(data, status) {
			_this.setState({
				featured: data
			});
		});	
	},

	render: function() {
		var results = [];

		if (this.state.featured.length > 0) {
			for (var i=0; i < this.state.featured.length; i++) {
				var key = this.state.featured[i].id,
					show = this.state.featured[i];

				results.push(<FeaturedShow key={ key } show={ show }/>)
			}
		}

		return (
			<div className="search--results rec">{ results }</div>
		)
	}
});

