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
						<form action="//showgrid.us9.list-manage.com/subscribe/post?u=24f724359c2dd0e5e6d775b61&amp;id=49b59ce078" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
							<div id="mc_embed_signup_scroll">
								<label for="mce-EMAIL">Receive news and updates about Show Grid</label><br></br>
								<input type="text" value="" name="EMAIL" id="mce-EMAIL" placeholder="Email" required/>
								<div style={ cookieStyle }>
									<input type="text" name="b_24f724359c2dd0e5e6d775b61_49b59ce078" tabindex="-1" value=""/>
								</div>
								<input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe"/>
							</div>
						</form>
					</div>
				</div>
			</footer>
		)
	}
});