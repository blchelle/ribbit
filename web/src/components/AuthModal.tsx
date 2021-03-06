import React from 'react';
import Image from 'next/image';
import {
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalProps,
	ModalCloseButton,
	Box,
} from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

export type AuthModalType = 'login' | 'sign up' | 'forgot password';

interface AuthModalProps extends ModalProps {
	type: AuthModalType;
	setType: React.Dispatch<React.SetStateAction<AuthModalType>>;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, setType, ...props }) => {
	let form = null;
	if (type === 'login')
		form = <Login setType={setType} onSuccess={props.onClose} />;
	else if (type === 'sign up')
		form = <Register setType={setType} onSuccess={props.onClose} />;
	else if (type === 'forgot password')
		form = <ForgotPassword setType={setType} />;

	return (
		<Modal {...props} size="3xl">
			<ModalOverlay />
			<ModalContent h={600}>
				<ModalCloseButton />
				<Flex h="100%">
					<Image
						src="/auth-left.png"
						width="130px"
						height="100%"
						objectFit="cover"
					/>
					<Box p={8}>{form}</Box>
				</Flex>
			</ModalContent>
		</Modal>
	);
};

export default AuthModal;
