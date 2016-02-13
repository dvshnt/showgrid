import React, { Component } from 'react';

import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

var DateManager = require('../util/DateManager');
var GridEngine = require('../util/GridEngine');


export default class PanelItem extends Component {
	constructor(props) {
		super(props);

		this.convertHex = this.convertHex.bind(this);
		this.makeFadeUpGradient = this.makeFadeUpGradient.bind(this);
		this.makeBackgroundImage = this.makeBackgroundImage.bind(this);
	}

	convertHex(hex) {
	    var hex = hex.replace('#','');

	    var r = parseInt(hex.substring(0,2), 16);
	    var g = parseInt(hex.substring(2,4), 16);
	    var b = parseInt(hex.substring(4,6), 16);

	    return {
	    	start: 'rgba('+r+','+g+','+b+',1)',
	    	end: 'rgba('+r+','+g+','+b+',0.3)'
	   	};
	}

	makeFadeUpGradient(color) {
		var { start, end } = this.convertHex(color);

		return {
			'background': '-moz-linear-gradient(bottom, ' + start + ' 0%, ' + start + ' 30%, ' + end + ' 100%)',
			'background': '-webkit-gradient(linear, left bottom, left top, color-stop(0%,' + start + '), color-stop(30%,' + start + '), color-stop(100%,' + end + '))',
			'background': '-webkit-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 30%,' + end + ' 100%)',
			'background': '-o-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 30%,' + end + ' 100%)',
			'background': '-ms-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 30%,' + end + ' 100%)',
			'background': 'linear-gradient(to top, ' + start + ' 0%,' + start + ' 30%,' + end + ' 100%)'
		};
	}

	makeBackgroundImage(banner) {
		return {
			'background-image': 'url(' + GridEngine.domain + banner + ')',
			'background-size': 'cover',
            'background-position': 'center center'
        };
	}

	render() {
		var show = this.props.show;
		var venue = show.venue;

		var website = show.website + (show.website.indexOf('?') > -1 ? '&' : '?') + 'utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var boxStyle = {
			'background': venue.primary_color || '#000000'
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
			age = "",
			banner = "";

		var fadeUp = this.makeFadeUpGradient(venue.primary_color);

		if (show.banner) {
			banner = <div className="banner" style={ this.makeBackgroundImage(show.banner) }></div>;
		}


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
			var saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <div className="onsale">On Sale { saleDate }</div>;
		}
		else if (show.ticket !== '') {
			ticket = <a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><b className="icon-ticket"></b>Tickets &nbsp;{ price }</a>;
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}




		return (
			<div className="panel--item">
				<header style={ boxStyle }>
					<h4 className="venue">{ venue.name }</h4>
					{ age }
				</header>
				<div className="info">
					{ banner }
					<div className="artists" style={ fadeUp }>
						<div className="inner">
							{ headliner }
							{ opener }
							{ review }
							<span className="more">Read More...</span>
						</div>
					</div>
				</div>
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

