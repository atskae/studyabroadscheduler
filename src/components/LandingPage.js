import React from 'react';
import { Button }from 'semantic-ui-react';

class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		
		// binds methods to 'this'
		this.handleNextStep = this.handleNextStep.bind(this);
	}

	handleNextStep() {
		this.props.onNextStep(); // updates step in parent MainForm
	}

	render() {
		return(
			<div className="LandingPage">
				<h1>I'm a Computer Science student at Binghamton University.</h1>
				<h2>When could I study abroad?</h2>
				<Button onClick={this.handleNextStep}>Let's Find Out</Button>
			</div>
		);
	}
}

export default LandingPage;
