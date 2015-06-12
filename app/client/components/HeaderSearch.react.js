/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),
	
	HeaderPageOption = React.createFactory(require('./HeaderPageOption.react'));

module.exports = HeaderPage = React.createClass({
	render: function() {
		var disabled = (this.props.page !== 'search') ? 'search--bar disabled' : 'search--bar';

		return (
			<form className={ disabled } action="" onSubmit={ this.props.search }>
				<div className="search--bar__input">
					<input type="search" className="search--bar__text" placeholder="Search by venue or artist"/>
				</div>
				<input type="submit" className="search--bar__button" value=""/>
			</form>
		)
	}
});