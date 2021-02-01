import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

import { __PROD__ } from '../constants';
import { FieldError } from '../models/error.model';

/**
 * Checks to database to make sure that a username is not already taken,
 * this is typically run on a sign up request
 * @param username The username to search for
 * @param prisma The prisma client
 * @param errors Any preexisting errors
 *
 * @returns Errors after the validation
 */
export const validateUserDoesNotExist = async (
	username: string,
	prisma: PrismaClient,
	errors: FieldError[] = [],
): Promise<FieldError[]> => {
	// Ensures that the username isn't taken
	const usernameIsTaken =
		(await prisma.user.findUnique({
			where: { username },
		})) !== null;

	if (usernameIsTaken) {
		errors.push({
			field: 'username',
			message: `The username '${username}' is taken`,
		});
	}

	return errors;
};

/**
 * Ensures that a password is strong enough, dependent on the environment
 * this is typically run on a sign up request
 * @param password The password to validate
 * @param errors Any preexisting errors
 *
 * @returns Errors after the validation
 */
export const validatePasswordStrength = (
	password: string,
	errors: FieldError[] = [],
): FieldError[] => {
	// Sets a required password length based on the environment,
	// then checks that the password is at least that long
	const requiredLength = __PROD__ ? 8 : 1;

	if (password.length < requiredLength) {
		errors.push({
			field: 'password',
			message: 'This password is too weak',
		});
	}

	return errors;
};

/**
 * Compares a hashed and a plain password to see if they match
 * this is typically run on a sign up request
 * @param hashed The hashed password
 * @param plain The plain password
 * @param prisma The prisma client
 * @param errors Any preexisting errors
 *
 * @returns Errors after the validation
 */
export const validatePasswordMatch = async (
	hashed: string,
	plain: string,
	errors: FieldError[] = [],
) => {
	// Validates that the attempted password matches the users stored password
	const validPassword = await argon2.verify(hashed, plain);

	// If the password doesn't match, send an error
	if (!validPassword) {
		errors.push({ field: 'password', message: 'Incorrect password' });
	}

	return errors;
};
