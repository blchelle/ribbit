import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalProps,
} from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';

export type AuthModalType = 'login' | 'sign up' | 'forgot password';

interface AuthModalProps extends ModalProps {
	type: AuthModalType;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, ...props }) => {
	let form = null;
	if (type === 'login') form = <Login onClose={props.onClose} />;
	else if (type === 'sign up') form = <Register onClose={props.onClose} />;

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent p={4}>{form}</ModalContent>
		</Modal>
	);
};

export default AuthModal;
