import React, { Component } from 'react';

var DateManager = require('../util/DateManager');


export default class SearchResults extends Component {
	constructor(props) {
		super(props);

		this.getShowStatus = this.getShowStatus.bind(this);
	}

	getShowStatus(show) {
		if (show.soldout) {
			return <div className="soldout">Sold Out</div>;
		}

		var onsale = DateManager.areTicketsOnSale(show.onsale);
		if (!onsale) {
			var saleDate = DateManager.formatSaleDate(show.onsale);
			return <div className="onsale">On Sale<br></br>{ saleDate }</div>;
		}

		return <span></span>;
	}

	render() {
		var { show } = this.props;

		var status = this.getShowStatus(show);

		var month = DateManager.getMonthFromDate(show.date),
			day = DateManager.getDayFromDate(show.date);


		return (
			<div className="result">
				<div className="date">
					<div>{ month }</div>
					<div>{ day }</div>
				</div>
				<div className="info">
					<h5>{ show.venue.name }</h5>
					<h6>{ show.title }</h6>
					<h3>{ show.headliners }</h3>
					<h6>{ show.openers }</h6>
				</div>
				<div className="status">
					{ status }
				</div>
			</div>
		)
	}
};