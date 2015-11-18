import React, { Component } from 'react';

export default class FormButton extends Component {
	render() {
		var errorClass = (this.props.error) ? "error" : "";
		var buttonText = (this.props.error) ? this.props.errorMessage : this.props.submitMessage;

		return (
			<input type="submit" className={ errorClass } value={ buttonText }/>
		)
	}
};