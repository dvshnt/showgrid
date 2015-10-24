import { CALL_API, isRSAA } from 'redux-api-middleware';

import { showModal } from '../actions/modal';

import { store } from '../index';

function authMiddleware({ getState }) {
	return (next) => (action) => {
		// Do not process actions without a [CALL_API] property
		if (!isRSAA(action)) {
			return next(action);
		}

		var token = localStorage.getItem("token") || "";
		if (token !== "") {
			action[CALL_API].headers = {
				'Authorization': 'Token ' + token
			};
		}
		else if (token === "" && action[CALL_API].method === "POST") {
			store.dispatch(showModal());
		}

		let result = next(action);
		return result;
	}
}

export { authMiddleware };