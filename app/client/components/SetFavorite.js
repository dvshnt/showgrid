import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import $ from 'jquery';

import { unfavoriteShow, favoriteShow, getUserInfo } from '../actions/index';

var DateManager = require('../util/DateManager');
var GridEngine = require('../util/GridEngine');


class SetFavorite extends Component {	
	constructor(props) {
		super(props);

		this.setShowAsFavorite = this.setShowAsFavorite.bind(this);

		this.state = {
			favorited: props.favorites.indexOf(props.show.id) > -1
		};
	}

	componentWillReceiveProps(nextProps) {
		this.state = {
			favorited: nextProps.favorites.indexOf(nextProps.show.id) > -1
		};
	}

	setShowAsFavorite(e) {
		var _this = this;

		if (this.state.favorited) {
			this.setState({
				favorited: false
			});

			this.props.unfavoriteShow(this.props.show.id);
		} else {
			this.setState({
				favorited: true
			});

			this.props.favoriteShow(this.props.show.id).then(function(response) {
				if (response.error) {
					_this.setState({
						favorited: false
					});
				}

				return;
			});
		}
	}

	render() {
		var className = (this.state.favorited) ? "favorite active" : "favorite";

		var text = (this.props.label) ? <span className="text">Favorite</span> : "";

		return (
			<div className={ className }>
				<span onClick={ this.setShowAsFavorite }><b className="icon-heart"></b>{ text }</span>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		favorites: state.state.favorites
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({ unfavoriteShow, favoriteShow, getUserInfo }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SetFavorite);