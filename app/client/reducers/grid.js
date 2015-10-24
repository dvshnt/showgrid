var DateManager = require('../util/DateManager');
var GridEngine = require('../util/GridEngine');

export default function grid(state={ 
	days:[],
	venues: [],
	waiting: false
}, action) {

	switch (action.type) {
	case "GRID_REQUEST":
		return  Object.assign({}, state, {
			days: DateManager.getDaysArray(action.payload.date, GridEngine.getCellCount()),
			waiting: true
		});

	case "GRID_SUCCESS":
		return  Object.assign({}, state, {
			venues: action.payload,
			waiting: false
		});

	case "GRID_FAILURE":
		return  Object.assign({}, state, {
			waiting: false
		});

	default:
		return state;
	}

};