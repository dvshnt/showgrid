/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = CalendarRowDayShow = React.createClass({	
	registerTicketEvent: function() {
		ga('send', 'event', 'ticket', 'click', this.props.show.headliners);  	
		return true;
	},
	
	registerShowEvent: function() {
		ga('send', 'event', 'show', 'click', this.props.show.headliners);  	
		return true;
	},

	render: function() {
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
			ticket = "",
			free = "",
			age = "",
			star = "";

		if (show.title !== '' && show.headliners !== '') {
			title = <a href={ show.website } target="_blank" onClick={ this.registerShowEvent }><div className="title">{ show.title }</div></a>;
		}

		if (show.star) {
			star = <b className="icon-star--full"></b>;
		}

		if (show.headliners !== '') {
			headliner = <a href={ show.website } target="_blank" onClick={ this.registerShowEvent }><div className="main">{ star }{ show.headliners }</div></a>;
		}

		if (show.openers !== '') {
			opener =  <a href={ show.website } target="_blank" onClick={ this.registerShowEvent }><div className="extra">{ show.openers }</div></a>;
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

			ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><div className="ticket">Buy Tickets{ price }</div></a>;
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
				<div className="show--info">
	            	<span className="time">{ time }</span>
	            	{ free }
	            	{ age }
				</div>
				{ title }
				{ headliner }
				{ opener }
				{ ticket }
	        </div>
		)
	}
});

