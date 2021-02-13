import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import {
	Stack,
	Heading,
	Box,
	Button,
	HStack,
	Divider,
	Text,
} from '@chakra-ui/react';
import {
	IoSend as SendIcon,
	IoCheckmark as SuccessIcon,
} from 'react-icons/io5';

import { useForgotPasswordMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import InputField from './InputField';
import { AuthModalType } from './AuthModal';

interface ForgotPasswordProps {
	setType: React.Dispatch<React.SetStateAction<AuthModalType>>;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setType }) => {
	// GraphQL Hooks for Login Mutation
	const [forgotPassword] = useForgotPasswordMutation();
	const [successfulSend, setSuccessfulSend] = useState(false);

	return (
		<Stack spacing={8} h="100%">
			<Heading fontSize="lg" mb={4}>
				Forgot Password
			</Heading>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, { setErrors }) => {
					const res = await forgotPassword({ variables: values });

					if (res.data?.forgotPassword.errors) {
						setErrors(toErrorMap(res.data.forgotPassword.errors));
					} else {
						setSuccessfulSend(true);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Box w="280px" mt="auto">
						<Form>
							<Text fontSize="sm">
								Enter your email address and we'll send you a
								link to reset your password
							</Text>
							<Box mt={4}>
								<InputField
									name="email"
									placeholder="email address"
									label="Email Address"
								/>
							</Box>
							<Button
								mt={4}
								type={successfulSend ? 'button' : 'submit'}
								colorScheme={
									successfulSend ? 'primary' : 'secondary'
								}
								rightIcon={
									successfulSend ? (
										<SuccessIcon />
									) : (
										<SendIcon />
									)
								}
								isLoading={isSubmitting}
								w="100%"
							>
								{successfulSend ? 'Successfully sent' : 'Send'}
							</Button>
						</Form>
					</Box>
				)}
			</Formik>
			<HStack spacing={2}>
				<Button
					variant="link"
					colorScheme="secondary"
					fontSize="sm"
					onClick={() => setType('sign up')}
				>
					LOGIN
				</Button>
				<Divider orientation="vertical" />
				<Button
					variant="link"
					colorScheme="secondary"
					fontSize="sm"
					onClick={() => setType('sign up')}
				>
					SIGN UP
				</Button>
			</HStack>
		</Stack>
	);
};

export default ForgotPassword;
