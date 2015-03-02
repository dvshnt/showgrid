/** @jsx React.DOM */

var React = require('react'),
	ShowGrid = require('./components/Showgrid.react')

var initialState = JSON.parse(document.getElementById('state--initial').innerHTML);

React.render(
	<ShowGrid day={ initialState.day } range={ initialState.range } venues={ initialState.venues }></ShowGrid>,
	document.getElementById('showgrid')
);