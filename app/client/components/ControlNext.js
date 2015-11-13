var DateManager = require('../util/DateManager');

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getGrid } from '../actions/index';


class ControlNext extends Component {
	constructor(props) {
		super(props);
		this.nextPage = this.nextPage.bind(this);
	}

	nextPage() {
		var day = DateManager.getStartOfNextPage(this.props.days[this.props.days.length - 1].date);
		this.props.getGrid(day);
	}

	render() {
		return (
			<div className="arrow next" onClick={ this.nextPage }></div>
		)
	}
};


function mapStateToProps(state) {
	return {
		days: state.state.days
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getGrid }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ControlNext)