import React from 'react';
import MainForm from './MainForm';
import { Container } from 'semantic-ui-react';

class App extends React.Component {
	render() {
		return(
			<Container textAlign='left'>
				<MainForm />
			</Container>
		);
	}
}

// exposes App component to other modules
export default App;
