import moment from 'moment';

import omit from 'lodash/object/omit';
import merge from 'lodash/object/merge';
import remove from 'lodash/array/remove';

var GridEngine = require('../util/GridEngine');
var DateManager = require('../util/DateManager');


export default function state(state={ 
		waiting:true, 

		days:[], 

		user:"", 

		grid:[], 
		recent:[], 
		featured:[], 

		search:{
			query:"", 
			searching: false,
			results: []
		}, 

		favorites:[], 
		alerts:[], 

		entities:{} 
	}, action) 
{


	switch (action.type) {
	case "FETCH_REQUEST":
		return Object.assign({}, state, {
			waiting: true
		});

	case "ADJUST_SIZE":
		return  Object.assign({}, state, {
			days: DateManager.getDaysArray(state.days[0] || moment(), action.cells)
		});

	case "GRID_REQUEST":
		return Object.assign({}, state, {
			waiting: true,
			days: DateManager.getDaysArray(action.payload.date, GridEngine.getCellCount())
		});


	case "FEATURED_SUCCESS":
		if (action.payload && action.payload.entities && action.payload.entities.shows) {
			return Object.assign({}, state, {
				waiting: false,
				featured: state.featured.concat(action.payload.result),
				entities: Object.assign({}, state.entities, {
					shows: merge({}, state.entities.shows, action.payload.entities.shows)
				})
			});
		}
		
		return Object.assign({}, state, {
			waiting: false,
		});


	case "RECENT_SUCCESS":
		if (action.payload && action.payload.entities && action.payload.entities.shows) {
			return Object.assign({}, state, {
				waiting: false,
				recent: state.recent.concat(action.payload.result),
				entities: Object.assign({}, state.entities, {
					shows: merge({}, state.entities.shows, action.payload.entities.shows)
				})
			});
		}

		return Object.assign({}, state, {
			waiting: false,
		});


	case "GRID_SUCCESS":
		if (action.payload && action.payload.entities && action.payload.entities.venues) {
			return Object.assign({}, state, {
				waiting: false,
				grid: action.payload.result,
				entities: Object.assign({}, state.entities, {
					shows: merge({}, state.entities.shows, action.payload.entities.shows),
					venues: action.payload.entities.venues,
				})
			});
		}
		return state;

	case "USER_SUCCESS":
		if (action.payload && action.payload.entities && action.payload.entities.users) {
			var index = action.payload.result;
			return Object.assign({}, state, {
				waiting: false,
				user: index,
				alerts: action.payload.entities.users[index].alerts,
				favorites: action.payload.entities.users[index].favorites,
				entities: Object.assign({}, state.entities, {
					user: merge({}, state.entities.user, action.payload.entities.users[index].profile),
					alerts: merge({}, state.entities.alerts, action.payload.entities.alerts),
					shows: merge({}, state.entities.shows, action.payload.entities.shows)
				})
			});
		}
		return state;

	case "USER_FAILURE":
		return Object.assign({}, state, {
			waiting: false
		});


	// FAVORITING ACTIONS
	case "REMOVE_FAVORITE_SUCCESS":
		return Object.assign({}, state, {
			favorites: state.favorites.filter( f => f !== action.payload.show )
		});

	case "SET_FAVORITE_SUCCESS":
		return Object.assign({}, state, {
			favorites: state.favorites.concat(action.payload.show)
		});


	// ALERT ACTIONS
	case "ALERT_SET_SUCCESS":
		if (action.payload && action.payload.entities) {
			var index = action.payload.result;

			return Object.assign({}, state, {
				alerts: state.alerts.concat(index),
				entities: Object.assign({}, state.entities, {
					alerts: merge({}, state.entities.alerts, action.payload.entities.alerts)
				})
			});
		}
		return state;

	case "ALERT_CHANGE_SUCCESS":
		var index = action.payload.id;
		var which = action.payload.which;

		state.entities.alerts[index].which = which;
		return state;

	case "ALERT_DELETE_SUCCESS":
		var index = action.payload.alert;
		delete state.entities.alerts[index];

		return Object.assign({}, state, {
			alerts: state.alerts.filter( a => a !== index )
		});


	case "SEARCH_WAIT":
		return Object.assign({}, state, {
			search: Object.Object.assign({}, state.search, {
				searching: true
			})
		});

	case "SEARCH_REQUEST":
		return  Object.assign({}, state, {
			waiting: false,
			search: Object.assign({}, state.search, {
				searching: false,
				query: action.payload.query
			})
		});

	case "SEARCH_SUCCESS":
		return  Object.assign({}, state, {
			waiting: false,
			search: Object.assign({}, state.search, {
				results: action.payload.result
			}),
			entities: Object.assign({}, state.entities, {
				shows: merge({}, state.entities.shows, action.payload.entities.shows)
			})
		});

	
	case "PAGE_LOADED":
	case "SEARCH_FAILURE":
		return  Object.assign({}, state, {
			waiting: false
		});




	default:
		if (action.payload && action.payload.entities && action.payload.entities.shows) {
			return merge({}, state, {
				entities: Object.assign({}, state.entities, {
					shows: merge({}, state.entities.shows, action.payload.entities.shows)
				})
			});
		}
		return state;
	}
}