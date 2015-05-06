/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = SearchResultsShow = React.createClass({
	registerEvent: function() {
		console.log("CLICK");
	},

	render: function() {
		var month = DateManager.getMonthFromDate(this.props.show[0].date),
			day = DateManager.getDayFromDate(this.props.show[0].date);


		var shows = [];

		for (var i=0; i < this.props.show.length; i++) {
			var show = this.props.show[i];

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

			shows.push(<div className="search__row__day__show"><div className="search__row__show__info"><span className="time">{ DateManager.formatShowTime(show.date) }</span>{ free }{ age }</div>{ title }{ headliner }{ opener }{ ticket }</div>);
		}

		


		return (
			<div className="search__row__day">
				<div className="search__row__day__date">
					<div>{ month }</div>
					<div>{ day }</div>
				</div>

				<div className="search__row__day__shows">
					{ shows }
				</div>
			</div>
		)
	}
});

