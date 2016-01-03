import 'babel-core/polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route } from 'react-router';

import App from './containers/App';
import Splash from './containers/Splash';
import Showgrid from './containers/Showgrid';
import Featured from './containers/Featured';
import Recent from './containers/Recent';
import Profile from './containers/Profile';
import Search from './containers/Search';
import Venue from './containers/Venue';

import './util/global';

import configureStore from './store/';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import { ReduxRouter } from 'redux-router';


const history = createBrowserHistory();
export const store = configureStore({});


const routes = (
	<Provider store={store}>
		{() =>
        <ReduxRouter>
			<Router history={history}>
				<Route path="/" component={App}>
					<IndexRoute component={Showgrid}/>
					<Route path="recent" component={Recent}/>
					<Route path="featured" component={Featured}/>
					<Route path="profile" component={Profile}/>
					<Route path="search" component={Search}/>
					<Route path="venue/:id" component={Venue}/>
				</Route>
			</Router>
        </ReduxRouter>
		}
	</Provider>
);

React.render(routes, document.getElementById('showgrid'));
