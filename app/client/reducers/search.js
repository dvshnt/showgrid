import { SEARCH_REQUEST, SEARCH_RECEIVE, SEARCH_FAILURE, SEARCH_PREPARE } from '../actions/search';

export default function search(state={ 
	query:"", 
	results: { query: "", results: [] },
	waiting: false,
	searching: false
}, action) {

	switch (action.type) {
	case SEARCH_PREPARE:
		return  Object.assign({}, state, {
			searching: true
		});

	case SEARCH_REQUEST:
		return  Object.assign({}, state, {
			query: action.query,
			waiting: true,
			searching: false
		});

	case SEARCH_RECEIVE:
		return  Object.assign({}, state, {
			results: action.results,
			waiting: false
		});

	case SEARCH_FAILURE:
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}

};