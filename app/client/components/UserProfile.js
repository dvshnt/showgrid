import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class UserProfile extends Component {
	render() {
		var email, number = "";

		if (this.props.profile) {
			email = this.props.profile.email;
			number = this.props.profile.phone;
		}

		return (
			<div className="user--profile">
				<div className="pic"></div>
				<div className="info">
					<label>Name</label>
					<input type="text"/>

					<label>Email Address</label>
					<input type="text" value={ email }/>

					<label>Phone Number</label>
					<input type="text" value={ number }/>
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
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);