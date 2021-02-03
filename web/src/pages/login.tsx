import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [login, { data }] = useLoginMutation();

	const router = useRouter();

	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await login({ variables: values });

					if (res.data?.login.errors) {
						setErrors(toErrorMap(res.data.login.errors));
					} else if (res.data?.login.user) {
						router.push('/');
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							color="primary"
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
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;
