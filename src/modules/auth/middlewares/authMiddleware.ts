import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { tokenNotProvided } from '../config/errorMessages';

dotenv.config();

const requireAuth = (req, res, next) => {
    const tokenStartWithBearer = (bearerToken: string) => bearerToken.startsWith('Bearer ');
    const token = req.headers.authorization || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({ errors: { token: tokenNotProvided } });
        throw new Error(tokenNotProvided);
    }

    const tokenToVerify = !tokenStartWithBearer ? token : token.substring(7);

    jwt.verify(tokenToVerify, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) res.status(401).json({ error: err.message });

        return decodedToken;
    });

    next();
};

export default requireAuth;
