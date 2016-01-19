import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HeaderPage from './HeaderPage';
import SubHeader from './SubHeader';


export default class Header extends Component {
	render() {
		var visibility = "";
		if (this.props.route.indexOf("venue") > -1 && window.innerWidth <= 500) {
			visibility = "hidden";
		}
		
		return (
			<header id="header" className={ visibility }>
				<HeaderPage />
				<SubHeader />
			</header>
		)
	}
};


function mapStateToProps(state) {
	return {
		route: state.router.location.pathname
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);