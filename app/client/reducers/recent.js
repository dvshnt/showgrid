export default function recent(state={
	results: []
}, action) {

	switch (action.type) {
	case "RECENT_REQUEST":
		return  Object.assign({}, state, {
			waiting: true
		});

	case "RECENT_SUCCESS":
		return  Object.assign({}, state, {
			results: action.payload,
			waiting: false
		});

	case "RECENT_FAILURE":
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}

};