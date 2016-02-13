import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class Share extends Component {	
	constructor(props) {
		super(props);

		this.toggleShare = this.toggleShare.bind(this);

		this.state = {
			panel: false
		};
	}

	toggleShare(e) {
		var panel = !this.state.panel;
		this.setState({
			panel: panel
		});
	}

	render() {
		var shareButtonClass = this.state.panel ? "share-button hidden" : "share-button";
		var sharePanelClass = this.state.panel ? "share-panel" : "share-panel hidden";

		var text = (this.props.label) ? <span className="text">Share</span> : "";

		return (
			<div className="share">
				<span className={ shareButtonClass } onClick={ this.toggleShare }><b className="icon-share"></b>{ text }</span>
				<div className={ sharePanelClass }>
					<a href="https://twitter.com/intent/tweet?text=Hello%20world" target="_blank" className="twitter-share"><b className="icon-twitter"></b></a>
					<a href="" className="facebook-share"><b className="icon-facebook"></b></a>
					<a href="" className="mail-share"><b className="icon-mail"></b></a>
				</div>
			</div>
		)
	}
};


function mapStateToProps(state) {
	return {
		
	};
}


function mapDispatchToProps(dispatch) {
	return bindActionCreators({  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Share);