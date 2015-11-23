export default function recent(state={
	waiting: false
}, action) {

	switch (action.type) {
	case "TOKEN_REQUEST":
		return  Object.assign({}, state, {
			waiting: true
		});

	case "TOKEN_SUCCESS":
		console.log("GOT TOKEN")
		console.log(action.payload.token);
		localStorage.setItem("token", action.payload.token);
		return  Object.assign({}, state, {
			waiting: false
		});

	case "TOKEN_FAILURE":
		localStorage.removeItem("token");
		console.log(action.payload);
		return  Object.assign({}, state, {
			waiting: false
		});

	case "REGISTRATION_REQUEST":
		return  Object.assign({}, state, {
			waiting: true
		});

	case "REGISTRATION_SUCCESS":
		return  Object.assign({}, state, {
			waiting: false
		});

	case "REGISTRATION_FAILURE":
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}

};