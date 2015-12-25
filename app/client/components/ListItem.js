



import React, { Component } from 'react';

import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

var DateManager = require('../util/DateManager');


export default class ListItem extends Component {
	render() {
		var show = this.props.show;
		var venue = show.venue;

		var website = show.website + (show.website.indexOf('?') > -1 ? '&' : '?') + 'utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var boxStyle = {
			//'background': venue.primary_color || '#000000',
			'border-top': "8px solid " + (venue.primary_color || '#FFFFFF') 
		};

		var onsale = DateManager.areTicketsOnSale(show.onsale);

		var	title,
			headliner,
			opener,
			ticket,
			price,
			date,
			time,
			star,
			review,
			free,
			age,
			venue_header



		if (show.star && this.props.showStar) {
			star = <b className="rec icon-star"></b>;
		}


		if (show.review && show.review !== "") {
			review = <article dangerouslySetInnerHTML={{__html: show.review}}></article>;
		}



		// Header
		var _time = DateManager.formatShowTime(show.date);

		if (show.age > 0) {
			age = <div className="age">{ show.age }+</div>;
		}

		if (show.price < 0) {
			price = <div className="price">FREE</div>;
		}
		else if (show.price > 0) {
			price = <div className="price">${ show.price }</div>;
		}

		// Info --> Date 
		if (this.props.showDate) {
			var month = DateManager.getMonthFromDate(show.date);
			var day = DateManager.getDayFromDate(show.date);

			date = (
				<div className="date">
					<div>{ _time }</div>
					<div>{ month }</div>
					<div>{ day }</div>
				</div>
			);
		}

		if(this.props.showTime){
			time = (
				<div className="time">{ _time }</div>
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
			var saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <div className="onsale">On Sale { saleDate }</div>;
		}
		else if (show.ticket !== '') {
			if(this.props.ticket_price){
				ticket = (
					<span className="ticket">
						<b className="icon-ticket" />
						<b className="ticket-price"> ${show.price}</b>
					</span>
				)
			}else{
				ticket = <a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><b className="icon-ticket"></b>Buy Tickets</a>;
			}
			
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		if(this.props.ticket_price) price = null


		return (
			<div className="list--item"  style={ boxStyle }>
				<header>
					<div className="pic"></div>
					<h4>{this.props.showVenueName === false ? null : venue.name}</h4>
					<div className="extra-info">
						{ age }{price}
					</div>
				</header>

				{venue_header}
				<div className="info">
					{ date }
					<div className="artists">
						
						<a href={ website } target="_blank">
						{ time }
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

