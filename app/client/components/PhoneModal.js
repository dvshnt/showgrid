import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { hidePhoneModal } from '../actions/modal';
import { submitUserPhone, submitPhonePin } from '../actions/index';

var GridEngine = require('../util/GridEngine');


class PhoneModal extends Component {
	constructor(props) {
		super(props);

		this.userSubmitPhone = this.userSubmitPhone.bind(this);
		this.userSubmitPin = this.userSubmitPin.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);

		this.state = {
			token: null,
			verify: false
		};
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.visible) {
			// window.addEventListener("click", this.closeOnClick, false);
			window.addEventListener("keydown", this.handleKeydown, false);

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

		this.props.hidePhoneModal();
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
						verify: false
					});

					_this.props.hidePhoneModal();
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
						verify: true
					});
				}
			});
	}

	render() {
		var active = (this.props.visible) ? "active" : "";
		var form = (
			<div>
				<p>
					In order to keep you on track about shows, we will text you a reminder before the show. The text will include a ticket link so should you decide to go, you can buy tickets right away!
				</p>
				<form action="" onSubmit={ this.userSubmitPhone }>
					<input type="text" ref="phonenumber" placeholder="Enter phonenumber"/>
					<input type="submit" placeholder="Submit"/>
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
						<input type="submit" placeholder="Submit"/>
					</form>
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
