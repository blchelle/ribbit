import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import ThemeWrapper from '../components/AppWrapper';
import { __NEXT_PUBLIC_API_URL__ } from '../constants';

import theme from '../theme';

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<ColorModeProvider options={{ useSystemColorMode: true }}>
				<ThemeWrapper>
					<Component {...pageProps} />
				</ThemeWrapper>
			</ColorModeProvider>
		</ChakraProvider>
	);
}

export default MyApp;
