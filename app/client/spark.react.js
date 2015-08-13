/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	Router = require('react-router'),
	moment = require('moment'),

	App = React.createFactory(require('./components/App.react')),

	ShowGrid = React.createFactory(require('./components/ShowGrid.react')),
	Recent = React.createFactory(require('./components/Recent.react')),
	Featured = React.createFactory(require('./components/Featured.react')),
	Search = React.createFactory(require('./components/Search.react')),

	GridEngine = require('./util/GridEngine'),
	DateManager = require('./util/DateManager');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// GridEngine holds domain state for switch between dev and prod
var dataURL = GridEngine.domain + '/i/grid/?range=7';

$.ajax({
	type: "GET",
	url: dataURL,
}).success(function(data, status) {
	
	GridEngine.init(data);

	var routes = (
		<Route name="app" handler={App} path="/">
			<DefaultRoute name="showgrid" handler={ShowGrid}/>
			<Route name="recent" path="/recent" handler={Recent} />
			<Route name="featured" path="/featured" handler={Featured} />
			<Route name="search" path="/search" handler={Search} />
		</Route>
	);

	Router.run(routes, function (Handler) {
		React.render(<Handler/>, document.getElementById('showgrid'));
	});

});