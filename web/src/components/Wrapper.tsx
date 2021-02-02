import React from 'react';
import { Box } from '@chakra-ui/react';

interface WrapperProps {
	variant?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
	return (
		<Box
			maxWidth={variant === 'regular' ? '800px' : '400px'}
			w="100%"
			marginTop={8}
			mx="auto"
		>
			{children}
		</Box>
	);
};

export default Wrapper;
