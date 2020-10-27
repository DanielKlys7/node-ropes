export const wrongCredentials = 'Either password or email is invalid';
export const alreadyRegistered = 'This email is already registered';
export const tokenNotProvided = 'Token not provided';

export const fieldMissing = (fieldName: string) => `${fieldName} is required`
export const fieldInvalid = (fieldName: string) => `${fieldName} you want to use is invalid`

export const minLength = (fieldName: string, minFieldLength: number) => `${fieldName} must be at least ${minFieldLength} long.`
export const maxLength = (fieldName: string, maxFieldLength: number) => `${fieldName} cannot be longer than ${maxFieldLength}`