import React from 'react';
import {
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Switch,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import { ChevronDownIcon, MoonIcon } from '@chakra-ui/icons';
import {
	IoLogIn as LoginIcon,
	IoLogOut as LogoutIcon,
	IoPerson as UserIcon,
} from 'react-icons/io5';

import { CommonUserFragment, useLogoutMutation } from '../generated/graphql';

interface UserMenuListProps {
	openAuthModal?: () => void;
	user?: CommonUserFragment;
}

const UserMenuList: React.FC<UserMenuListProps> = ({ openAuthModal, user }) => {
	// Chakra Hooks
	const { colorMode, toggleColorMode } = useColorMode();
	const isDarkMode = colorMode === 'dark';

	console.log(user);

	// The logout mutation has to update the cached user to null
	const [logout] = useLogoutMutation({
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

	return (
		<Menu>
			<MenuButton
				as={Button}
				leftIcon={<UserIcon />}
				rightIcon={<ChevronDownIcon />}
			></MenuButton>
			<MenuList>
				<Text fontSize="small" px={5} fontWeight="bold">
					VIEW OPTIONS
				</Text>
				<Flex alignItems="center" w="100%" px={5} py={1}>
					<MoonIcon />
					<Text ml="0.75em" mr={'auto'}>
						Night Mode
					</Text>
					<Switch
						colorScheme="secondary"
						isChecked={isDarkMode}
						onChange={() => toggleColorMode()}
						size="lg"
					/>
				</Flex>
				<MenuDivider />
				{user ? (
					<MenuItem
						icon={<LogoutIcon size="24px" />}
						onClick={() => {
							logout();
							window.location.reload();
						}}
					>
						<Text>Log Out</Text>
					</MenuItem>
				) : (
					<MenuItem
						icon={<LoginIcon size="24px" />}
						onClick={openAuthModal}
					>
						<Text>Log In / Sign Up</Text>
					</MenuItem>
				)}
			</MenuList>
		</Menu>
	);
};

export default UserMenuList;
