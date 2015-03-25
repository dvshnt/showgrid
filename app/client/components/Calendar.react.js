/** @jsx React.DOM */

var $ = require('jquery'),
	React = require('react'),

	Swipeable = React.createFactory(require('react-swipeable')),
	moment = require('moment'),

	Header = React.createFactory(require('./Header.react')),
	TableHead = React.createFactory(require('./TableHead.react')),
	TableBody = React.createFactory(require('./TableBody.react')),
	Footer = React.createFactory(require('./Footer.react')),

	GridEngine = require('../util/GridEngine'),
	DateManager = require('../util/DateManager');


React.initializeTouchEvents(true);

module.exports = Calendar = React.createClass({

	render: function() {
		return (
			<div className="calendar--container">
				<div className="arrow previous" onClick={ this.props.previousPage }>
					<div className="direction"><div className="top"></div><div className="bottom"></div></div>
				</div>
				<div className="arrow next" onClick={ this.props.nextPage }>
					<div className="direction"><div className="top"></div><div className="bottom"></div></div>
				</div>

				<section id="grid--fixed--container">

					<Header></Header>
					<TableHead days={ this.props.days }/>

				</section>
				
				<Swipeable  
					onSwipedLeft={ this.nextPage } 
					onSwipedRight={ this.previousPage } >
				
					<TableBody
						days={ this.props.days }
						venues={ this.props.venues }/>

				</Swipeable>
				
				<Footer></Footer>
			</div>
		)
	}
});