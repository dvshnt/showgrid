import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import UserProfile from '../components/UserProfile';
import UserActions from '../components/UserActions';
import ProfilePrompt from '../components/ProfilePrompt';

import { getUserInfo } from '../actions/index';
import Loader from '../components/Loader';
import DocMeta from 'react-doc-meta'
class Profile extends Component {
	componentDidMount() {
		if (!this.props.user) {
			this.props.getUserInfo();
		}
	}

	render() {
		var tags = [
			{name: "description", content: "lorem ipsum dolor"},
			{itemProp: "name", content: "The Name or Title Here"},
			{itemProp: "description", content: "This is the page description"},
			{name: "twitter:card", content: "product"},
			{name: "twitter:title", content: "Page Title"},
			{property: "og:title", content: "Title Here"},	
		]
	
		if (this.props.user) {
			return (
				
				<div id="profile">
					<DocMeta tags={tags} />
					<UserProfile/>
					<UserActions/>
				</div>
			)
		}

		return (
			<div id="profile-prompt">
				<DocMeta tags={tags} />
				<ProfilePrompt/>
			</div>
		)
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