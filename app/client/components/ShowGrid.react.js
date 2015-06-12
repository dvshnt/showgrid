/** @jsx React.DOM */
var $ = require('jquery'),
	React = require('react'),

	Swipeable = React.createFactory(require('react-swipeable')),

	ControlNext = React.createFactory(require('./ControlNext.react')),
	ControlPrevious = React.createFactory(require('./ControlPrevious.react')),

	Header = React.createFactory(require('./Header.react')),
	Calendar = React.createFactory(require('./Calendar.react')),
	Footer = React.createFactory(require('./Footer.react'));


React.initializeTouchEvents(true);

module.exports = ShowGrid = React.createClass({
	componentDidMount: function() {
		var _this = this;

		var previousScroll = 0,
			headerOrgOffset = $('#header').height();

		$(window).scroll(function() {
			previousScroll = togglePageHeader(previousScroll, headerOrgOffset);

			function togglePageHeader(prev, offset) {
				var currentScroll = $(this).scrollTop();
				
				if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
					
				}
				else if (currentScroll > offset && (_this.props.page === "calendar" || _this.props.page === "search")) {
					if (currentScroll > prev) {
						$('body').addClass("sleep");
					} else {
						$('body').removeClass("sleep");
					}
				}
				
				return currentScroll;
			}
		})
	},

	render: function() {
		return (
			<section id="container">
				<ControlNext next={ this.props.next }/>
				<ControlPrevious previous={ this.props.previous }/>

				<Swipeable onSwipedLeft={ this.props.next } onSwipedRight={ this.props.previous }>
					<Calendar venues={ this.props.venues } days={ this.props.days }/>
					<Footer/>
				</Swipeable>
			</section>
		)
	}
});