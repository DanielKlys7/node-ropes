import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { tokenNotProvided } from '../config/errorMessages';

dotenv.config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    try {
        if (!token) {
            res.status(401).json({ errors: { token: tokenNotProvided } });
            throw new Error(tokenNotProvided);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) res.status(401).json({ error: err.message });

            return decodedToken;
        });

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default requireAuth;
