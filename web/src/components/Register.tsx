import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import rug from 'random-username-generator';

import InputField from './InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import UsernameGenerator from './UsernameGenerator';

interface RegisterProps {
	onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
	// GraphQL Hook for Register Mutation
	const [register] = useRegisterMutation();

	// Generates a set of random usernames
	const [usernames, setUsernames] = useState(
		new Array(5).fill('').map(() => rug.generate()),
	);

	// Reloads the random usernames
	const reloadUsernames = () => {
		setUsernames(new Array(5).fill('').map(() => rug.generate()));
	};

	return (
		<Formik
			initialValues={{ username: '', password: '' }}
			onSubmit={async (values, { setErrors }) => {
				const res = await register({ variables: values });

				if (res.data?.register.errors) {
					setErrors(toErrorMap(res.data.register.errors));
				} else if (res.data?.register.user) {
					onClose();
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
					<UsernameGenerator
						name="username"
						mt={4}
						usernames={usernames}
						reload={reloadUsernames}
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
	);
};

export default Register;
