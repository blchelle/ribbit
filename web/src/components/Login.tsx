import React from 'react';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import InputField from './InputField';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { AuthModalType } from './AuthModal';

interface LoginProps {
	setType: React.Dispatch<React.SetStateAction<AuthModalType>>;
	onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ setType, onSuccess }) => {
	// GraphQL Hooks for Login Mutation
	const [login] = useLoginMutation();

	return (
		<Stack spacing={8} h="100%">
			<Heading fontSize="lg" mb={4}>
				Login
			</Heading>
			<Formik
				initialValues={{ credential: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await login({
						variables: values,
						update: (cache, { data }) => {
							cache.writeQuery<MeQuery>({
								query: MeDocument,
								data: {
									__typename: 'Query',
									me: data?.login.user,
								},
							});
						},
					});

					if (res.data?.login.errors) {
						setErrors(toErrorMap(res.data.login.errors));
					} else if (res.data?.login.user) {
						onSuccess();
					}
				}}
			>
				{({ isSubmitting }) => (
					<Box w="280px" mt="auto">
						<Form>
							<InputField
								name="credential"
								placeholder="username or email"
								label="Username or Email"
							/>
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
								colorScheme="secondary"
								isLoading={isSubmitting}
								w="100%"
							>
								Login
							</Button>
							<Flex justify="flex-end" mt={4}>
								<Button
									fontSize="small"
									variant="link"
									colorScheme="secondary"
									onClick={() => setType('forgot password')}
								>
									FORGOT PASSWORD?
								</Button>
							</Flex>
						</Form>
					</Box>
				)}
			</Formik>
			<Flex>
				<Text mr={2} fontSize="sm">
					New to Ribbit?
				</Text>
				<Button
					variant="link"
					colorScheme="secondary"
					fontSize="sm"
					onClick={() => setType('sign up')}
				>
					SIGN UP
				</Button>
			</Flex>
		</Stack>
	);
};

export default Login;
