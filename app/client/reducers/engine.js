import { ADJUST_SIZE } from '../actions/engine';

var GridEngine = require('../util/GridEngine');


export default function engine(state={
	width: document.documentElement.clientWidth || window.innerWidth,
	cells: 7
}, action) {

	switch (action.type) {
	case ADJUST_SIZE:
		return  Object.assign({}, state, {
			width: action.width,
			cells: action.cells
		});
	default:
		return state;
	}
};