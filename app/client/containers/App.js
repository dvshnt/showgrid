import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Header from '../components/Header';
import LoginModal from '../components/LoginModal';

var GridEngine = require('../util/GridEngine');


class App extends Component {
	constructor(props) {
		super(props);

		GridEngine.init();
	}

	render() {
		// Injected by React Router
		const { children } = this.props;

		return (
			<div>
				<LoginModal />
				<Header />
        		{children}
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
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(App);