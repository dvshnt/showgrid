import React, { Component } from 'react';

import SearchResults from '../components/SearchResults';


export default class Search extends Component {
	render() {
		return (
			<div className="list--container">
				<SearchResults active="true" hide="false"/>
			</div>
		)
	}
};
