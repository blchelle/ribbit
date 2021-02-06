import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import InputField from './InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface LoginProps {
	onClose: () => void;
}

const Login: React.FC<LoginProps> = () => {
	// GraphQL Hooks for Login Mutation
	const [login] = useLoginMutation();

	return (
		<Formik
			initialValues={{ username: '', password: '' }}
			onSubmit={async (values, { setErrors }) => {
				const res = await login({ variables: values });

				if (res.data?.login.errors) {
					setErrors(toErrorMap(res.data.login.errors));
				} else if (res.data?.login.user) {
					window.location.reload();
				}
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<InputField
						name="username"
						placeholder="username"
						label="Username"
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
						colorScheme="primary"
						isLoading={isSubmitting}
					>
						Login
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default Login;
