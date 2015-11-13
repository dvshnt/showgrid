import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { unfavoriteShow } from '../actions/index';

var DateManager = require('../util/DateManager');


export default class UserFavorite extends Component {
	constructor(props) {
		super(props);

		this.unfavoriteShow = this.unfavoriteShow.bind(this);
	}
	
	unfavoriteShow(e) {
		this.props.unfavoriteShow(this.props.show.id);
	}

	render() {
		var show = this.props.show;

		var month = DateManager.getMonthFromDate(show.date);
		var day = DateManager.getDayFromDate(show.date);

		var date = (
			<div className="date">
				<div>{ month }</div>
				<div>{ day }</div>
			</div>
		);



		var venue = <h4>{ show.venue.name }</h4>;

		var headliner = "";
		var opener = "";

		if (show.headliners !== '') {
			headliner = <h3>{ show.headliners }</h3>;
		}

		if (show.openers !== '') {
			opener =  <h5>{ show.openers }</h5>;
		}



		return (
			<div className="alert-block">
				{ date }
				<div className="info">
					{ venue }
					{ headliner }
					{ opener }
				</div>
				<div className="favorite">
					<a onClick={ this.unfavoriteShow } href="javaScript:void(0);">Remove</a>
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
	return bindActionCreators({ unfavoriteShow }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserFavorite);