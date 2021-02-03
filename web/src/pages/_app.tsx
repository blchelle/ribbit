import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';

import theme from '../theme';

function MyApp({ Component, pageProps }) {
	// Configures the apollo client
	const client = new ApolloClient({
		uri: 'http://localhost:4000/graphql',
		credentials: 'include',
		cache: new InMemoryCache(),
	});

	return (
		<ApolloProvider client={client}>
			<ChakraProvider resetCSS theme={theme}>
				<ColorModeProvider
					options={{
						initialColorMode: 'light',
						useSystemColorMode: false,
					}}
				>
					<Component {...pageProps} />
				</ColorModeProvider>
			</ChakraProvider>
		</ApolloProvider>
	);
}

export default MyApp;
