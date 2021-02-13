import React, { useState } from 'react';
import { NextPage } from 'next';
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	CloseButton,
	Heading,
} from '@chakra-ui/react';
import { IoCheckmark as SuccessIcon } from 'react-icons/io5';
import { Formik, Form } from 'formik';

import InputField from '../../components/InputField';
import { useResetPasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { withApollo } from '../../apollo/withApollo';

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
	const [resetPassword] = useResetPasswordMutation();
	const [resetSuccessful, setResetSuccessful] = useState(false);
	const [tokenExpired, setTokenExpired] = useState(false);

	return (
		<Formik
			initialValues={{ newPassword: '', newPasswordConfirm: '' }}
			onSubmit={async (values, { setErrors }) => {
				const res = await resetPassword({
					variables: { ...values, token },
				});

				if (res.data?.resetPassword.errors) {
					const errorMap = toErrorMap(res.data.resetPassword.errors);
					setErrors(errorMap);

					if (errorMap.token) {
						setTokenExpired(true);
					}
				} else if (res.data?.resetPassword.user) {
					setTokenExpired(false);
					setResetSuccessful(true);
				}
			}}
		>
			{({ isSubmitting }) => (
				<Box w={500} mt="50vh" transform="translateY(-50%)">
					<Form>
						<Heading fontSize="large">Reset Password</Heading>
						<Box mt={4}>
							<InputField
								name="newPassword"
								placeholder="password"
								label="New Password"
								type="password"
							/>
						</Box>
						<Box mt={4}>
							<InputField
								name="newPasswordConfirm"
								placeholder="password"
								label="Confirm New Password"
								type="password"
							/>
						</Box>
						<Button
							mt={4}
							type={resetSuccessful ? 'button' : 'submit'}
							colorScheme={
								resetSuccessful ? 'primary' : 'secondary'
							}
							rightIcon={resetSuccessful ? <SuccessIcon /> : null}
							isLoading={isSubmitting}
							w="100%"
						>
							{resetSuccessful
								? 'Successfully Reset'
								: 'Reset Password'}
						</Button>
						<Button
							colorScheme="secondary"
							variant="link"
							mt={4}
							onClick={() => window.location.replace('/')}
						>
							Back to Home
						</Button>
						{tokenExpired ? (
							<Alert status="error" mt={8}>
								<AlertIcon />
								<AlertTitle mr={2}>Invalid Token</AlertTitle>
								<AlertDescription>
									Your reset password token has expired
								</AlertDescription>
								<CloseButton
									position="absolute"
									right="8px"
									top="8px"
									onClick={() => setTokenExpired(false)}
								/>
							</Alert>
						) : null}
					</Form>
				</Box>
			)}
		</Formik>
	);
};

ChangePassword.getInitialProps = ({ query }) => {
	return {
		token: query.token as string,
	};
};

export default withApollo({ ssr: false })(ChangePassword);
