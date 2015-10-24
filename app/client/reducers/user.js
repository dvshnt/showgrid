import { showModal } from '../actions/modal';

import { store } from '../index';

 
export default function user(state={
	waiting: false
}, action) {

	switch (action.type) {
	case 'ACTION_REQUEST':
		return  Object.assign({}, state, {
			waiting: true
		});

	case 'ACTION_SUCCESS':
		return  Object.assign({}, state, {
			waiting: false
		});

	case 'ACTION_FAILURE':
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}
};