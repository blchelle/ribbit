import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
});

const theme = extendTheme({
	colors: {
		primary: {
			50: '#e0ffe9',
			100: '#b5f9c9',
			200: '#8af4a8',
			300: '#5cef86',
			400: '#32eb65',
			500: '#1ad14b',
			600: '#10a33a',
			700: '#067428',
			800: '#004617',
			900: '#001902',
		},
		secondary: {
			50: '#ffe1ec',
			100: '#ffb1c6',
			200: '#ff7e9f',
			300: '#ff4c79',
			400: '#ff1a53',
			500: '#e60039',
			600: '#b4002c',
			700: '#81001f',
			800: '#500012',
			900: '#210005',
		},
	},
	fonts,
	breakpoints,
});

export default theme;
