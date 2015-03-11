/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	moment = require('moment'),

	ShowGrid = React.createFactory(require('./components/ShowGrid.react')),

	GridEngine = require('./util/GridEngine'),
	DateManager = require('./util/DateManager');


// GridEngine holds domain state for switch between dev and prod
var dataURL = GridEngine.domain + '/i/grid/?range=7';

$.ajax({
	type: "GET",
	url: dataURL,
}).success(function(data, status) {

	// Get today's date for use in calendar production
	var day = moment();

	// We are only getting venue data from server
	var venues = data,
		range = 7,
		days = DateManager.getDaysArray(day, range);

	React.render(
		<ShowGrid venues={ venues } days={ days } range={ range }></ShowGrid>,
		document.getElementById('showgrid')
	);

});


