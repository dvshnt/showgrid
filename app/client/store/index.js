import { createStore, applyMiddleware, compose } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';

import { authMiddleware } from '../middleware/middleware-auth';

import { reduxReactRouter, ReduxRouter } from 'redux-router';

import createHistory from 'history/lib/createBrowserHistory';


const loggerMiddleware = createLogger({
	level: 'info',
	collapsed: true
});


const createStoreWithMiddleware = compose(
	applyMiddleware(
		thunkMiddleware,
		authMiddleware,
		apiMiddleware,
		loggerMiddleware
	),
	reduxReactRouter({
		createHistory
	})
)(createStore);


export default function configureStore(initialState) {
	return createStoreWithMiddleware(rootReducer, initialState);
}