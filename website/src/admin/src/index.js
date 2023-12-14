import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';


const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		// Check if the user is authenticated (e.g., by checking for the presence of a JWT)
		const jwt = localStorage.getItem('jwt'); // Adjust this based on your authentication setup
		if (jwt) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

	return (
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<ThemeEditorProvider>
					<HashRouter>
						<Switch>
							<Route path="/auth" component={AuthLayout} />
							{isAuthenticated ? (
								<Route path="/admin" component={AdminLayout} />
							) : (
								<Redirect from="/" to="/auth" />
							)}
						</Switch>
					</HashRouter>
				</ThemeEditorProvider>
			</React.StrictMode>
		</ChakraProvider>
	);
};

ReactDOM.render(
	<App />,
	document.getElementById('root')
);