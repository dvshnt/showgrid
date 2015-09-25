/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = SearchResultsShow = React.createClass({
	registerEvent: function() {
		console.log("CLICK");
	},

	render: function() {
		var show = this.props.show,
			venue = show.venue;

		var onsale = DateManager.areTicketsOnSale(show.onsale);

		var month = DateManager.getMonthFromDate(show.date),
			day = DateManager.getDayFromDate(show.date);

		var	venue = show.venue,
			title = "",
			headliner = "",
			opener = "",
			ticket = "",
			star = "",
			free = "",
			age = "";


		var primaryColor = {
			'background': venue.primary_color
		};

		var secondaryColor = {
			'color': venue.secondary_color
		};

		var accentColor = {
			'color': venue.accent_color
		};


		if (show.title !== '' && show.headliners !== '') {
			title = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="title">{ show.title }</div></a>;
		}

		if (show.star) {
			star = <b className="icon-star--full"></b>;
		}
		
		if (show.headliners !== '') {
			headliner = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="headliner">{ star }{ show.headliners }</div></a>;
		}

		if (show.openers !== '') {
			opener =  <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="opener">{ show.openers }</div></a>;
		}
		
		if (show.price < 0) {
			free = <span className="free" style={ accentColor }>FREE</span>;
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		if (show.age > 0) {
			age = <span className="age" style={ accentColor }>{ show.age }+</span>;
		}

		if (!onsale) {
			saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><div className="onsale">On Sale { saleDate }</div></a>;
		}
		else if (show.ticket !== '') {
			var price = "";

			if (show.price > 0) {
				price = <span className="price">${ show.price }</span>;
			}

			ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><div className="button ticket">Buy Tickets { price }</div></a>;
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}


		return (
			<div className="recent--day__show__block">
				<div className="recent--day__show__info" style={ primaryColor }>
					<span className="venue" style={ secondaryColor }>{ venue.name }</span>
					<span className="time" style={ accentColor }>{ DateManager.formatShowTime(show.date) }</span>
					{ free }{ age }
				</div>
				<div className="recent--day--middle">
					<div className="recent--day__show__date">
						<div>{ month }</div>
						<div>{ day }</div>
					</div>
					<div className="recent--day__show__bands">
						{ title }
						{ headliner }
						{ opener }
					</div>
				</div>
				<div className="recent--day__show__actions">
					{ ticket }
				</div>
			</div>
		);
	}
});

