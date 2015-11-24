import React, { Component } from 'react';

import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

var DateManager = require('../util/DateManager');


export default class ListItem extends Component {
	render() {
		var show = this.props.show;
		var venue = show.venue;

		show.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';
		if (show.ticket !== "") {
			show.ticket += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';
		}

		var boxStyle = {
			//'background': venue.primary_color || '#000000',
			'border-top': "8px solid " + (venue.primary_color || '#FFFFFF') 
		};

		var onsale = DateManager.areTicketsOnSale(show.onsale);

		var	title = "",
			headliner = "",
			opener = "",
			ticket = "",
			price = "",
			date = "",
			star = "",
			review = "",
			free = "",
			age = "";



		if (show.star && this.props.showStar) {
			star = <b className="rec icon-star"></b>;
		}


		if (show.review && show.review !== "") {
			review = <article dangerouslySetInnerHTML={{__html: show.review}}></article>;
		}



		// Header
		var time = DateManager.formatShowTime(show.date);

		if (show.age > 0) {
			age = <span className="age">{ show.age }+</span>;
		}

		if (show.price < 0) {
			price = <span className="price">FREE</span>;
		}
		else if (show.price > 0) {
			price = <span className="price">${ show.price }</span>;
		}



		// Info --> Date 
		if (this.props.showDate) {
			var month = DateManager.getMonthFromDate(show.date);
			var day = DateManager.getDayFromDate(show.date);

			date = (
				<div className="date">
					<div>{ month }</div>
					<div>{ day }</div>
				</div>
			);
		}




		// Info --> Artists
		if (show.title !== '') {
			title = <h4>{ show.title }</h4>;
		}

		if (show.headliners !== '') {
			headliner = <h3>{ star }{ show.headliners }</h3>;
		}

		if (show.openers !== '') {
			opener =  <h5>{ show.openers }</h5>;
		}




		// Actions
		if (!onsale) {
			saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <div className="onsale">On Sale { saleDate }</div>;
		}
		else if (show.ticket !== '') {
			ticket = <a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><b className="icon-ticket"></b>Buy Tickets</a>;
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}




		return (
			<div className="list--item"  style={ boxStyle }>
				<header>
					<div className="pic"></div>
					<h4>{ venue.name }</h4>
					{ age }{ price }
				</header>
				<div className="info">
					{ date }
					<div className="artists">
						<span className="time">{ time }</span>
						<a href={ show.website } target="_blank">
						{ title }
						{ headliner }
						{ opener }
						</a>
					</div>
				</div>
				{ review }
				<footer>
					<div className="all">
						{ ticket }
					</div>
					<div className="user">
						<SetAlert show={ show }/>
						<SetFavorite show={ show }/>
					</div>
				</footer>
			</div>
		);
	}
};

