import React, { Component } from 'react';

import HeaderCalendar from './HeaderCalendar';
import HeaderSearch from './HeaderSearch';


export default class Header extends Component {
	constructor(props) {
		super(props);

		this.getSubHead = this.getSubHead.bind(this);
	}

	getSubHead() {
		var location = window.location.href.toString().split(window.location.host)[1];

		if (location === "/calendar") {
			return <HeaderCalendar />;
		}

		if (location === "/search" 
			&& (window.innerWidth <= 500
			|| document.documentElement.clientWidth <= 500
			|| document.body.clientWidth <= 500)) {

			return <HeaderSearch mode="subhead"/>;
		}

		return <span></span>;
	}

	render() {
		return this.getSubHead();
	}
};