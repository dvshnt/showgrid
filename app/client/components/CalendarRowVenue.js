import React, { Component } from 'react';
import {Link} from 'react-router';


var GridEngine = require('../util/GridEngine');


export default class CalendarRowVenue extends Component {
	constructor(props) {
		super(props);

		//this.convertHex = this.convertHex.bind(this);
		// this.makeFadeUpGradient = this.makeFadeUpGradient.bind(this);
		// this.makeFadeDownGradient = this.makeFadeDownGradient.bind(this);
	}

	// convertHex(hex) {
	//     var hex = hex.replace('#','');

	//     var r = parseInt(hex.substring(0,2), 16);
	//     var g = parseInt(hex.substring(2,4), 16);
	//     var b = parseInt(hex.substring(4,6), 16);

	//     return {
	//     	start: 'rgba('+r+','+g+','+b+',1)',
	//     	end: 'rgba('+r+','+g+','+b+',0)'
	//    	};
	// }

	// makeFadeDownGradient(color) {
	// 	var { start, end } = this.convertHex(color);

	// 	return {
	// 		'opacity': '1',
	// 		'background': '-moz-linear-gradient(top, ' + start + ' 0%, ' + start + ' 4%, ' + end + ' 100%)',
	// 		'background': '-webkit-gradient(linear, left top, left bottom, color-stop(0%,' + start + '), color-stop(4%,' + start + '), color-stop(100%,' + end + '))',
	// 		'background': '-webkit-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': '-o-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': '-ms-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': 'linear-gradient(to bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)'
	// 	};
	// }

	// makeFadeUpGradient(color) {
	// 	var { start, end } = this.convertHex(color);

	// 	return {
	// 		'opacity': '1',
	// 		'background': '-moz-linear-gradient(bottom, ' + start + ' 0%, ' + start + ' 4%, ' + end + ' 100%)',
	// 		'background': '-webkit-gradient(linear, left bottom, left top, color-stop(0%,' + start + '), color-stop(4%,' + start + '), color-stop(100%,' + end + '))',
	// 		'background': '-webkit-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': '-o-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': '-ms-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
	// 		'background': 'linear-gradient(to top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)'
	// 	};
	// }
	gradient(){

		if( ! this.props.venue.primary_color ){
			var r = 0,g=0,b=0
		}else{
			var hex = this.props.venue.primary_color.replace('#','');this.props.venue.primary_color
			var r = parseInt(hex.substring(0,2), 16);
	  	  	var g = parseInt(hex.substring(2,4), 16);
	    	var b = parseInt(hex.substring(4,6), 16);
		}

		if(!b) b = 0
		if(!g) g = 0
		if(!r) r = 0	
		return {
			//background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 50%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3)"
			background: "-moz-linear-gradient(top, rgba("+r+","+g+","+b+",0.9) 0%, rgba("+r+","+g+","+b+",0.9) 6%, rgba("+r+","+g+","+b+",0.3) 42%, rgba("+r+","+g+","+b+",0.3) 60%, rgba("+r+","+g+","+b+",1) 100%)", /* FF3.6-15 */
			background: "-webkit-linear-gradient(top, rgba("+r+","+g+","+b+",0.9) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.3) 42%,rgba("+r+","+g+","+b+",0.3) 60%,rgba("+r+","+g+","+b+",1) 100%)", /* Chrome10-25,Safari5.1-6 */
			background: "linear-gradient(to bottom, rgba("+r+","+g+","+b+",0.9) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.3) 42%,rgba("+r+","+g+","+b+",0.3) 60%,rgba("+r+","+g+","+b+",1) 100%)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
		}	
	}

	render() {
		this.props.venue.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var primaryColor = {
			'background': this.props.venue.primary_color
		};

		var titleColor = {
			'color': this.props.venue.secondary_color
		};

		// if (this.props.venue.primary_color) {
		// 	var fadeDown = this.makeFadeDownGradient(this.props.venue.primary_color);

		// 	var fadeUp = this.makeFadeUpGradient(this.props.venue.primary_color);
		// 	fadeUp.color = this.props.venue.accent_color;
		// // }
		// else {
		// 	var fadeDown = {};
		// 	var fadeUp = {};
		// 	fadeUp.color = this.props.venue.accent_color;
		// }

		var image = {
			'background-image': 'url(' + GridEngine.domain + this.props.venue.image + ')',
			'filter': 'grayscale(1)',
			'-webkit-filter':'grayscale(1)'
		};

		

		

/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&0.9+6,0.1+42,0.1+60,1+100 */


		var link = '/venue/'+this.props.venue.id;

		return (
			<div className="venue" style={ primaryColor }>
				<div className="image" style={ image }></div>
				<div className="overlay" style={this.gradient()}>
					
					<h3 className="name">
						<Link to={link}>
							<a style={ {color:"#fff",cursor:"pointer"} } target="_blank">{ this.props.venue.name }</a>
						</Link>
					</h3>
					


					<Link className= 'icon-wrapper' to={link}>
						<b className='icon icon-th-list-2'></b>
					</Link>


					<div  className="address">
				    	<div>
			    			{ this.props.venue.address.street }
				    	</div>
				    	<div>
				    		{ this.props.venue.address.city },  { this.props.venue.address.state } { this.props.venue.address.zip_code }
				    	</div>
			    	</div>
		    	</div>
			</div>
		)
	}
};

