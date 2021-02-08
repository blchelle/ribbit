import React from 'react';
import { useField } from 'formik';
import {
	Button,
	Flex,
	IconButton,
	Stack,
	StackProps,
	Text,
} from '@chakra-ui/react';
import { IoReload } from 'react-icons/io5';

interface UsernameGeneratorProps extends StackProps {
	name: string;
	usernames: string[];
	reload: () => void;
}
const UsernameGenerator: React.FC<UsernameGeneratorProps> = ({
	name,
	usernames,
	reload,
	...props
}) => {
	// Formik Hook for setting the username field
	const [, , helpers] = useField(name);

	return (
		<Stack align="flex-start" spacing={0} {...props}>
			<Flex alignItems="center">
				<Text mr={2}>Some username suggestions</Text>
				<IconButton
					aria-label="reload-usernames"
					onClick={reload}
					variant="ghost"
					colorScheme="secondary"
				>
					<IoReload />
				</IconButton>
			</Flex>
			{usernames.map((username) => (
				<>
					<Button
						colorScheme="secondary"
						height={6}
						variant="link"
						onClick={() => helpers.setValue(username)}
					>
						{username}
					</Button>
				</>
			))}
		</Stack>
	);
};

export default UsernameGenerator;
