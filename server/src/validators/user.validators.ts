import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

import { __PROD__ } from '../constants';
import { FieldError } from '../models/error.model';

// =============== Public Validators ===============

/**
 * Performs two checks on a given email address
 * 1. Checks that the email matches a strong regex pattern for emails
 * 2. Checks that the email is not already in use by another user
 * @param email The email address to validate
 * @param prisma The prisma client
 * @param errors Any preexisting errors
 */
export const validateNewEmail = async (
	email: string,
	prisma: PrismaClient,
	errors: FieldError[] = [],
): Promise<FieldError[]> => {
	// Gets the errors array after running the pattern match
	const patternErrors = validateEmailPattern(email);

	if (patternErrors.length > 0) {
		// Returns the error array with the additional pattern error
		return [...errors, ...patternErrors];
	}

	// Returns the error array after checking if the email was taken
	return validateEmailNotTaken(email, prisma, errors);
};

export const validateNewUsername = async (
	username: string,
	prisma: PrismaClient,
	errors: FieldError[] = [],
): Promise<FieldError[]> => {
	const blankErrors = validateUsernameNotEmpty(username);

	if (blankErrors.length > 0) {
		// Returns the error array with the additional blank error
		return [...errors, ...blankErrors];
	}

	// Returns the errors array after checking that the username isn't taken
	return validateUsernameNotTaken(username, prisma, errors);
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

// =============== Private Validators ===============

/**
 * Tests an email against a regex pattern
 * @param email Validates the syntax of an email address
 * @param errors Any preexisting errors
 */
const validateEmailPattern = (email: string, errors: FieldError[] = []) => {
	const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!pattern.test(email.toLowerCase())) {
		errors.push({
			field: 'email',
			message: 'Invalid email address',
		});
	}

	return errors;
};

/**
 * Checks to see if a specified email address is already associated with an account
 * @param email The email address to validate
 * @param prisma The prisma client
 * @param errors Any preexisting errors
 */
const validateEmailNotTaken = async (
	email: string,
	prisma: PrismaClient,
	errors: FieldError[] = [],
): Promise<FieldError[]> => {
	// Ensures that the email isn't taken
	const emailIsTaken =
		(await prisma.user.findUnique({
			where: { email },
		})) !== null;

	if (emailIsTaken) {
		errors.push({
			field: 'email',
			message: `The email address '${email}' is already associated with an account`,
		});
	}

	return errors;
};

/**
 * Checks to database to make sure that a username is not already taken,
 * this is typically run on a sign up request
 * @param username The username to search for
 * @param prisma The prisma client
 * @param errors Any preexisting errors
 *
 * @returns Errors after the validation
 */
const validateUsernameNotTaken = async (
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
 * Checks that the entered username is non-empty
 * @param username The username to check
 * @param errors Any preexisting errors
 *
 * @returns Errors after the validation
 */
const validateUsernameNotEmpty = (
	username: string,
	errors: FieldError[] = [],
): FieldError[] => {
	// Ensures that the username isn't taken
	if (username.length === 0) {
		errors.push({
			field: 'username',
			message: 'Username cannot be empty',
		});
	}

	return errors;
};
