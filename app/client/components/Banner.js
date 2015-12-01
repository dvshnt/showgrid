import React, { Component } from 'react';


export default class Banner extends Component {
	constructor(props) {
		super(props);

		this.closeBanner = this.closeBanner.bind(this);

		this.state = {
			open: !localStorage.getItem("seen_banner")
		};
	}

	closeBanner() {
		localStorage.setItem("seen_banner", true);

		this.setState({
			open: false
		});
	}

	render() {
		var bannerClass = this.state.open ? "active" : "";

		return (
			<div id="banner" className={ bannerClass }>
				<div className="close" onClick={ this.closeBanner }>&#10006;</div>
				<div className="text">New Showgrid! Hang with us while we iron out the kinks and email &nbsp;<a href="mailto:info@showgrid.com?subject=Showgrid User Report">info@showgrid.com</a>&nbsp; should you come across any bugs or weirdness!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thanks, Davis.</div>
			</div>
		)
	}
};