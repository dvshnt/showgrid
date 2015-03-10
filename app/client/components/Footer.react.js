/** @jsx React.DOM */

var React = require('react');

module.exports = Header = React.createClass({
	render: function() {
		var cookieStyle = {
			position: 'absolute',
			left: '-5000px'
		};

		return (
			<footer>
				<div className="input--prompt">
					<h3>something missing?</h3>
					<p>Let us know if you notice a show or venue missing from the Grid. Otherwise, feel free to drop us a line or come visit us in our office located one hundred miles under the ground in an old, repurposed bomb shelter.</p>
					<p>Email us at <a href="mailto:showgridnashville@gmail.com">showgridnashville@gmail.com</a>.</p>
				</div>
				<div className='email--form'>
					<div id="mc_embed_signup">
						<form action="//showgrid.us9.list-manage.com/subscribe/post?u=24f724359c2dd0e5e6d775b61&amp;id=49b59ce078" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
							<div id="mc_embed_signup_scroll">
								<label htmlFor="mce-EMAIL">Receive news and updates about Show Grid</label><br></br>
								<input type="email" value="" name="EMAIL" id="mce-EMAIL" placeholder="Email"/>
								<div style={ cookieStyle }>
									<input type="text" name="b_24f724359c2dd0e5e6d775b61_49b59ce078" tabIndex="-1" value=""/>
								</div>
								<input type="submit" value="Join the Mailing List" name="subscribe" id="mc-embedded-subscribe"/>
							</div>
						</form>
					</div>
				</div>
				<div className="footer--copy">
					<span>&copy; 2015 Showgrid, Nashville, TN</span>
				</div>
			</footer>
		)
	}
});