import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment'
import {sortBy, clone, map} from 'lodash';
import Toggler from '../components/Toggler';

class VenueRecentShows extends Component{
	constructor(props){
		super(props);

		props.default_min = props.default_min || 3;
		props.default_max = props.default_max || 10;

		this.toggle = this.toggle.bind(this);

		this.state = {
			mini: props.mini || false,
			total_shows: props.venue.shows.length,
			max_shows: props.default_min,
		}
	}

	formatShowName(show){
		return (
			<a className='name' key = {show.id} target="_blank" href={ show.website }>{moment(show.date).format('ddd. M/D ')} &nbsp;-&nbsp; {show.headliners}</a>
		)
	}

	toggle(){
		this.setState({
			max_shows: this.state.max_shows == this.props.default_max ? this.props.default_min : this.props.default_max,
		})
	}

	media_check_primitive(){
		if(window.innerWidth < 700){
			if(this.state.mini == true) return;
			else{
				this.setState({
					mini:true,
					max_shows:this.props.default_min
				})
				this.refs.toggle.resetState();
			};
			// console.log("MINI");
		}else{
			if(this.state.mini == false) return;
			else{
				this.setState({
					mini:false,
					max_shows:this.props.default_max
				})
			};
			//console.log("NOT MINI");
		}
	}


	componentDidMount(){
		this.media_check_primitive();
		window.addEventListener('resize',this.media_check_primitive.bind(this));
	}

	render(){
		if(this.props.venue.shows.length){
			var header = <h3>Recently Added</h3>
		}else{
			var header = null
		}
		
		var children = [];
		var tc = 0;
		//console.log("MAX SHOWS",this.state.max_shows)

		var sorted_shows = sortBy(map(this.props.venue.shows,function(show){
			show.created_at = moment(show.created_at)
			return show
		}),function(show){
			return show.created_at
		});
		sorted_shows = sorted_shows.slice(0, 10);

		//console.log("SORTED:",sorted_shows)



		for( var i in sorted_shows){
			var show = sorted_shows[i];			
			children.push(this.formatShowName(show))
			if(++tc >= this.state.max_shows && this.state.mini == true) break;
			// children.push(<hr></hr>);
		}



		return (
			<div className = 'venue-recent'>
				{header}
				<hr/>
				<div className = 'child-container'>
					{children}
				</div>
				<Toggler ref="toggle" hook={ this.toggle }/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(VenueRecentShows);