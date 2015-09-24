/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = RecentShow = React.createClass({
	registerTicketEvent: function() {
		ga('send', 'event', 'ticket', 'featured', this.props.show.headliners);  	
		return true;
	},

	render: function() {
		var shows = this.props.show.shows,
			show_list = [];


		for (var i=0; i < shows.length; i++) {
			var show = shows[i];
			var venue = show.venue;

			var onsale = DateManager.areTicketsOnSale(show.onsale);

			var	title = "",
				headliner = "",
				opener = "",
				ticket = "",
				free = "",
				age = "";



			var primaryColor = {
				'background': show.venue.primary_color
			};

			var secondaryColor = {
				'color': show.venue.secondary_color
			};

			var accentColor = {
				'color': show.venue.accent_color
			};


			if (show.title !== '' && show.headliners !== '') {
				title = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="title">{ show.title }</div></a>;
			}
			
			if (show.headliners !== '') {
				headliner = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="headliner">{ show.headliners }</div></a>;
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

			show_list.push(
				<div className="featured--day__show__block">
					<div className="featured--day__show__info" style={ primaryColor }>
						<span className="venue" style={ secondaryColor }>{ venue.name }</span>
						<span className="time" style={ accentColor }>{ DateManager.formatShowTime(show.date) }</span>
						{ free }{ age }
					</div>
					<div className="featured--day__show__bands">
						{ title }
						{ headliner }
						{ opener }
					</div>
					<div className="featured--day__show__actions">
						{ ticket }
					</div>
				</div>
			);
		}
		

		return (
			<div className="featured--day__shows">
				{ show_list }
			</div>
		)
	}
});
