import React, { Component } from 'react';

import HeaderPage from './HeaderPage';
import SubHeader from './SubHeader';


export default class Header extends Component {
	render() {
		
		
		return (
			<header id="header">
				<HeaderPage />
				<SubHeader />
			</header>
		)
	}
};