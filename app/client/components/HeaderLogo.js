import React, { Component } from 'react';
import SGLink from './SGLink';

export default class HeaderLogo extends Component {
	constructor(props) {
		super(props);

		this.translatePageLocationToTitle = this.translatePageLocationToTitle.bind(this);
	}

	translatePageLocationToTitle() {
		var location = window.location.href.toString().split(window.location.host)[1];

		if (location == "/") return "Calendar";

		if (location == "/recent") return "New Shows";
		
		if (location == "/featured") return "Featured";

		if (location == "/profile") return "Me";

		if (location == "/profile") return "Me";

		return "";
	}

	render() {
		var title = this.translatePageLocationToTitle();

		return (
			<div id="header__logo">
				<SGLink to="/">
					<div className="logo"></div>
				</SGLink>
				<span className="location">Nashville</span>
				<span className="page-title">{ title }</span>
			</div>
		)
	}
};