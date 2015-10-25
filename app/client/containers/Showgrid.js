import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ControlNext from '../components/ControlNext';
import ControlPrevious from '../components/ControlPrevious';
import Calendar from '../components/Calendar';
import Footer from '../components/Footer';

import { getGrid } from '../actions/index';
import { adjustWindowSize } from '../actions/engine';

var GridEngine = require('../util/GridEngine');


class Showgrid extends Component {
	componentDidMount() {
		// Listener run when window changes size
		var _this = this;
		var adjustGrid = function() {
			var width = document.documentElement.clientWidth || window.innerWidth;
			var cells = GridEngine.calculateCellCount();

			_this.props.adjustWindowSize(width, cells);
		};


		// Intializing the grid dimensions
		var width = document.documentElement.clientWidth || window.innerWidth;
		var cells = GridEngine.calculateCellCount();
	    this.props.adjustWindowSize(width, cells);

	    // Fetching first grid data
	    var startDate = (this.props.startDate) ? moment(this.props.startDate.date, 'MMMM Do YYYY') : moment()
	    this.props.getGrid(startDate);

	    // Attaching grid dimension resizer on window size change
		window.addEventListener('resize', adjustGrid, true);
	}

	render() {
		return (
			<section id="container">
				<ControlNext />
				<ControlPrevious />
				<Calendar />
				<Footer/>
			</section>
		)
	}
};


function mapStateToProps(state) {
	return {
		startDate: state.grid.days[0]
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getGrid, adjustWindowSize }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Showgrid);