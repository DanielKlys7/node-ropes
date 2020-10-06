export const tokenExpirationTimeInSeconds = 7 * 24 * 60 * 60;
export const cookieSettings = { httpOnly: true, maxAge: tokenExpirationTimeInSeconds, secure: true };
export const jwtSettings = { expiresIn: tokenExpirationTimeInSeconds };
