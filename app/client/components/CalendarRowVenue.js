import React, { Component } from 'react';
import {Link} from 'react-router';


var GridEngine = require('../util/GridEngine');


export default class CalendarRowVenue extends Component {
	constructor(props) {
		super(props);

		this.convertHex = this.convertHex.bind(this);
		this.makeFadeUpGradient = this.makeFadeUpGradient.bind(this);
		this.makeFadeDownGradient = this.makeFadeDownGradient.bind(this);
	}

	convertHex(hex) {
	    var hex = hex.replace('#','');

	    var r = parseInt(hex.substring(0,2), 16);
	    var g = parseInt(hex.substring(2,4), 16);
	    var b = parseInt(hex.substring(4,6), 16);

	    return {
	    	start: 'rgba('+0+','+0+','+0+',1)',
	    	end: 'rgba('+0+','+0+','+0+',0)'
	   	};
	}

	makeFadeDownGradient(color) {
		var { start, end } = this.convertHex(color);

		return {
			'opacity': '1',
			'background': '-moz-linear-gradient(top, ' + start + ' 0%, ' + start + ' 4%, ' + end + ' 100%)',
			'background': '-webkit-gradient(linear, left top, left bottom, color-stop(0%,' + start + '), color-stop(4%,' + start + '), color-stop(100%,' + end + '))',
			'background': '-webkit-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': '-o-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': '-ms-linear-gradient(top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': 'linear-gradient(to bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)'
		};
	}

	makeFadeUpGradient(color) {
		var { start, end } = this.convertHex(color);

		return {
			'opacity': '1',
			'background': '-moz-linear-gradient(bottom, ' + start + ' 0%, ' + start + ' 4%, ' + end + ' 100%)',
			'background': '-webkit-gradient(linear, left bottom, left top, color-stop(0%,' + start + '), color-stop(4%,' + start + '), color-stop(100%,' + end + '))',
			'background': '-webkit-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': '-o-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': '-ms-linear-gradient(bottom, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)',
			'background': 'linear-gradient(to top, ' + start + ' 0%,' + start + ' 4%,' + end + ' 100%)'
		};
	}

	render() {
		this.props.venue.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var primaryColor = {
			'background': this.props.venue.primary_color
		};

		var titleColor = {
			'color': this.props.venue.secondary_color
		};

		if (this.props.venue.primary_color) {
			var fadeDown = this.makeFadeDownGradient(this.props.venue.primary_color);

			var fadeUp = this.makeFadeUpGradient(this.props.venue.primary_color);
			fadeUp.color = this.props.venue.accent_color;
		}
		else {
			var fadeDown = {};
			var fadeUp = {};
			fadeUp.color = this.props.venue.accent_color;
		}

		var image = {
			'background-image': 'url(' + GridEngine.domain + this.props.venue.image + ')'
		};




		var link = '/venue/'+this.props.venue.id;

		return (
			<div className="venue" style={ primaryColor }>
				<div className="image" style={ image }></div>
				<div className="overlay">
			    		<Link to={link}>
			    		<h3 className="name" style={ fadeDown }>
			    			<a style={ {color:"#fff",cursor:"pointer"} } target="_blank">{ this.props.venue.name }</a>
			    		</h3>
			    		</Link>
					<div  className="address" style={ fadeUp }>
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

