/** @jsx React.DOM */

var React = require('react'),
	ShowGrid = require('./components/ShowGrid.react');

React.render(
	<ShowGrid day={ initialState.day } range={ initialState.range } venues={ initialState.venues }></ShowGrid>,
	document.getElementById('showgrid')
);