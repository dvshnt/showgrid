import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { favoriteShow } from '../actions/index';

var DateManager = require('../util/DateManager');
var GridEngine = require('../util/GridEngine');


class SetFavorite extends Component {	
	constructor(props) {
		super(props);

		this.setShowAsFavorite = this.setShowAsFavorite.bind(this);

		this.state = {
			className: "icon-heart"
		};
	}

	componentDidMount() {
		if (this.props.show.favorited) {
			this.setState({
				className: "icon-heart active"
			});
		}
	}

	setShowAsFavorite(e) {
		this.props.favoriteShow(this.props.show.id);

		if (this.state.className === "icon-heart active") {
			this.setState({
				className: "icon-heart"
			});
			return;
		}

		this.setState({
			className: "icon-heart active"
		});	
	}

	render() {
		return (
			<b className={ this.state.className } onClick={ this.setShowAsFavorite }></b>
		)
	}
};


function mapStateToProps(state) {
	return { };
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ favoriteShow }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SetFavorite);