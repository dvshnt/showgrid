/** @jsx React.DOM */

var $ = require('jquery'),
	React = require('react'),
	moment = require('moment'),
	ShowGrid = require('./components/ShowGrid.react');


var dataURL = 'http://localhost:8000/i/grid/';
$.ajax({
	type: "GET",
	url: dataURL,
}).success(function(data, status) {

	var venues = data,
		day = moment().format('MMMM Do YYYY').toString(),
		range = 7;

	React.render(
		<ShowGrid venues={ venues } day={ day } range={ range }></ShowGrid>,
		document.getElementById('showgrid')
	);

});


