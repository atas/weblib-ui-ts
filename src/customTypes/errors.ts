export class ValidationError extends Error {
	constructor(...args: any[]) {
		super(...args);
		Error.captureStackTrace(this, ValidationError);
	}
}

export class HttpError extends Error {
	public status = 400;
	public logLevel = 'info'; //For local winston logging

	constructor(message: string) {
		super(message);
	}
}

export class SocialLoginError extends Error {
	constructor(param: LoginErrorType) {
		super(param as any);
		// Error.captureStackTrace(this, SocialLoginError);
		// Object.setPrototypeOf(this, LoginError.prototype);
	}
}

export enum LoginErrorType {
	GENERIC,
	EMAIL_IN_USE,
	EMAIL_NOT_EXISTS,
	NOT_VERIFIED,
	AGE_LIMIT_MIN,
}

export const LOGIN_ERROR_TYPE_MSGS: { [k: string]: string } = {
	[LoginErrorType.GENERIC]: 'A generic login error happened. We will investigate this.',
	[LoginErrorType.EMAIL_IN_USE]: `Email address is in use.
		Have you logged in with another social provider previously?`,
	[LoginErrorType.EMAIL_NOT_EXISTS]: `Your social provider didn't provide an email address.`,
	[LoginErrorType.NOT_VERIFIED]: `Your Facebook/Google account is not verified,
		you can only use verified accounts.`,
	[LoginErrorType.AGE_LIMIT_MIN]: `Age limit is 18.`,
};
