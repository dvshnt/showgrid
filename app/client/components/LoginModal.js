import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hideLoginModal } from '../actions/modal';
import { getUserToken } from '../actions/index';

var GridEngine = require('../util/GridEngine');


class LoginModal extends Component {
	constructor(props) {
		super(props);

		this.userLogin = this.userLogin.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);

		this.state = {
			token: null
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.visible) {
			// window.addEventListener("click", this.closeOnClick, false);
			window.addEventListener("keydown", this.handleKeydown, false);

			React.findDOMNode(this.refs.username).focus();

			return;
		}
		
		// window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	componentWillUnmount() {
		// window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	closeOnClick(e) {
		if (e.target.id === "modal") {
			return false;
		}

		this.props.hideLoginModal();
		return false;
	}

	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.props.hideLoginModal();
		}
	}

	userLogin(e) {
		e.preventDefault();
		
		var username = React.findDOMNode(this.refs.username).value;
		var password = React.findDOMNode(this.refs.password).value;


		var _this = this;

		this.props.getUserToken(username, password)
			.then(function(response) {
				// Verified Login
				if (response.payload.hasOwnProperty('token')) {
					_this.props.hideLoginModal();

					window.location.replace(GridEngine.domain + _this.props.route);
				}

				// Handle Login Errors
				else {

				}
			});

	}

	render() {
		var active = (this.props.visible) ? "active" : "";

		return (
			<div id="overlay" className={ active }>
				<div id="modal">
					<div className="banner"></div>
					<p>
						Sign up for Showgrid to receive the ability to favorite shows, set show alerts, and particpate in all the conversation happening on here!
					</p>
					<form action="" onSubmit={ this.userLogin }>
						<input type="text" ref="username" placeholder="Enter username"/>
						<input type="password" ref="password" placeholder="Enter password"/>
						<input type="submit" placeholder="Sign In"/>
					</form>
				</div>

			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		visible: state.modal.login,
		route: state.router.location.pathname
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ hideLoginModal, getUserToken }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
