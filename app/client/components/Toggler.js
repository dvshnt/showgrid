//toggler icon
import React, { Component } from 'react';
export default class Toggle extends Component {
	constructor(props){
		super(props);
		this.state = {
			ain: false
		}
	}

	toggle(){
		this.setState({
			ain: !this.state.ain
		})
	}

	resetState(){
		this.setState({
			ain: false
		})		
	}


	componentDidMount(){
		var el = React.findDOMNode(this.refs.toggler);


		if(window.is_touch) el.addEventListener('touchend',this.toggle.bind(this));
		else el.addEventListener('mouseup',this.toggle.bind(this));
		
		if(this.props.hook){
			if(window.is_touch) el.addEventListener('touchend',this.props.hook);
			else el.addEventListener('mouseup',this.props.hook);
		}
	}

	render(){
		var type = this.state.ain ? 'ain' : 'aout';
		return (
			<div ref="toggler" className='toggler'>
				<div className={'toggler_bar '+type} />
				<div className={'toggler_bar '+type} />
				<div className={'toggler_bar '+type} />
			</div>
		)
	}
}