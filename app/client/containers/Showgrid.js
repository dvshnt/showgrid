import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ControlNext from '../components/ControlNext';
import ControlPrevious from '../components/ControlPrevious';
import Calendar from '../components/Calendar';

import { getGrid, adjustWindowSize } from '../actions/index';

var GridEngine = require('../util/GridEngine');


class Showgrid extends Component {
	componentDidMount() {
		// Listener run when window changes size
		var _this = this;
		var adjustGrid = function() {
			var cells = GridEngine.calculateCellCount();

			_this.props.adjustWindowSize(cells);
		};


		// Intializing the grid dimensions
		var cells = GridEngine.calculateCellCount();
	    this.props.adjustWindowSize(cells);

	    // Fetching first grid data
	    var startDate = (this.props.startDate) ? moment(this.props.startDate.date, 'MMMM Do YYYY') : moment()
	    
	    if (this.props.grid.length === 0) {
	    	this.props.getGrid(startDate);
	    }

	    // Attaching grid dimension resizer on window size change
		window.addEventListener('resize', adjustGrid, true);
	}

	render() {
		return (
			<section id="container">
				<ControlNext />
				<ControlPrevious />
				<Calendar />
			</section>
		)
	}
};


function mapStateToProps(state) {
	return {
		grid: state.state.grid,
		startDate: state.state.days[0]
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getGrid, adjustWindowSize }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Showgrid);