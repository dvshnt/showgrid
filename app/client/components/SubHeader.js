import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HeaderCalendar from './HeaderCalendar';
import HeaderSearch from './HeaderSearch';


class SubHeader extends Component {
	constructor(props) {
		super(props);

		this.getSubHead = this.getSubHead.bind(this);
	}

	getSubHead() {
		if (this.props.route === "/") {
			return <HeaderCalendar />;
		}

		if (this.props.route === "/search" 
			&& (window.innerWidth <= 500
			|| document.documentElement.clientWidth <= 500
			|| document.body.clientWidth <= 500)) {

			return <HeaderSearch mode="subhead"/>;
		}

		return <span></span>;
	}

	render() {
		return this.getSubHead();
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


export default connect(mapStateToProps, mapDispatchToProps)(SubHeader);
