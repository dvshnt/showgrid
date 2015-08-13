/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react');

module.exports = HeaderMobileMenu = React.createClass({
	render: function() {
		return (
			<div id="header__mobile--menu">
				<header>
					<aside className="profile">
					</aside>
					<div className="city"><span>Nashville</span></div>
					<aside className="close" onClick={ this.props.closeMenu }><b className="icon-close"></b></aside>
				</header>
				<section>
					<a href="/#/" className="page calendar" onClick={ this.props.selectPage.bind(this, 'calendar') }><b className="icon-calendar--full"></b></a>
					<a href="/#/recent" className="page recent" onClick={ this.props.selectPage.bind(this, 'recent') }><b className="icon-recent--full"></b></a>
					<a href="/#/featured" className="page star" onClick={ this.props.selectPage.bind(this, 'featured') }><b className="icon-star--full"></b></a>
					<a href="/#/search" className="page search" onClick={ this.props.selectPage.bind(this, 'search') }><b className="icon-search"></b></a>
				</section>
				<footer>
					
				</footer>
			</div>
		)
	}
});