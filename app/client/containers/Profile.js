import React, { Component } from 'react';

import UserProfile from '../components/UserProfile';
import UserActions from '../components/UserActions';


export default class Profile extends Component {
	render() {
		return (
			<div id="profile">
				<UserProfile/>
				<UserActions/>
			</div>
		)
	}
};