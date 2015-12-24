import React, { Component } from 'react';
import {Link} from 'react-router';


var GridEngine = require('../util/GridEngine');


export default class VenueOverlay extends Component {
	constructor(props) {
		super(props);

		this.convertHex(props.venue.primary_color);
	}

	convertHex(hex) {
	    var hex = hex.replace('#','');

	    var r = parseInt(hex.substring(0,2), 16);
	    var g = parseInt(hex.substring(2,4), 16);
	    var b = parseInt(hex.substring(4,6), 16);

	    if(!b) b = 0
	    if(!g) g = 0
	    if(!r) r = 0

	   	this.overlayStyle = {
	   		"background": "-webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 80%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3)", /* Chrome10-25,Safari5.1-6 */
	   		"background": "-moz-linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 80%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3)", /* FF3.6-15 */
	   		"background": "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 80%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	   	}
	}


	//primitive
	formatPhone(p){
		if(p == null) return null
		var pp = String(p).split(/(\d{3})/).filter(v=>{return v.length > 0})
		var res = null
		try{
			res = '('+pp[0]+') '+pp[1]+'-'+pp[2]+pp[3]
		}catch(e){
			console.error('failed to format venue phone number')
		}
		return (res || pp)
	}

	render() {
		this.props.venue.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var primaryColor = {
			'background': this.props.venue.primary_color
		};

		var titleColor = {
			'color': this.props.venue.secondary_color
		};

		var image = {
			'background-image': 'url(' + GridEngine.domain + this.props.venue.image + ')'
		};




		var link = '/venue/'+this.props.venue.id;
		//console.log(link);

		var icons = [
			this.props.venue.twitter_url != null ? ( <a href={this.props.venue.twitter_url} ><b className='icon icon-twitter-bird'></b></a> ) : null,
			this.props.venue.facebook_url != null ? ( <a href={this.props.venue.facebook_url}><b className='icon icon-facebook-rect'></b></a> ) : null
		]

		return (
			<div className="venue-overlay" style={ primaryColor }>
				<div className="image" style={ image }></div>
				<div className="overlay-gradient" style={this.overlayStyle}></div>
				<div className="content">
					<div className="content-top">
						<a className="name" target="_blank">{ this.props.venue.name }</a>
						<div  className="address" >
							{ this.props.venue.address.street } { this.props.venue.address.city },  { this.props.venue.address.state } { this.props.venue.address.zip_code }
						</div>
					</div>
			    	<div className="description">
			    		<p>
			    			{ this.props.venue.description }
			    		</p>
			    	</div>
			    	<div className='footer'>
			    		{icons}
			    		<span className='phone'>{this.formatPhone(this.props.venue.phone)}</span>
			    	</div>
				</div>
				
			</div>
		)
	}
};

