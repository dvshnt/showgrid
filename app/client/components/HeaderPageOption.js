import React, { Component } from 'react';
import { Link } from 'react-router';


export default class HeaderPageOption extends Component {
	render() {
		return (
			<Link to={ this.props.link } activeClassName="selected">
				<b className={ this.props.symbol }></b>
				<br></br>
				<span>{ this.props.text }</span>
			</Link>
		)
	}
};