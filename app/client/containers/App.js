import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import PhoneModal from '../components/PhoneModal';
import Footer from '../components/Footer';

import { getUserInfo } from '../actions/index';

var GridEngine = require('../util/GridEngine');



class App extends Component {
	constructor(props) {
		super(props);

		GridEngine.init();

		
		var token = localStorage.getItem("token") || "";
		if (token !== "") {
			this.props.getUserInfo();
		}
	}

	render() {
		// Injected by React Router
		const { children } = this.props;

		return (
			<div>
				<LoginModal />
				<PhoneModal />
				<Header />
        		{children}
        		<Footer />
			</div>
		);
	}
}


App.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired
	}),
	children: PropTypes.node
};


App.contextTypes = {
	history: PropTypes.object.isRequired
};


function mapStateToProps(state) {
	return {
		
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getUserInfo }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(App);