import React, { Component } from 'react';


export default class Header extends Component {
	render() {
		return (
			<footer id="footer">
				<nav>
					<a href="">About</a>
					<a href="mailto:info@showgrid.com">Contact</a>
					<a target="_blank" href="https://www.facebook.com/showgrid">Facebook</a>
				</nav>
				
				<span>Produced by Davis Hunt, &copy; 2015 Showgrid, Nashville, TN</span>
			</footer>
		)
	}
};