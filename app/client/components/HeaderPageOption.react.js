/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react');

module.exports = HeaderPageOption = React.createClass({
	render: function() {
		var boxClass = (this.props.page === this.props.pageName) ? "header__page--option--box selected " + this.props.pageName : "header__page--option--box " + this.props.pageName; 

		return (
			<a className={ boxClass } href={ this.props.link } onClick={ this.props.selectPage.bind(this, this.props.pageName) }>
				<b className={ this.props.symbol }></b>
				<br></br>
				<span>{ this.props.text }</span>
			</a>
		)
	}
});