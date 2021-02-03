import React from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
	const [register, { data }] = useRegisterMutation();

	const router = useRouter();

	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await register({ variables: values });

					if (res.data?.register.errors) {
						setErrors(toErrorMap(res.data.register.errors));
					} else if (res.data?.register.user) {
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

export default Register;
