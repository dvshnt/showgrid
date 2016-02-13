import React, { Component } from 'react';

import Share from './Share';
import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

import {Link} from 'react-router';

var DateManager = require('../util/DateManager');


export default class ListItem extends Component {
	constructor(props) {
		super(props);

		this.convertHex = this.convertHex.bind(this);
	}

	convertHex(hex) {
	    var hex = hex.replace('#','');

	    var r = parseInt(hex.substring(0,2), 16);
	    var g = parseInt(hex.substring(2,4), 16);
	    var b = parseInt(hex.substring(4,6), 16);

	    if(!b) b = 0
	    if(!g) g = 0
	    if(!r) r = 0

	    return {
	   		"background": "-webkit-linear-gradient(top, rgba("+r+","+g+","+b+",0.5) 0%,rgba("+r+","+g+","+b+",0.5) 10%,rgba("+r+","+g+","+b+",0.9) 100%), rgba("+r+","+g+","+b+",0.3)", /* Chrome10-25,Safari5.1-6 */
	   		"background": "-moz-linear-gradient(to bottom, rgba("+r+","+g+","+b+",0.5) 0%,rgba("+r+","+g+","+b+",0.5) 10%,rgba("+r+","+g+","+b+",0.9) 100%), rgba("+r+","+g+","+b+",0.3)", /* FF3.6-15 */
	   		"background": "linear-gradient(to bottom, rgba("+r+","+g+","+b+",0.5) 0%,rgba("+r+","+g+","+b+",0.5) 10%,rgba("+r+","+g+","+b+",0.9) 100%), rgba("+r+","+g+","+b+",0.3)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	   	}
	}

	render() {
		var show = this.props.show;
		var venue = show.venue;

		var website = show.website + (show.website.indexOf('?') > -1 ? '&' : '?') + 'utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var boxStyle = (this.props.showGradient) ? {'background': venue.primary_color || '#000000'} : {"display": "none"};

		var onsale = DateManager.areTicketsOnSale(show.onsale);

		var	title,
			headliner,
			opener,
			ticket,
			price,
			date,
			star,
			review,
			free,
			age,
			venue_header;


		var backgroundImage = {
	   		"background-image": "url('" + show.image + "')"
	   	};


		if (show.star && this.props.showStar) {
			star = <div className="featured"><b className="icon-star"></b>&nbsp;Featured Show</div>;
		}


		if (show.review && show.review !== "") {
			review = <article dangerouslySetInnerHTML={{__html: show.review}}></article>;
		}



		// Header
		if (show.age > 0) {
			age = <div className="age">{ show.age }+</div>;
		}


		// Info --> Datetime 
		if (this.props.showDate) {
			date = (
				<div className="date">{ DateManager.getFormattedShowTime(show.date) }</div>
			);
		}

		if(this.props.showTime){
			date = (
				<div className="date">{ DateManager.formatShowTime(show.date) }</div>
			);		
		}



		// Info --> Artists
		if (show.title !== '') {
			title = <h4>{ show.title }</h4>;
		}

		if (show.headliners !== '') {
			headliner = <h3>{ show.headliners }</h3>;
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
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<b className="icon-ticket" />
						<span className="ticket-price">Tickets &nbsp;<span className="number">${show.price}</span></span>
					</a>
				);
			} else{
				ticket = (
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<b className="icon-ticket"></b>Buy Tickets
					</a>
				);
			}
			
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		if(this.props.ticket_price) price = null;


		var gradient = (this.props.showGradient) ? this.convertHex(venue.primary_color) : { "background": "rgba(0,0,0,0.2)" };


		return (
			<div className="list--item">
				<div className="content">
					<header style={ boxStyle }>
						{
							(()=>{
								if(this.props.showVenueName === false) return null
								return (
									<Link to={'/venue/'+venue.id}>
										<h4 style={{cursor:'pointer'}}>{venue.name}</h4>
									</Link>
								)
							})()
						}
						{ age }
					</header>

					{venue_header}
					<div className="info" style={ gradient }>
						{ date }{ star }
						<div className="artists">
							<a href={ website } target="_blank">
							{ title }
							{ headliner }
							{ opener }
							</a>
						</div>
						<div className="overlay">
							<div className="bg-img" style={ backgroundImage }></div>
						</div>
					</div>
					{ review }
					<footer>
						<div className="col-3">
							<SetFavorite show={ show } label={ true }/>
						</div>
						<div className="col-3">
							<SetAlert show={ show } label={ true }/>
						</div>
						<div className="col-3">
							<Share show={ show } label={ true }/>
						</div>
						<div className="col-3">
							{ ticket }
						</div>
					</footer>
				</div>
			</div>
		);
	}
};