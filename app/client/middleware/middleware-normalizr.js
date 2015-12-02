import { CALL_API, isRSAA } from 'redux-api-middleware';
import { showLoginModal } from '../actions/modal';
import { store } from '../index';

import { normalize } from 'normalizr';


function normalizrMiddleware({ getState }) {
	return (next) => (action) => {
		if (action.type.indexOf("SUCCESS") > -1 && action.schema && action.payload && !action.payload.status) {
			action.payload = normalize(action.payload, action.schema);	
		}

		let result = next(action);
		return result;
	}
}

export { normalizrMiddleware };