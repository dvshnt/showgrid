import { SHOW_LOGIN_MODAL, HIDE_LOGIN_MODAL, SHOW_PHONE_MODAL, HIDE_PHONE_MODAL } from '../actions/modal';

export default function modal(state={
	login: false,
	phone: false,
	mode: "login"
}, action) {

	switch (action.type) {
	case SHOW_LOGIN_MODAL:
		return  Object.assign({}, state, {
			login: true,
			mode: action.mode
		});
	case HIDE_LOGIN_MODAL:
		return  Object.assign({}, state, {
			login: false
		});
	case SHOW_PHONE_MODAL:
		return  Object.assign({}, state, {
			phone: true
		});
	case HIDE_PHONE_MODAL:
		return  Object.assign({}, state, {
			phone: false
		});
	default:
		return state;
	}
};