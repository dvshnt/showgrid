import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showPhoneModal } from '../actions/modal';
import { updateProfile } from '../actions/index';
import FormButton from './FormButton';

var GridEngine = require('../util/GridEngine');

class UserProfile extends Component {
	constructor(props) {
		super(props);

		this.updateProfile = this.updateProfile.bind(this);
		this.resetState = this.resetState.bind(this);
		this.logout = this.logout.bind(this);

		this.resetState();
		this.state = {
			update_error: false,
			update_msg: 'Save Changes',
			update_error_msg: "Oops, try again."
		}
	}

	resetState() {
		this.setState({
			update_error: false,
			update_msg: 'Save Changes',	
			update_error_msg: "Oops, try again."		
		})
	}

	updateProfile() {
		var name = React.findDOMNode(this.refs.name).value;
		var email = React.findDOMNode(this.refs.email).value;
		var pass1 = React.findDOMNode(this.refs.pass1).value;
		var pass2 = React.findDOMNode(this.refs.pass2).value;



		if( name == "" && email == "" && pass1 == "" && pass2 == ""){
			return this.setState({
				update_error_msg: "Nothing to save!",
				update_error: true
			})
		}

		if(pass1 !== pass2){
			return this.setState({
				update_error_msg: "Passwords dont match!",
				update_error: true
			})
		}

		this.props.updateProfile(name , email , pass2).then((response)=>{
		
			if(response.type === 'UPDATEUSER_FAILURE') return this.setState({update_error: true});
			this.setState({ update_msg: 'Changes Saved!' });

		})
	}

	logout() {
		if (localStorage.getItem("token") !== null) {
			localStorage.removeItem("token");
			window.location.replace(GridEngine.domain);
		}
	}

	render() {
		var name, email, number = "";


		if (this.props.profile) {
			email = this.props.profile.email;
			number = this.props.profile.phone;
			name = this.props.profile.name;
		}

		if(number == "None"){
			var phone_button = <input ref="phone" className = "error" type="submit" value={"Register Phone"} onClick={this.props.showPhoneModal}/>
		}else{
			var phone_button = <input ref="phone" type="submit" value={"Change Phone: (+1) ("+ String(number).slice(1)+")"} onClick={this.props.showPhoneModal}/>
		}
			

		return (
			<div className="user--profile">

				<div onClick={ this.logout } id="logout-profile">Logout</div>
				<div className="info">

					<div className="section fields">
						<label>Name</label>
						<input onChange = {this.resetState} ref="name" type="text" placeholder= {name || "Your Name" } />
						<label>Email</label>
						<input onChange = {this.resetState} ref="email" type="text" placeholder={email || "Your Email" } />
					</div>
					<div className="section fields">
						<label>Change Password</label>
						<input onChange = {this.resetState} ref="pass1" type="password" placeholder= {"Change Your Password" } />
						<input onChange = {this.resetState} ref="pass2" type="password" placeholder= {"Confirm New Password" } />
					</div>
					<div className="section buttons">
						{phone_button}
						<FormButton error = { this.state.update_error } errorMessage={ this.state.update_error_msg } submitMessage={this.state.update_msg} onClick={ this.updateProfile } />
					</div>
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