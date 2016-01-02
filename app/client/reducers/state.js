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
		var start = moment();
		if (state.days[0]) {
			start = moment(state.days[0].date, "MMMM Do YYYY");
		}

		var days = DateManager.getDaysArray(start, action.cells);

		return  Object.assign({}, state, {
			days: days
		});

	case "VENUE_REQUEST":
		return Object.assign({}, state, {
			waiting: true,
		});		

	case "GRID_REQUEST":
		return Object.assign({}, state, {
			waiting: true,
			days: DateManager.getDaysArray(action.payload.date, GridEngine.getCellCount())
		});


	case "FEATURED_SUCCESS":
		if (action.payload && action.payload.entities) {
			return Object.assign({}, state, {
				waiting: false,
				featured: action.payload.result,
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

	case "VENUE_SUCCESS":
		if (action.payload && action.payload && !action.payload.status) {
			console.log(action.payload)
			var new_state = Object.assign({}, state, {
				waiting: false,
				entities: Object.assign({}, state.entities, {
					venues: merge({}, state.entities.venues, action.payload.entities.venue),
				})
			});
			console.log("GOT VENUE")
			console.log(new_state)
			return new_state
		}

		return Object.assign({}, state, {
			waiting: false,
		});

	case "VENUE_FAILURE":
		console.error("FAILED TO FETCH VENUE")
		return Object.assign({}, state, {
			waiting: false
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
			search: Object.assign({}, state.search, {
				waiting: true
			})
		});

	case "SEARCH_REQUEST":
		return  Object.assign({}, state, {
			//waiting: true,
			search: Object.assign({}, state.search, {
				waiting: true,
				results: [],
				query: action.payload.query
			})
		});

	case "SEARCH_SUCCESS":
		return  Object.assign({}, state, {
			//waiting: false,
			search: Object.assign({}, state.search, {
				waiting: false,
				results: action.payload.result
			}),
			entities: Object.assign({}, state.entities, {
				shows: merge({}, state.entities.shows, action.payload.entities.shows)
			})
		});

	
	case "PAGE_LOADED":
	case "SEARCH_FAILURE":
		return  Object.assign({}, state, {
			search: Object.assign({}, state.search, {
				waiting: false,
				results: []
			})
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