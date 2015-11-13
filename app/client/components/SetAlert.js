import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import $ from 'jquery';
import moment from 'moment';

import { showPhoneModal } from '../actions/modal';
import { setAlert, deleteAlert } from '../actions/index';

var GridEngine = require('../util/GridEngine');
var DateManager = require('../util/DateManager');


class SetAlert extends Component {	
	constructor(props) {
		super(props);

		this.createAlert = this.createAlert.bind(this);
		this.toggleAlert = this.toggleAlert.bind(this);
		this.checkIfAlertSet = this.checkIfAlertSet.bind(this);

		var _this = this;
		this.state = {
			open: false,
			active: _this.checkIfAlertSet(props.alerts, props.show.id)
		};
	}

	checkIfAlertSet(alerts, show) {
		for (var i = 0, len = alerts.length; i < len; i++) {
		    if (alerts[i].show === show) {
		    	return alerts[i];
		    }
		}

		return null;
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
		
		this.props.setAlert(show.id, alertDate.format(), value.id)
			.then(function(data) {
				if (data.payload.status === "phone_not_verified") {
					_this.props.showPhoneModal();
				}
				else if (data.payload.entities) {
					var index = data.payload.result;
					var alert = data.payload.entities.alerts[index];

					_this.setState({
						active: alert
					});
				}

				_this.setState({
					open: false
				});
			});
	}

	cancelAlert() {
		this.props.deleteAlert(this.state.active.id);

		this.setState({
			active: null,
			open: false
		});
	}

	toggleAlert(e) {
		if (e.target.localName === "select") return false;

		if (this.state.active) {
			this.cancelAlert();
		}
		else {
			var _this = this;
			this.setState({
				open: !_this.state.open
			});
		}
	}

	getEligibleAlertTimes() {
		var show = this.props.show;

		var now = moment();
		var date = moment(show.date, 'YYYY-MM-DD HH:mm:ssZZ');

		var options = [];

		if (now.isBefore(date)) {
			options.push(<option data-value='{"id":0, "unit":"days","num":0}' selected={ alert.which === 0 }>At time of show</option>);
		}

		if (now.isBefore(date.subtract(30, 'minutes'))) {
			options.push(<option data-value='{"id":1, "unit":"minutes","num":30}' selected={ alert.which === 1 }>30 Minutes before show</option>);
		}

		if (now.isBefore(date.subtract(1, 'hours'))) {
			options.push(<option data-value='{"id":1, "unit":"hours","num":1}' selected={ alert.which === 2 }>1 Hour before show</option>);
		}


		if (now.isBefore(date.subtract(2, 'hours'))) {
			options.push(<option data-value='{"id":1, "unit":"hours","num":2}' selected={ alert.which === 3 }>2 Hours before show</option>);
		}


		if (now.isBefore(date.subtract(1, 'days'))) {
			options.push(<option data-value='{"id":1, "unit":"days","num":1}' selected={ alert.which === 4 }>1 Day before show</option>);
		}


		if (now.isBefore(date.subtract(2, 'days'))) {
			options.push(<option data-value='{"id":1, "unit":"days","num":2}' selected={ alert.which === 5 }>2 Days before show</option>);
		}


		if (now.isBefore(date.subtract(7, 'days'))) {
			options.push(<option data-value='{"id":1, "unit":"days","num":7}' selected={ alert.which === 6 }>1 Week before show</option>);
		}

		if (options.length === 0) {
			return "Show has already started. Get your ass over there!";
		}

		return (<span>Alert me <select onChange={ this.createAlert }>{ options }</select></span>);
	}

	render() {
		var _this = this;

		var alertInfo, alertText = "";

		if (this.state.active) {
			alertText = DateManager.convertAlertDate(this.state.active.which);
			alertInfo = <div className="alert-info">{ alertText }</div>;
		}

		var className = (this.state.open) ? "icon-alert open" : "icon-alert";
		className += (this.state.active) ? " active" : "";

		var options = this.getEligibleAlertTimes();


		return (
			<b className={ className } onClick={ this.toggleAlert }>
				<div className="alert-box">
					{ options }
				</div>
				{ alertInfo }
			</b>
		)
	}
};


function mapStateToProps(state) {
	var alerts = state.state.alerts.map( a => state.state.entities.alerts[a] );

	return {
		alerts: alerts
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setAlert, deleteAlert, showPhoneModal }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SetAlert);
