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
		}

		if (this.state.favoriteTab) {
			for (var i=0; i < this.props.favorites.length; i++) {
				items.push(<UserFavorite show={ this.props.favorites[i] }/>);
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