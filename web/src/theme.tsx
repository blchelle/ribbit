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
	icons: {
		logo: {
			path: (
				<svg
					width="3000"
					height="3163"
					viewBox="0 0 3000 3163"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="3000" height="3162.95" fill="none" />
					<path
						d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
						fill="currentColor"
					/>
				</svg>
			),
			viewBox: '0 0 3000 3163',
		},
	},
});

export default theme;
