import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showPhoneModal } from '../actions/modal';
import { updateProfile } from '../actions/index';
import FormButton from './FormButton';

class UserProfile extends Component {
	constructor(props) {
		super(props);

		this.updateProfile = this.updateProfile.bind(this);
		this.resetState = this.resetState.bind(this);

		this.resetState();
		this.state = {
			update_error: false,
			update_msg: 'Save Changes',
		}
	}

	resetState() {
		this.setState({
			update_error: false,
			update_msg: 'Save Changes',			
		})
	}

	updateProfile() {
		var name = React.findDOMNode(this.refs.name).value;
		var email = React.findDOMNode(this.refs.email).value;
		console.log("UPDATE",name,email);
		this.props.updateProfile(name , email).then((response)=>{
			if(response.type === "USERUPDATE_FAILURE") return this.setState({update_error: true});
			
			this.setState({ update_msg: 'Changes Saved!' });

		})
	}

	render() {
		var name, email, number = "";


		if (this.props.profile) {
			email = this.props.profile.email;
			number = this.props.profile.phone;
			name = this.props.profile.name;
		}

		var phoneClass = number === "None" ? "phone empty" : "phone";
		var phoneValue = number === "None" ? "Register Number" : "Phone: " + number;


		return (
			<div className="user--profile">
				<div className="info">
					
					<label>Name</label>
					<input onChange = {this.resetState} ref="name" type="text" placeholder= {name || "Your Name" } />
					
					<label>Email Address</label>
					<input onChange = {this.resetState} ref="email" type="text" placeholder={email || "Your Email" } />

					<label>Change Phone Number</label>
					<input ref="phone" type="submit" className={ phoneClass } value={ phoneValue } onClick={this.props.showPhoneModal}/>
					
					<FormButton error = { this.state.update_error } errorMessage="update failed" submitMessage={this.state.update_msg} onClick={ this.updateProfile } />
				</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		profile: state.state.entities.user
	};
}


function mapDispatchToProps(dispatch) {
	console.log(updateProfile);
	return bindActionCreators({ showPhoneModal, updateProfile }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);