import React from 'react';
import { Button, Progress, Container } from 'semantic-ui-react';

class Step extends React.Component {
	constructor(props) {
		super(props);
		
		// binds methods to 'this'
		this.handleNextStep = this.handleNextStep.bind(this);
		this.handlePrevStep = this.handlePrevStep.bind(this);
	}

	handleNextStep() {
		this.props.onNextStep(); // updates step in parent MainForm
	}

	handlePrevStep() {
		this.props.onPrevStep(); // updates step in parent MainForm
	}

	render() {
		return(
			<Container>
				<Progress percent={this.props.percent} color='green' />
				<h1>{this.props.question}</h1>
				<p>{this.props.description}</p>
				{this.props.choices}
				<Button onClick={this.handlePrevStep}>Back</Button>
				<Button onClick={this.handleNextStep}>Next</Button>
			</Container>
		);
	}
}

export default Step;
