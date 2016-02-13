import { CALL_API } from 'redux-api-middleware';
import { Schemas } from '../schemas/index';
import { arrayOf } from 'normalizr';



var GridEngine = require('../util/GridEngine');


export function adjustWindowSize(cells) {
	return {
		type: "ADJUST_SIZE",
		cells: cells
	}
}


function loginUser(username, password) {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/login',
		    method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		    types: ['TOKEN_REQUEST', 'TOKEN_SUCCESS', 'TOKEN_FAILURE'],
		    body: JSON.stringify({
    			username: username,
    			password: password
    		})
		}
	};
}


// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getUserToken(username, password) {
	return (dispatch, getState) => {
		return dispatch(loginUser(username, password));
	};
}

export function signupUser(email, password) {
	return (dispatch, getState) => {
		return dispatch({
			[CALL_API]: {
				endpoint: GridEngine.domain + '/signup',
			    method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
			    types: ['REGISTRATION_REQUEST', 'REGISTRATION_SUCCESS', 'REGISTRATION_FAILURE'],
			    body: JSON.stringify({
	    			email: email,
	    			password: password
	    		})
			}			
		});
	};
};

export function updateProfile(name, email, pass) {
	return (dispatch, getState) => {
		return dispatch({
			[CALL_API]: {
				endpoint: GridEngine.domain + '/user/profile',
			    method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
			    types: ['UPDATEUSER_REQUEST', 'UPDATEUSER_SUCCESS', 'UPDATEUSER_FAILURE'],
			    body: JSON.stringify({
	    			name: name,
	    			email: email,
	    			pass: pass
	    		})
			}		
		})
	}
}

function getUser() {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/user/profile',
		    method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		    types: ['USER_REQUEST', 'USER_SUCCESS', 'USER_FAILURE'],
		    schema: Schemas.USER
		}
	};
}




// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getUserInfo() {
	return (dispatch, getState) => {
		return dispatch(getUser());
	};
}



function submitNumber(number) {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/user/phone_set',
		    method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		    types: ['ACTION_REQUEST', 'ACTION_SUCCESS', 'ACTION_FAILURE'],
		    body: JSON.stringify({
    			phone: number
    		})
		}
	};
}

export function submitUserPhone(number) {
	return (dispatch, getState) => {
		return dispatch(submitNumber(number));
	};
}



function submitPin(pin) {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/user/pin_check',
		    method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
		    types: ['ACTION_REQUEST', 'ACTION_SUCCESS', 'ACTION_FAILURE'],
		    body: JSON.stringify({
    			pin: pin
    		})
		}
	};
}

export function submitPhonePin(pin) {
	return (dispatch, getState) => {
		return dispatch(submitPin(pin));
	};
}



export function getVenue(id) {
	console.log("GET VENUE")
	return (dispatch, getState) => {
		return dispatch({
			[CALL_API]: {
				endpoint: GridEngine.domain + '/v1/venues/'+id,
			    method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			    types: ['VENUE_REQUEST', 'VENUE_SUCCESS', 'VENUE_FAILURE'],
			    schema: Schemas.VENUE
			}
		})
	}
}


export function getShow(id) {
	console.log("GET SHOW")
	return (dispatch, getState) => {
		return dispatch({
			[CALL_API]: {
				endpoint: GridEngine.domain + '/v1/shows/' + id,
			    method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			    types: ['SHOW_REQUEST', 'SHOW_SUCCESS', 'SHOW_FAILURE'],
			    schema: Schemas.SHOW
			}
		})
	}
}

function fetchGrid(date) {

	console.log("FETCH GRID")
	return {
		[CALL_API]: {
			endpoint: function() {
				var start = date;
				var end = date.clone().add(GridEngine.getCellCount(), 'days');

				var url = GridEngine.domain + '/v1/venues';
				url += '?opened=True';
				url += '&start=' + start.format('YYYY') + '-' + start.format('M')  + '-' + start.format('D')
				url += '&end=' + end.format('YYYY') + '-' + end.format('M')  + '-' + end.format('D')
				return url;
			},
		    method: 'GET',
		    types: [
				{
					type: 'GRID_REQUEST', 
					payload: (action, state) => ({ date: date })
				},
		    	'GRID_SUCCESS', 
		    	'FETCH_FAILURE'
		    ],
			headers: {
				'Content-Type': 'application/json'
			},
		    schema: arrayOf(Schemas.VENUE_LIST)
		}
	};
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getGrid(date) {
	return (dispatch, getState) => {
		return dispatch(fetchGrid(date));
	};
}




function fetchRecent(page) {
	return {
		[CALL_API]: {
			endpoint: function() {
				var url = GridEngine.domain + '/v1/shows';
				url += '?page=' + page;
				url += '&orderby=-created_at,date,venue';
				return url;
			},
		    method: 'GET',
		    types: ['FETCH_REQUEST', 'RECENT_SUCCESS', 'FETCH_FAILURE'],
		    schema: arrayOf(Schemas.SHOW)
		}
	};
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getRecent(page) {
	return (dispatch, getState) => {
		return dispatch(fetchRecent(page));
	};
}



function fetchFeatured(page, start, end) {
	return {
		[CALL_API]: {
			endpoint: function() {
				var url = GridEngine.domain + '/v1/shows';
				url += '?featured=True';
				url += '&page=' + page;
				url += '&orderby=date,venue';
				url += '&start=' + start;
				url += '&end=' + end;
				return url;
			},
		    method: 'GET',
		    types: ['FETCH_REQUEST', 'FEATURED_SUCCESS', 'FEATURED_FAILURE'],
		    schema: arrayOf(Schemas.SHOW)
		}
	};
}
// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getFeatured(page, start, end) {
	return (dispatch, getState) => {
		return dispatch(fetchFeatured(page, start, end));
	};
}



function markShowAsFavorite(show) {
	console.log("MARK SHOW AS FAVORITE")
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/favorite",
		    method: 'POST',
		    types: ['FAVORITE_REQUEST', 'SET_FAVORITE_SUCCESS', 'SET_FAVORITE_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			show: show
    		})
		}
	}
}

export function favoriteShow(show) {
	return (dispatch, getState) => {
		return dispatch(markShowAsFavorite(show));
	};
}



function removeShowAsFavorite(show) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/favorite",
		    method: 'DELETE',
		    types: ['FAVORITE_REQUEST', 'REMOVE_FAVORITE_SUCCESS', 'REMOVE_FAVORITE_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			show: show
    		})
		}
	};
}

export function unfavoriteShow(show) {
	return (dispatch, getState) => {
		return dispatch(removeShowAsFavorite(show));
	};
}



function setAlertForShow(show, date, which, sale) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/alert",
		    method: 'POST',
		    types: ['ALERT_SET_REQUEST', 'ALERT_SET_SUCCESS', 'ALERT_SET_SUCCESS'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			show: show,
    			date: date,
    			which: which,
    			sale: sale
    		}),
		    schema: Schemas.ALERT
		}
	};
}

export function setAlert(show, date, which, sale) {
	return (dispatch, getState) => {
		return dispatch(setAlertForShow(show, date, which, sale));
	};
}



function changeAlertForShow(alert, date, which) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/alert",
		    method: 'PUT',
		    types: ['ALERT_CHANGE_REQUEST', 'ALERT_CHANGE_SUCCESS', 'ALERT_CHANGE_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			alert: alert,
    			date: date,
    			which: which
    		})
		}
	};
}

export function changeAlert(alert, date, which) {
	return (dispatch, getState) => {
		return dispatch(changeAlertForShow(alert, date, which));
	};
}



function deleteAlertForShow(alert) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/alert",
		    method: 'DELETE',
		    types: ['ALERT_DELETE_REQUEST', 'ALERT_DELETE_SUCCESS', 'ALERT_DELETE_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			alert: alert
    		})
		}
	};
}

export function deleteAlert(alert) {
	return (dispatch, getState) => {
		return dispatch(deleteAlertForShow(alert));
	};
}


export function prepareSearch() {
	return {
		type: 'SEARCH_WAIT'
	};
}


function fetchSearchResults(query) {
	return {
		[CALL_API]: {
			endpoint: function() {
				var url = GridEngine.domain + '/v1/shows?';
				url += 'q=' + encodeURIComponent(query);
				return url;
			},
		    method: 'GET',
		    types: [
				{
					type: 'SEARCH_REQUEST', 
					payload: (action, state) => ({ query: query })
				}, 
				'SEARCH_SUCCESS', 
				'SEARCH_FAILURE'
			],
			headers: {
				'Content-Type': 'application/json'
			},
		    schema: arrayOf(Schemas.SHOW)
		}
	};
}

export function getSearchResults(query) {
	return (dispatch, getState) => {
		return dispatch(fetchSearchResults(query));
	};
}

export function pageLoaded() {
	return {
		type: "PAGE_LOADED"
	};
}