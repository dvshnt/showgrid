import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import UserAlert from './UserAlert';
import UserFavorite from './UserFavorite';


class UserActions extends Component {
	constructor(props) {
		super(props);

		this.selectTab = this.selectTab.bind(this);

		this.state = {
			alertTab: false,
			favoriteTab: true
		};
	}

	selectTab(e) {
		if (e.target.className.indexOf("alerts") !== -1) {
			this.setState({
				alertTab: true,
				favoriteTab: false
			});

			return false;
		}

		if (e.target.className.indexOf("favorites") !== -1) {
			this.setState({
				alertTab: false,
				favoriteTab: true
			});

			return false;
		}

		return false;
	}

	render() {
		var alertTabClass = (this.state.alertTab) ? "tab alerts selected" : "tab alerts";
		var favoritesTabClass = (this.state.favoriteTab) ? "tab favorites selected" : "tab favorites";

		var items = [];
		if (this.state.alertTab) {
			for (var i=0; i < this.props.alerts.length; i++) {
				items.push(<UserAlert alert={ this.props.alerts[i] }/>);
			}

			if (items.length === 0) {
				items = (
					<div className="info-text">
						<h2>No Alerts Set</h2>
						<p>Set a reminder on a show by clicking the <b className="icon-alert"></b> icon and selecting a time. You will receive a text at the chosen time reminding you about the show and providing you with a link to buy tickets.</p>
					</div>
				);
			}
		}

		if (this.state.favoriteTab) {
			for (var i=0; i < this.props.favorites.length; i++) {
				items.push(<UserFavorite show={ this.props.favorites[i] }/>);
			}

			if (items.length === 0) {
				items = (
					<div className="info-text">
						<h2>No Shows Favorited</h2>
						<p>Favorite a show by clicking the <b className="icon-heart"></b> icon on any show you might like. Favoriting helps you track shows that you might go to.</p>
					</div>
				);
			}
		}


		return (
			<div className="user--actions">
				<div className="tabs">
					<span onClick={ this.selectTab } className={ favoritesTabClass }><b className="icon-heart"></b>Favorites</span>
					<span onClick={ this.selectTab } className={ alertTabClass }><b className="icon-alert"></b> Alerts</span>
				</div>
				<div className="actions">
					{ items }
				</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	var favorites = state.state.favorites.map( f => state.state.entities.shows[f] );
	var alerts = state.state.alerts.map(function(a) {
		var result = state.state.entities.alerts[a];
		
		if (typeof result.show !== 'object') {
			result.show = state.state.entities.shows[result.show];
		}
		
		return result;
	});

	return {
		favorites: favorites,
		alerts: alerts
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(UserActions);