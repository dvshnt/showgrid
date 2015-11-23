export default function recent(state={
	waiting: false
}, action) {

	switch (action.type) {
		case "TOKEN_REQUEST":
			return  Object.assign({}, state, {
				waiting: true
			});

		case "TOKEN_SUCCESS":
			console.log("GOT TOKEN",action.payload.token);
			localStorage.setItem("token", action.payload.token);

			return  Object.assign({}, state, {
				waiting: false
			});

		case "TOKEN_FAILURE":
			console.log(action.payload);
			return  Object.assign({}, state, {
				waiting: false
			});

		default:
			return state;
	}

};