export default function recent(state={
	results: []
}, action) {

	switch (action.type) {
	case "FEATURED_REQUEST":
		return  Object.assign({}, state, {
			waiting: true
		});

	case "FEATURED_SUCCESS":
		return  Object.assign({}, state, {
			results: action.payload,
			waiting: false
		});

	case "FEATURED_FAILURE":
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}

};