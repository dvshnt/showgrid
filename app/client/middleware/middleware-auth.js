import { CALL_API, isRSAA } from 'redux-api-middleware';

import { showLoginModal } from '../actions/modal';

import { store } from '../index';

function authMiddleware({ getState }) {
	return (next) => (action) => {
		console.log("Auth Middleware");

		// Do not process actions without a [CALL_API] property
		if (!isRSAA(action)) {
			return next(action);
		}

		var token = localStorage.getItem("token") || "";
		if (token !== "") {
			action[CALL_API].headers = {
				'Authorization' : 'Token ' + token
			}
		}
		else if (token === "" && (action[CALL_API].method === "POST" ||  action[CALL_API].method === "DELETE")) {
			store.dispatch(showLoginModal());
		}

		let result = next(action);
		return result;
	}
}

export { authMiddleware };