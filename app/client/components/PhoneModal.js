import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hidePhoneModal } from '../actions/modal';
import { submitUserPhone, submitPhonePin } from '../actions/index';

import FormButton from './FormButton';

var GridEngine = require('../util/GridEngine');


class PhoneModal extends Component {
	constructor(props) {
		super(props);

		this.goToNextPinInput = this.goToNextPinInput.bind(this);
		this.userSubmitPhone = this.userSubmitPhone.bind(this);
		this.userSubmitPin = this.userSubmitPin.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);
		this.resetState = this.resetState.bind(this);

		this.state = {
			error: false,
			verify: false,
			success: false
		};
	}

	resetState(){
		this.setState({
			error: false
		});
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.visible) {
			window.addEventListener("click", this.closeOnClick, false);
			window.addEventListener("keydown", this.handleKeydown, false);

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
			this.props.hidePhoneModal();
			//window.location.replace(GridEngine.domain + this.props.route); this is probably bad. (causes screen lag)
		}
		return false;
	}

	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.props.hidePhoneModal();
		}
	}

	userSubmitPin(e) {
		e.preventDefault();
		
		var pin = React.findDOMNode(this.refs.pinOne).value;
		pin += React.findDOMNode(this.refs.pinTwo).value;
		pin += React.findDOMNode(this.refs.pinThree).value;
		pin += React.findDOMNode(this.refs.pinFour).value;

		var _this = this;
		this.props.submitPhonePin(pin)
			.then(function(data) {
				if (data.payload.status === "pin_verified") {
					_this.setState({
						verify: false,
						success: true
					});
				}

				else {
					_this.setState({
						error: true
					});
				}
			});
	}

	goToNextPinInput(e) {
		var classes = e.target.className;

		if (classes.indexOf("pin-1") > -1) {
			React.findDOMNode(this.refs.pinTwo).focus();
			return true;
		}

		if (classes.indexOf("pin-2") > -1) {
			React.findDOMNode(this.refs.pinThree).focus();
			return true;
		}

		if (classes.indexOf("pin-3") > -1) {
			React.findDOMNode(this.refs.pinFour).focus();
			return true;
		}

		return false;
	}

	userSubmitPhone(e) {
		e.preventDefault();
		
		var phonenumber = React.findDOMNode(this.refs.phonenumber).value;

		var _this = this;
		this.props.submitUserPhone("1"+phonenumber)
			.then(function(data) {
				if (data.payload.status === "phone_set") {
					_this.setState({
						verify: true,
						error: false
					});
				}

				else {
					_this.setState({
						error: true
					})
				}
			});
	}

	render() {
		var active = (this.props.visible) ? "active" : "";
		var form = (
			<div>
				<h3>Sign Up to Receive Text Alerts</h3>
				<p>
					To complete the process, you will receive a 4-digit pin at the number you provide. Enter the PIN when prompted to get started receiveing alerts!
				</p>
				<p>
					Text alerts will include a link to buy tickets as well as information about the show.
				</p>
				<form action="" onSubmit={ this.userSubmitPhone }>
					<span> <span><b>+1</b></span> <input className="phone" type="tel" pattern="[0-9]{10}" ref="phonenumber" placeholder="Your 9 Digit Phone #" title="" onChange={ this.resetState }/></span>
					<FormButton error={ this.state.error } errorMessage="Invalid Phone Number" submitMessage="Submit"/>
				</form>
			</div>
		);

		if (this.state.verify) {
			form = (
				<div>
					<h3>Confirm your phone number</h3>
					<p>
						Enter the 4-digit PIN you receive to start getting alerts.
					</p>
					<form action="" onSubmit={ this.userSubmitPin }>
						<input maxLength="1" className="pin pin-1" type="text" ref="pinOne" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-2" type="text" ref="pinTwo" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-3" type="text" ref="pinThree" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-4" type="text" ref="pinFour" size="1" onChange={ this.goToNextPinInput }/>

						<FormButton error={ this.state.error } errorMessage="Invalid PIN" submitMessage="Submit"/>
					</form>
				</div>
			);
		}

		if (this.state.success) {
			var _this = this;

			form = (
				<div>
					<h3>Phone Number Verified!</h3>
					<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>
				</div>
			);

			setTimeout(function() {
				_this.props.hidePhoneModal();
			}, 800);
		}

		return (
			<div id="overlay" className={ active }>
				<div id="modal">{ form }</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		visible: state.modal.phone,
		route: state.router.location.pathname
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ hidePhoneModal, submitUserPhone, submitPhonePin }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(PhoneModal);
