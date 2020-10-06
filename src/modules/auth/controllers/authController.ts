import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/User';
import { cookieSettings, jwtSettings } from '../config/authConfig';

dotenv.config();

const signupPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, cookieSettings);
        res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
};

const createToken = id => jwt.sign({ id }, process.env.JWT_SECRET, jwtSettings);

const handleErrors = <T extends { message: string; errors: object; code: number }>(err: T) => {
    if (err.code === 11000)
        return {
            email: 'This email is already in registered',
        };

    if (err.message.includes('User validation failed'))
        return Object.values(err.errors).reduce((total: {}, { properties: { path, message } }) => {
            total.hasOwnProperty(path) ? (total[path] = [total[path], message]) : (total[path] = message);

            return total;
        }, {});

    return err;
};

export default {
    signupPost,
    loginPost,
};
