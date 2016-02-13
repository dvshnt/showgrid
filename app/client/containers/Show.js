import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getShow } from '../actions/index';
import Loader from '../components/Loader';
import DocMeta from 'react-doc-meta'

class Show extends Component {
	constructor(props) {
		super(props)

		this.state = {
			offset: false,
			show: null
		}
	}

	componentDidMount(){
		this.props.getShow(this.props.params.id).then((show)=>{
			var show = this.props.shows[this.props.params.id];
			if( !show ) return;

			this.setState({
				show: show
			})
		})
	}

	toggle() {
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

		if (this.state.offset) var offset = 'container-offset';
		else var offset = '';


		if (this.state.show){
			return (
				<div className='show--page'>
					<h2>{ this.state.show.title }</h2>
					<h1>{ this.state.show.headliners }</h1>
					<h2>{ this.state.show.openers }</h2>
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
		shows: state.state.entities.shows
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getShow }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Show);


