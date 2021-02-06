import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import ThemeWrapper from '../components/AppWrapper';
import { __NEXT_PUBLIC_API_URL__ } from '../constants';

import theme from '../theme';

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<ThemeWrapper>
				<Component {...pageProps} />
			</ThemeWrapper>
		</ChakraProvider>
	);
}

export default MyApp;
