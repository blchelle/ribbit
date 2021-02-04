import React from 'react';
import NextLink from 'next/link';
import {
	Flex,
	MenuDivider,
	MenuItem,
	MenuList,
	Switch,
	Text,
	useColorMode,
} from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';

interface UserMenuListProps {}

const UserMenuList: React.FC<UserMenuListProps> = ({}) => {
	// Chakra Hooks
	const { colorMode, toggleColorMode } = useColorMode();
	const isDarkMode = colorMode === 'dark';

	return (
		<MenuList>
			<Flex alignItems="center" w="100%" px={3} py={1}>
				<MoonIcon mr={2} />
				<Text mr={'auto'}>Night Mode</Text>
				<Switch
					colorScheme="secondary"
					isChecked={isDarkMode}
					onChange={() => toggleColorMode()}
					size="lg"
				/>
			</Flex>
			<MenuDivider />
			<NextLink href="/login">
				<MenuItem>
					<Text>Log In</Text>
				</MenuItem>
			</NextLink>
			<NextLink href="/register">
				<MenuItem>Sign Up</MenuItem>
			</NextLink>
		</MenuList>
	);
};

export default UserMenuList;
