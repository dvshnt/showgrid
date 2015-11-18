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

		this.userSubmitPhone = this.userSubmitPhone.bind(this);
		this.userSubmitPin = this.userSubmitPin.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);

		this.state = {
			error: false,
			verify: false,
			success: false
		};
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
		
		var pin = React.findDOMNode(this.refs.pin).value;

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

	userSubmitPhone(e) {
		e.preventDefault();
		
		var phonenumber = React.findDOMNode(this.refs.phonenumber).value;

		var _this = this;
		this.props.submitUserPhone(phonenumber)
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
				<p>
					In order to keep you in the loop, we will text you a reminder before the show. The text will include a ticket link so should you decide to go, you can buy tickets right away!
				</p>
				<form action="" onSubmit={ this.userSubmitPhone }>
					<input type="tel" pattern="[0-9]{11}" ref="phonenumber" placeholder="Phone Number" title=""/>
					<FormButton error={ this.state.error } errorMessage="Invalid Phone Number" submitMessage="Submit"/>
				</form>
			</div>
		);

		if (this.state.verify) {
			form = (
				<div>
					<p>
						Enter the 4-digit PIN you receive to start getting alerts.
					</p>
					<form action="" onSubmit={ this.userSubmitPin }>
						<input type="text" ref="pin" size="4"/>
						<FormButton error={ this.state.error } errorMessage="Invalid PIN" submitMessage="Submit"/>
					</form>
				</div>
			);
		}

		if (this.state.success) {
			form = (
				<div>
					<h3>Phone Number Verified!</h3>
					<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>
				</div>
			);
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
