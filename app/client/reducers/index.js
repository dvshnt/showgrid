import { combineReducers } from 'redux';


import user from './user';
import auth from './auth';
import grid from './grid';
import modal from './modal';
import search from './search';
import engine from './engine';
import recent from './recent';
import actions from './actions';
import featured from './featured';

import { routerStateReducer as router } from 'redux-router';


const rootReducer = combineReducers({
	grid, 
	search, 
	engine, 
	recent, 
	featured, 
	modal, 
	auth,
	router,
	user,
	actions
});


export default rootReducer;