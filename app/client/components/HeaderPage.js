import React, { Component } from 'react';

import HeaderLogo from './HeaderLogo';
import HeaderSearch from './HeaderSearch';
import HeaderOptions from './HeaderOptions';


export default class HeaderPage extends Component {
	render() {
		var logo = "";
		var search = "";


		if (window.innerWidth > 500
			|| document.documentElement.clientWidth >500
			|| document.body.clientWidth > 500
		) {

			var logo = <HeaderLogo />;
			var search = <HeaderSearch />;

		}


		return (
			<div id="header__page">
				{ logo }
				{ search }
				<HeaderOptions />
			</div>
		)
	}
};