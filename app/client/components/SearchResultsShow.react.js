/** @jsx React.DOM */
var React = require('react/addons'),
	DateManager = require('../util/DateManager');

module.exports = SearchResultsShow = React.createClass({
	render: function() {
		var time = DateManager.formatShowTime(this.props.show[0].date),
			month = DateManager.getMonthFromDate(this.props.show[0].date),
			day = DateManager.getDayFromDate(this.props.show[0].date);

		return (
			<div className="search--results__row__show">
				<div className="search--results__row__show__date">
					<div>{ month }</div>
					<div>{ day }</div>
				</div>

				<div className="search--results__row__show__band">
				{
					this.props.show.map(function(s) {
						return (
							<div>
								<span className="search--results__row__show__band__time">{ time }</span>
								<a href={ s.website }>{ s.band }</a>
							</div>
						)
    				})
				}
				</div>
			</div>
		)
	}
});
