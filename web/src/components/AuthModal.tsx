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

export type AuthModalType = 'login' | 'sign up' | 'forgot password';

interface AuthModalProps extends ModalProps {
	type: AuthModalType;
	setType: React.Dispatch<React.SetStateAction<AuthModalType>>;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, setType, ...props }) => {
	let form = null;
	if (type === 'login')
		form = <Login onClose={props.onClose} setType={setType} />;
	else if (type === 'sign up')
		form = <Register onClose={props.onClose} setType={setType} />;

	return (
		<Modal {...props} size="3xl">
			<ModalOverlay />
			<ModalContent h={500}>
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
