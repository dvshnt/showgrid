import fetch from 'isomorphic-fetch';

var GridEngine = require('../util/GridEngine');


export const SEARCH_PREPARE = 'SEARCH_PREPARE';
export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_RECEIVE = 'SEARCH_RECEIVE';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';


export function prepareSearch(query) {
	return {
		type: SEARCH_PREPARE
	};
}

export function requestSearch(query) {
	return {
		type: SEARCH_REQUEST,
		query: query
	};
}

export function receiveSearch(results) {
	return {
		type: SEARCH_RECEIVE,
		results: results
	};
}

export function searchIfNeeded(query) {
	return (dispatch, getState) => {
		if (query !== "" && shouldFetchSearch(getState())) {
			return dispatch(fetchSearch(query));
		}
	};
}

function fetchSearch(query) {
	return (dispatch, getState) => {
		dispatch(requestSearch(query));

		var url = generateSearchUrl(query);

		return fetch(url)
			.then(response => response.json())
			.then(json => dispatch(receiveSearch(json)));
	};
}

function generateSearchUrl(query) {
	var url = GridEngine.domain + '/i/search?';
	url += 'q=' + encodeURIComponent(query);
	return url;
}

function shouldFetchSearch(state) {
	if (state.search.waiting) {
		return false;
	}
	return true;
}