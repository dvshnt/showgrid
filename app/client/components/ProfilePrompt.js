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
					We&#39;re still in beta mode here. To deal with the influx of traffic, we&#39;re manually creating accounts. To get one, email <a href="mailto:accounts@showgrid.com">accounts@showgrid.com</a> and ask for one.
				</p>

				<p>
					With an account, you&#39;ll be able to favorite shows, set alerts, and talk about shows with the rest of Showgrid. Expect many more features in the coming months and thanks for coming aboard!
				</p>

				<p>
					If you already have an account, you can sign in below.
				</p>

				<input type="button" value="Sign In" onClick={ this.userLogin }/>
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