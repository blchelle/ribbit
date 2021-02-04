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
import { ChevronDownIcon } from '@chakra-ui/icons';

import RibbitLogoText from './icons/RibbitLogoText';
import UserIcon from './icons/UserIcon';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
	// Chakra Hooks
	const { colorMode, toggleColorMode } = useColorMode();

	// GraphQL Hooks
	const { data, loading: meLoading } = useMeQuery();

	// The logout mutation has to update the cached user to null
	const [logout, { loading: logoutLoading }] = useLogoutMutation({
		update(cache) {
			cache.modify({
				fields: {
					me() {
						return null;
					},
				},
			});
		},
	});

	let body = null;

	// Data is loading
	if (meLoading) {
	}
	// User is not logged in
	else if (!data?.me) {
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
						leftIcon={<UserIcon />}
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
			<Flex alignItems="center">
				<Box mr={8}>{data.me.username}</Box>
				<Button
					variant="outline"
					colorScheme="secondary"
					onClick={() => logout()}
					isLoading={logoutLoading}
				>
					Logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex p={4} w="100%" align="center">
			<RibbitLogoText />
			<Box ml={'auto'}>{body}</Box>
		</Flex>
	);
};

export default NavBar;
