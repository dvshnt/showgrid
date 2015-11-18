import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import UserProfile from '../components/UserProfile';
import UserActions from '../components/UserActions';
import ProfilePrompt from '../components/ProfilePrompt';

import { getUserInfo } from '../actions/index';


class Profile extends Component {
	componentDidMount() {
		if (!this.props.user) {
			this.props.getUserInfo();
		}
	}

	render() {
		if (this.props.user) {
			return <div id="profile"><UserProfile/><UserActions/></div>;
		}

		return <div id="profile-prompt"><ProfilePrompt/></div>;
	}
};


function mapStateToProps(state) {
	return {
		waiting: state.state.waiting,
		user: state.state.entities.user
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getUserInfo }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);