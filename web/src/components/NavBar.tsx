import React, { useState } from 'react';
import {
	Box,
	Button,
	Flex,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react';

import RibbitLogoText from './icons/RibbitLogoText';
import UserMenuList from './UserMenuList';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import AuthModal, { AuthModalType } from './AuthModal';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
	// Chakra Color Mode Hook
	const { colorMode } = useColorMode();
	const isDarkMode = colorMode === 'dark';

	// Chakra Modal Hook for AuthModal
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [authModalType, setAuthModalType] = useState<AuthModalType>('login');

	// GraphQL Hooks
	const { data, loading: meLoading } = useMeQuery({ skip: isServer() });

	const openModal = (type: AuthModalType) => {
		setAuthModalType(type);
		onOpen();
	};

	let body = null;

	// Data is loading
	if (meLoading) {
	}
	// User is not logged in
	else if (!data?.me) {
		body = (
			<>
				<Button
					colorScheme="secondary"
					variant="outline"
					mr={4}
					onClick={() => openModal('login')}
				>
					Log In
				</Button>
				<Button
					colorScheme="secondary"
					mr={4}
					onClick={() => openModal('sign up')}
				>
					Sign Up
				</Button>
				<AuthModal
					isCentered
					setType={setAuthModalType}
					onClose={onClose}
					isOpen={isOpen}
					type={authModalType}
					children={null}
				/>
			</>
		);
	}
	// User is logged in
	else {
	}

	return (
		<Flex
			py={2}
			px={8}
			w="100%"
			align="center"
			bg={isDarkMode ? 'gray.800' : 'gray.100'}
			borderBottom={`1px solid ${isDarkMode ? '#333' : '#DDD'}`}
		>
			<RibbitLogoText />
			<Box ml={'auto'}>{body}</Box>
			<UserMenuList
				openAuthModal={() => openModal('login')}
				user={data?.me}
			/>
		</Flex>
	);
};

export default NavBar;
