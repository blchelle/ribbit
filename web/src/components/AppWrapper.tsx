import { Flex, useColorMode } from '@chakra-ui/react';

const AppWrapper = (props) => {
	const { colorMode } = useColorMode();

	const bgColor = { light: 'gray.50', dark: 'gray.900' };

	const color = { light: 'black', dark: 'white' };
	return (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="flex-start"
			bg={bgColor[colorMode]}
			color={color[colorMode]}
			fill={color[colorMode]}
			w="100%"
			minH="100vh"
			{...props}
		/>
	);
};

export default AppWrapper;
