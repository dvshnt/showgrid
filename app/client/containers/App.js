import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import PhoneModal from '../components/PhoneModal';
import Footer from '../components/Footer';
import Banner from '../components/Banner';

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
		var loading = "";

		const { children } = this.props;

		if (this.props.waiting) {
			loading = <div className="loading"><div className="spinner"></div></div>
		} 

		return (
			<div id="container">
				<AuthModal />
				<PhoneModal />
				<Header />
				{ loading }
        		{ children }
        		<Footer />
				<Banner />
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
		waiting: state.state.waiting
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getUserInfo }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(App);