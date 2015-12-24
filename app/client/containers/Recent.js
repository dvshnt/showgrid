import moment from 'moment';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Show from '../components/ListItem';

import { getRecent } from '../actions/index';
import { Loader } from '../components/Loader';
import DocMeta from 'react-doc-meta'
var DateManager = require('../util/DateManager');


class Recent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 1,
			lastPage: false
		};
	}
	

	componentDidMount() {
	    // Fetching first recent shows
	    if (this.props.recent.length === 0) {
	    	this.props.getRecent(this.state.page);
	    }
	}

	render() {
		var tags = [
			{name: "description", content: "lorem ipsum dolor"},
			{itemProp: "name", content: "The Name or Title Here"},
			{itemProp: "description", content: "This is the page description"},
			{name: "twitter:card", content: "product"},
			{name: "twitter:title", content: "Page Title"},
			{property: "og:title", content: "Title Here"},	
		]

		var items = [];

		

		var last_day = null
		for (var i=0;i<this.props.recent.length;i++){
			var show = this.props.recent[i];

			var day = DateManager.getRecentShowsDate(moment(show.created_at));

			if(last_day == null || day != last_day){
				console.log("DAY",day);
				items.push(<h3>{day}</h3>);
				last_day = day;
			}
			items.push(<Show showStar={true} showTime={true} ticket_price={true} skip_header={true} showDate={false} show={show} />)
		}


		
		return (
			<div style={{ width : '100%' }}>
				<DocMeta tags={tags} />
				<div id="list">
					{items}
				</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	var recent = state.state.recent.map( s => state.state.entities.shows[s] );

	return {
		recent: recent
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getRecent }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Recent);