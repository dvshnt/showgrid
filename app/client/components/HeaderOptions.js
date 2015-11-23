import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import HeaderPageOption from './HeaderPageOption';
import LogInOut from './LogInOut';

var GridEngine = require('../util/GridEngine');


export default class HeaderOptions extends Component {
	constructor(props) {
		super(props);

		this.logout = this.logout.bind(this);
		this.activateMobileSearch = this.activateMobileSearch.bind(this);
	}

	logout() {
		if (localStorage.getItem("token") !== null) {
			localStorage.removeItem("token");

			window.location.replace(GridEngine.domain);
		}
	}

	activateMobileSearch() {
		var logo = document.getElementById("header__logo");
		var search = document.getElementById("header__search");
		var options = document.getElementById("header__options");
		var calendar = document.getElementById("header__calendar");

		logo.style.display = "none";
		search.style.display = "block";
		options.style.display = "none";
		calendar.style.display = "none";
	}

	render() {
		return (
			<div id="header__options">
				<Link to="/" activeClassName="selected" onlyActiveOnIndex="true">
					<b className="icon-calendar"></b>
					<br></br>
					<span>Calendar</span>
				</Link>
				<HeaderPageOption symbol="icon-recent" text="New Shows" link="/recent"/>
				<HeaderPageOption symbol="icon-star" text="Featured" link="/featured"/>
				<HeaderPageOption symbol="icon-user" text="My Profile" link="/profile"/>
				<HeaderPageOption symbol="icon-search" text="Search" link="/search"/>
				<LogInOut />
			</div>
		)
	}
};

// function mapStateToProps(state) {
// 	return { 
// 		user: state.state.user
// 	};
// }


// export default connect(mapStateToProps)(HeaderOptions);
				