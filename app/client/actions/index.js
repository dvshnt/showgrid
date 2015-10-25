import { CALL_API } from 'redux-api-middleware';

var GridEngine = require('../util/GridEngine');

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




function fetchGrid(date) {
	return {
		[CALL_API]: {
			endpoint: function() {
				var day = date;

				var url = GridEngine.domain + '/i/grid/';
				url += day.format('YYYY') + '/';
				url += day.format('M') + '/';
				url += day.format('D') + '?range=' + GridEngine.getCellCount();

				return url;
			},
		    method: 'GET',
		    types: [
				{
					type: 'GRID_REQUEST', 
					payload: (action, state) => ({ date: date })
				},
		    	'GRID_SUCCESS', 
		    	'GRID_FAILURE'
		    ]
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




function fetchRecent() {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/i/shows?method=recent',
		    method: 'GET',
		    types: ['RECENT_REQUEST', 'RECENT_SUCCESS', 'RECENT_FAILURE']
		}
	};
}

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getRecent() {
	return (dispatch, getState) => {
		return dispatch(fetchRecent());
	};
}



function fetchFeatured() {
	return {
		[CALL_API]: {
			endpoint: GridEngine.domain + '/i/shows?method=featured',
		    method: 'GET',
		    types: ['FEATURED_REQUEST', 'FEATURED_SUCCESS', 'FEATURED_FAILURE']
		}
	};
}
// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export function getFeatured() {
	return (dispatch, getState) => {
		return dispatch(fetchFeatured());
	};
}



function markShowAsFavorite(show) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/favorite",
		    method: 'POST',
		    types: ['ACTION_REQUEST', 'ACTION_SUCCESS', 'ACTION_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			show: show
    		})
		}
	};
}

export function favoriteShow(show) {
	return (dispatch, getState) => {
		return dispatch(markShowAsFavorite(show));
	};
}



function setAlertForShow(show, date) {
	return {
		[CALL_API]: {
			endpoint:  GridEngine.domain + "/user/alert",
		    method: 'POST',
		    types: ['ACTION_REQUEST', 'ACTION_SUCCESS', 'ACTION_FAILURE'],
			headers: {
				'Content-Type': 'application/json'
			},
		    body: JSON.stringify({
    			show: show,
    			date: date
    		})
		}
	};
}

export function setAlert(show, date) {
	return (dispatch, getState) => {
		return dispatch(setAlertForShow(show, date));
	};
}



function fetchSearchResults(query) {
	return {
		[CALL_API]: {
			endpoint: function() {
				var url = GridEngine.domain + '/i/search?';
				url += 'q=' + encodeURIComponent(query);
				return url;
			},
		    method: 'GET',
		    types: ['SEARCH_REQUEST', 'SEARCH_SUCCESS', 'SEARCH_FAILURE']
		}
	};
}

export function getSearchResults(query) {
	return (dispatch, getState) => {
		return dispatch(fetchSearchResults(query));
	};
}