import { SHOW_MODAL, HIDE_MODAL } from '../actions/modal';

export default function modal(state={
	visible: false
}, action) {

	switch (action.type) {
	case SHOW_MODAL:
		return  Object.assign({}, state, {
			visible: true
		});
	case HIDE_MODAL:
		return  Object.assign({}, state, {
			visible: false
		});
	default:
		return state;
	}
};