export const tokenExpirationTimeInMs = 7 * 24 * 60 * 60 * 1000;
export const cookieSettings = {
    httpOnly: true,
    maxAge: tokenExpirationTimeInMs,
};
export const jwtSettings = { expiresIn: tokenExpirationTimeInMs };
