import React from 'react';
import NextLink from 'next/link';
import {
	Box,
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';

import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
	// Chakra Hooks
	const { colorMode, toggleColorMode } = useColorMode();

	// GraphQL Hooks
	const { data, loading } = useMeQuery();

	let body = null;

	// Data is loading
	if (loading) {
	}
	// User is not logged in
	else if (!data.me) {
		body = (
			<>
				<NextLink href="/login">
					<Button colorScheme="secondary" variant="outline" mr={4}>
						Log In
					</Button>
				</NextLink>
				<NextLink href="/register">
					<Button colorScheme="secondary" mr={4}>
						Sign Up
					</Button>
				</NextLink>
				<Menu>
					<MenuButton
						as={Button}
						leftIcon={<SettingsIcon />}
						rightIcon={<ChevronDownIcon />}
					></MenuButton>
					<MenuList>
						<MenuItem onClick={toggleColorMode}>
							Switch to {colorMode === 'light' ? 'dark' : 'light'}{' '}
							mode
						</MenuItem>
						<MenuDivider />
						<MenuItem>
							<Text>Log In</Text>
						</MenuItem>
						<MenuItem>Sign Up</MenuItem>
					</MenuList>
				</Menu>
			</>
		);
	}
	// User is logged in
	else {
		body = (
			<Flex>
				<Box mr={4}>{data.me.username}</Box>
				<Button variant="link">Logout</Button>
			</Flex>
		);
	}

	return (
		<Flex p={4} w="100%">
			<Box ml={'auto'}>{body}</Box>
		</Flex>
	);
};

export default NavBar;
