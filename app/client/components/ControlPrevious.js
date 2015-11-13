var DateManager = require('../util/DateManager');

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getGrid } from '../actions/index';


class ControlPrevious extends Component {
	constructor(props) {
		super(props);
		this.previousPage = this.previousPage.bind(this);
	}

	previousPage() {
		var day = DateManager.getStartOfPreviousPage(this.props.days[0].date, this.props.days.length);
		this.props.getGrid(day);
	}

	render() {
		return (
			<div className="arrow previous" onClick={ this.previousPage }></div>
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


export default connect(mapStateToProps, mapDispatchToProps)(ControlPrevious)
