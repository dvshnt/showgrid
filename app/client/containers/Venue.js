import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';


import VenueOverlay from '../components/VenueOverlay';
import VenueRecentShows from '../components/VenueRecentShows';
import VenueUpcomingShows from '../components/VenueUpcomingShows';

import Toggler from '../components/Toggler';
import Loader from '../components/Loader';

import DocMeta from 'react-doc-meta'

import { getVenue } from '../actions/index'

import $ from 'jquery';


class Venue extends Component {
	constructor(props) {
		super(props)

		this.back = this.back.bind(this);
		this.toggle = this.toggle.bind(this);

		this.state = {
			offset: false,
			venue: null
		}
	}

	componentDidMount(){
		this.props.getVenue(this.props.params.id).then((venue)=>{
			var venue = this.props.venues[this.props.params.id];
			
			if( !venue ) return;
			
			this.setState({
				venue: venue
			})
		});
		
		if (window.innerWidth <= 500) $("body").addClass("lock");
	}

	componentWillUnmount() {
		if (window.innerWidth <= 500) $("body").removeClass("lock");
	}

	back() {
		if (window.history.length > 0) {
			window.history.back();
		}
		else {
			pushState(null, '/calendar/', '');
		}
	}

	toggle(){
		var offset = !this.state.offset;

		this.setState({
			offset: offset
		});
	}

	render(){
		var tags = [
			{name: "description", content: "lorem ipsum dolor"},
			{itemProp: "name", content: "The Name or Title Here"},
			{itemProp: "description", content: "This is the page description"},
			{name: "twitter:card", content: "product"},
			{name: "twitter:title", content: "Page Title"},
			{property: "og:title", content: "Title Here"},	
		]

		if(this.state.offset) {
			var offset = 'container-offset';
		}
		else {
			var offset = '';
		}


		if(this.state.venue){
			return (
				<div className='venue--page'>
					<DocMeta tags={tags} />

					<VenueOverlay venue={ this.state.venue } toggle={ this.toggle } back={ this.back }/>
					
					<div className = {"venue-container " + offset}>
						<VenueRecentShows mini={ true } venue={ this.state.venue }/>
						<VenueUpcomingShows  venue={ this.state.venue }/>
					</div>
				</div>
			)			
		}else{
			return (
				
				<Loader />
			)
		}
	}
}

function mapStateToProps(state) {
	return {
		venues: state.state.entities.venues
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getVenue }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Venue);


