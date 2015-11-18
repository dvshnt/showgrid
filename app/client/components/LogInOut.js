import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { showLoginModal } from '../actions/modal';

var GridEngine = require('../util/GridEngine');


class LogInOut extends Component {
	constructor(props) {
		super(props);

		this.logInOut = this.logInOut.bind(this);
		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);
	}

	logInOut() {
		if (this.props.user !== "") {
			this.logout();
			return;
		} 

		this.login();
	}

	login() {
		this.props.showLoginModal();
	}

	logout() {
		if (localStorage.getItem("token") !== null) {
			localStorage.removeItem("token");
			window.location.replace(GridEngine.domain);
		}
	}

	render() {
		var text = this.props.user !== "" ? "Log Out" : "Log In";

		return (
			<span className="loginout" onClick={ this.logInOut }>{ text }</span>
		)
	}
};


function mapStateToProps(state) {
	return { 
		user: state.state.user
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ showLoginModal }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(LogInOut);
				