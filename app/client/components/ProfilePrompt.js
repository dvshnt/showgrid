import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { showLoginModal } from '../actions/modal';

var GridEngine = require('../util/GridEngine');


class Profile extends Component {
	constructor(props) {
		super(props);

		this.userLogin = this.userLogin.bind(this);

		this.state = {
			token: null
		};
	}

	userLogin(e) {
		e.preventDefault();
		
		this.props.showLoginModal();
	}

	render() {
		return (
			<article>

				<p>
					Thanks for your interest in Showgrid. Sign up below or Login to your existing profile to get started tracking shows around Nashville!
				</p>

				<p>
					In the coming weeks and months, we will continue to build out Showgrid to make as useful and easy to use as possible. If you have any recommendations, do not hesitate to contact us. You can reach us at <a href="mailto:info@showgrid.com">info@showgrid.com</a>.
				</p>

				<input type="button" value="Sign Up" onClick={ this.userLogin }/>
			</article>
		)
	}
};


function mapStateToProps(state) {
	return { 
		route: state.router.location.pathname
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ showLoginModal }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);