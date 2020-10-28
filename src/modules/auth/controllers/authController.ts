import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';

import User from '../models/User';
import Secret from '../models/Secret';
import Error from '../models/Error';
import { cookieSettings, jwtSettings } from '../config/authConfig';
import { alreadyRegistered, wrongCredentials } from '../config/errorMessages';

dotenv.config();

const signupPost: RequestHandler = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        const user = await User.create({ email, password, first_name, last_name, status: undefined });
        const secret = await Secret.createAndSend(user.email, user._id);

        res.status(201).end();
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const loginPost: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.cookie('jwt', token, cookieSettings);
        res.status(200).json({ userID: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const emailConfirmRequestPost: RequestHandler = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        const secret = await Secret.createAndSend(user.email, user._id);

        res.status(200).end();
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const emailConfirmPost: RequestHandler = async (req, res) => {
    const { userID, code } = req.body;

    try {
        const secret = await Secret.findOneAndDelete({ code, userID });
        const user = await User.findByIdAndUpdate(secret.userID, { status: 'confirmed' });
        const token = createToken(user._id);

        res.cookie('jwt', token, cookieSettings);
        res.status(200).json({ userID: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const createToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET, jwtSettings);

const handleErrors = (err: Error) => {
    if (err.code === 11000)
        return {
            errors: { email: alreadyRegistered },
        };

    if (err.message === wrongCredentials)
        return {
            errors: { email: err.message, password: err.message },
        };

    if (err.message.includes('User validation failed'))
        return Object.values(err.errors).reduce(
            (total: { errors? }, { properties: { path, message } }) => {
                total.errors.hasOwnProperty(path)
                    ? (total.errors[path] = [total.errors[path], message])
                    : (total.errors[path] = message);

                return total;
            },
            { errors: {} },
        );

    return err;
};

export default {
    signupPost,
    loginPost,
    emailConfirmPost,
};
