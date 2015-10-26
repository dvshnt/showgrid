import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import UserProfile from '../components/UserProfile';
import UserActions from '../components/UserActions';

import { getUserProfile } from '../actions/index';


export default class Profile extends Component {
	componentDidMount() {
		this.props.getUserProfile();
	}

	render() {
		return (
			<div id="profile">
				<UserProfile />
				<UserActions />
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		featured: state.user.profile
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getUserProfile }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);