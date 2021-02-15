import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import rug from 'random-username-generator';

import InputField from './InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import UsernameGenerator from './UsernameGenerator';
import { AuthModalType } from './AuthModal';

interface RegisterProps {
	setType: React.Dispatch<React.SetStateAction<AuthModalType>>;
	onSuccess: () => void;
	numUsernameSuggestions?: number;
}

const Register: React.FC<RegisterProps> = ({
	setType,
	onSuccess,
	numUsernameSuggestions = 5,
}) => {
	// GraphQL Hook for Register Mutation
	const [register] = useRegisterMutation();

	// Generates a set of random usernames
	const [usernames, setUsernames] = useState(
		new Array(numUsernameSuggestions)
			.fill('')
			.map(() => (rug.generate() as string)?.toLowerCase()),
	);

	// Reloads the random usernames
	const reloadUsernames = () => {
		setUsernames(
			new Array(numUsernameSuggestions)
				.fill('')
				.map(() => (rug.generate() as string)?.toLowerCase()),
		);
	};

	return (
		<Stack spacing={8}>
			<Heading fontSize="lg" mb={4}>
				Sign Up
			</Heading>
			<Formik
				initialValues={{ email: '', username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await register({
						variables: values,
						update: (cache, { data }) => {
							cache.writeQuery<MeQuery>({
								query: MeDocument,
								data: {
									__typename: 'Query',
									me: data?.register.user,
								},
							});
						},
					});

					if (res.data?.register.errors) {
						setErrors(toErrorMap(res.data.register.errors));
					} else if (res.data?.register.user) {
						onSuccess();
					}
				}}
			>
				{({ isSubmitting }) => (
					<Stack direction="row" spacing={8}>
						<Stack spacing={8}>
							<Box w="280px">
								<Form>
									<InputField
										name="email"
										placeholder="email address"
										label="Email Address"
									/>
									<Box mt={4}>
										<InputField
											name="username"
											placeholder="username"
											label="Username"
										/>
									</Box>
									<Box mt={4}>
										<InputField
											name="password"
											placeholder="password"
											label="Password"
											type="password"
										/>
									</Box>
									<Button
										mt={4}
										type="submit"
										w="100%"
										colorScheme="secondary"
										isLoading={isSubmitting}
									>
										Register
									</Button>
								</Form>
							</Box>
						</Stack>
						<UsernameGenerator
							name="username"
							usernames={usernames}
							reload={reloadUsernames}
						/>
					</Stack>
				)}
			</Formik>
			<Flex>
				<Text mr={2} fontSize="sm">
					Already a member?
				</Text>
				<Button
					variant="link"
					colorScheme="secondary"
					fontSize="sm"
					onClick={() => setType('login')}
				>
					LOGIN
				</Button>
			</Flex>
		</Stack>
	);
};

export default Register;
