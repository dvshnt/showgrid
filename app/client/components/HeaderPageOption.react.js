/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react');

module.exports = HeaderPageOption = React.createClass({
	goToPage: function() {
		ga('send', 'event', 'page', this.props.pageName);  
		this.props.selectPage(this.props.pageName);
	},

	render: function() {
		var boxClass = (this.props.page === this.props.pageName) ? "header__page--option--box selected " + this.props.pageName : "header__page--option--box " + this.props.pageName; 

		return (
			<a className={ boxClass } href={ this.props.link } onClick={  }>
				<b className={ this.props.symbol }></b>
				<br></br>
				<span>{ this.props.text }</span>
			</a>
		)
	}
});