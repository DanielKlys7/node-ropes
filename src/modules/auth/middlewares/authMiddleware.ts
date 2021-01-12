import { RequestHandler } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

import { tokenNotProvided } from '../config/errorMessages';

dotenv.config();

const requireAuth: RequestHandler = ({ cookies: { jwt } }, res, next) => {
    try {
        if (!jwt) {
            res.status(401).json({ errors: { token: tokenNotProvided } });
            throw new Error(tokenNotProvided);
        }

        jsonwebtoken.verify(jwt, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) res.status(401).json({ error: err.message });

            return decodedToken;
        });

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default requireAuth;
