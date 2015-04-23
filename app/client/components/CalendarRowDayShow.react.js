/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = CalendarRowDayShow = React.createClass({	
	registerEvent: function() {
		ga('send', 'event', 'show', 'click', this.props.show.band_name);  	
		return true;
	},

	render: function() {
		var show = this.props.show,
			headliner = show.band_name,
			time = DateManager.formatShowTime(show.date);

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

		if (show.ticket !== '') {
			var price = "";

			if (show.price !== '') {
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

