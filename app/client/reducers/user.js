import { showModal } from '../actions/modal';

import { store } from '../index';

 
export default function user(state={
	waiting: false,
	profile: {},
	alerts: [],
	favorites: []
}, action) {

	switch (action.type) {

	case 'UPDATEUSER_REQUEST':
		return  Object.assign({}, state, {
			waiting: true
		});
	case 'UPDATEUSER_SUCCESS':
		return  Object.assign({}, state, {
			profile: action.payload.profile
		});

	case 'UPDATEUSER_FAILURE':
		return  Object.assign({}, state, {
			waiting: false
		});

	case 'USER_REQUEST':
		return  Object.assign({}, state, {
			waiting: true
		});
	case 'USER_SUCCESS':
		return  Object.assign({}, state, {
			waiting: false,
			profile: action.payload.profile,
			alerts: action.payload.alerts,
			favorites: action.payload.favorites
		});

	case 'USER_FAILURE':
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}
};