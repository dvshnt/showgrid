import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hideLoginModal } from '../actions/modal';
import { getUserToken, signupUser } from '../actions/index';

import FormButton from './FormButton';

import classNames from 'classnames';

var GridEngine = require('../util/GridEngine');


class AuthModal extends Component {
	constructor(props) {
		super(props);
		
		this.userSignup = this.userSignup.bind(this);
		this.userLogin = this.userLogin.bind(this);
		this.resetError = this.resetError.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);

		this.toggleScreen = this.toggleScreen.bind(this);

		this.state = {
			token: null,
			error: false,
			signup_error: false,
			isSignUp: false,
			facebook_login: false,
		};
	}


	componentWillUpdate(nextProps, nextState) {
		if (nextProps.visible) {
			window.addEventListener("click", this.toggleRegister, false);
			window.addEventListener("click", this.closeOnClick, false);
			window.addEventListener("keydown", this.handleKeydown, false);

			React.findDOMNode(this.refs.username).focus();

			return;
		}
		
		window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.closeOnClick);
		window.removeEventListener("keydown", this.handleKeydown);
	}

	closeOnClick(e) {
		if (e.target.id === "overlay") {
			this.closeModal();
			return true;
		}
		return false;
	}



	toggleScreen(e){
		this.setState({
			error: false,
			isSignUp: !this.state.isSignUp
		});
	}


	closeModal() {
		this.setState({
			error: false,
			isSignUp: false
		})
		this.props.hideLoginModal();
		window.location.replace(GridEngine.domain + this.props.route);
	}


	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.props.hideLoginModal();
		}
	}

	resetError(e) {
		if (this.state.error) {
			this.setState({
				signup_error: false,
				error: false
			});
		}
	}

	isGood(response){
		// Verified Login
		console.log('DONE AUTH',response.payload.hasOwnProperty('token'))
		if (response.payload.hasOwnProperty('token')) return this.closeModal();

		// Handle Login Errors
		else if (response.type === "TOKEN_FAILURE") this.setState({ error: true });
	}

	userSignup(e){
		e.preventDefault();

		var email = React.findDOMNode(this.refs.register_email).value;
		var password = React.findDOMNode(this.refs.register_password).value;
		var password2 = React.findDOMNode(this.refs.register_password2).value;

		if(password2 !== password) return this.setState({ error:true })
		
		this.props.signupUser(email, password).then(this.isGood.bind(this));
	}

	userLogin(e) {
		e.preventDefault();

		var username = React.findDOMNode(this.refs.username).value;
		var password = React.findDOMNode(this.refs.password).value;

		this.props.getUserToken(username, password).then(this.isGood.bind(this));
	}



	render() {
		var active = (this.props.visible) ? "active" : "";

		console.log(this.state.isSignUp);
		var container_state= classNames({
			'modalScreenContainer' : true,
			'page2': this.state.isSignUp == true ? true : false 
		})

		return (
			<div id="overlay" className={ active }>
				<div id="modal">
					<b id="close" className="icon-close" onClick={ this.closeModal }></b>
					<div className="banner"></div>
					<div className = {container_state}>
						<div className= 'modalScreen' id='LogInModalScreen'>
							<p>
								<span ><b><a href="#" onClick={ this.toggleScreen }>Sign up</a></b></span> for Showgrid to receive the ability to favorite shows, set show alerts, and particpate in all the conversation happening on here!
							</p>
							<form action="" onSubmit={ this.userLogin }>
								<input required type="text" ref="username" placeholder="Enter username" onChange={ this.resetError }/>
								<input required type="password" ref="password" placeholder="Enter password" onChange={ this.resetError }/>
								<FormButton error={ this.state.error } errorMessage="Invalid Username or Password" submitMessage="Sign In" />
							</form>
							<p>
								forgot your password? email <a href="mailto:info@showgrid.com?Subject=Password%20RESET" target="_top" ><b>info@showgrid.com</b></a>
							</p>
						</div>
						<div className= 'modalScreen' id='SignUpModalScreen'>
							<p>
								Sign up with your email and a password.
							</p>
							<form action="" onSubmit={ this.userSignup }>
								<input required type="email" ref="register_email" placeholder="Enter Email" onChange={ this.resetError }/>
								<input required type="password" ref="register_password" placeholder="Enter password" onChange={ this.resetError }/>
								<input required type="password" ref="register_password2" placeholder="Confirm password" onChange={ this.resetError }/>
								<FormButton error = { this.state.error } errorMessage="hm...try again" submitMessage="Sign Up" />
							</form>
							<br/>
							<span><b><a href="#" onClick={ this.toggleScreen }>Log In</a></b></span>
						</div>
					</div>

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
	return bindActionCreators({ hideLoginModal, getUserToken, signupUser}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);
