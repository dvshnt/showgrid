import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getVenue } from '../actions/index'
import VenueOverlay from '../components/VenueOverlay';
import VenueRecentShows from '../components/VenueRecentShows';
import VenueUpcomingShows from '../components/VenueUpcomingShows';
import Loader from '../components/Loader';
import Toggler from '../components/Toggler';
import DocMeta from 'react-doc-meta'

class Venue extends Component {
	constructor(props) {
		super(props)

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
		})
	}

	toggle(){
		this.setState({
			offset: !this.state.offset
		})
	}

	// componentDidMount(){
	// 	var container = React.findDOMNode(this.refs.container);

	// }

	render(){
		var tags = [
			{name: "description", content: "lorem ipsum dolor"},
			{itemProp: "name", content: "The Name or Title Here"},
			{itemProp: "description", content: "This is the page description"},
			{name: "twitter:card", content: "product"},
			{name: "twitter:title", content: "Page Title"},
			{property: "og:title", content: "Title Here"},	
		]

		if(this.state.offset) var offset = 'container-offset';
		else var offset = '';



		if(this.state.venue){
			return (
				<div className='venue--page'>
					<DocMeta tags={tags} />
					<VenueOverlay venue={ this.state.venue } />
					<Toggler hook={this.toggle.bind(this)} />
					<div ref="container" className = {"venue-container "+offset}>
						<VenueUpcomingShows  venue={ this.state.venue }/>
						<VenueRecentShows mini={true} venue={ this.state.venue }/>
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


