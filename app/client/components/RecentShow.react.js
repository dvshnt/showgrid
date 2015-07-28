/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = RecentShow = React.createClass({
	render: function() {
		var shows = this.props.show.shows,
			venue = this.props.show.venue,
			show_list = [];


		for (var i=0; i < shows.length; i++) {
			var show = shows[i];

			var month = DateManager.getMonthFromDate(show.date),
				day = DateManager.getDayFromDate(show.date);

			var onsale = DateManager.areTicketsOnSale(show.onsale);

			var	title = "",
				headliner = "",
				opener = "",
				ticket = "",
				free = "",
				age = "";


			if (show.title !== '' && show.headliners !== '') {
				title = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="title">{ show.title }</div></a>;
			}
			
			if (show.headliners !== '') {
				headliner = <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="main">{ show.headliners }</div></a>;
			}

			if (show.openers !== '') {
				opener =  <a href={ show.website } target="_blank" onClick={ this.registerEvent }><div className="extra">{ show.openers }</div></a>;
			}


			if (!onsale) {
				saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
				ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }><div className="onsale">On Sale<br></br>{ saleDate }</div></a>;
			}
			else if (show.ticket !== '') {
				var price = "";

				if (show.price > 0) {
					price = <span className="price">${ show.price }</span>;
				}

				ticket = <a href={ show.ticket } target="_blank" onClick={ this.registerEvent }><div className="ticket">Buy Tickets{ price }</div></a>;
			}
			else if (show.price > 0) {
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


			show_list.push(
				<div className="search__row__day">
					<div className="search__row__day__date">
						<div>{ month }</div>
						<div>{ day }</div>
					</div>
					<div className="search__row__day__shows">
						<div className="search__row__day__show">
							<div className="search__row__show__info">
								<span className="time">{ DateManager.formatShowTime(show.date) }</span>
								{ free }{ age }
							</div>
							{ title }
							{ headliner }
							{ opener }
							{ ticket }
						</div>
					</div>
				</div>

			);
		}
		

		return (
			<div className="recent--day__venue">
				<h3>{  venue.name }</h3>
				{ show_list }
			</div>
		)
	}
});

