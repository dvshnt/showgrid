import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import $ from 'jquery';

<<<<<<< HEAD
import { setAlert } from '../actions/index';
=======
import { setAlert, deleteAlert } from '../actions/index';
>>>>>>> Merge branch 'feature/phone_alerts' of https://github.com/dvshnt/showgrid into feature/phone_alerts

var GridEngine = require('../util/GridEngine');
var DateManager = require('../util/DateManager');


class SetAlert extends Component {	
	constructor(props) {
		super(props);

		this.createAlert = this.createAlert.bind(this);
		this.toggleAlert = this.toggleAlert.bind(this);

		this.state = {
			set: false,
			open: false
		};
	}

	componentDidMount() {
		if (this.props.show.alert.date) {
			this.setState({
				set: true
			});
		}
	}

	createAlert(e) {
		var _this = this;

		var show = this.props.show;
		var date = show.date;

		var options = e.target.options;
		var value = "";

		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) {
				value = JSON.parse(options[i].getAttribute('data-value'));
			}
		}

		var alertDate = DateManager.getAlertDate(date, value);
		
		this.props.setAlert(show.id, alertDate.format());

		this.setState({
			set: !_this.state.set,
			open: false
		});
	}

<<<<<<< HEAD
=======
	cancelAlert(e) {
		var show = this.props.show;
		
		this.props.deleteAlert(show.id);

		this.setState({
			set: false,
			open: false
		});
	}

>>>>>>> Merge branch 'feature/phone_alerts' of https://github.com/dvshnt/showgrid into feature/phone_alerts
	toggleAlert(e) {
		if (e.target.localName === "select") return false;

		var _this = this;
		this.setState({
			open: !_this.state.open
		});
	}

	render() {
		var className = (this.state.open) ? "icon-alert open" : "icon-alert";
		className += (this.state.set) ? " active" : "";

		return (
			<b className={ className } onClick={ this.toggleAlert }>
				<div className="alert-box">
<<<<<<< HEAD
					Alert me 
=======
					Alert me
>>>>>>> Merge branch 'feature/phone_alerts' of https://github.com/dvshnt/showgrid into feature/phone_alerts
					<select onChange={ this.createAlert }>
						<option data-value='{"unit":"days","num":0}' selected>At time of show</option>
						<option data-value='{"unit":"minutes","num":30}'>30 Minutes before show</option>
						<option data-value='{"unit":"hours","num":1}'>1 Hour before show</option>
						<option data-value='{"unit":"hours","num":2}'>2 Hours before show</option>
						<option data-value='{"unit":"days","num":1}'>1 Day before show</option>
						<option data-value='{"unit":"days","num":2}'>2 Days before show</option>
						<option data-value='{"unit":"days","num":7}'>1 week before show</option>
					</select>
<<<<<<< HEAD
=======
					{ (this.state.set) ? <a href="javascript:;" onClick={ this.cancelAlert }>Cancel</a> : "" }
>>>>>>> Merge branch 'feature/phone_alerts' of https://github.com/dvshnt/showgrid into feature/phone_alerts
				</div>
			</b>
		)
	}
};


function mapStateToProps(state) {
	return { };
}


function mapDispatchToProps(dispatch) {
<<<<<<< HEAD
	return bindActionCreators({ setAlert }, dispatch);
=======
	return bindActionCreators({ setAlert, deleteAlert }, dispatch);
>>>>>>> Merge branch 'feature/phone_alerts' of https://github.com/dvshnt/showgrid into feature/phone_alerts
}


export default connect(mapStateToProps, mapDispatchToProps)(SetAlert);
