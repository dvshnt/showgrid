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
		    if (alerts[i].show === show || alerts[i].show.id === show) {
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
					
					_this.setState({
						open: false
					});
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
			options.push(<option value="0" data-value='{"id":0, "unit":"days","num":0}' selected={ alert.which === 0 }>At time of show</option>);
		}

		if (now.isBefore(date.subtract(30, 'minutes'))) {
			options.push(<option value="1" data-value='{"id":1, "unit":"minutes","num":30}' selected={ alert.which === 1 }>30 Minutes before show</option>);
		}

		if (now.isBefore(date.subtract(1, 'hours'))) {
			options.push(<option value="2" data-value='{"id":2, "unit":"hours","num":1}' selected={ alert.which === 2 }>1 Hour before show</option>);
		}


		if (now.isBefore(date.subtract(2, 'hours'))) {
			options.push(<option value="3" data-value='{"id":3, "unit":"hours","num":2}' selected={ alert.which === 3 }>2 Hours before show</option>);
		}


		if (now.isBefore(date.subtract(1, 'days'))) {
			options.push(<option value="4" data-value='{"id":4, "unit":"days","num":1}' selected={ alert.which === 4 }>1 Day before show</option>);
		}


		if (now.isBefore(date.subtract(2, 'days'))) {
			options.push(<option value="5" data-value='{"id":5, "unit":"days","num":2}' selected={ alert.which === 5 }>2 Days before show</option>);
		}


		if (now.isBefore(date.subtract(7, 'days'))) {
			options.push(<option value="6" data-value='{"id":6, "unit":"days","num":7}' selected={ alert.which === 6 }>1 Week before show</option>);
		}

		if (options.length === 0) {
			return "Show has already started. Get your ass over there!";
		}

		return <select onChange={ this.createAlert }>{ options }</select>;
	}

	render() {
		var _this = this;

		var alertInfo, alertText = "";

		if (this.state.active) {
			alertText = DateManager.convertAlertDate(this.state.active.which);
			alertInfo = <div className="alert-info">{ alertText }</div>;
		}

		var artistInfo = (
			<div className="artist-info">
				<span>{ moment(this.props.show.date).format("ddd MMM Mo, h A") }</span>
				<h4>{ this.props.show.headliners }</h4>
				<h5>{ this.props.show.openers }</h5>
			</div>	
		);

		var className = (this.state.open) ? "icon-alert open" : "icon-alert";
		className += (this.state.active) ? " active" : "";

		var options = this.getEligibleAlertTimes();


		return (
			<b className={ className } onClick={ this.toggleAlert }>
				<div className="alert-box">
					{ artistInfo }
					Alert me
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
