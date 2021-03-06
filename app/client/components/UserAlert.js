import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { deleteAlert, changeAlert } from '../actions/index';

var DateManager = require('../util/DateManager');



class UserAlert extends Component {
	constructor(props) {
		super(props);

		this.removeAlert = this.removeAlert.bind(this);
		this.changeAlert = this.changeAlert.bind(this);
	}

	componentWillUpdate(nextProps, nextState) {

	}

	removeAlert() {
		var alert = this.props.alert.id;

		this.props.deleteAlert(alert);
	}

	changeAlert(e) {
		var _this = this;

		var show = this.props.alert.show;

		var options = e.target.options;
		var value = "";


		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) {
				value = JSON.parse(options[i].getAttribute('data-value'));
			}
		}

		var alertDate = DateManager.getAlertDate(show.date, value);
		
		this.props.changeAlert(this.props.alert.id, alertDate.format(), value.id);
	}



	getEligibleAlertTimes() {
		var alert = this.props.alert;
		var show = alert.show;

		var now = moment();
		var date = moment(show.date, 'YYYY-MM-DD HH:mm:ssZZ');

		var options = [];
		
		if(show.onsale){
			var sale_date = moment(show.onsale, 'YYYY-MM-DD HH:mm:ssZZ');
			if (now.isBefore(sale_date)) {
				options.push(<option value="7"  data-value='{"sale":true, "id":7, "unit":"days","num":0}' selected={ alert.which === 7 }>when ticket sale starts</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(30, 'minutes'))) {
				options.push(<option value="8" data-value='{"sale":true, "id":8, "unit":"minutes","num":30}' selected={ alert.which === 8 }>30 minutes before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(1, 'hours'))) {
				options.push(<option value="9" data-value='{"sale":true, "id":9, "unit":"hours","num":1}' selected={ alert.which === 9 }>1 hour before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(2, 'hours'))) {
				options.push(<option value="10" data-value='{"sale":true, id":10, "unit":"hours","num":2}' selected={ alert.which === 10 }>2 hours before ticket sale starts</option>);
			}
		}


		if (now.isBefore(date)) {
			options.push(<option value="0" data-value='{"id":0, "unit":"days","num":0}' selected={ alert.which === 0 }>At time of show</option>);
		}

		if (now.isBefore(date.clone().subtract(30, 'minutes'))) {
			options.push(<option value="1" data-value='{"id":1, "unit":"minutes","num":30}' selected={ alert.which === 1 }>30 Minutes before show</option>);
		}

		if (now.isBefore(date.clone().subtract(1, 'hours'))) {
			options.push(<option value="2" data-value='{"id":2, "unit":"hours","num":1}' selected={ alert.which === 2 }>1 Hour before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'hours'))) {
			options.push(<option value="3" data-value='{"id":3, "unit":"hours","num":2}' selected={ alert.which === 3 }>2 Hours before show</option>);
		}


		if (now.isBefore(date.clone().subtract(1, 'days'))) {
			options.push(<option value="4" data-value='{"id":4, "unit":"days","num":1}' selected={ alert.which === 4 }>1 Day before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'days'))) {
			options.push(<option value="5" data-value='{"id":5, "unit":"days","num":2}' selected={ alert.which === 5 }>2 Days before show</option>);
		}


		if (now.isBefore(date.clone().subtract(7, 'days'))) {
			options.push(<option value="6" data-value='{"id":6, "unit":"days","num":7}' selected={ alert.which === 6 }>1 Week before show</option>);
		}

		return <select onBlur={this.createAlert} onChange={ this.createAlert }>{ options }</select>;
	}

	render() {
		var alert = this.props.alert;

		var alertRef = "alert-" + alert.id;

		var month = DateManager.getMonthFromDate(alert.show.date);
		var day = DateManager.getDayFromDate(alert.show.date);

		var date = (
			<div className="date">
				<div>{ month }</div>
				<div>{ day }</div>
			</div>
		);



		var venue = <h4>{ alert.show.venue.name }</h4>;

		var headliner = "";
		var opener = "";

		if (alert.show.headliners !== '') {
			headliner = <h3>{ alert.show.headliners }</h3>;
		}

		if (alert.show.openers !== '') {
			opener =  <h5>{ alert.show.openers }</h5>;
		}

		var options = this.getEligibleAlertTimes();


		return (
			<div className="alert-block" ref={ alertRef }>
				{ date }
				<div className="info">
					{ venue }
					{ headliner }
					{ opener }
				</div>
				<div className="alert">
					{ options }
					<a onClick={ this.removeAlert } href="javaScript:void(0);">Remove</a>
				</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return { 
		
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ deleteAlert, changeAlert }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserAlert);