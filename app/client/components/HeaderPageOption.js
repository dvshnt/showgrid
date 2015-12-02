import React, { Component } from 'react';
import SGLink from './SGLink';


export default class HeaderPageOption extends Component {
	render() {
		return (
			<SGLink to={ this.props.link } activeClassName="selected">
				<b className={ this.props.symbol }></b>
				<br></br>
				<span>{ this.props.text }</span>
			</SGLink>
		)
	}
};