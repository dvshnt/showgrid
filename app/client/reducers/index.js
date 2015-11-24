import { combineReducers } from 'redux';

import auth from './auth';
import state from './state';
import modal from './modal';

import { routerStateReducer as router } from 'redux-router';


const rootReducer = combineReducers({
	state,
	modal, 
	auth,
	router
});


export default rootReducer;