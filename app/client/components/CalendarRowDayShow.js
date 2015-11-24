import React, { Component } from 'react';

import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';


var DateManager = require('../util/DateManager');


export default class CalendarRowDayShow extends Component {	
	constructor(props) {
		super(props);
	}

	render() {
		var show = this.props.show,
			headliner = show.band_name,
			onsale = DateManager.areTicketsOnSale(show.onsale),
			time = DateManager.formatShowTime(show.date);

		show.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';
		if (show.ticket !== "") {
			show.ticket += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';
		}

		var	title = "",
			headliner = "",
			saleDate = "",
			opener = "",
			ticket = <div className="ticket"></div>,
			free = "",
			age = "",
			recent = "", //DateManager.generateRecentBadge(show),
			star = "";

		if (show.title !== '' && show.headliners !== '') {
			title = <div className="title">{ show.title }</div>;
		}

		if (show.star) {
			star = <b className="icon-star"></b>;
		}

		if (show.headliners !== '') {
			headliner = <div className="main">{ star }{ recent }{ show.headliners }</div>;
		}

		if (show.openers !== '') {
			opener =  <div className="extra">{ show.openers }</div>;
		}

		if (!onsale) {
			saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><div className="onsale">On Sale<br></br>{ saleDate }</div></a>;
		}
		else if (show.ticket !== "") {
			var price = "";

			if (show.price > 0) {
				price = <span className="price">${ show.price }</span>;
			}

			ticket = <a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><b className="icon-ticket"></b>{ price }</a>;
		}
		else if (show.price > 0 && show.ticket === '') {
			free = <span className="free">${ show.price }</span>;
		}
		else if (show.price < 0) {
			free = <span className="free">FREE</span>;
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		if (show.age > 0) {
			age = <span className="age">{ show.age }+</span>;
		}

		return (
			<div className="show">
				<div className="info">
	            	<span className="time">{ time }</span>
	            	{ free }
	            	{ age }
				</div>
				<div className="titles">
					<a href={ show.website } target="_blank">
					{ title }
					{ headliner }
					{ opener }
					</a>
				</div>
				<div className="actions">
					{ ticket }
					<SetAlert show={ show }/>
					<SetFavorite show={ show }/>
				</div>
	        </div>
		)
	}
};
